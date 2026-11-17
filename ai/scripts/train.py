#!/usr/bin/env python3
"""Train a stronger, reproducible EfficientNet-B0 cloud-genus research model."""
from __future__ import annotations
import argparse, json, random
from pathlib import Path
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import f1_score

def seed_all(seed: int) -> None:
    random.seed(seed); np.random.seed(seed); torch.manual_seed(seed)
    if torch.cuda.is_available(): torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

def evaluate(model, loader, device):
    model.eval(); ys=[]; preds=[]
    with torch.no_grad():
        for x,y in loader:
            logits=model(x.to(device))
            preds.extend(logits.argmax(1).cpu().tolist()); ys.extend(y.tolist())
    return float(f1_score(ys,preds,average="macro",zero_division=0))

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--data",type=Path,required=True); p.add_argument("--output",type=Path,required=True)
    p.add_argument("--epochs",type=int,default=24); p.add_argument("--batch-size",type=int,default=16)
    p.add_argument("--image-size",type=int,default=224); p.add_argument("--freeze-epochs",type=int,default=2)
    p.add_argument("--lr",type=float,default=1e-4); p.add_argument("--seed",type=int,default=42)
    p.add_argument("--patience",type=int,default=8)
    a=p.parse_args()
    if not 128 <= a.image_size <= 320: raise SystemExit("image-size must be 128..320")
    seed_all(a.seed); a.output.mkdir(parents=True,exist_ok=True)
    for split in ("train","validation","test"):
        if not (a.data/split).is_dir(): raise SystemExit("Dataset splits missing")
    mean=[.485,.456,.406]; std=[.229,.224,.225]
    # Mild, physically plausible augmentation: preserve cloud morphology and avoid aggressive color shifts.
    train_tf=transforms.Compose([
        transforms.Resize((a.image_size+32,a.image_size+32)),
        transforms.RandomResizedCrop(a.image_size,scale=(.78,1.0),ratio=(.90,1.10)),
        transforms.RandomHorizontalFlip(p=.5),
        transforms.RandomRotation(degrees=7),
        transforms.ColorJitter(brightness=.12,contrast=.12,saturation=.08,hue=.01),
        transforms.ToTensor(),transforms.Normalize(mean,std),
        transforms.RandomErasing(p=.08,scale=(.015,.06),ratio=(.5,2.0),value="random")
    ])
    eval_tf=transforms.Compose([transforms.Resize((a.image_size,a.image_size)),transforms.ToTensor(),transforms.Normalize(mean,std)])
    train=datasets.ImageFolder(a.data/"train",transform=train_tf)
    val=datasets.ImageFolder(a.data/"validation",transform=eval_tf)
    if train.classes!=val.classes or len(train.classes)<2: raise SystemExit("Train/validation taxonomy mismatch")
    device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
    torch.set_num_threads(max(1,min(4,torch.get_num_threads())))
    tr=DataLoader(train,batch_size=a.batch_size,shuffle=True,num_workers=0,pin_memory=(device.type=="cuda"))
    va=DataLoader(val,batch_size=a.batch_size,shuffle=False,num_workers=0,pin_memory=(device.type=="cuda"))
    weights=models.EfficientNet_B0_Weights.DEFAULT
    model=models.efficientnet_b0(weights=weights)
    model.classifier[1]=nn.Sequential(nn.Dropout(p=.25),nn.Linear(model.classifier[1].in_features,len(train.classes)))
    for q in model.features.parameters(): q.requires_grad=False
    model.to(device)
    counts=np.bincount(train.targets,minlength=len(train.classes)).astype(np.float32)
    class_weights=(len(train)/(len(train.classes)*np.maximum(counts,1)))
    cw=torch.tensor(class_weights,dtype=torch.float32,device=device)
    criterion=nn.CrossEntropyLoss(weight=cw,label_smoothing=.02)
    optimizer=torch.optim.AdamW(model.classifier.parameters(),lr=a.lr,weight_decay=2e-4)
    scheduler=None
    best=-1.; stale=0; best_path=a.output/"best.pt"
    epochs=max(1,a.epochs); freeze_epochs=min(max(0,a.freeze_epochs),epochs-1)
    for epoch in range(epochs):
        if epoch==freeze_epochs:
            for q in model.features.parameters(): q.requires_grad=True
            optimizer=torch.optim.AdamW([
                {"params":model.features.parameters(),"lr":a.lr*.12},
                {"params":model.classifier.parameters(),"lr":a.lr*.65}
            ],weight_decay=2e-4)
            scheduler=torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer,mode="max",factor=.5,patience=2,min_lr=2e-7)
        model.train(); running=0.0
        for x,y in tr:
            x,y=x.to(device),y.to(device)
            optimizer.zero_grad(set_to_none=True)
            logits=model(x); loss=criterion(logits,y); loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(),max_norm=2.0)
            optimizer.step(); running+=float(loss.detach())
        score=evaluate(model,va,device)
        if scheduler is not None: scheduler.step(score)
        lrs=",".join(f"{g['lr']:.2g}" for g in optimizer.param_groups)
        print(f"epoch={epoch+1}/{epochs} phase={'head' if epoch<freeze_epochs else 'fine_tune'} loss={running/max(1,len(tr)):.4f} val_macro_f1={score:.4f} lr={lrs}",flush=True)
        if score>best+1e-4:
            best=score; stale=0
            torch.save({"state_dict":model.cpu().state_dict(),"classes":train.classes,"seed":a.seed,"val_macro_f1":best,"image_size":a.image_size,"train_class_counts":{c:int(counts[i]) for i,c in enumerate(train.classes)}},best_path)
            model.to(device)
        else:
            stale+=1
            if stale>=max(3,a.patience):
                print(f"Early stopping after {epoch+1} epochs; best validation macro-F1={best:.4f}",flush=True)
                break
    ck=torch.load(best_path,map_location="cpu",weights_only=False)
    model.load_state_dict(ck["state_dict"]); model.eval()
    dummy=torch.zeros(1,3,a.image_size,a.image_size); onnx_path=a.output/"model.onnx"
    torch.onnx.export(model,dummy,onnx_path,input_names=["images"],output_names=["logits"],dynamic_axes={"images":{0:"batch"},"logits":{0:"batch"}},opset_version=17,dynamo=False)
    meta={"model_name":"Cloud Scanner AI Pro EfficientNet-B0 improved research run","architecture":"torchvision.efficientnet_b0","input":{"name":"images","shape":[1,3,a.image_size,a.image_size],"color":"RGB","resize":f"{a.image_size}x{a.image_size}","normalization":"ImageNet mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]"},"output":{"name":"logits","postprocess":"softmax"},"classes":ck["classes"],"best_validation_macro_f1":best,"test_metrics":None,"status":"trained_not_yet_test_evaluated","seed":a.seed,"training":{"epochs_requested":epochs,"early_stopping_patience":a.patience,"augmentation":"mild geometry and color; random erasing","optimizer":"AdamW with staged fine-tuning and ReduceLROnPlateau","class_weighting":"inverse-frequency weighted cross entropy"},"warning":"Research/beta model only until untouched test evaluation passes release gates."}
    (a.output/"model_metadata.json").write_text(json.dumps(meta,indent=2),encoding="utf-8")
    print(f"Saved checkpoint={best_path} ONNX={onnx_path}",flush=True)
if __name__=="__main__": main()

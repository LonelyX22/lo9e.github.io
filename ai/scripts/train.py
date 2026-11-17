#!/usr/bin/env python3
"""Transfer-learn EfficientNet-B0; exports ONNX, but makes no accuracy claims."""
from __future__ import annotations
import argparse, json, random
from pathlib import Path
import numpy as np
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from sklearn.metrics import accuracy_score, f1_score

SEED=42
def seed_all(seed):
    random.seed(seed); np.random.seed(seed); torch.manual_seed(seed)
    if torch.cuda.is_available(): torch.cuda.manual_seed_all(seed)

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--data",type=Path,required=True); p.add_argument("--output",type=Path,required=True)
    p.add_argument("--epochs",type=int,default=30); p.add_argument("--batch-size",type=int,default=32)
    p.add_argument("--lr",type=float,default=1e-4); p.add_argument("--seed",type=int,default=SEED)
    a=p.parse_args(); seed_all(a.seed); a.output.mkdir(parents=True,exist_ok=True)
    required=["train","validation","test"]
    if any(not (a.data/x).is_dir() for x in required): raise SystemExit("Dataset splits missing. Run prepare_dataset.py first.")
    train_tf=transforms.Compose([transforms.Resize((256,256)),transforms.RandomResizedCrop(224,scale=(.75,1.0)),transforms.RandomHorizontalFlip(),transforms.ColorJitter(brightness=.12,contrast=.12,saturation=.10,hue=.02),transforms.ToTensor(),transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    eval_tf=transforms.Compose([transforms.Resize((224,224)),transforms.ToTensor(),transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    train=datasets.ImageFolder(a.data/"train",transform=train_tf)
    val=datasets.ImageFolder(a.data/"validation",transform=eval_tf)
    if train.classes!=val.classes: raise SystemExit("Train/validation class order mismatch.")
    if len(train.classes)<2: raise SystemExit("Need at least two classes.")
    workers=0
    tr=DataLoader(train,batch_size=a.batch_size,shuffle=True,num_workers=workers)
    va=DataLoader(val,batch_size=a.batch_size,shuffle=False,num_workers=workers)
    device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
    weights=models.EfficientNet_B0_Weights.DEFAULT
    model=models.efficientnet_b0(weights=weights)
    model.classifier[1]=nn.Linear(model.classifier[1].in_features,len(train.classes))
    model.to(device)
    criterion=nn.CrossEntropyLoss(label_smoothing=.05)
    optimizer=torch.optim.AdamW(model.parameters(),lr=a.lr,weight_decay=1e-4)
    scheduler=torch.optim.lr_scheduler.CosineAnnealingLR(optimizer,T_max=a.epochs)
    best=-1.0; best_path=a.output/"best.pt"
    for epoch in range(a.epochs):
        model.train(); loss_sum=0
        for x,y in tr:
            x,y=x.to(device),y.to(device); optimizer.zero_grad(set_to_none=True)
            logits=model(x); loss=criterion(logits,y); loss.backward(); optimizer.step(); loss_sum+=loss.item()*len(y)
        model.eval(); ys=[]; ps=[]
        with torch.no_grad():
            for x,y in va:
                logits=model(x.to(device)); ps.extend(logits.argmax(1).cpu().tolist()); ys.extend(y.tolist())
        score=f1_score(ys,ps,average="macro")
        scheduler.step()
        print(f"epoch={epoch+1}/{a.epochs} train_loss={loss_sum/len(train):.4f} val_macro_f1={score:.4f}")
        if score>best:
            best=score; torch.save({"state_dict":model.cpu().state_dict(),"classes":train.classes,"seed":a.seed,"val_macro_f1":best},best_path); model.to(device)
    ckpt=torch.load(best_path,map_location="cpu",weights_only=False)
    model.load_state_dict(ckpt["state_dict"]); model.eval()
    dummy=torch.zeros(1,3,224,224)
    onnx_path=a.output/"model.onnx"
    torch.onnx.export(model,dummy,onnx_path,input_names=["images"],output_names=["logits"],dynamic_axes={"images":{0:"batch"},"logits":{0:"batch"}},opset_version=17,dynamo=False)
    metadata={"model_name":"Cloud Scanner AI Pro EfficientNet-B0","architecture":"torchvision.efficientnet_b0","input":{"name":"images","shape":[1,3,224,224],"color":"RGB","resize":"224x224","normalization":"ImageNet mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]"},"output":{"name":"logits","postprocess":"softmax"},"classes":ckpt["classes"],"best_validation_macro_f1":best,"test_metrics":None,"status":"trained_not_yet_test_evaluated","seed":a.seed,"warning":"Do not deploy as validated until evaluate.py is run on untouched test data and model calibration/rejection are checked."}
    (a.output/"model_metadata.json").write_text(json.dumps(metadata,indent=2),encoding="utf-8")
    print(f"Saved checkpoint={best_path} ONNX={onnx_path}")
if __name__=="__main__": main()

#!/usr/bin/env python3
"""Train a transfer-learning cloud genus baseline with a frozen-head warmup."""
from __future__ import annotations
import argparse,json,random
from pathlib import Path
import numpy as np,torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets,transforms,models
from sklearn.metrics import f1_score
def seed_all(seed):
 random.seed(seed);np.random.seed(seed);torch.manual_seed(seed)
 if torch.cuda.is_available():torch.cuda.manual_seed_all(seed)
def evaluate(model,loader,device):
 model.eval();ys=[];ps=[]
 with torch.no_grad():
  for x,y in loader:
   ps.extend(model(x.to(device)).argmax(1).cpu().tolist());ys.extend(y.tolist())
 return float(f1_score(ys,ps,average="macro"))
def main():
 p=argparse.ArgumentParser()
 p.add_argument("--data",type=Path,required=True);p.add_argument("--output",type=Path,required=True)
 p.add_argument("--epochs",type=int,default=7);p.add_argument("--batch-size",type=int,default=16)
 p.add_argument("--image-size",type=int,default=160);p.add_argument("--freeze-epochs",type=int,default=3)
 p.add_argument("--lr",type=float,default=1e-4);p.add_argument("--seed",type=int,default=42)
 a=p.parse_args()
 if a.image_size<128 or a.image_size>320:raise SystemExit("image-size must be 128..320")
 seed_all(a.seed);a.output.mkdir(parents=True,exist_ok=True)
 for split in ("train","validation","test"):
  if not (a.data/split).is_dir():raise SystemExit("Dataset splits missing")
 norm=([.485,.456,.406],[.229,.224,.225])
 train_tf=transforms.Compose([transforms.Resize((a.image_size+24,a.image_size+24)),transforms.RandomResizedCrop(a.image_size,scale=(.85,1.0)),transforms.RandomHorizontalFlip(),transforms.ColorJitter(brightness=.12,contrast=.12,saturation=.10,hue=.02),transforms.ToTensor(),transforms.Normalize(*norm)])
 eval_tf=transforms.Compose([transforms.Resize((a.image_size,a.image_size)),transforms.ToTensor(),transforms.Normalize(*norm)])
 train=datasets.ImageFolder(a.data/"train",transform=train_tf);val=datasets.ImageFolder(a.data/"validation",transform=eval_tf)
 if train.classes!=val.classes or len(train.classes)<2:raise SystemExit("Train/validation taxonomy mismatch")
 device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
 torch.set_num_threads(max(1,min(4,torch.get_num_threads())))
 tr=DataLoader(train,batch_size=a.batch_size,shuffle=True,num_workers=0);va=DataLoader(val,batch_size=a.batch_size,shuffle=False,num_workers=0)
 model=models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
 model.classifier[1]=nn.Linear(model.classifier[1].in_features,len(train.classes))
 for q in model.features.parameters():q.requires_grad=False
 model.to(device)
 counts=np.bincount(train.targets,minlength=len(train.classes))
 cw=torch.tensor(len(train)/(len(train.classes)*counts),dtype=torch.float32,device=device)
 criterion=nn.CrossEntropyLoss(weight=cw,label_smoothing=.03)
 best=-1.;best_path=a.output/"best.pt";epochs=max(1,a.epochs);freeze_epochs=min(max(0,a.freeze_epochs),epochs-1)
 for epoch in range(epochs):
  if epoch==freeze_epochs:
   # Unfreeze only the final two EfficientNet stages for a controlled fine-tune.
   for block in list(model.features.children())[-2:]:
    for q in block.parameters():q.requires_grad=True
   optimizer=torch.optim.AdamW((q for q in model.parameters() if q.requires_grad),lr=a.lr*.2,weight_decay=1e-4)
  elif epoch==0:
   optimizer=torch.optim.AdamW(model.classifier.parameters(),lr=a.lr,weight_decay=1e-4)
  model.train()
  for x,y in tr:
   x,y=x.to(device),y.to(device);optimizer.zero_grad(set_to_none=True)
   loss=criterion(model(x),y);loss.backward();optimizer.step()
  score=evaluate(model,va,device)
  print(f"epoch={epoch+1}/{epochs} phase={'head' if epoch<freeze_epochs else 'fine_tune'} val_macro_f1={score:.4f}",flush=True)
  if score>best:
   best=score;torch.save({"state_dict":model.cpu().state_dict(),"classes":train.classes,"seed":a.seed,"val_macro_f1":best,"image_size":a.image_size},best_path);model.to(device)
 ck=torch.load(best_path,map_location="cpu",weights_only=False);model.load_state_dict(ck["state_dict"]);model.eval()
 dummy=torch.zeros(1,3,a.image_size,a.image_size);onnx_path=a.output/"model.onnx"
 torch.onnx.export(model,dummy,onnx_path,input_names=["images"],output_names=["logits"],dynamic_axes={"images":{0:"batch"},"logits":{0:"batch"}},opset_version=17,dynamo=False)
 meta={"model_name":"Cloud Scanner AI Pro EfficientNet-B0","architecture":"torchvision.efficientnet_b0","input":{"name":"images","shape":[1,3,a.image_size,a.image_size],"color":"RGB","resize":f"{a.image_size}x{a.image_size}","normalization":"ImageNet mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225]"},"output":{"name":"logits","postprocess":"softmax"},"classes":ck["classes"],"best_validation_macro_f1":best,"test_metrics":None,"status":"trained_not_yet_test_evaluated","seed":a.seed,"warning":"Research baseline only until untouched test evaluation passes release gates."}
 (a.output/"model_metadata.json").write_text(json.dumps(meta,indent=2),encoding="utf-8");print(f"Saved checkpoint={best_path} ONNX={onnx_path}",flush=True)
if __name__=="__main__":main()

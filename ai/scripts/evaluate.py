#!/usr/bin/env python3
"""Evaluate a trained checkpoint on the untouched test split."""
import argparse, json
from pathlib import Path
import numpy as np, torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torch import nn
from sklearn.metrics import accuracy_score, f1_score, precision_recall_fscore_support, confusion_matrix, classification_report

def main():
    p=argparse.ArgumentParser(); p.add_argument("--data",type=Path,required=True); p.add_argument("--checkpoint",type=Path,required=True); p.add_argument("--output",type=Path,required=True); p.add_argument("--batch-size",type=int,default=32); a=p.parse_args()
    device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tf=transforms.Compose([transforms.Resize((224,224)),transforms.ToTensor(),transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    ds=datasets.ImageFolder(a.data/"test",transform=tf)
    ck=torch.load(a.checkpoint,map_location="cpu",weights_only=False); classes=ck["classes"]
    if ds.classes!=classes: raise SystemExit(f"Class mismatch: test={ds.classes}, model={classes}")
    model=models.efficientnet_b0(weights=None); model.classifier[1]=nn.Linear(model.classifier[1].in_features,len(classes)); model.load_state_dict(ck["state_dict"]); model.to(device).eval()
    loader=DataLoader(ds,batch_size=a.batch_size,shuffle=False)
    ys=[]; pred=[]; probs=[]
    with torch.no_grad():
        for x,y in loader:
            z=model(x.to(device)); q=z.softmax(1).cpu().numpy(); probs.extend(q); pred.extend(q.argmax(1)); ys.extend(y.numpy())
    precision,recall,f1,_=precision_recall_fscore_support(ys,pred,labels=list(range(len(classes))),zero_division=0)
    report={"accuracy":float(accuracy_score(ys,pred)),"macro_f1":float(f1_score(ys,pred,average="macro")),"per_class":{c:{"precision":float(precision[i]),"recall":float(recall[i]),"f1":float(f1[i]),"support":int(sum(np.array(ys)==i))} for i,c in enumerate(classes)},"confusion_matrix":confusion_matrix(ys,pred,labels=list(range(len(classes)))).tolist(),"classes":classes,"test_images":len(ds),"threshold_calibration":"not yet performed","limitations":["Results apply only to this held-out random split; external Thai-camera generalization is unproven.","No geographic/time/session grouping unless source metadata was added before splitting."]}
    a.output.mkdir(parents=True,exist_ok=True); (a.output/"test_metrics.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2))
if __name__=="__main__": main()

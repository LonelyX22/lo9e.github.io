#!/usr/bin/env python3
"""Evaluate held-out test data and calibrate a conservative rejection gate on validation only."""
import argparse, json
from pathlib import Path
import numpy as np, torch
from torch.utils.data import DataLoader
from torchvision import datasets, transforms, models
from torch import nn
from sklearn.metrics import accuracy_score, f1_score, precision_recall_fscore_support, confusion_matrix

def collect(model, dataset, device, batch_size):
    loader=DataLoader(dataset,batch_size=batch_size,shuffle=False,num_workers=0)
    ys=[]; probs=[]
    with torch.no_grad():
        for x,y in loader:
            z=model(x.to(device)); probs.extend(z.softmax(1).cpu().numpy()); ys.extend(y.numpy())
    return np.asarray(ys),np.asarray(probs)

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--data",type=Path,required=True);p.add_argument("--checkpoint",type=Path,required=True)
    p.add_argument("--output",type=Path,required=True);p.add_argument("--batch-size",type=int,default=32)
    a=p.parse_args();device=torch.device("cuda" if torch.cuda.is_available() else "cpu")
    ck=torch.load(a.checkpoint,map_location="cpu",weights_only=False); image_size=int(ck.get("image_size",224))\n    tf=transforms.Compose([transforms.Resize((image_size,image_size)),transforms.ToTensor(),transforms.Normalize([.485,.456,.406],[.229,.224,.225])])
    val=datasets.ImageFolder(a.data/"validation",transform=tf);test=datasets.ImageFolder(a.data/"test",transform=tf)
    classes=ck["classes"]
    if val.classes!=classes or test.classes!=classes:raise SystemExit("Class order mismatch between checkpoint and validation/test data.")
    model=models.efficientnet_b0(weights=None);model.classifier[1]=nn.Linear(model.classifier[1].in_features,len(classes))
    model.load_state_dict(ck["state_dict"]);model.to(device).eval()
    vy,vp=collect(model,val,device,a.batch_size);ty,tp=collect(model,test,device,a.batch_size)
    # Calibrate only on validation predictions. Search for the widest accepted coverage
    # that still reaches 90% precision; test data is never used to choose thresholds.
    vtop=np.sort(vp,axis=1)[:,-1];vpred=vp.argmax(1);vsecond=np.sort(vp,axis=1)[:,-2]
    candidates=[]
    for conf in np.arange(.20,.991,.01):
        for margin in np.arange(0,.501,.01):
            keep=(vtop>=conf)&((vtop-vsecond)>=margin)
            coverage=float(keep.mean())
            if coverage<.15:continue
            precision=float((vpred[keep]==vy[keep]).mean()) if keep.any() else 0.0
            if precision>=.90:candidates.append((coverage,precision,float(conf),float(margin)))
    if candidates:
        coverage_v,precision_v,threshold,margin=max(candidates,key=lambda x:(x[0],x[1],-x[2],-x[3]))
        calibrated=True
    else:
        coverage_v=precision_v=0.0;threshold=1.01;margin=1.01;calibrated=False
    pred=tp.argmax(1);top=np.sort(tp,axis=1)[:,-1];second=np.sort(tp,axis=1)[:,-2]
    keep=(top>=threshold)&((top-second)>=margin)
    selective_coverage=float(keep.mean())
    selective_precision=float((pred[keep]==ty[keep]).mean()) if keep.any() else 0.0
    precision,recall,f1,_=precision_recall_fscore_support(ty,pred,labels=list(range(len(classes))),zero_division=0)
    macro=float(f1_score(ty,pred,average="macro"));accuracy=float(accuracy_score(ty,pred))
    report={
      "accuracy":accuracy,"macro_f1":macro,
      "per_class":{c:{"precision":float(precision[i]),"recall":float(recall[i]),"f1":float(f1[i]),"support":int((ty==i).sum())} for i,c in enumerate(classes)},
      "confusion_matrix":confusion_matrix(ty,pred,labels=list(range(len(classes)))).tolist(),
      "classes":classes,"test_images":int(len(test)),
      "validation_calibration":{"target_precision":0.90,"minimum_coverage":0.15,"achieved_precision":precision_v,"coverage":coverage_v,"threshold":threshold,"margin":margin,"found_threshold":calibrated},
      "test_selective":{"precision":selective_precision,"coverage":selective_coverage,"accepted_images":int(keep.sum())},
      "release_gate":{"minimum_macro_f1":0.70,"minimum_selective_precision":0.90,"minimum_selective_coverage":0.15},
      "limitations":["Random held-out split only; geographic and temporal generalization is unproven.","CCSN does not represent all Thai sky, camera, seasonal and local weather conditions.","Confidence calibration is based on a small validation split and needs external validation."]
    }
    # Conservative: never mark the model validated unless both overall and selective test gates pass.
    release_ok=macro>=.70 and selective_precision>=.90 and selective_coverage>=.15
    status="validated" if release_ok and calibrated else "research_only"
    metadata_path=a.checkpoint.parent/"model_metadata.json"
    metadata=json.loads(metadata_path.read_text(encoding="utf-8")) if metadata_path.exists() else {}
    metadata.update({"test_metrics":{"accuracy":accuracy,"macro_f1":macro,"selective_precision":selective_precision,"selective_coverage":selective_coverage},"release_thresholds":{"min_confidence":threshold,"min_margin":margin},"status":status,"validation_calibration":report["validation_calibration"],"release_gate":report["release_gate"]})
    metadata_path.write_text(json.dumps(metadata,indent=2),encoding="utf-8")
    report["model_status"]=status
    a.output.mkdir(parents=True,exist_ok=True)
    (a.output/"test_metrics.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2))
    if status!="validated":print("MODEL NOT RELEASED: test metrics did not pass the conservative release gate.")
if __name__=="__main__":main()

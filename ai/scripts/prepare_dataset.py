#!/usr/bin/env python3
"""Validate image folders, remove exact duplicates, and create deterministic splits."""
from __future__ import annotations
import argparse, hashlib, json, random, shutil
from collections import Counter, defaultdict
from pathlib import Path
from PIL import Image, UnidentifiedImageError
from sklearn.model_selection import train_test_split

EXTS={".jpg",".jpeg",".png",".webp",".bmp"}
CLASSES=["Ci","Cc","Cs","Ac","As","Ns","Sc","St","Cu","Cb"]
ALIASES={c:{c.lower(),c.upper()} for c in CLASSES}
ALIASES.update({"Ct":{"ct","contrail"},"non_cloud":{"non_cloud","clear","clear_sky","clear-sky"},"unknown":{"unknown","other"}})

def digest(path:Path)->str:
    h=hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""): h.update(chunk)
    return h.hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--input",type=Path,required=True)
    ap.add_argument("--output",type=Path,required=True)
    ap.add_argument("--seed",type=int,default=42)
    ap.add_argument("--min-per-class",type=int,default=10)
    ap.add_argument("--include-auxiliary",action="store_true")
    args=ap.parse_args()
    if not args.input.is_dir(): raise SystemExit(f"Input folder not found: {args.input}")
    labels=CLASSES+(["Ct","non_cloud","unknown"] if args.include_auxiliary else [])
    found=defaultdict(list); seen={}; rejected=[]
    folder_map={}
    for folder in args.input.iterdir():
        if folder.is_dir():
            for label,names in ALIASES.items():
                if folder.name in names: folder_map[folder]=label; break
    for folder,label in folder_map.items():
        if label not in labels: continue
        for p in folder.rglob("*"):
            if p.suffix.lower() not in EXTS: continue
            try:
                with Image.open(p) as im:
                    im.verify()
                sha=digest(p)
                if sha in seen:
                    rejected.append({"file":str(p),"reason":"exact_duplicate_of","duplicate_of":seen[sha]})
                    continue
                seen[sha]=str(p)
                found[label].append(p)
            except (UnidentifiedImageError,OSError,ValueError) as e:
                rejected.append({"file":str(p),"reason":"invalid_image","detail":str(e)})
    counts={k:len(found[k]) for k in labels}
    missing=[k for k,v in counts.items() if v<args.min_per_class]
    if missing:
        report={"status":"blocked_insufficient_data","counts":counts,"minimum_per_class":args.min_per_class,"missing_or_small":missing,"rejected":rejected}
        args.output.mkdir(parents=True,exist_ok=True)
        (args.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
        raise SystemExit("Not enough verified images per class; see dataset_report.json. No training split was created.")
    rng=random.Random(args.seed)
    args.output.mkdir(parents=True,exist_ok=True)
    split_counts={}
    for label in labels:
        paths=found[label][:]
        rng.shuffle(paths)
        # 70/15/15 stratified within each class; exact duplicates already removed.
        n=len(paths); n_test=max(1,round(n*.15)); n_val=max(1,round(n*.15))
        if n-n_test-n_val<1: raise SystemExit(f"Class {label} too small for three splits.")
        test=paths[:n_test]; val=paths[n_test:n_test+n_val]; train=paths[n_test+n_val:]
        split_counts[label]={"train":len(train),"validation":len(val),"test":len(test)}
        for split,items in (("train",train),("validation",val),("test",test)):
            target=args.output/split/label; target.mkdir(parents=True,exist_ok=True)
            for i,p in enumerate(items):
                ext=p.suffix.lower()
                shutil.copy2(p,target/f"{i:05d}_{digest(p)[:12]}{ext}")
    report={"status":"prepared","seed":args.seed,"counts":counts,"splits":split_counts,"removed_exact_duplicates":len(rejected),"rejected":rejected,"limitations":["Only byte-identical duplicates are removed; near-duplicate and same-session leakage require source metadata.","Random image split does not establish geographic or temporal generalization.","Confirm source licenses and attribution before public/commercial deployment."]}
    (args.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2))
if __name__=="__main__": main()

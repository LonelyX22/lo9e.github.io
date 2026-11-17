#!/usr/bin/env python3
"""Validate CCSN class folders, remove duplicates safely, and make deterministic splits."""
from __future__ import annotations
import argparse, hashlib, json, random
from collections import defaultdict
from pathlib import Path
from PIL import Image, UnidentifiedImageError
EXTS={".jpg",".jpeg",".png",".webp",".bmp"}
CLASSES=["Ci","Cc","Cs","Ac","As","Ns","Sc","St","Cu","Cb"]
ALIASES={"Ci":{"ci","cirrus"},"Cc":{"cc","cirrocumulus"},"Cs":{"cs","cirrostratus"},"Ac":{"ac","altocumulus"},"As":{"as","altostratus"},"Ns":{"ns","nimbostratus"},"Sc":{"sc","stratocumulus"},"St":{"st","stratus"},"Cu":{"cu","cumulus"},"Cb":{"cb","cumulonimbus"},"Ct":{"ct","contrail","contrails"},"non_cloud":{"no","non_cloud","no_cloud","no-cloud","clear","clear_sky","clear-sky","clearsky","clear sky"},"unknown":{"unknown","other"}}
def digest(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for chunk in iter(lambda:f.read(1024*1024),b""):h.update(chunk)
 return h.hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--input",type=Path,required=True);ap.add_argument("--output",type=Path,required=True);ap.add_argument("--seed",type=int,default=42);ap.add_argument("--min-per-class",type=int,default=500);ap.add_argument("--include-auxiliary",action="store_true");a=ap.parse_args()
 if not a.input.is_dir():raise SystemExit(f"Input folder not found: {a.input}")
 labels=CLASSES+(["Ct","non_cloud","unknown"] if a.include_auxiliary else []);folder_map={}
 for folder in (x for x in a.input.rglob("*") if x.is_dir()):
  for label,names in ALIASES.items():
   if folder.name.lower() in names and "__MACOSX" not in folder.parts:folder_map[folder]=label;break
 if a.input.name.lower() in {n for ns in ALIASES.values() for n in ns}:
  for label,names in ALIASES.items():
   if a.input.name.lower() in names:folder_map[a.input]=label;break
 by_hash=defaultdict(list);rejected=[]
 for folder,label in folder_map.items():
  if label not in labels:continue
  for path in folder.rglob("*"):
   if path.suffix.lower() not in EXTS or path.name.startswith("._") or "__MACOSX" in path.parts:continue
   try:
    with Image.open(path) as im:im.verify()
    by_hash[digest(path)].append((path,label))
   except (UnidentifiedImageError,OSError,ValueError) as e:rejected.append({"file":str(path),"reason":"invalid_image","detail":str(e)})
 found=defaultdict(list);conflicts=[]
 for sha,records in by_hash.items():
  labels_for_hash={label for _,label in records}
  if len(labels_for_hash)>1:
   conflicts.append({"sha256":sha,"files":[str(path) for path,_ in records],"labels":sorted(labels_for_hash)});continue
  path,label=records[0];found[label].append(path)
  for duplicate,_ in records[1:]:rejected.append({"file":str(duplicate),"reason":"exact_duplicate_same_class","kept":str(path)})
 counts={k:len(found[k]) for k in labels};small=[k for k,v in counts.items() if v<a.min_per_class];a.output.mkdir(parents=True,exist_ok=True)
 if small:
  report={"status":"blocked_insufficient_data","counts":counts,"minimum_per_class":a.min_per_class,"missing_or_small":small,"conflicting_label_duplicates":conflicts,"rejected":rejected}
  (a.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
  print(json.dumps({"status":report["status"],"counts":counts,"conflicting_label_duplicates":len(conflicts),"matched_class_directories":[str(x) for x in folder_map]},indent=2));raise SystemExit("Not enough correctly labeled images per class; no training split created.")
 rng=random.Random(a.seed);split_counts={}
 for label in labels:
  paths=found[label][:];rng.shuffle(paths);n=len(paths);nt=max(1,round(n*.15));nv=max(1,round(n*.15))
  if n-nt-nv<1:raise SystemExit(f"Class {label} too small for three splits.")
  for split,items in (("test",paths[:nt]),("validation",paths[nt:nt+nv]),("train",paths[nt+nv:])):
   target=a.output/split/label;target.mkdir(parents=True,exist_ok=True)
   for i,path in enumerate(items):target.joinpath(f"{i:05d}_{digest(path)[:12]}{path.suffix.lower()}").write_bytes(path.read_bytes())
  split_counts[label]={"test":nt,"validation":nv,"train":n-nt-nv}
 report={"status":"prepared","seed":a.seed,"counts":counts,"splits":split_counts,"conflicting_label_duplicate_groups":conflicts,"rejected_count":len(rejected),"rejected":rejected,"limitations":["Only exact byte-identical duplicates are removed; perceptual near-duplicates are not grouped.","Random image split does not establish geographic or temporal generalization.","CCSN has fewer than 500 images in at least one genus; baseline is not a complete production dataset.","Confirm source license and attribution before reuse."]}
 (a.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8");print(json.dumps(report,indent=2))
if __name__=="__main__":main()

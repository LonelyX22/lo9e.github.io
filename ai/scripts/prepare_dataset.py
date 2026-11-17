#!/usr/bin/env python3
"""Validate class folders, remove exact duplicates, and create deterministic splits."""
from __future__ import annotations
import argparse, hashlib, json, random
from collections import defaultdict
from pathlib import Path
from PIL import Image, UnidentifiedImageError

EXTS={".jpg",".jpeg",".png",".webp",".bmp"}
CLASSES=["Ci","Cc","Cs","Ac","As","Ns","Sc","St","Cu","Cb"]
ALIASES={
 "Ci":{"ci","cirrus"},"Cc":{"cc","cirrocumulus"},"Cs":{"cs","cirrostratus"},
 "Ac":{"ac","altocumulus"},"As":{"as","altostratus"},"Ns":{"ns","nimbostratus"},
 "Sc":{"sc","stratocumulus"},"St":{"st","stratus"},"Cu":{"cu","cumulus"},
 "Cb":{"cb","cumulonimbus"},"Ct":{"ct","contrail","contrails"},
 "non_cloud":{"non_cloud","clear","clear_sky","clear-sky","clearsky"},
 "unknown":{"unknown","other"}
}
def digest(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for chunk in iter(lambda:f.read(1024*1024),b""):h.update(chunk)
 return h.hexdigest()
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--input",type=Path,required=True);ap.add_argument("--output",type=Path,required=True);ap.add_argument("--seed",type=int,default=42);ap.add_argument("--min-per-class",type=int,default=500);ap.add_argument("--include-auxiliary",action="store_true");a=ap.parse_args()
 if not a.input.is_dir():raise SystemExit(f"Input folder not found: {a.input}")
 labels=CLASSES+(["Ct","non_cloud","unknown"] if a.include_auxiliary else [])
 found=defaultdict(list);seen={};rejected=[];folder_map={}
 # Find label directories recursively (CCSN archives often wrap classes in a parent directory).
 for folder in (p for p in a.input.rglob("*") if p.is_dir()):
  for label,names in ALIASES.items():
   if folder.name.lower() in names and "__MACOSX" not in folder.parts:folder_map[folder]=label;break
 # Also accept the input directory itself if it is a single class folder.
 if a.input.name in {n for names in ALIASES.values() for n in names}:
  for label,names in ALIASES.items():
   if a.input.name in names:folder_map[a.input]=label;break
 for folder,label in folder_map.items():
  if label not in labels:continue
  for p in folder.rglob("*"):
   if p.suffix.lower() not in EXTS or p.name.startswith("._") or "__MACOSX" in p.parts:continue
   try:
    with Image.open(p) as im: im.verify()
    sha=digest(p)
    if sha in seen:
     rejected.append({"file":str(p),"reason":"exact_duplicate","first_seen":seen[sha]["file"],"first_label":seen[sha]["label"],"duplicate_label_conflict":seen[sha]["label"]!=label});continue
    seen[sha]={"file":str(p),"label":label};found[label].append(p)
   except (UnidentifiedImageError,OSError,ValueError) as e:rejected.append({"file":str(p),"reason":"invalid_image","detail":str(e)})
 counts={k:len(found[k]) for k in labels};small=[k for k,v in counts.items() if v<a.min_per_class]
 a.output.mkdir(parents=True,exist_ok=True)
 if small:
  report={"status":"blocked_insufficient_data","counts":counts,"minimum_per_class":a.min_per_class,"missing_or_small":small,"rejected":rejected}
  (a.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
  print(json.dumps({"status":"blocked_insufficient_data","counts":counts,"small_classes":small,"matched_class_directories":[str(x) for x in folder_map]},indent=2)); raise SystemExit("Not enough verified images per class; see dataset_report.json. No training split created.")
 rng=random.Random(a.seed);split_counts={}
 for label in labels:
  paths=found[label][:];rng.shuffle(paths);n=len(paths);nt=max(1,round(n*.15));nv=max(1,round(n*.15))
  if n-nt-nv<1:raise SystemExit(f"Class {label} too small for three splits.")
  for split,items in (("test",paths[:nt]),("validation",paths[nt:nt+nv]),("train",paths[nt+nv:])):
   target=a.output/split/label;target.mkdir(parents=True,exist_ok=True)
   for i,p in enumerate(items):
    target.joinpath(f"{i:05d}_{digest(p)[:12]}{p.suffix.lower()}").write_bytes(p.read_bytes())
  split_counts[label]={"test":nt,"validation":nv,"train":n-nt-nv}
 report={"status":"prepared","seed":a.seed,"counts":counts,"splits":split_counts,"rejected_count":len(rejected),"rejected":rejected,"limitations":["Only exact byte-identical duplicates are removed; perceptual near-duplicates are not grouped.","Random image split does not establish geographic or temporal generalization.","Confirm source license and attribution before reuse."]}
 (a.output/"dataset_report.json").write_text(json.dumps(report,indent=2),encoding="utf-8");print(json.dumps(report,indent=2))
if __name__=="__main__":main()

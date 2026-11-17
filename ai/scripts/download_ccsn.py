#!/usr/bin/env python3
"""Acquire only the original CCSN image records; keep source and SHA-256 provenance."""
import argparse, hashlib, json, re, zipfile
from pathlib import Path, PurePosixPath
import requests
PID="doi:10.7910/DVN/CADDPD"
API="https://dataverse.harvard.edu/api/datasets/:persistentId/"
CLASSES={"Ac","As","Cb","Cc","Ci","Cs","Ct","Cu","Ns","Sc","St"}
def sha256(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for b in iter(lambda:f.read(1024*1024),b""):h.update(b)
 return h.hexdigest()
def safe_name(name):
 p=PurePosixPath(name.replace("\\","/"))
 if p.is_absolute() or ".." in p.parts:raise ValueError(f"Unsafe archive path: {name}")
 return Path(*[re.sub(r"[^A-Za-z0-9._ -]","_",x) for x in p.parts])
def extract_archives(download_dir,raw_dir):
 for archive in download_dir.rglob("*"):
  if not archive.is_file() or not zipfile.is_zipfile(archive):continue
  with zipfile.ZipFile(archive) as z:
   for member in z.infolist():
    if member.is_dir():continue
    target=raw_dir/safe_name(member.filename);target.parent.mkdir(parents=True,exist_ok=True)
    with z.open(member) as src,target.open("wb") as dst:
     while True:
      chunk=src.read(1024*1024)
      if not chunk:break
      dst.write(chunk)
def from_dataverse(out,raw,timeout):
 r=requests.get(API,params={"persistentId":PID},headers={"User-Agent":"CloudScannerAIPro/2.0 (research dataset downloader)"},timeout=timeout);r.raise_for_status()
 payload=r.json()
 if payload.get("status")!="OK":raise RuntimeError(f"Dataverse API response: {payload}")
 version=payload["data"]["latestVersion"];files=version.get("files",[])
 if not files:raise RuntimeError("Dataverse returned no files")
 records=[]
 for item in files:
  df=item["dataFile"];fid=df["id"];name=df.get("filename",f"dataverse_{fid}");dest=out/safe_name(name);dest.parent.mkdir(parents=True,exist_ok=True)
  if not dest.exists():
   with requests.get(f"https://dataverse.harvard.edu/api/access/datafile/{fid}",headers={"User-Agent":"CloudScannerAIPro/2.0"},stream=True,timeout=timeout) as resp:
    resp.raise_for_status()
    with dest.open("wb") as f:
     for chunk in resp.iter_content(1024*1024):
      if chunk:f.write(chunk)
  records.append({"id":fid,"name":name,"path":str(dest),"bytes":dest.stat().st_size,"sha256":sha256(dest)})
 extract_archives(out,raw)
 image_count=sum(1 for p in raw.rglob("*") if p.is_file() and p.suffix.lower() in {".jpg",".jpeg",".png",".webp"})
 if image_count < 100: raise RuntimeError(f"Dataverse archive contained only {image_count} recognized images; trying the filtered CCSN mirror.")
 return {"method":"Harvard Dataverse API","version":version.get("versionNumber"),"image_count":image_count,"files":records}
def from_huggingface(raw):
 # Fallback mirrors the original CCSN image records only; do not use CloudBench's unrelated images or relevance labels.
 from datasets import load_dataset
 ds=load_dataset("sagecontinuum/CloudBench",split="train")
 saved={}; skipped=0
 for row in ds:
  image_id=str(row.get("image_id",""))
  parts=image_id.replace("\\","/").split("/")
  if len(parts)<3 or parts[0].lower()!="ccsn" or parts[1] not in CLASSES:continue
  license_name=str(row.get("license","")).lower()
  doi=str(row.get("doi","")).lower()
  if "cc0" not in license_name or "10.7910/dvn/caddpd" not in doi:
   skipped+=1;continue
  if image_id in saved:continue
  img=row.get("image")
  if img is None:continue
  if isinstance(img,dict) and img.get("bytes"):
   from io import BytesIO
   from PIL import Image
   img=Image.open(BytesIO(img["bytes"]))
  if not hasattr(img,"save"):continue
  dest=raw/parts[1]/Path(parts[-1]).name;dest.parent.mkdir(parents=True,exist_ok=True)
  img.convert("RGB").save(dest,quality=95)
  saved[image_id]={"path":str(dest),"sha256":sha256(dest),"license":license_name,"doi":doi}
 if not saved:raise RuntimeError("Hugging Face fallback found no CCSN rows with explicit CC0 1.0 license and the CCSN DOI.")
 return {"method":"Hugging Face CloudBench mirror; filtered to original CCSN paths with row-level CC0 1.0 + CCSN DOI","unique_images":len(saved),"skipped_license_or_doi":skipped,"images":saved}
def main():
 ap=argparse.ArgumentParser();ap.add_argument("--output",type=Path,default=Path("ai/dataset/downloads/ccsn"));ap.add_argument("--extract-to",type=Path,default=Path("ai/dataset/raw"));ap.add_argument("--timeout",type=int,default=60);a=ap.parse_args()
 a.output.mkdir(parents=True,exist_ok=True);a.extract_to.mkdir(parents=True,exist_ok=True)
 try:source=from_dataverse(a.output,a.extract_to,a.timeout)
 except Exception as exc:
  print(f"Dataverse endpoint unavailable ({type(exc).__name__}: {exc}); trying filtered mirror.")
  source=from_huggingface(a.extract_to)
 manifest={"dataset":"CCSN","persistent_id":PID,"doi":"https://doi.org/10.7910/DVN/CADDPD","source":source,"notes":"Only CCSN path records with explicit row-level CC0 1.0 and matching DOI are accepted by the mirror fallback. Keep source citations; re-check live terms before reuse."}
 (a.output/"download_manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
 print(json.dumps({"source":source.get("method"),"unique_images":source.get("unique_images",source.get("image_count",None)),"downloaded_files":len(source.get("files",[])),"raw_directories":[str(p.relative_to(a.extract_to)) for p in a.extract_to.rglob("*") if p.is_dir()][:80],"raw_image_samples":[str(p.relative_to(a.extract_to)) for p in a.extract_to.rglob("*") if p.is_file() and p.suffix.lower() in {".jpg",".jpeg",".png",".webp"}][:30],"manifest":str(a.output/"download_manifest.json")},indent=2))
if __name__=="__main__":main()

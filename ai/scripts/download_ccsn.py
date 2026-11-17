#!/usr/bin/env python3
"""Download CCSN from Harvard Dataverse and preserve provenance."""
import argparse, hashlib, json, re, zipfile
from pathlib import Path, PurePosixPath
import requests
PID="doi:10.7910/DVN/CADDPD"
API="https://dataverse.harvard.edu/api/datasets/:persistentId/"
def sha256(path):
 h=hashlib.sha256()
 with path.open("rb") as f:
  for b in iter(lambda:f.read(1024*1024),b""): h.update(b)
 return h.hexdigest()
def safe_name(name):
 p=PurePosixPath(name.replace("\\","/"))
 if p.is_absolute() or ".." in p.parts: raise ValueError(f"Unsafe archive path: {name}")
 return Path(*[re.sub(r"[^A-Za-z0-9._ -]","_",x) for x in p.parts])
def main():
 ap=argparse.ArgumentParser(); ap.add_argument("--output",type=Path,default=Path("ai/dataset/downloads/ccsn")); ap.add_argument("--extract-to",type=Path,default=Path("ai/dataset/raw")); ap.add_argument("--timeout",type=int,default=60); a=ap.parse_args()
 a.output.mkdir(parents=True,exist_ok=True); a.extract_to.mkdir(parents=True,exist_ok=True)
 r=requests.get(API,params={"persistentId":PID},timeout=a.timeout); r.raise_for_status(); payload=r.json()
 if payload.get("status")!="OK": raise SystemExit(f"Dataverse API error: {payload}")
 ds=payload["data"]; version=ds["latestVersion"]; files=version.get("files",[])
 if not files: raise SystemExit("Dataverse returned no files.")
 manifest={"dataset":"CCSN","persistent_id":PID,"doi":"https://doi.org/10.7910/DVN/CADDPD","license":"CC0 1.0 reported by open-source dataset survey; verify live Dataverse terms","version":version.get("versionNumber"),"files":[]}
 for item in files:
  df=item["dataFile"]; fid=df["id"]; name=df.get("filename",f"dataverse_{fid}"); out=a.output/safe_name(name); out.parent.mkdir(parents=True,exist_ok=True)
  if not out.exists():
   with requests.get(f"https://dataverse.harvard.edu/api/access/datafile/{fid}",stream=True,timeout=a.timeout) as resp:
    resp.raise_for_status()
    with out.open("wb") as f:
     for chunk in resp.iter_content(1024*1024):
      if chunk:f.write(chunk)
  manifest["files"].append({"id":fid,"name":name,"path":str(out),"bytes":out.stat().st_size,"sha256":sha256(out)})
  if zipfile.is_zipfile(out):
   with zipfile.ZipFile(out) as z:
    for member in z.infolist():
     if member.is_dir():continue
     target=a.extract_to/safe_name(member.filename); target.parent.mkdir(parents=True,exist_ok=True)
     with z.open(member) as src,target.open("wb") as dst:
      while True:
       chunk=src.read(1024*1024)
       if not chunk:break
       dst.write(chunk)
 (a.output/"download_manifest.json").write_text(json.dumps(manifest,indent=2),encoding="utf-8")
 print(json.dumps(manifest,indent=2)); print(f"Extracted images to {a.extract_to}")
if __name__=="__main__":main()

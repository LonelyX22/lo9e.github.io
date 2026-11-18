const $ = id => document.getElementById(id);
const LABELS = {
  Ci:["Cirrus","เมฆซีร์รัส"], Cc:["Cirrocumulus","เมฆซีร์โรคิวมูลัส"],
  Cs:["Cirrostratus","เมฆซีร์โรสเตรตัส"], Ac:["Altocumulus","เมฆอัลโตคิวมูลัส"],
  As:["Altostratus","เมฆอัลโตสเตรตัส"], Ns:["Nimbostratus","เมฆนิมโบสเตรตัส"],
  Sc:["Stratocumulus","เมฆสเตรโตคิวมูลัส"], St:["Stratus","เมฆสเตรตัส"],
  Cu:["Cumulus","เมฆคิวมูลัส"], Cb:["Cumulonimbus","เมฆคิวมูโลนิมบัส"],
  Ct:["Contrail","เมฆ/แนวไอควบแน่นจากเครื่องบิน"]
};
const T = {
 th:{eyebrow:"CLOUD INTELLIGENCE PLATFORM",headline:"มองท้องฟ้าให้ลึกกว่าเดิม",subhead:"สแกนชนิดเมฆ ตรวจคุณภาพภาพ และดูสภาพอากาศจากตำแหน่งของคุณ",scannerTitle:"สแกนท้องฟ้า",ready:"พร้อมใช้งาน",cameraPrompt:"เปิดกล้องหรือเลือกรูปภาพ",cameraHint:"แนะนำให้เห็นท้องฟ้าและเมฆชัดเจน",openCamera:"เปิดกล้อง",chooseImage:"เลือกรูปภาพ",stopCamera:"ปิดกล้อง",analyze:"วิเคราะห์ภาพ",modelMissing:"ยังไม่มีโมเดล AI ที่ผ่านการประเมินและอนุมัติให้ใช้งาน ระบบจะไม่เดาผลแทนโมเดลจริง",resultTitle:"ผลการวิเคราะห์",waiting:"รอภาพสำหรับวิเคราะห์",waitingHint:"ผลจำแนกจะแสดงเมื่อมีโมเดลที่ผ่านการทดสอบ",classification:"การจำแนกเมฆ",confidence:"ความมั่นใจของโมเดล",weatherTitle:"สภาพอากาศบริเวณนี้",locate:"ใช้ตำแหน่งของฉัน",temperature:"อุณหภูมิ",humidity:"ความชื้น",cloudCover:"เมฆปกคลุม",wind:"ลม",weatherHint:"ต้องอนุญาตตำแหน่งเพื่อดึงข้อมูลอากาศ · Open-Meteo",historyTitle:"ประวัติบนอุปกรณ์นี้",export:"ส่งออก",clear:"ล้างประวัติ",noHistory:"ยังไม่มีประวัติการสแกน",privacy:"ประวัติเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น ไม่ซิงก์ขึ้น Cloud",disclaimerTitle:"หมายเหตุความแม่นยำ",disclaimer:"ผลจำแนกเป็นการประเมินภาพ ไม่ใช่การพยากรณ์ฝนหรือคำเตือนภัย ความมั่นใจไม่เท่ากับความถูกต้องที่รับประกัน",footer:"สำหรับการศึกษาและการวิเคราะห์เบื้องต้น",noModel:"ยังไม่มีโมเดล AI จำแนกชนิดเมฆที่ผ่านการรับรอง แต่ใช้การประเมินภาพเบื้องต้นได้",visualTitle:"สัดส่วนพิกเซลสว่างสีจาง",visualNote:"เป็นเพียงตัวชี้วัดจากสีและความสว่างของพิกเซล ไม่ใช่สัดส่วนเมฆจริง ไม่ใช่ AI จำแนกชนิดเมฆ และไม่ใช่การพยากรณ์อากาศ",noSky:"ภาพนี้ตรวจพบท้องฟ้าไม่เพียงพอ ลองถ่ายให้เห็นท้องฟ้ากว้างขึ้น",badImage:"ไม่สามารถอ่านภาพนี้ได้",modelNotReady:"พบไฟล์โมเดล แต่ยังไม่ผ่านสถานะ validated จึงยังไม่เปิดให้ทำนาย",analyzing:"กำลังวิเคราะห์ภาพ…",rejected:"ภาพนี้อยู่นอกขอบเขตหรือความมั่นใจไม่เพียงพอ ระบบจึงไม่ระบุชนิดเมฆ",modelResult:"ผลจากโมเดล AI · ไม่ใช่คำพยากรณ์อากาศ",downloadModel:"ดาวน์โหลด AI โมเดล",modelDownloadReady:"ดาวน์โหลดโมเดลทดลองเพื่อเริ่มจำแนกเมฆ 10 ชนิด",modelDownloading:"กำลังดาวน์โหลดโมเดล…",modelInstalled:"ติดตั้งโมเดลแล้ว พร้อมสแกน",modelDownloadFailed:"ดาวน์โหลดไม่สำเร็จ กรุณาลองอีกครั้ง"},
 en:{eyebrow:"CLOUD INTELLIGENCE PLATFORM",headline:"See more in every sky",subhead:"Identify cloud types, check image quality and explore weather around your location.",scannerTitle:"Sky scanner",ready:"Ready",cameraPrompt:"Open camera or choose an image",cameraHint:"For best results, capture a clear view of the sky and clouds.",openCamera:"Open camera",chooseImage:"Choose image",stopCamera:"Stop camera",analyze:"Analyze image",modelMissing:"No AI model has passed evaluation and release approval yet. The app will not invent predictions.",resultTitle:"Analysis result",waiting:"Waiting for an image",waitingHint:"Classification appears only when a validated model is available.",classification:"CLOUD CLASSIFICATION",confidence:"Model confidence",weatherTitle:"Local weather",locate:"Use my location",temperature:"Temperature",humidity:"Humidity",cloudCover:"Cloud cover",wind:"Wind",weatherHint:"Location permission required · Open-Meteo",historyTitle:"On-device history",export:"Export",clear:"Clear",noHistory:"No scan history yet",privacy:"History stays in this browser on this device. It is not synced to the cloud.",disclaimerTitle:"Accuracy note",disclaimer:"This is image classification, not a rainfall forecast or severe-weather warning. Confidence is not a guarantee of correctness.",footer:"For education and preliminary analysis",noModel:"No validated cloud-genus AI model yet. Basic image analysis is available.",visualTitle:"Bright, low-saturation pixel ratio",visualNote:"A simple pixel-color/brightness indicator only; it is not actual cloud coverage, AI cloud-genus classification or a weather forecast.",noSky:"Not enough recognizable sky. Try a wider sky photo.",badImage:"Could not read this image",modelNotReady:"Model files found but release status is not validated; predictions remain disabled.",analyzing:"Analyzing image…",rejected:"Image is outside the supported scope or confidence is insufficient. No cloud type is assigned.",modelResult:"AI model output · Not a weather forecast",downloadModel:"Download AI model",modelDownloadReady:"Download the experimental model to identify 10 cloud genera.",modelDownloading:"Downloading model…",modelInstalled:"Model installed · Ready to scan",modelDownloadFailed:"Download failed. Please try again."}
};
let lang=localStorage.getItem("csp_lang")||"th", stream=null, imageSource=null, modelSession=null, modelMeta=null;
const MODEL_META_URL="./models/cloud-classifier/model_metadata.json", MODEL_FILE_URL="./models/cloud-classifier/model.onnx", MODEL_DB="cloud-scanner-ai-cache";
function tr(k){return T[lang][k]||T.en[k]||k}
function setLang(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(T[lang][k])el.textContent=T[lang][k]});$("langBtn").textContent=lang==="th"?"EN":"TH";localStorage.setItem("csp_lang",lang);if($("downloadModelLabel"))$("downloadModelLabel").textContent=modelSession?(lang==="th"?"✓ ติดตั้งแล้ว · พร้อมใช้งาน":"✓ Installed · Ready"):tr("downloadModel");if($("modelInstallNote")&&!modelSession)$("modelInstallNote").textContent=tr("modelDownloadReady")}
$("langBtn").onclick=()=>{lang=lang==="th"?"en":"th";setLang();renderHistory()};
function setMessage(s){$("scanMessage").textContent=s}
function stopStream(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$("video").srcObject=null;$("video").hidden=true;$("stopCameraBtn").disabled=true}
$("cameraBtn").onclick=async()=>{try{if(!navigator.mediaDevices?.getUserMedia)throw Error("Camera requires HTTPS or localhost.");stopStream();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});$("video").srcObject=stream;await $("video").play();$("video").hidden=false;$("preview").hidden=true;$("emptyState").hidden=true;imageSource=$("video");$("stopCameraBtn").disabled=false;$("analyzeBtn").disabled=!modelSession}catch(e){setMessage(e.message)}};
$("stopCameraBtn").onclick=()=>{stopStream();if(!$("preview").src)$("emptyState").hidden=false;imageSource=$("preview").src?$("preview"):null;$("analyzeBtn").disabled=!imageSource||!modelSession};
$("fileInput").onchange=e=>{const f=e.target.files?.[0];if(!f||!f.type.startsWith("image/"))return;stopStream();const url=URL.createObjectURL(f);$("preview").src=url;$("preview").hidden=false;$("video").hidden=true;$("emptyState").hidden=true;imageSource=$("preview");$("analyzeBtn").disabled=!modelSession;setMessage(f.name)};
function openModelDB(){
 return new Promise((resolve,reject)=>{
  if(!("indexedDB" in window)){reject(new Error("Browser storage is unavailable"));return}
  const req=indexedDB.open(MODEL_DB,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains("models"))req.result.createObjectStore("models")};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error("Could not open local model storage"));
 });
}
async function readCachedModel(){
 const db=await openModelDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction("models","readonly"),req=tx.objectStore("models").get("cloud-classifier");
  req.onsuccess=()=>{const value=req.result||null;db.close();resolve(value)};
  req.onerror=()=>{db.close();reject(req.error||new Error("Could not read cached model"))};
 });
}
async function saveCachedModel(buffer,meta){
 const db=await openModelDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction("models","readwrite");
  tx.objectStore("models").put({buffer,meta,downloadedAt:Date.now()},"cloud-classifier");
  tx.oncomplete=()=>{db.close();resolve()};
  tx.onerror=()=>{db.close();reject(tx.error||new Error("Could not save model on this device"))};
  tx.onabort=()=>{db.close();reject(tx.error||new Error("Model storage was interrupted"))};
 });
}
function validModelMetadata(meta){
 return !!meta&&["beta","validated"].includes(meta.status)&&Array.isArray(meta.classes)&&meta.classes.length===10&&Array.isArray(meta.input?.shape)&&meta.input.shape.length===4&&meta.input.shape[1]===3;
}
function setModelProgress(received,total){
 const wrap=$("modelProgressWrap");wrap.hidden=false;
 const pct=total?Math.min(100,Math.round(received/total*100)):0;
 $("modelProgressBar").style.width=pct+"%";
 $("modelProgressText").textContent=total?pct+"% · "+(received/1048576).toFixed(1)+" / "+(total/1048576).toFixed(1)+" MB":(received/1048576).toFixed(1)+" MB";
}
function setModelReady(meta,source){
 modelMeta=meta;
 $("modelStatus").textContent=meta.status==="beta"?(lang==="th"?"AI รุ่นทดลอง":"AI BETA"):(lang==="th"?"AI พร้อมใช้":"AI READY");
 $("modelStatus").classList.remove("muted");
 $("downloadModelBtn").disabled=true;
 $("downloadModelLabel").textContent=lang==="th"?"✓ ติดตั้งแล้ว · พร้อมใช้งาน":"✓ Installed · Ready";
 $("modelInstallNote").textContent=lang==="th"?(source==="cache"?"พบโมเดลในอุปกรณ์นี้แล้ว · พร้อมใช้งาน":"ดาวน์โหลดและติดตั้งโมเดลบนอุปกรณ์นี้เรียบร้อย"):(source==="cache"?"Model found on this device · Ready":"Model downloaded and installed on this device");
 $("modelProgressWrap").hidden=true;
 $("analyzeBtn").disabled=!imageSource;
 setMessage(meta.status==="beta"?(lang==="th"?"เปิดใช้ AI รุ่นทดลองแล้ว · ผลอาจจำแนกผิด":"Experimental beta model ready · predictions may be wrong"):(lang==="th"?"โมเดลพร้อมใช้งาน":"Model ready"));
}
async function createModelSession(buffer,meta){
 if(!validModelMetadata(meta))throw new Error("Model metadata is invalid or unsupported");
 if(!window.ort)throw new Error("ONNX Runtime Web failed to load");
 ort.env.wasm.wasmPaths="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
 const bytes=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);
 const session=await ort.InferenceSession.create(bytes,{executionProviders:["wasm"]});
 modelSession=session;modelMeta=meta;
}
async function loadModel(){
 try{
  const mr=await fetch(MODEL_META_URL,{cache:"no-store"});
  if(!mr.ok)throw new Error("Model metadata is not published yet");
  const remoteMeta=await mr.json();
  if(!validModelMetadata(remoteMeta))throw new Error("No supported beta or validated model is published");
  const cached=await readCachedModel();
  if(cached&&cached.meta&&cached.meta.model_version===remoteMeta.model_version&&cached.buffer){
   $("modelStatus").textContent=lang==="th"?"กำลังเปิด AI…":"Loading AI…";
   await createModelSession(cached.buffer,remoteMeta);
   setModelReady(remoteMeta,"cache");
  }else{
   $("modelStatus").textContent=lang==="th"?"ยังไม่ได้ดาวน์โหลด AI":"AI not downloaded";
   $("modelStatus").classList.add("muted");
   $("downloadModelBtn").disabled=false;
   $("downloadModelLabel").textContent=tr("downloadModel");
   $("modelInstallNote").textContent=tr("modelDownloadReady");
   setMessage(lang==="th"?"กดดาวน์โหลด AI โมเดลก่อนเริ่มวิเคราะห์ · โมเดลจะถูกเก็บไว้ในอุปกรณ์นี้":"Download the AI model before analysis. It will be stored on this device.");
   $("analyzeBtn").disabled=true;
  }
 }catch(e){
  $("modelStatus").textContent=lang==="th"?"AI ยังไม่พร้อม":"AI unavailable";
  $("modelStatus").classList.add("muted");
  $("downloadModelBtn").disabled=false;
  $("downloadModelLabel").textContent=tr("downloadModel");
  $("modelInstallNote").textContent=e.message||tr("modelDownloadFailed");
  $("analyzeBtn").disabled=true;
  setMessage(tr("modelDownloadFailed"));
 }
}
$("downloadModelBtn").onclick=async()=>{
 const btn=$("downloadModelBtn");
 btn.disabled=true;$("downloadModelLabel").textContent=lang==="th"?"กำลังเตรียมดาวน์โหลด…":"Preparing download…";
 $("modelStatus").textContent=lang==="th"?"กำลังดาวน์โหลด…":"Downloading…";
 $("modelProgressWrap").hidden=false;setModelProgress(0,0);
 try{
  const mr=await fetch(MODEL_META_URL,{cache:"no-store"});
  if(!mr.ok)throw new Error("Model metadata unavailable ("+mr.status+")");
  const meta=await mr.json();
  if(!validModelMetadata(meta))throw new Error("Published model metadata is invalid");
  const response=await fetch(MODEL_FILE_URL,{cache:"no-store"});
  if(!response.ok)throw new Error("Model download failed ("+response.status+")");
  const total=Number(response.headers.get("content-length")||0),reader=response.body?.getReader();
  let buffer;
  if(reader){
   const chunks=[];let received=0;
   while(true){const part=await reader.read();if(part.done)break;chunks.push(part.value);received+=part.value.length;setModelProgress(received,total)}
   const merged=new Uint8Array(received);let offset=0;
   for(const chunk of chunks){merged.set(chunk,offset);offset+=chunk.length}
   buffer=merged.buffer;
  }else{buffer=await response.arrayBuffer();setModelProgress(buffer.byteLength,buffer.byteLength)}
  if(buffer.byteLength<1024*1024)throw new Error("Downloaded model file is unexpectedly small");
  $("downloadModelLabel").textContent=lang==="th"?"กำลังติดตั้ง AI…":"Installing AI…";
  await createModelSession(buffer,meta);
  await saveCachedModel(buffer,meta);
  setModelReady(meta,"download");
 }catch(e){
  modelSession=null;modelMeta=null;
  $("modelStatus").textContent=lang==="th"?"ดาวน์โหลดไม่สำเร็จ":"Download failed";
  $("modelStatus").classList.add("muted");
  $("modelInstallNote").textContent=(e.message||tr("modelDownloadFailed"))+" · "+(lang==="th"?"ลองใหม่อีกครั้ง":"Please try again");
  $("downloadModelLabel").textContent=tr("downloadModel");btn.disabled=false;
  $("analyzeBtn").disabled=true;setMessage(tr("modelDownloadFailed"));
 }
};
function getImageElement(){
 if(imageSource===$("video")){if(!$("video").videoWidth)throw Error(tr("badImage"));return $("video")}
 if(imageSource===$("preview")&&$("preview").complete&&$("preview").naturalWidth)return $("preview");
 throw Error(tr("badImage"));
}
function preprocess(el){
 const size=Number(modelMeta?.input?.shape?.[2]||224);
 const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 const pxSource=el.videoWidth||el.naturalWidth;
 if(!pxSource)throw Error(tr("badImage"));
 ctx.drawImage(el,0,0,size,size);
 const px=ctx.getImageData(0,0,size,size).data, plane=size*size, data=new Float32Array(3*plane);
 const mean=[.485,.456,.406],std=[.229,.224,.225];
 for(let i=0;i<plane;i++){data[i]=(px[i*4]/255-mean[0])/std[0];data[plane+i]=(px[i*4+1]/255-mean[1])/std[1];data[2*plane+i]=(px[i*4+2]/255-mean[2])/std[2]}
 return new ort.Tensor("float32",data,[1,3,size,size]);
}
function softmax(a){const m=Math.max(...a),e=a.map(v=>Math.exp(v-m)),s=e.reduce((x,y)=>x+y,0);return e.map(v=>v/s)}
function addHistory(label,confidence){const h=getHistory();h.unshift({label,confidence,time:new Date().toISOString()});localStorage.setItem("csp_history",JSON.stringify(h.slice(0,100)));renderHistory()}
function estimateCloudPixels(el){
 const w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;
 if(!w||!h)throw Error(tr("badImage"));
 const scale=Math.min(1,320/Math.max(w,h)),cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));
 const canvas=document.createElement("canvas");canvas.width=cw;canvas.height=ch;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});ctx.drawImage(el,0,0,cw,ch);
 const px=ctx.getImageData(0,0,cw,ch).data;let sky=0,cloud=0;
 for(let i=0;i<px.length;i+=4){const r=px[i],g=px[i+1],b=px[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b),sat=mx-mn;
  const isSky=(b>r*1.04&&b>g*.91&&b>65)||(mx>170&&sat<48);
  if(isSky){sky++;if(mx>150&&sat<58)cloud++}}
 if(sky<Math.max(100,cw*ch*.035))throw Error(tr("noSky"));
 return {coverage:Math.max(0,Math.min(100,cloud/sky*100)),skyRatio:sky/(cw*ch)*100};
}
$("analyzeBtn").onclick=async()=>{
 if(!imageSource)return;
 try{
  setMessage(tr("analyzing"));$("analyzeBtn").disabled=true;
  const el=getImageElement();
  if(modelSession&&modelMeta){
   const tensor=preprocess(el),out=await modelSession.run({[modelSession.inputNames[0]]:tensor});
   const probs=softmax(Array.from(out[modelSession.outputNames[0]].data));
   const ranked=probs.map((p,i)=>({p,i})).sort((a,b)=>b.p-a.p),top=ranked[0],second=ranked[1];
   const threshold=Number(modelMeta.release_thresholds.min_confidence),margin=Number(modelMeta.release_thresholds.min_margin);
   if(!Number.isFinite(threshold)||!Number.isFinite(margin)||top.p<threshold||top.p-second.p<margin)throw Error(tr("rejected"));
   const code=modelMeta.classes[top.i],names=LABELS[code]||[code,code];
   const alternatives=ranked.slice(1,3).map(x=>{const c=modelMeta.classes[x.i],n=LABELS[c]||[c,c];return n[0]+" ("+(x.p*100).toFixed(1)+"%)"}).join(" · ");
   $("classificationLabel").textContent=modelMeta.status==="beta"?(lang==="th"?"ผลจำแนกเบื้องต้น · รุ่นทดลอง":"PRELIMINARY · BETA MODEL"):tr("classification");
   $("metricLabel").textContent=modelMeta.status==="beta"?(lang==="th"?"คะแนนโมเดล (ไม่ใช่ความน่าจะเป็นที่สอบเทียบ)":"Model score (not calibrated probability)"):tr("confidence");
   $("cloudName").textContent=names[0];$("cloudThai").textContent=names[1];
   $("confidence").textContent=(top.p*100).toFixed(1)+"%";$("confidenceBar").style.width=(top.p*100)+"%";
   $("modelNote").textContent=modelMeta.status==="beta"?(lang==="th"?"ชนิดที่ใกล้เคียง: "+alternatives+" · ผลทดลองจากชุดข้อมูลขนาดเล็ก อาจจำแนกผิดได้":"Alternatives: "+alternatives+" · Experimental model on a limited dataset; may be wrong"):tr("modelResult");
   addHistory(names[0],top.p);
  }else{
   throw Error(tr("noModel"))
  }
  $("resultEmpty").hidden=true;$("resultContent").hidden=false;
  setMessage(modelSession?tr("modelResult"):tr("visualNote"));
 }catch(e){$("resultEmpty").hidden=false;$("resultContent").hidden=true;setMessage(e.message||tr("badImage"))}
 finally{$("analyzeBtn").disabled=!modelSession||!imageSource}
};
$("weatherBtn").onclick=()=>{if(!navigator.geolocation){$("weatherNote").textContent="Geolocation is not supported.";return} $("weatherNote").textContent=lang==="th"?"กำลังขอตำแหน่ง…":"Requesting location…";navigator.geolocation.getCurrentPosition(async p=>{try{const u=new URL("https://api.open-meteo.com/v1/forecast");u.search=new URLSearchParams({latitude:p.coords.latitude,longitude:p.coords.longitude,current:"temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m",timezone:"auto"});const d=await(await fetch(u)).json(),c=d.current;$("temp").textContent=c.temperature_2m+"°C";$("humidity").textContent=c.relative_humidity_2m+"%";$("cloudCover").textContent=c.cloud_cover+"%";$("wind").textContent=c.wind_speed_10m+" km/h";$("weatherNote").textContent="Open-Meteo · "+c.time}catch(e){$("weatherNote").textContent="Weather data unavailable: "+e.message}},e=>$("weatherNote").textContent=e.message,{timeout:12000})};
function getHistory(){try{return JSON.parse(localStorage.getItem("csp_history")||"[]")}catch{return[]}}
function renderHistory(){const h=getHistory();$("historyList").replaceChildren();if(!h.length){$("historyList").textContent=tr("noHistory");return}h.slice(0,20).forEach(x=>{const d=document.createElement("div");d.className="history-item";const a=document.createElement("span"),b=document.createElement("time");a.textContent=x.label+(x.confidence?" · "+(x.confidence*100).toFixed(1)+"%":"");b.textContent=new Date(x.time).toLocaleString(lang==="th"?"th-TH":"en-US");d.append(a,b);$("historyList").append(d)})}
$("clearHistoryBtn").onclick=()=>{if(confirm(lang==="th"?"ล้างประวัติในอุปกรณ์นี้ทั้งหมด?":"Clear all local history?")){localStorage.removeItem("csp_history");renderHistory()}};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(getHistory(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cloud-scanner-history.json";a.click();URL.revokeObjectURL(a.href)};
setLang();renderHistory();loadModel();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});

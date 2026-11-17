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
 th:{eyebrow:"CLOUD INTELLIGENCE PLATFORM",headline:"มองท้องฟ้าให้ลึกกว่าเดิม",subhead:"สแกนชนิดเมฆ ตรวจคุณภาพภาพ และดูสภาพอากาศจากตำแหน่งของคุณ",scannerTitle:"สแกนท้องฟ้า",ready:"พร้อมใช้งาน",cameraPrompt:"เปิดกล้องหรือเลือกรูปภาพ",cameraHint:"แนะนำให้เห็นท้องฟ้าและเมฆชัดเจน",openCamera:"เปิดกล้อง",chooseImage:"เลือกรูปภาพ",stopCamera:"ปิดกล้อง",analyze:"วิเคราะห์ภาพ",modelMissing:"ยังไม่มีโมเดล AI ที่ผ่านการประเมินและอนุมัติให้ใช้งาน ระบบจะไม่เดาผลแทนโมเดลจริง",resultTitle:"ผลการวิเคราะห์",waiting:"รอภาพสำหรับวิเคราะห์",waitingHint:"ผลจำแนกจะแสดงเมื่อมีโมเดลที่ผ่านการทดสอบ",classification:"การจำแนกเมฆ",confidence:"ความมั่นใจของโมเดล",weatherTitle:"สภาพอากาศบริเวณนี้",locate:"ใช้ตำแหน่งของฉัน",temperature:"อุณหภูมิ",humidity:"ความชื้น",cloudCover:"เมฆปกคลุม",wind:"ลม",weatherHint:"ต้องอนุญาตตำแหน่งเพื่อดึงข้อมูลอากาศ · Open-Meteo",historyTitle:"ประวัติบนอุปกรณ์นี้",export:"ส่งออก",clear:"ล้างประวัติ",noHistory:"ยังไม่มีประวัติการสแกน",privacy:"ประวัติเก็บไว้ในเบราว์เซอร์ของคุณเท่านั้น ไม่ซิงก์ขึ้น Cloud",disclaimerTitle:"หมายเหตุความแม่นยำ",disclaimer:"ผลจำแนกเป็นการประเมินภาพ ไม่ใช่การพยากรณ์ฝนหรือคำเตือนภัย ความมั่นใจไม่เท่ากับความถูกต้องที่รับประกัน",footer:"สำหรับการศึกษาและการวิเคราะห์เบื้องต้น",noModel:"ยังไม่มีโมเดลที่ผ่านการประเมิน",badImage:"ไม่สามารถอ่านภาพนี้ได้",modelNotReady:"พบไฟล์โมเดล แต่ยังไม่ผ่านสถานะ validated จึงยังไม่เปิดให้ทำนาย",analyzing:"กำลังวิเคราะห์ภาพ…",rejected:"ภาพนี้อยู่นอกขอบเขตหรือความมั่นใจไม่เพียงพอ ระบบจึงไม่ระบุชนิดเมฆ",modelResult:"ผลจากโมเดล AI · ไม่ใช่คำพยากรณ์อากาศ"},
 en:{eyebrow:"CLOUD INTELLIGENCE PLATFORM",headline:"See more in every sky",subhead:"Identify cloud types, check image quality and explore weather around your location.",scannerTitle:"Sky scanner",ready:"Ready",cameraPrompt:"Open camera or choose an image",cameraHint:"For best results, capture a clear view of the sky and clouds.",openCamera:"Open camera",chooseImage:"Choose image",stopCamera:"Stop camera",analyze:"Analyze image",modelMissing:"No AI model has passed evaluation and release approval yet. The app will not invent predictions.",resultTitle:"Analysis result",waiting:"Waiting for an image",waitingHint:"Classification appears only when a validated model is available.",classification:"CLOUD CLASSIFICATION",confidence:"Model confidence",weatherTitle:"Local weather",locate:"Use my location",temperature:"Temperature",humidity:"Humidity",cloudCover:"Cloud cover",wind:"Wind",weatherHint:"Location permission required · Open-Meteo",historyTitle:"On-device history",export:"Export",clear:"Clear",noHistory:"No scan history yet",privacy:"History stays in this browser on this device. It is not synced to the cloud.",disclaimerTitle:"Accuracy note",disclaimer:"This is image classification, not a rainfall forecast or severe-weather warning. Confidence is not a guarantee of correctness.",footer:"For education and preliminary analysis",noModel:"No validated model is available",badImage:"Could not read this image",modelNotReady:"Model files found but release status is not validated; predictions remain disabled.",analyzing:"Analyzing image…",rejected:"Image is outside the supported scope or confidence is insufficient. No cloud type is assigned.",modelResult:"AI model output · Not a weather forecast"}
};
let lang=localStorage.getItem("csp_lang")||"th", stream=null, imageSource=null, modelSession=null, modelMeta=null;
function tr(k){return T[lang][k]||T.en[k]||k}
function setLang(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(T[lang][k])el.textContent=T[lang][k]});$("langBtn").textContent=lang==="th"?"EN":"TH";localStorage.setItem("csp_lang",lang)}
$("langBtn").onclick=()=>{lang=lang==="th"?"en":"th";setLang();renderHistory()};
function setMessage(s){$("scanMessage").textContent=s}
function stopStream(){if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$("video").srcObject=null;$("video").hidden=true;$("stopCameraBtn").disabled=true}
$("cameraBtn").onclick=async()=>{try{if(!navigator.mediaDevices?.getUserMedia)throw Error("Camera requires HTTPS or localhost.");stopStream();stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});$("video").srcObject=stream;await $("video").play();$("video").hidden=false;$("preview").hidden=true;$("emptyState").hidden=true;imageSource=$("video");$("stopCameraBtn").disabled=false;$("analyzeBtn").disabled=false}catch(e){setMessage(e.message)}};
$("stopCameraBtn").onclick=()=>{stopStream();if(!$("preview").src)$("emptyState").hidden=false;imageSource=$("preview").src?$("preview"):null;$("analyzeBtn").disabled=!imageSource};
$("fileInput").onchange=e=>{const f=e.target.files?.[0];if(!f||!f.type.startsWith("image/"))return;stopStream();const url=URL.createObjectURL(f);$("preview").src=url;$("preview").hidden=false;$("video").hidden=true;$("emptyState").hidden=true;imageSource=$("preview");$("analyzeBtn").disabled=false;setMessage(f.name)};
async function loadModel(){
 try{
  const mr=await fetch("./models/cloud-classifier/model_metadata.json",{cache:"no-store"});
  if(!mr.ok)throw Error("metadata missing");
  const meta=await mr.json();modelMeta=meta;
  if(meta.status!=="validated"||!meta.test_metrics||!meta.release_thresholds)throw Error("not validated");
  if(!window.ort)throw Error("ONNX Runtime Web failed to load");
  ort.env.wasm.wasmPaths="https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
  modelSession=await ort.InferenceSession.create("./models/cloud-classifier/model.onnx",{executionProviders:["wasm"]});
  $("modelStatus").textContent=lang==="th"?"AI พร้อมใช้งาน":"AI ready";$("modelStatus").classList.remove("muted");setMessage(lang==="th"?"โหลดโมเดลที่ผ่านการประเมินแล้ว":"Validated model loaded");
 }catch(e){modelSession=null;$("modelStatus").textContent=lang==="th"?"ยังไม่มีโมเดลที่รับรอง":"Model not released";setMessage(e.message==="not validated"?tr("modelNotReady"):tr("noModel"))}
}
function getImageElement(){
 if(imageSource===$("video")){if(!$("video").videoWidth)throw Error(tr("badImage"));return $("video")}
 if(imageSource===$("preview")&&$("preview").complete&&$("preview").naturalWidth)return $("preview");
 throw Error(tr("badImage"));
}
function preprocess(el){
 const size=Number(modelMeta?.input?.shape?.[2]||224);\n const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;
 const ctx=canvas.getContext("2d",{willReadFrequently:true});
 const w=el.videoWidth||el.naturalWidth,h=el.videoHeight||el.naturalHeight;
 ctx.drawImage(el,0,0,size,size);
 const px=ctx.getImageData(0,0,size,size).data, plane=size*size, data=new Float32Array(1*3*plane);
 const mean=[.485,.456,.406],std=[.229,.224,.225];
 for(let i=0;i<plane;i++){data[i]=(px[i*4]/255-mean[0])/std[0];data[plane+i]=(px[i*4+1]/255-mean[1])/std[1];data[2*plane+i]=(px[i*4+2]/255-mean[2])/std[2]}
 return new ort.Tensor("float32",data,[1,3,size,size]);
}
function softmax(a){const m=Math.max(...a),e=a.map(v=>Math.exp(v-m)),s=e.reduce((x,y)=>x+y,0);return e.map(v=>v/s)}
function addHistory(label,confidence){const h=getHistory();h.unshift({label,confidence,time:new Date().toISOString()});localStorage.setItem("csp_history",JSON.stringify(h.slice(0,100)));renderHistory()}
$("analyzeBtn").onclick=async()=>{
 if(!modelSession||!modelMeta){setMessage(tr("noModel"));return}
 try{
  setMessage(tr("analyzing"));$("analyzeBtn").disabled=true;
  const tensor=preprocess(getImageElement()),out=await modelSession.run({[modelSession.inputNames[0]]:tensor});
  const logits=Array.from(out[modelSession.outputNames[0]].data),probs=softmax(logits);
  const ranked=probs.map((p,i)=>({p,i})).sort((a,b)=>b.p-a.p),top=ranked[0],second=ranked[1];
  const threshold=Number(modelMeta.release_thresholds.min_confidence),margin=Number(modelMeta.release_thresholds.min_margin);
  if(!Number.isFinite(threshold)||!Number.isFinite(margin)||top.p<threshold||top.p-second.p<margin){
    $("resultEmpty").hidden=false;$("resultContent").hidden=true;setMessage(tr("rejected"));return;
  }
  const code=modelMeta.classes[top.i],names=LABELS[code]||[code,code];
  $("resultEmpty").hidden=true;$("resultContent").hidden=false;
  $("cloudName").textContent=names[0];$("cloudThai").textContent=names[1];
  $("confidence").textContent=(top.p*100).toFixed(1)+"%";$("confidenceBar").style.width=(top.p*100)+"%";
  $("modelNote").textContent=tr("modelResult");setMessage(tr("modelResult"));addHistory(names[0],top.p);
 }catch(e){setMessage(e.message||tr("badImage"))}finally{$("analyzeBtn").disabled=false}
};
$("weatherBtn").onclick=()=>{if(!navigator.geolocation){$("weatherNote").textContent="Geolocation is not supported.";return} $("weatherNote").textContent=lang==="th"?"กำลังขอตำแหน่ง…":"Requesting location…";navigator.geolocation.getCurrentPosition(async p=>{try{const u=new URL("https://api.open-meteo.com/v1/forecast");u.search=new URLSearchParams({latitude:p.coords.latitude,longitude:p.coords.longitude,current:"temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m",timezone:"auto"});const d=await(await fetch(u)).json(),c=d.current;$("temp").textContent=c.temperature_2m+"°C";$("humidity").textContent=c.relative_humidity_2m+"%";$("cloudCover").textContent=c.cloud_cover+"%";$("wind").textContent=c.wind_speed_10m+" km/h";$("weatherNote").textContent="Open-Meteo · "+c.time}catch(e){$("weatherNote").textContent="Weather data unavailable: "+e.message}},e=>$("weatherNote").textContent=e.message,{timeout:12000})};
function getHistory(){try{return JSON.parse(localStorage.getItem("csp_history")||"[]")}catch{return[]}}
function renderHistory(){const h=getHistory();$("historyList").replaceChildren();if(!h.length){$("historyList").textContent=tr("noHistory");return}h.slice(0,20).forEach(x=>{const d=document.createElement("div");d.className="history-item";const a=document.createElement("span"),b=document.createElement("time");a.textContent=x.label+(x.confidence?" · "+(x.confidence*100).toFixed(1)+"%":"");b.textContent=new Date(x.time).toLocaleString(lang==="th"?"th-TH":"en-US");d.append(a,b);$("historyList").append(d)})}
$("clearHistoryBtn").onclick=()=>{if(confirm(lang==="th"?"ล้างประวัติในอุปกรณ์นี้ทั้งหมด?":"Clear all local history?")){localStorage.removeItem("csp_history");renderHistory()}};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(getHistory(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="cloud-scanner-history.json";a.click();URL.revokeObjectURL(a.href)};
setLang();renderHistory();loadModel();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});

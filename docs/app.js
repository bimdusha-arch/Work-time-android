const KEY="worktime.pwa.v01";
const DAY_MS=8*60*60*1000;
const statusEl=document.querySelector("#status");
const timerEl=document.querySelector("#timer");
const hoursEl=document.querySelector("#hours");
const percentEl=document.querySelector("#percent");
const ring=document.querySelector("#ring");
const button=document.querySelector("#startStop");
const buttonText=document.querySelector("#buttonText");
let state=load();

function load(){
  try{return {...{running:false,startedAt:null,lastElapsedMs:0},...JSON.parse(localStorage.getItem(KEY)||"{}")};}
  catch{return {running:false,startedAt:null,lastElapsedMs:0};}
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function elapsed(){return state.lastElapsedMs+(state.running&&state.startedAt?Date.now()-state.startedAt:0);}
function clock(ms){
  const total=Math.floor(ms/1000),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;
  return [h,m,s].map((v,i)=>i===0?String(v).padStart(2,"0"):String(v).padStart(2,"0")).join(":");
}
function render(){
  const ms=elapsed(),progress=Math.min(ms/DAY_MS,1),pct=Math.min(ms/DAY_MS*100,100);
  timerEl.textContent=clock(ms);
  hoursEl.textContent=(ms/3600000).toFixed(2)+" / 8 h";
  percentEl.textContent=pct.toFixed(pct<10?1:0)+"%";
  ring.style.setProperty("--progress",progress);
  statusEl.textContent=state.running?"Working":"Not working";
  buttonText.textContent=state.running?"STOP":"START";
  button.classList.toggle("running",state.running);
}
button.addEventListener("click",()=>{
  if(state.running){state.lastElapsedMs=elapsed();state.running=false;state.startedAt=null;}
  else{state.running=true;state.startedAt=Date.now();}
  save();render();
});
render();
setInterval(render,250);
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));}

const KEY="worktime.pwa.v01",DAY_MS=8*60*60*1000;
const statusEl=document.querySelector("#status"),timerEl=document.querySelector("#timer"),hoursEl=document.querySelector("#hours"),percentEl=document.querySelector("#percent"),ring=document.querySelector("#ring"),ringStage=document.querySelector(".ringStage"),overtimeRing=document.querySelector("#overtimeRing"),overtimeLabel=document.querySelector("#overtimeLabel"),progressLabel=document.querySelector("#progressLabel"),button=document.querySelector("#startStop"),buttonText=document.querySelector("#buttonText"),demo=document.querySelector("#demoOvertime");
let state=load(),demoMs=null;
function load(){try{return {...{running:false,startedAt:null,lastElapsedMs:0},...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return {running:false,startedAt:null,lastElapsedMs:0}}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function elapsed(){return state.lastElapsedMs+(state.running&&state.startedAt?Date.now()-state.startedAt:0)}
function clock(ms){const t=Math.floor(ms/1000),h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;return [h,m,s].map(v=>String(v).padStart(2,"0")).join(":")}
function shortTime(ms){const t=Math.floor(ms/60000),h=Math.floor(t/60),m=t%60;return "+"+h+":"+String(m).padStart(2,"0")}
function render(){const real=elapsed(),ms=demoMs??real,over=Math.max(ms-DAY_MS,0),progress=Math.min(ms/DAY_MS,1),overProgress=Math.min(over/DAY_MS,1);
timerEl.textContent=clock(ms);ring.style.setProperty("--progress",progress);overtimeRing.style.setProperty("--overtime",overProgress);
const isOver=over>0;ringStage.classList.toggle("overtime",isOver);overtimeLabel.textContent=isOver?shortTime(over)+" overtime":"";
hoursEl.textContent=isOver?"8.00 h + "+(over/3600000).toFixed(2)+" h":(ms/3600000).toFixed(2)+" / 8 h";
progressLabel.textContent=isOver?"Overtime":"Daily progress";percentEl.textContent=isOver?"+"+(over/DAY_MS*100).toFixed(0)+"%":(progress*100).toFixed(progress<.1?1:0)+"%";
statusEl.textContent=demoMs!==null?"Preview":state.running?"Working":"Not working";buttonText.textContent=state.running?"STOP":"START";button.classList.toggle("running",state.running);demo.textContent=demoMs===null?"PREVIEW 10 HOURS":"BACK TO REAL TIME"}
button.addEventListener("click",()=>{demoMs=null;if(state.running){state.lastElapsedMs=elapsed();state.running=false;state.startedAt=null}else{state.running=true;state.startedAt=Date.now()}save();render()});
demo.addEventListener("click",()=>{demoMs=demoMs===null?10*60*60*1000:null;render()});render();setInterval(render,250);
if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"))}
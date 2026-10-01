const KEY="worktime.pwa.v01";
const statusEl=document.querySelector("#status");
const timerEl=document.querySelector("#timer");
const button=document.querySelector("#startStop");
let state=load();

function load(){
  try{return {...{running:false,startedAt:null,lastElapsedMs:0},...JSON.parse(localStorage.getItem(KEY)||"{}")};}
  catch{return {running:false,startedAt:null,lastElapsedMs:0};}
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function elapsed(){
  return state.lastElapsedMs+(state.running&&state.startedAt?Date.now()-state.startedAt:0);
}
function render(){
  timerEl.textContent=(elapsed()/3600000).toFixed(2)+" h";
  statusEl.textContent=state.running?"Working":"Not working";
  button.textContent=state.running?"STOP":"START";
  button.classList.toggle("running",state.running);
}
button.addEventListener("click",()=>{
  if(state.running){
    state.lastElapsedMs=elapsed();
    state.running=false;
    state.startedAt=null;
  }else{
    state.running=true;
    state.startedAt=Date.now();
  }
  save(); render();
});
render();
setInterval(render,1000);

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js"));
}
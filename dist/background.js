(()=>{"use strict";class t{scripting=null;tabId=null;btnStyle="\n    top: 50vh;\n    left: 95vw;\n    z-index: 999;\n    border: none;\n    position:fixed;\n    width: 40px;\n    height: 40px;\n    border-radius: 50%;\n  ";constructor(t){this.scripting=chrome.scripting,this.tabId=t}create(t){this.scripting.executeScript({target:{tabId:this.tabId},func:(t,e)=>{if(!document.getElementById("actions-button")){const a=t?"green":"red",r=`${e}background-color: ${a};box-shadow: 0px 0px 10px 4px ${a};`,s=document.createElement("button");s.setAttribute("id","actions-button"),s.setAttribute("style",r),s.setAttribute("data-start",t),s.addEventListener("click",(async()=>{"true"===s.dataset.start?(s.style.backgroundColor="red",s.style.boxShadow="0px 0px 10px 4px red",s.dataset.start="false",await chrome.storage.local.set({timerStart:!1})):(s.style.backgroundColor="green",s.style.boxShadow="0px 0px 10px 4px green",s.dataset.start="true",await chrome.storage.local.set({timerStart:!0}))})),document.body.appendChild(s)}},args:[t,this.btnStyle]})}remove(){this.scripting.executeScript({target:{tabId:this.tabId},func:()=>{const t=document.getElementById("actions-button");t&&t.remove()}})}}class e{storage=null;constructor(){this.storage=chrome.storage}async set(t){await this.storage.local.set(t)}get(t){return this.storage.local.get(t)}changed(t){this.storage.onChanged.addListener(t)}}class a{tabs=null;constructor(){this.tabs=chrome.tabs}onEventsTab(t,e){return this.tabs[t].addListener(e)}reload(){this.tabs.reload()}async getCurrentTab(){const[t]=await this.tabs.query({currentWindow:!0,active:!0});return t.id}}class r{timer=null;delay=3e4;storage=null;constructor(t){this.storage=t,this.setDelay()}get timer(){return this.timer}async setDelay(t){if(t)this.delay=t;else{const{delay:t}=await this.storage.get(["delay"]);console.log(t,"delay"),this.delay=t??3e4}}timerRun(t){this.timer||(this.timer=setInterval(t,this.delay))}async timerStop(){clearInterval(this.timer),this.timer=null,await this.storage.set({timerStart:!1})}}(()=>{const s=new e,n=new r(s),i=new a,o=()=>{n.timerRun((()=>{i.reload()}))},l=async e=>{const a=new t(e),{showStartButton:r,timerStart:i}=await s.get(["showStartButton","timerStart"]);r?a.create(i):a.remove(),i&&null===n.timer&&o()};i.onEventsTab("onUpdated",(t=>{l(t)})),i.onEventsTab("onActivated",(({tabId:t})=>{l(t)})),s.changed((async t=>{t.timerStart&&(t.timerStart.newValue?(await s.set({timerStart:!0}),o()):(await s.set({timerStart:!1}),await n.timerStop())),t.delay&&(await n.timerStop(),t.delay.newValue&&(await n.setDelay(),await s.set({delay:t.delay.newValue})))}))})()})();
//# sourceMappingURL=background.js.map

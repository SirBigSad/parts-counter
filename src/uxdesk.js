/* ===== Computer layout: on a wide screen (1100px and up) the store picture stays full size on the left
   for every tab, the tabs move up into the header as a compact pill bar, everything lines up to one
   width, rows react to the mouse, and the number keys 1-5 switch tabs. Phones are untouched. ===== */
(()=>{
const css=document.createElement('style');css.id='desk';css.textContent=`
@media (min-width:1100px){
 header>.hrow,header>.dash,header>*{max-width:1468px!important;margin-left:auto!important;margin-right:auto!important}
 header .hrow{align-items:center!important}
 main{padding-bottom:32px!important}
 /* the store picture: full size on every tab */
 main>.stage,body.offhome #stage,body.offhome #stage.open{height:calc(100vh - 280px)!important;min-height:360px}
 body.offhome #ticker{display:block}
 #stagePeek,#stageChip,.stage .fold{display:none!important}
 /* tabs in the header */
 header nav.bar{position:relative!important;transform:none!important;left:auto!important;right:auto!important;bottom:auto!important;width:auto!important;
  display:flex!important;gap:2px;flex:0 1 auto;margin:0 16px;padding:4px!important;border-radius:999px!important;height:auto!important;
  background:rgba(0,0,0,.22)!important;border:1px solid rgba(255,255,255,.12)!important;box-shadow:none!important;backdrop-filter:none!important}
 header nav.bar button{flex:0 0 auto!important;display:flex!important;flex-direction:row!important;align-items:center;gap:7px;min-height:38px!important;height:38px;padding:0 16px!important;border-radius:999px;font-size:14px!important;color:rgba(255,255,255,.8)!important;width:auto!important}
 header nav.bar button svg{width:18px!important;height:18px!important;margin:0!important}
 header nav.bar button span,header nav.bar button b,header nav.bar button small{font-size:14px!important;margin:0!important}
 header nav.bar button:hover{background:rgba(255,255,255,.1)}
 header nav.bar button[aria-selected=true]{color:var(--acc)!important}header nav.bar #navInd{top:4px;bottom:4px}
 header nav.bar .n{position:static!important;margin-left:2px}
 header.mini nav.bar button{min-height:32px!important;height:32px}
 /* the mouse */
 .sku:not(.locked):not(.full):hover,.item:not(.locked):not(.full):hover{background:color-mix(in srgb,var(--acc) 6%,transparent)}
 .btn:not(:disabled):hover{filter:brightness(1.08)}
 .btn,.tbi,details>summary,[data-mt]{cursor:pointer}
 [data-mt]:hover{transform:translateY(-2px);transition:transform .15s}
 ::-webkit-scrollbar{width:10px}::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--mute) 40%,transparent);border-radius:9px}::-webkit-scrollbar-track{background:transparent}
}`;
document.head.appendChild(css);
const mq=matchMedia('(min-width:1100px)'),nav=document.querySelector('nav.bar'),home=nav&&nav.parentNode,next=nav&&nav.nextSibling;
function place(){if(!nav)return;const row=document.querySelector('header .hrow'),money=row&&row.querySelector('.money');
  if(mq.matches&&row&&money){if(nav.parentNode!==row)row.insertBefore(nav,money)}else if(nav.parentNode!==home)home.insertBefore(nav,next);
  dispatchEvent(new Event('resize'))}
mq.addEventListener('change',place);place();
/* number keys switch tabs on a computer */
const tabs=()=>[...nav.querySelectorAll('button[data-tab]')].filter(b=>!b.hidden&&getComputedStyle(b).display!=='none');
setTimeout(()=>tabs().forEach((b,i)=>{if(!b.title)b.title=`${b.textContent.trim()} (${i+1})`}),500);
addEventListener('keydown',e=>{if(!mq.matches||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  const n=+e.key;if(n>=1&&n<=9){const b=tabs()[n-1];if(b){e.preventDefault();b.click()}}});
})();

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
/* ===== Computer layout, part 2 ===== */
(()=>{
const css=document.createElement('style');css.id='desk2';css.textContent=`
#tip{position:fixed;z-index:80;max-width:280px;padding:9px 12px;border-radius:14px;background:#1d1a2e;color:#fff;font:13px/1.35 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.4);pointer-events:none;opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s}
#tip.on{opacity:1;transform:none}#tip b{display:block;font-size:14px;margin-bottom:3px}#tip i{font-style:normal;color:#9be7c4}#tip u{text-decoration:none;color:#ffb3b3}#tip small{display:block;color:#aab;margin-top:4px;font-size:11.5px}
.rail{display:none}
@media (min-width:1100px){
 /* mini header: one thin row (title, tabs, money) over a thin row of the four links */
 header.mini #flow,header.mini #weak,header.mini #rkEta,header.mini .who small{display:none!important}
 header.mini .dash{margin-top:4px!important}header.mini .dash>div{padding:3px 10px!important}header.mini .dash .db{display:none!important}
 /* More: tiles become a side list, the picked page opens next to it */
 #t-more.one{display:grid!important;grid-template-columns:230px minmax(0,1fr);column-gap:18px;align-items:start}
 #t-more.one>#mback{display:none!important}
 #t-more.one>#mtiles{display:block!important;grid-column:1;grid-row:1/span 40;position:sticky;top:200px;max-height:calc(100vh - 220px);overflow:auto;margin:0}
 #t-more.one>#mtiles h4{margin:10px 6px 4px;font-size:11px}
 #t-more.one>#mtiles .tg{grid-template-columns:1fr;gap:3px}
 #t-more.one>#mtiles button{min-height:0;padding:7px 12px;border-radius:999px;border-top:0;box-shadow:none;background:transparent;flex-direction:row;align-items:center;gap:8px}
 #t-more.one>#mtiles button::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--tc);flex:none}
 #t-more.one>#mtiles button b{font-size:15px}#t-more.one>#mtiles button small{display:none}
 #t-more.one>#mtiles button:hover{background:var(--soft);transform:none}
 #t-more.one>#mtiles button.cur{background:var(--card);box-shadow:var(--sh)}
 #t-more.one>details.fold.pick{grid-column:2!important}
 /* rows use the width: name, chips and bar on one line */
 .sku:not(.locked):not(.full) .sn{display:grid!important;grid-template-columns:minmax(150px,1.3fr) auto minmax(70px,1fr);align-items:center;column-gap:14px}
 .sku:not(.locked):not(.full) .sn>small{margin:0!important}
 .sku:not(.locked):not(.full) .sn>.rbar,.sku:not(.locked):not(.full) .sn>[id$=w]{grid-column:3;grid-row:1;margin:0!important;align-self:center}
}
@media (min-width:1100px) and (max-width:1599px){
 #caps .item:not(.locked):not(.full),#shcaps .item:not(.locked):not(.full){display:grid!important;grid-template-columns:minmax(0,1.3fr) auto minmax(70px,1fr) auto;align-items:center;column-gap:14px}
 #caps .item:not(.locked):not(.full)>h3,#shcaps .item:not(.locked):not(.full)>h3{grid-column:1;grid-row:1;margin:0}
 #caps .item:not(.locked):not(.full)>p,#shcaps .item:not(.locked):not(.full)>p{grid-column:2;grid-row:1}
 #caps .item:not(.locked):not(.full)>.rbar,#shcaps .item:not(.locked):not(.full)>.rbar{grid-column:3;grid-row:1;margin:0!important}
 #caps .item:not(.locked):not(.full)>button,#shcaps .item:not(.locked):not(.full)>button{grid-column:4!important;grid-row:1!important}
}
@media (min-width:1600px){
 main{grid-template-columns:560px minmax(0,1fr)!important;max-width:1880px!important}
 header>.hrow,header>.dash,header>*{max-width:1848px!important}
 /* three columns: store | list | rail */
 main>section:not([hidden]):not(#t-more):has(>.rail:not([hidden])){display:grid!important;grid-template-columns:minmax(0,1fr) 320px;column-gap:20px;align-items:start}
 main>section>*,#t-shelves>#ladder,#t-shelves>.row,#t-shelves>#mode{grid-column:1!important;grid-row:auto!important}
 main>section>.rail{grid-column:2!important;grid-row:1/span 60!important}
 main>section>.rail{display:flex;flex-direction:column;gap:12px;grid-column:2;grid-row:1/span 60;position:sticky;top:200px}
 main>section>.rail[hidden]{display:none}
 .rail>*{margin:0!important}.rail .nx2{flex-direction:column;align-items:stretch}.rail .nx2 .btn{width:100%}
 /* the four links side by side, two by two */
 #t-store:not([hidden]) #caps,#t-shop:not([hidden]) #shcaps{display:grid!important;grid-template-columns:1fr 1fr!important;gap:14px;align-items:start}
}`;
document.head.appendChild(css);
const $$=s=>document.querySelector(s);
/* ---- the rail: Next up and best buy move beside the list on very wide screens ---- */
const RAILS={shelves:['#t-shelves>#prog'],store:['#t-store>.nx2'],service:['#t-service .nx2','#sprog'],shop:['#t-shop .nx2','#shOpen>.card']};
const homes=new Map(),rails={};
const wide=matchMedia('(min-width:1600px)');
function rail(){for(const t in RAILS){const sec=$$('#t-'+t);if(!sec)continue;let r=rails[t];if(!r){r=document.createElement('div');r.className='rail';rails[t]=r;sec.prepend(r)}
  for(const q of RAILS[t]){const el=homes.has(q)?homes.get(q).el:$$(q);if(!el)continue;if(!homes.has(q))homes.set(q,{el,parent:el.parentNode,next:el.nextSibling});const h=homes.get(q);
    if(wide.matches){if(el.parentNode!==r)r.appendChild(el)}else if(el.parentNode===r)h.parent.insertBefore(el,h.next&&h.next.parentNode===h.parent?h.next:null)}
  const closed=sec.querySelector('#svClosed,#shClosed');r.hidden=!wide.matches||!!(closed&&!closed.hidden&&closed.innerHTML.trim())}}
wide.addEventListener('change',rail);setTimeout(rail,600);setInterval(rail,1000);
/* ---- More: mark the page that's open in the side list ---- */
document.addEventListener('click',e=>{const b=e.target.closest('#mtiles [data-mt]');if(!b)return;document.querySelectorAll('#mtiles .cur').forEach(x=>x.classList.remove('cur'));b.classList.add('cur')});
/* ---- hover tips (mouse only) ---- */
const fine=matchMedia('(hover:hover) and (pointer:fine)');
const tip=document.createElement('div');tip.id='tip';document.body.appendChild(tip);let tgt=null;
const LINK={sh:['Shelf','supply'],cu:['Customers','dem'],ck:['Checkout','ck'],sk:['Stocking','sk']};
function tipHTML(el){
  if(el.matches('#dash>[data-jump]')){const k=el.dataset.jump,[n,f]=LINK[k]||[];if(!n||typeof R==='undefined')return '';const vals=Object.values(LINK).map(([,x])=>R[x]),lo=Math.min(...vals),v=R[f];
    return `<b>${n}: ${fmt(v)}/s</b>${el.classList.contains('lim')?'<u>The slowest link. Everything moves at this speed, so this is the one to improve.</u>':`<i>${lo>0?(v/lo).toFixed(2)+'× the slowest link':'Ahead of the slowest link'}</i>`}<small>Click to go there</small>`}
  const row=el.closest('.sku,.item');if(!row)return '';const name=(row.querySelector('.sn b,h3 span')||{}).textContent||'';
  if(el.disabled&&!el.dataset.cl)return `<b>${name}</b>Full: 25 of 25`;
  const amt=(el.firstChild&&el.firstChild.textContent||'').trim(),cl=+el.dataset.cl;
  const each=row.querySelector('.sn .rchip.go,.item>p');const owned=row.querySelector('.rchip:not(.go),.ct');
  let h=`<b>${amt} ${name}</b>`;if(isFinite(cl))h+=`Costs ${moneyL(cl)}<br>`;if(each)h+=`<i>${each.textContent.replace(' each','')}${/each/.test(each.textContent)?' each':''}</i><br>`;if(owned)h+=`Owned: ${owned.textContent.replace('×','')}`;
  h+=el.disabled?`<small>${el.dataset.eta?'You can afford it '+el.dataset.eta:'Not enough money yet'}</small>`:'<small>Click to buy · Space buys the best buy</small>';return h}
function showTip(){if(!tgt||!tgt.isConnected){hideTip();return}const h=tipHTML(tgt);if(!h){hideTip();return}if(tip._h!==h){tip._h=h;tip.innerHTML=h}
  const r=tgt.getBoundingClientRect(),tw=tip.offsetWidth,th=tip.offsetHeight;let x=r.left+r.width/2-tw/2,y=r.top-th-8;if(y<8)y=r.bottom+8;x=Math.max(8,Math.min(innerWidth-tw-8,x));tip.style.left=x+'px';tip.style.top=y+'px';tip.classList.add('on')}
function hideTip(){tgt=null;tip.classList.remove('on')}
document.addEventListener('mouseover',e=>{if(!fine.matches||innerWidth<1100)return;const el=e.target.closest('.sku .btn,.item .btn,#dash>[data-jump]');if(el!==tgt){tgt=el;if(el)showTip();else hideTip()}});
document.addEventListener('mouseleave',hideTip);addEventListener('scroll',hideTip,{passive:true});setInterval(()=>{if(tgt)showTip()},300);
/* ---- keyboard: Q W E R pick x1 x10 x25 Max, Space buys the best buy ---- */
addEventListener('keydown',e=>{if(innerWidth<1100||e.ctrlKey||e.metaKey||e.altKey)return;const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName)&&e.key===' '||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;
  const sec=document.querySelector('main>section:not([hidden])');if(!sec)return;const k=e.key.toLowerCase(),i='qwer'.indexOf(k);
  if(i>=0&&k.length===1){const b=sec.querySelectorAll('.seg button')[i];if(b){e.preventDefault();b.click()}return}
  if(e.key===' '){const show=sec.querySelector('.nx2:not([hidden]) [data-show]');if(!show)return;e.preventDefault();show.click();const row=sec.querySelector('.pick');const b=row&&row.querySelector('button.btn:not(:disabled)');if(b)b.click()}});
})();

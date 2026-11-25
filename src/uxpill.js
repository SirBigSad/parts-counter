/* ===== Parts Counter Idle: the pill pass. Smaller, rounder, capsule-shaped controls everywhere; a floating
   tab bar with a highlight that slides; row details as chips; a live weak-link chip on the store strip; an
   accent colour picker; and messages that drop down as pills. ===== */
(()=>{
const css=document.createElement('style');css.textContent=`
.btn{border-radius:999px}
.sku>.btn,.item>.btn{min-height:38px;padding:4px 16px;font-size:14px}
.sku{padding:3px 4px}.sku .sn b{line-height:1.15}.item{padding:9px 0}
.card{border-radius:20px;padding:12px 13px;margin-bottom:8px}
.card .capg h3{font-size:18px}
.seg{border-radius:999px;padding:3px}.seg button{border-radius:999px;min-height:32px;padding:0 13px}
.dash{gap:5px}.dash>div{border-radius:18px;padding:6px 11px}.dash b{font-size:15px}
#mtiles button{border-radius:20px;min-height:68px}#mapRow{border-radius:999px;padding:8px 16px}
.nx2{border-radius:18px;padding:10px 12px}#weak{border-radius:999px;padding:5px 12px}header.mini #weak{padding:3px 10px}
.item>p{display:inline-block;justify-self:start;margin:2px 0 0;padding:2px 10px;border-radius:999px;background:var(--soft);font-size:12.5px;color:var(--mute)}
.sku .sn small:has(.rchips){display:block;line-height:1;margin-top:2px}.rchips{display:flex;flex-wrap:wrap;gap:4px;line-height:1}.rchip{display:inline-block;padding:0 7px;border-radius:999px;background:var(--soft);font:600 11px/16px system-ui,sans-serif;color:var(--mute);white-space:nowrap}.rchip.ok{color:#16a085;background:color-mix(in srgb,#2ec4a6 16%,transparent)}.rchip.go{color:var(--ink)}
/* the tab bar floats as a capsule */
nav.bar.pillnav{left:10px;right:10px;bottom:calc(8px + env(safe-area-inset-bottom));border-radius:999px;border:1px solid var(--line);padding:4px 6px;box-shadow:0 8px 24px rgba(0,0,0,.28)}
nav.bar.pillnav button{min-height:50px}nav.bar.pillnav button[aria-selected=true]::before{opacity:0}
#navInd{position:absolute;top:4px;bottom:4px;left:0;width:0;border-radius:999px;background:color-mix(in srgb,var(--acc) 18%,transparent);transition:transform .28s cubic-bezier(.3,1.3,.5,1),width .28s;z-index:0;pointer-events:none}
nav.bar.pillnav button{z-index:1}
main{padding-bottom:calc(92px + env(safe-area-inset-bottom))!important;overflow-x:clip}
/* messages drop down as pills */
#toast{border-radius:999px!important;padding:8px 16px!important;font-size:13.5px!important;animation:toastin .32s cubic-bezier(.3,1.3,.5,1)}@keyframes toastin{from{opacity:0;transform:translate(-50%,-14px) scale(.96)}to{opacity:1;transform:translate(-50%,0)}}
/* a live weak-link chip on the store strip */
#stageChip{position:absolute;left:10px;top:8px;z-index:3;display:none;align-items:center;gap:6px;padding:4px 11px;border-radius:999px;background:rgba(255,80,110,.85);color:#fff;font:700 12px system-ui,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.3);pointer-events:none}
body.offhome #stage:not(.open) #stageChip.on{display:flex}
#accRow{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}#accRow button{width:36px;height:36px;border-radius:50%;border:3px solid transparent;background:var(--c);cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.25)}#accRow button[aria-pressed=true]{border-color:var(--ink)}#accRow button.def{background:conic-gradient(#22c55e,#3b82f6,#ec4899,#f59e0b,#22c55e)}`;
document.head.appendChild(css);
const $=id=>document.getElementById(id);
/* floating tab bar with a sliding highlight (skipped for looks that restyle the tab bar themselves) */
const nav=document.querySelector('nav.bar'),ind=document.createElement('span');ind.id='navInd';
const plainNav=()=>{const s=document.documentElement.dataset.skin||'';const b=nav&&nav.querySelector('button');if(!b)return false;const st=getComputedStyle(b,'::after').content;return !(st&&st!=='none'&&st!=='normal')};
function placeInd(){if(!nav)return;const on=plainNav();nav.classList.toggle('pillnav',on);if(!on){ind.remove();return}if(!ind.isConnected)nav.prepend(ind);const b=nav.querySelector('button[aria-selected=true]');if(!b||b.hidden)return;const nr=nav.getBoundingClientRect(),br=b.getBoundingClientRect();ind.style.width=(br.width-8)+'px';ind.style.transform=`translateX(${br.left-nr.left+4}px)`}
if(nav){new MutationObserver(placeInd).observe(nav,{subtree:true,attributes:true,attributeFilter:['aria-selected','hidden']});new MutationObserver(placeInd).observe(document.documentElement,{attributes:true,attributeFilter:['data-skin']});addEventListener('resize',placeInd);setTimeout(placeInd,300)}
/* chip on the store strip */
const stage=$('stage'),chip=document.createElement('div');chip.id='stageChip';if(stage)stage.appendChild(chip);
const NAMES={cu:'Customers',ck:'Checkout',sk:'Stocking'};
setInterval(()=>{if(typeof R==='undefined'||!R)return;let t='';if(FAC&&FAC>=shelfCap())t='Shelves full';else if(FAC&&NAMES[R.lim]&&R.E<.97)t=`${NAMES[R.lim]} · ${Math.round(R.E*100)}%`;if(chip.textContent!==t)chip.textContent=t;chip.classList.toggle('on',!!t)},500);
/* accent colour */
const ACC=[['','Look default'],['#22c55e','Green'],['#3b82f6','Blue'],['#f59e0b','Orange'],['#ec4899','Pink'],['#8b5cf6','Purple'],['#14b8a6','Teal'],['#ef4444','Red']];
const mixw=(c,t)=>{const v=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));return '#'+v.map(x=>Math.round(x+(255-x)*t).toString(16).padStart(2,'0')).join('')};
function applyAcc(){const c=S.ui.acc||'',r=document.documentElement.style;if(c){r.setProperty('--acc',c);r.setProperty('--acc-2',mixw(c,.25));r.setProperty('--on-acc','#ffffff')}else{r.removeProperty('--acc');r.removeProperty('--acc-2');r.removeProperty('--on-acc')}
  for(const b of document.querySelectorAll('#accRow button'))b.setAttribute('aria-pressed',String((b.dataset.c||'')===c))}
applyAcc();
const addAcc=()=>{const look=[...document.querySelectorAll('#t-more>details.fold')].find(d=>(d.querySelector('summary')||{}).textContent==='Look');if(!look)return false;if($('accCard'))return true;
  const c=document.createElement('div');c.className='card';c.id='accCard';c.innerHTML=`<b>Accent colour</b><p class="sub" style="margin:4px 0 0">Colours the buttons, pills and highlights. Works with any look.</p><div id="accRow">${ACC.map(([v,n])=>`<button data-c="${v}" class="${v?'':'def'}" style="--c:${v||'#999'}" aria-label="${n}" title="${n}"></button>`).join('')}</div>`;
  c.addEventListener('click',e=>{const b=e.target.closest('[data-c]');if(!b)return;S.ui.acc=b.dataset.c;applyAcc();save()});look.appendChild(c);applyAcc();return true};
const ta=setInterval(()=>{if(addAcc())clearInterval(ta)},700);
})();
/* ---- pill pass 2: tiles, pill toggles, pill rows, one-row toolbars ---- */
(function(){
const css=`
/* Stats + Shop floor as tiles */
#stats.kv,#shFlow.kv{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.kt{background:var(--soft);border-radius:14px;padding:7px 10px;min-width:0}
.kt small{display:block;font-size:11px;color:var(--mute);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kt b{display:block;font:700 16px/1.25 'Barlow Condensed',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kt.hot{background:color-mix(in srgb,var(--bad,#d33) 16%,var(--card));box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--bad,#d33) 55%,transparent)}
.kt.hot b{color:var(--bad,#d33)}
/* Settings as a pill grid */
.card:has(#sAnim){display:grid;grid-template-columns:1fr 1fr;gap:6px}
.card:has(#sAnim)>:not(label.tog){grid-column:1/-1}
.card:has(#sAnim) label.tog{min-height:38px;border-radius:999px;background:var(--soft);padding:0 12px;font-size:13px;font-weight:600;border:0;margin:0;justify-content:center;text-align:center;position:relative;transition:background .2s,color .2s}
.card:has(#sAnim) label.tog input{position:absolute;opacity:0;pointer-events:none}
.card:has(#sAnim) label.tog:has(input:checked){background:var(--acc);color:var(--on-acc,#fff)}
/* Catalog departments as pill rows with a bar */
details.cat>summary{position:relative;border-radius:999px;background:var(--soft);padding:8px 14px 10px!important;margin:4px 0;overflow:hidden}
details.cat>summary::before{content:"";position:absolute;left:14px;right:14px;bottom:4px;height:3px;border-radius:3px;background:linear-gradient(90deg,var(--lc,var(--acc)) var(--p,0%),color-mix(in srgb,var(--mute) 22%,transparent) var(--p,0%))}
/* Next title bar */
#rkEta{display:flex!important;align-items:center;gap:6px}header.mini #rkEta{display:none!important}
#rkEta span{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}
#rkEta em{flex:0 0 46px;height:5px;border-radius:5px;background:color-mix(in srgb,var(--mute) 25%,transparent);overflow:hidden;display:block}
#rkEta em i{display:block;height:100%;border-radius:5px;background:var(--acc);transition:width .4s}
#rkEta b{flex:0 0 auto;font-weight:600;font-size:11px}
/* Card headers in one row with a small ring */
.capg{display:flex;align-items:center;justify-content:space-between;gap:8px}
.capg .gauge{width:44px!important;flex:0 0 44px}
.capg .gauge svg{width:40px!important;height:40px!important}
.capg .gauge small{display:none!important}
.capg .gauge b{font-size:11px!important;height:40px!important}
/* One toolbar */
.row.tbar{display:flex;align-items:center;gap:6px;flex-wrap:nowrap}
.row.tbar .seg{flex:1 1 auto;min-width:0}
.row.tbar label.tog.mini{flex:0 0 auto;min-height:32px;margin:0;padding:0 10px;border-radius:999px;background:var(--card);box-shadow:var(--sh);font-size:12px;font-weight:600;gap:6px;white-space:nowrap}
.row.tbar label.tog.mini:has(input:checked){background:var(--acc);color:var(--on-acc,#fff)}
.row.tbar label.tog.mini input{position:absolute;opacity:0;pointer-events:none}
.tbi{flex:0 0 32px;height:32px;border-radius:50%;border:0;background:var(--card);box-shadow:var(--sh);font:italic 700 15px Georgia,serif;color:var(--mute);cursor:pointer}
.tbi.on{background:var(--acc);color:var(--on-acc,#fff)}
section:has(.tbar) details.intro{margin:0 0 10px}section:has(.tbar) details.intro>summary{display:none}
section:has(.tbar) details.intro:not([open]){display:none}
/* Brand / level rows as slim chips */
.fit{display:inline-flex!important;align-items:center;gap:6px;padding:3px 10px 3px 4px;border-radius:999px;background:var(--soft);margin:10px 0 4px;font-weight:700;font-size:13px;width:auto!important}
.fit:not(:has(.bdg)){padding-left:10px}
.fit small{display:none}.fit .bdg{border-radius:999px;font-size:10px;padding:2px 7px}
/* Finished (25 of 25) items as thin long pills */
.sku.full{display:flex!important;align-items:center;grid-template-columns:none!important;min-height:0!important;height:30px;padding:0 14px!important;margin:3px 0!important;border-radius:999px!important;background:var(--soft)!important;border-left:0!important;box-shadow:none!important;opacity:.75}
.sku.full .sn{flex:1;min-width:0;display:flex!important;align-items:center;gap:8px;padding:0!important}
.sku.full .sn b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px!important;line-height:30px;margin:0!important}
.sku.full .sn b::after{content:none!important}
.sku.full .sn::after{content:'25/25 ✓';flex:none;font:700 12px/1 system-ui,sans-serif;color:#2ec4a6}
/* Service job headers as slim pills */
details.line{border-radius:999px;border-left:0;box-shadow:var(--sh)}
details.line[open]{border-radius:20px}
details.line>summary{grid-template-columns:26px minmax(0,1fr) auto 12px!important;gap:8px!important;padding:7px 14px 7px 8px!important}
details.line>summary .lic{width:26px;height:26px;border-radius:50%}
details.line>summary .lsum b{font-size:15px!important}
details.line>summary .lsum small{font-size:11.5px}
details.line>summary .lval{font-size:14px}
`;
const st=document.createElement('style');st.id='pill2';st.textContent=css;document.head.appendChild(st);
document.addEventListener('click',e=>{const b=e.target.closest('.tbi[data-intro]');if(!b)return;const sec=b.closest('section'),d=sec&&sec.querySelector('details.intro');if(!d)return;d.open=!d.open;b.classList.toggle('on',d.open)});
})();

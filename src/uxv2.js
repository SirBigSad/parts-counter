/* ===== Parts Counter Idle: layout pass. Each tab opens on its own content (the big store picture lives on
   Shelves, other tabs get a slim strip you can open), the header says in words which link is slowing you down,
   every tab starts with the one thing worth doing there, the buy-amount bar sits at the top of the list,
   the Shop tab appears when the shop opens, and More is a grid of tiles. ===== */
(()=>{
const css=document.createElement('style');css.textContent=`
header.mini .dash small{display:block!important;font-size:9.5px;line-height:1.1;opacity:.85}
#weak{display:flex;align-items:center;gap:8px;max-width:720px;margin:7px auto 0;padding:6px 10px;border-radius:10px;background:rgba(255,90,120,.18);border:1px solid rgba(255,143,163,.45);font-size:13px;line-height:1.25;cursor:pointer}
#weak[hidden]{display:none}#weak span{flex:1}#weak b{color:#ffb3c1}#weak em{font-style:normal;font-weight:700;white-space:nowrap;color:#fff}
header.mini #weak{margin-top:5px;padding:4px 9px;font-size:12px}
body.offhome #stage{height:64px!important;transition:height .25s}body.offhome #stage.open{height:220px!important}
body.offhome #ticker{display:none}
#stagePeek{position:absolute;left:10px;bottom:8px;z-index:2;border:0;border-radius:999px;padding:6px 12px;background:rgba(20,15,40,.55);color:#fff;font:600 12px system-ui,sans-serif;cursor:pointer;backdrop-filter:blur(4px);display:none}
body.offhome #stagePeek{display:block}
.nx2{display:flex;align-items:center;gap:10px;padding:12px 14px;margin:0 0 12px;border-radius:14px;background:var(--card);box-shadow:var(--sh);border-left:4px solid var(--acc);font-size:14px;line-height:1.3}
.nx2[hidden]{display:none}.nx2 span{flex:1}.nx2 small{display:block;color:var(--mute);font-size:12px;margin-bottom:2px;text-transform:uppercase;letter-spacing:.05em;font-weight:700}
.item.pick{animation:pickflash 1.4s ease-out}@keyframes pickflash{0%,40%{box-shadow:0 0 0 3px var(--acc)}100%{box-shadow:0 0 0 0 transparent}}
main .row:has(>.seg){position:sticky!important;top:calc(var(--hh,110px) + 6px)!important;bottom:auto!important;left:auto!important;transform:none!important;width:auto!important;margin:0 0 10px!important;z-index:8}
main{padding-bottom:calc(80px + env(safe-area-inset-bottom))!important}
#toast{top:calc(var(--hh,110px) + 10px)!important;bottom:auto!important}
nav.bar [data-tab].born{animation:born 1.2s ease-out 3}@keyframes born{0%{transform:scale(1)}30%{transform:scale(1.18)}100%{transform:scale(1)}}
#mtiles{margin:0 0 6px}#mtiles h4{margin:16px 2px 8px;font:700 13px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:var(--mute)}
#mtiles .tg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
#mtiles button{display:flex;flex-direction:column;align-items:flex-start;gap:3px;min-height:76px;padding:12px 14px;border-radius:14px;border:0;background:var(--card);box-shadow:var(--sh);color:var(--ink);text-align:left;cursor:pointer;border-top:4px solid var(--tc)}
#mtiles button b{font:700 17px 'Barlow Condensed',sans-serif}#mtiles button small{color:var(--mute);font-size:12.5px;line-height:1.25}
#t-more.tiles>details.fold{display:none}#t-more.one>details.fold:not(.pick){display:none}#t-more.one>details.fold.pick{display:block}#t-more.one>#mtiles{display:none}
#t-more>#mtiles,#t-more>#mback,#t-more.one>details.fold.pick{grid-column:1/-1}#mback{display:none;justify-self:start;margin:0 0 10px;min-height:40px;padding:0 14px;border-radius:10px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:600 14px system-ui,sans-serif;cursor:pointer}#t-more.one>#mback{display:inline-block}`;
document.head.appendChild(css);
const $=id=>document.getElementById(id),hdr=$('top'),stage=$('stage');
/* the sticky bits sit just under the header, whatever its height */
const setHH=()=>document.documentElement.style.setProperty('--hh',Math.round(hdr.getBoundingClientRect().height)+'px');new ResizeObserver(setHH).observe(hdr);setHH();
const weak=document.createElement('div');weak.id='weak';weak.hidden=true;weak.setAttribute('role','button');weak.tabIndex=0;$('dash').after(weak);
const peek=document.createElement('button');peek.id='stagePeek';peek.textContent='Show the store ▾';stage.appendChild(peek);
peek.addEventListener('click',e=>{e.stopPropagation();stage.classList.toggle('open');peek.textContent=stage.classList.contains('open')?'Hide the store ▴':'Show the store ▾'});
const cards={};for(const t of ['store','service','shop']){const sec=$('t-'+t);if(!sec)continue;const c=document.createElement('div');c.className='nx2';c.hidden=true;sec.prepend(c);cards[t]=c}
const NAMES={cu:'Customers',ck:'Checkout',sk:'Stocking',sh:'Shelf space',vb:'Bays',vc:'Trucks coming in',vw:'Service writers',vt:'Technicians',ve:'Tools'};
/* the best thing to buy in a link: the newest item you can afford, or the one to save up for */
function bestBuy(g){const box=$('ci-'+g);if(!box)return null;const rows=[...box.querySelectorAll('.item:not(.full)')],ok=rows.find(r=>{const b=r.querySelector('button[data-bld]');return b&&!b.disabled});const r=ok||rows[0];if(!r)return null;
  return {row:r,name:(r.querySelector('h3 span')||{}).textContent||'',what:(r.querySelector('p')||{}).textContent||'',ok:!!ok,price:((r.querySelector('button small')||{}).textContent||'')}}
const tabOf=g=>{const el=$('ci-'+g);const s=el&&el.closest('section');return s?s.id.replace('t-',''):''};
let pickRow=null;
const buyCard=(head,b)=>{pickRow=b.row;return `<span><small>${head}</small><b>${esc(b.name)}</b> · ${esc(b.what)}${b.ok?'':`<br>Save up for it: ${esc(b.price)}`}</span><button class="btn pri" data-show>Show me</button>`};
function card(t){if(t==='store'){const g=FAC&&FAC>=shelfCap()?'sh':(FAC&&R.lim&&R.lim!=='shelf'&&R.E<.97?R.lim:'');if(!g)return '';const b=bestBuy(g);return b?buyCard('Best buy for '+NAMES[g],b):''}
  if(!S.sv.open)return '';
  const g=R.sv.work>0&&R.sv.E<.97&&R.sv.lim?R.sv.lim:'';
  if(g&&tabOf(g)===t){const b=bestBuy(g);if(b)return buyCard('The shop is held back by '+NAMES[g].toLowerCase(),b)}
  if(g&&tabOf(g)!==t){const ot=tabOf(g);return `<span><small>Next up</small>The shop is held back by <b>${NAMES[g].toLowerCase()}</b>.</span><button class="btn pri" data-tab="${ot}">${ot[0].toUpperCase()+ot.slice(1)}</button>`}
  const q=S.top<NS-1&&typeof gateNeed==='function'?gateNeed(S.top+1):-1;if(t==='service'&&q>=0&&L(S.f,cur().id)>=needOf(cur()))return `<span><small>Next up</small><b>The next part is waiting on the shop.</b> Unlock the next job step to move on.</span>`;
  return ''}
document.addEventListener('click',e=>{if(e.target.closest('.nx2 [data-show]')&&pickRow){pickRow.scrollIntoView({behavior:'smooth',block:'center'});pickRow.classList.remove('pick');void pickRow.offsetWidth;pickRow.classList.add('pick')}});
/* the Shop tab shows up when the shop opens */
const shopBtn=document.querySelector('nav.bar [data-tab=shop]');let wasOpen=null;
/* More as tiles */
const TILES=[['Collection','#f4a62a',[['Catalog','Every part you’ve stocked'],['Photo album','Snapshots of your store'],['Postcards','Mail from the road'],['Plaque wall','Awards you’ve earned'],['Spotter\'s log','Trucks you’ve spotted'],['Customize shop','Decorate your store']]],
 ['Progress','#2ec4a6',[['Goals','Things to aim for'],['Logbook','What’s happened so far'],['Stats','Your numbers'],['Income','Earnings over time'],['How it all fits together','How the game works']]],
 ['Settings','#7e8cff',[['Look','Themes and layouts'],['Make it yours','Store name, dog, truck paint'],['Settings','Sound, motion, numbers'],['Cross save','Play on another device'],['Save','Back up your game'],['Reset','Start over']]]];
const more=$('t-more');
function buildTiles(){if(!more||$('mtiles'))return;const folds=[...more.querySelectorAll(':scope>details.fold')];if(folds.length<5)return;const byName={};for(const f of folds)byName[(f.querySelector('summary')||{}).textContent]=f;
  const w=document.createElement('div');w.id='mtiles';let h='';const used=new Set();
  for(const [grp,c,list] of TILES){const its=list.filter(([n])=>byName[n]);if(!its.length)continue;h+=`<h4>${grp}</h4><div class="tg">${its.map(([n,d])=>{used.add(n);return `<button data-mt="${esc(n)}" style="--tc:${c}"><b>${esc(n)}</b><small>${d}</small></button>`}).join('')}</div>`}
  const rest=Object.keys(byName).filter(n=>!used.has(n));if(rest.length)h+=`<h4>Other</h4><div class="tg">${rest.map(n=>`<button data-mt="${esc(n)}" style="--tc:#9aa3b5"><b>${esc(n)}</b></button>`).join('')}</div>`;
  w.innerHTML=h;const back=document.createElement('button');back.id='mback';back.textContent='‹ All of More';more.prepend(w);more.prepend(back);more.classList.add('tiles');
  w.addEventListener('click',e=>{const b=e.target.closest('[data-mt]');if(!b)return;const f=byName[b.dataset.mt];if(!f)return;for(const x of folds)x.classList.remove('pick');f.classList.add('pick');f.open=true;more.classList.add('one');scrollTo({top:0})});
  back.addEventListener('click',()=>{more.classList.remove('one');scrollTo({top:0})})}
let last='';
function tick(){if(typeof R==='undefined'||!R)return;const t=typeof tab==='string'?tab:'shelves';document.body.classList.toggle('offhome',t!=='shelves');if(t==='shelves')stage.classList.remove('open');
  if(t!=='more'&&more)more.classList.remove('one');buildTiles();
  /* the weak link, in words */
  let w='';if(FAC&&FAC>=shelfCap())w=`<span><b>Your shelves are full.</b> Add shelf space to keep growing.</span><em>Fix ›</em>`;
  else if(FAC&&R.lim&&R.lim!=='shelf'&&NAMES[R.lim]&&R.E<.97)w=`<span><b>${NAMES[R.lim]}</b> is slowing you down. You sell ${Math.round(R.E*100)}% of what's on your shelves.</span><em>Fix ›</em>`;
  const key=w+R.lim;if(key!==last){weak.innerHTML=w;weak.hidden=!w;weak.dataset.jump=FAC>=shelfCap()?'sh':R.lim;last=key}
  /* the Shelves card's own hint says the same thing as the pink line: hide it while the line is showing */
  for(const n of document.querySelectorAll('#prog .next'))n.style.display=w&&/your limit|Shelves are full/.test(n.textContent)?'none':'';
  /* one thing to do, at the top of the tab you're on */
  const c=cards[t];if(c){const inner=card(t);if(c._h!==inner){c._h=inner;c.innerHTML=inner;c.hidden=!inner}}
  /* Shop tab */
  if(shopBtn){const op=!!S.sv.open;shopBtn.hidden=!op;if(wasOpen===false&&op){shopBtn.classList.add('born');if(typeof note==='function')note('The Shop tab is open: hire staff and buy tools for the service shop.')}wasOpen=op}}
setInterval(tick,400);tick();
})();

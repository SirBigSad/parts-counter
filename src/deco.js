/* ===== Parts Counter Idle: decorations. The store starts bare. The Customize shop screen sells thousands of
   different decorations that only change the picture. Each decoration lives in one fixed spot, many share a spot,
   and only one per spot can be on at a time. Owned ones stay owned; switching between them is free. ===== */
const DUI={open:false,area:'Inside',spot:'f1',prev:null,filt:'all',q:''};
const D=()=>{if(!S.deco||typeof S.deco!=='object')S.deco={};const d=S.deco;if(!d.own||typeof d.own!=='object')d.own={};if(!d.on||typeof d.on!=='object')d.on={};if(typeof d.sp!=='number')d.sp=NEG;
  /* the first version of the shop had colour variants; it was replaced the same day, so give that money back */
  if(d.v!==2){const had=Object.keys(d.own).length&&d.sp>NEG/2;if(had){const back=d.sp;S.cashL=addL(S.cashL,back);setTimeout(()=>{if(typeof note==='function')note(`The Customize shop was rebuilt. You got ${moneyL(back)} back for your old decorations.`)},1500)}d.own={};d.on={};d.sp=NEG;d.v=2}
  return d};
{
const {P,H,quad,ibox,wallPen}=DK,I=window.ISO;
const SP=[['fl','Store floor','Inside','floorfin'],['pt','Wall paint','Inside','paint'],['rg','Rug by the counter','Inside','rug'],['wn','Front window','Inside','window'],
 ['ct','Counter top','Inside','counter'],['cf','Counter front','Inside','wrap'],['f1','Window corner','Inside','floor',{x:12,y:138,lay:'floorFront'}],['f2','Back corner','Inside','floor',{x:8,y:50,lay:'floorBack'}],
 ['f3','Beside the counter','Inside','floor',{x:177,y:100,lay:'floorFront'}],['c1','Store ceiling','Inside','ceil',{x:100,y:118}],['w1','Side wall','Inside','wall',{c:[.4,130,32],u:[0,-1],m:28}],
 ['w2','Corner wall','Inside','wall',{c:[.4,20,40],u:[0,-1],m:18}],['bn','Above the shelves','Inside','banner'],['li','Roofline lights','Inside','lights'],
 ['w3','Shop wall, left','Service shop','wall',{c:[231,.4,46],u:[1,0],m:30,sv:1}],['w4','Shop wall, right','Service shop','wall',{c:[304,.4,46],u:[1,0],m:30,sv:1}],
 ['f4','Shop corner','Service shop','floor',{x:320,y:138,lay:'floorShop',sv:1}],['c2','Shop ceiling','Service shop','ceil',{x:266,y:125,sv:1}],
 ['sg','Roof sign','Outside','sign'],['r1','Roof, left','Outside','roof',{x:22,y:-3}],['r2','Roof, right','Outside','roof',{x:182,y:-3}],['r3','Roof corner','Outside','roof',{x:-3,y:128}],['r4','Shop roof','Outside','roof',{x:300,y:-3,sv:1}],
 ['l1','Lawn by the window','Outside','lot',{x:-10,y:190}],['l2','Front curb','Outside','lot',{x:62,y:212}],['l3','Curbside','Outside','lot',{x:150,y:212}],['l4','Lot entrance','Outside','lot',{x:226,y:214}],
 ['l5','Back of the lot','Outside','lot',{x:376,y:160}],['l6','Lot edge','Outside','lot',{x:370,y:213}]];
const LAY={floorfin:'floor',paint:'paint',rug:'rug',window:'window',counter:'counter',wrap:'wrap',ceil:'ceil',wall:'wall',banner:'banner',lights:'lights',sign:'sign',roof:'roof',lot:'lot'};
const AT={floorfin:()=>[100,75,0],paint:()=>[60,0,40],rug:()=>[146,131,0],window:()=>[0,70,40],counter:()=>[37,102,30],wrap:()=>[70,112,12],floor:g=>[g.x,g.y,14],ceil:g=>[g.x,g.y,62],wall:g=>g.c,banner:()=>[100,0,72],lights:()=>[100,0,76],sign:()=>[100,-6,92],roof:g=>[g.x,g.y,92],lot:g=>[g.x,g.y,20]};
const ZOOM={floorfin:1.15,paint:1.15,rug:1.8,window:1.7,counter:2.4,wrap:1.8,floor:2,ceil:1.9,wall:2.2,banner:1.3,lights:1.15,sign:1.6,roof:2,lot:1.9};
const SPOTS=[],SPOT={},ITEMS={},BYLAYER={},LIST=[];
for(const [id,n,area,t,g0] of SP){const g=Object.assign({},g0||{}),sp={id,n,area,t,g,sv:!!g.sv,lay:g.lay||LAY[t],items:[]};SPOTS.push(sp);SPOT[id]=sp;(BYLAYER[sp.lay]=BYLAYER[sp.lay]||[]).push(sp)}
/* prices: about $25K for the cheapest, up past what an Owner earns for the fanciest */
const nice=L=>{let e=Math.floor(L),m=Math.round(10**(L-e)*10)/10;if(m>=10){m=1;e++}return e+Math.log10(m)};
DECO_FAMS.forEach((f,fi)=>{const spots=SPOTS.filter(s=>s.t===f.t);let combos=[[]];for(const ax of f.axes){const nx=[];for(const c of combos)for(const e of ax)nx.push(c.concat([e]));combos=nx}
  const ids=combos.map((_,i)=>`${f.key}.${i}`),order=ids.map((id,i)=>[H(id+'$'),i]).sort((a,b)=>a[0]-b[0]),rank=[];order.forEach(([,i],r)=>rank[i]=r);
  combos.forEach((es,i)=>{const id=ids[i],tier=f.lo+(f.hi-f.lo)*(rank[i]+.5)/combos.length,sp=spots[(i+fi*7)%spots.length],
    it={id,f,es,sp,grp:f.grp,L:nice(4.4+650*tier),name:f.nm(...es)};ITEMS[id]=it;sp.items.push(it);LIST.push(it)})});
window.DECO_ITEMS=ITEMS;window.DECO_SPOTS=SPOTS;window.DECO_N=LIST.length;window.DECO_LIST=LIST;
const activeId=id=>{if(DUI.open&&DUI.prev&&ITEMS[DUI.prev]&&ITEMS[DUI.prev].sp.id===id)return DUI.prev;if(DUI.open&&DUI.prev==='off:'+id)return null;const v=D().on[id];return v&&ITEMS[v]&&D().own[v]?v:null};
const atOf=sp=>AT[sp.t](sp.g);
const sync=o=>{DV.cx=I.cx;DV.s=I.s;DV.ox=I.ox;DV.oy=I.oy;DV.ph=I.ph;DV.mv=S.ui.anim&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(o&&o.night!==undefined)DV.night=o.night;if(o&&o.day!==undefined)DV.day=o.day};
window.decoLayer=function(layer,o){sync(o);if(layer==='ring')return ring();const list=BYLAYER[layer];if(!list)return false;let drew=false;
  for(const sp of list){if(sp.sv&&!S.sv.open)continue;const id=activeId(sp.id);if(!id)continue;const it=ITEMS[id],run=()=>{sync(o);it.f.dr(sp.g,o,...it.es)};if(layer==='lot')o.add(sp.g.x+sp.g.y,run);else run();drew=true}
  return drew};
function ring(){if(!DUI.open||!DUI.spot)return false;const sp=SPOT[DUI.spot];if(!sp||['floorfin','paint','lights','sign','banner','wrap'].includes(sp.t))return false;const [x,y,z]=atOf(sp),flat=sp.t==='lot'||sp.t==='floor',[a,b]=P(x,y,flat?0:z),cx=DV.cx,s=DV.s;
  const r=(sp.t==='lot'?18:sp.t==='counter'?6:12)*s*(1+.08*Math.sin(DV.ph*5));cx.save();cx.setLineDash([4,3]);cx.lineDashOffset=-DV.ph*12;cx.strokeStyle='rgba(255,255,255,.95)';cx.lineWidth=2;cx.beginPath();
  if(flat)cx.ellipse(a,b,r*1.225,r*.707,0,0,7);else cx.arc(a,b,r,0,7);cx.stroke();cx.strokeStyle='rgba(42,24,56,.55)';cx.lineDashOffset=-DV.ph*12+3.5;cx.stroke();cx.restore();return true}
/* the camera glides to the spot you're decorating */
let fz=0,fsp=null;
window.decoFocus=function(dt,set){const want=DUI.open&&DUI.spot?SPOT[DUI.spot]:null;if(want)fsp=want;fz+=((want?1:0)-fz)*Math.min(1,dt*5);if(fz<.003||!fsp)return;
  DV.s=I.s;DV.ox=I.ox;DV.oy=I.oy;const [x,y,z]=atOf(fsp),zoom=ZOOM[fsp.t],[a0,b0]=P(x,y,z),e=fz*fz*(3-2*fz),k=1+(zoom-1)*e,s2=I.s*k,ax=(x-y)*.866,ay=(x+y)*.5-z;
  const tx=a0+(I.W/2-a0)*e,ty=b0+(I.H*.55-b0)*e;set(k,tx-ax*s2,ty-ay*s2)};
/* ---------- little pictures for the shop ---------- */
const TH={floor:[1.7,'#e6dff0'],lot:[1.45,'#cfe9d8'],roof:[1.6,'#cde8f6'],ceil:[2.1,'#efe9f6'],wall:[0,'#f3ece2'],window:[1.2,'#f3ece2'],banner:[.55,'#f3ece2'],counter:[4.6,'#f6ece6'],wrap:[1.15,'#f6ece6'],sign:[.6,'#cde8f6'],floorfin:[.42,'#efe9f6'],paint:[.4,'#efe9f6'],rug:[1.9,'#efe9f6'],lights:[.4,'#2a2448']};
function thumb(it,cv){const dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth||110,Hh=cv.clientHeight||82;cv.width=W*dpr;cv.height=Hh*dpr;const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);
  const save=Object.assign({},DV),sp=it.sp,t=sp.t,[k,bg]=TH[t];c.fillStyle=bg;c.fillRect(0,0,W,Hh);
  DV.cx=c;DV.s=t==='wall'?W*.62/sp.g.m:k*W/110;DV.ph=1.3;DV.night=t==='lights'?.8:0;DV.day=1;DV.mv=false;const [x,y,z]=atOf(sp),cxp=W/2,cyp=Hh*(t==='lot'||t==='floor'?.62:t==='roof'?.66:.5);
  DV.ox=cxp-(x-y)*.866*DV.s;DV.oy=cyp-((x+y)*.5-z)*DV.s;
  try{const o={night:DV.night,day:1,fl:'#6b5a86',add:(d,f)=>f(),x0:30,w:78};
    if(t==='floor')quad([[x-16,y-16,0],[x+16,y-16,0],[x+16,y+16,0],[x-16,y+16,0]],'#cfc4e0');
    if(t==='lot')quad([[x-30,y-30,0],[x+30,y-30,0],[x+30,y+30,0],[x-30,y+30,0]],'#9fd3b0');
    if(t==='roof')ibox(x-16,y-16,66,32,32,14,'#b98a9a');
    if(t==='wall'){const q=wallPen(sp.g.c,sp.g.u);q.rect(-sp.g.m*.75,-sp.g.m*.75,sp.g.m*1.5,sp.g.m*1.5,sp.g.u[0]?'#e8b88f':'#b9737d')}
    if(t==='window'){const q=wallPen([.5,70,40],[0,-1]);q.rect(-50,-30,100,60,'#b9737d');q.rect(-40,-22,80,44,'#c9ecf5');q.rect(-40,0,80,22,'#7fc4ea')}
    if(t==='banner'){const q=wallPen([100,.4,72],[1,0]);q.rect(-100,-14,200,28,'#e8b88f')}
    if(t==='counter')ibox(18,92,0,40,20,24,'#93506e','#e0907a');
    if(t==='floorfin')quad([[0,0,0],[200,0,0],[200,150,0],[0,150,0]],o.fl);
    if(t==='rug')quad([[110,110,0],[184,110,0],[184,150,0],[110,150,0]],'#8a7ba6');
    if(t==='paint'||t==='lights'){quad([[0,0,0],[0,150,0],[0,150,80],[0,0,80]],t==='lights'?'#4a3550':'#b9737d');quad([[0,0,0],[200,0,0],[200,0,80],[0,0,80]],t==='lights'?'#5a4560':'#e8b88f')}
    if(t==='sign'){const s=DV.s;c.font=`700 ${Math.max(7,Math.round(11*s*1.6))}px "Barlow Condensed",sans-serif`;const sn='PARTS';Object.assign(o,{a:W/2,b:Hh/2,sn,tw:c.measureText(sn).width+14,hh:Math.max(12,16*s*1.6)})}
    it.f.dr(sp.g,o,...it.es)}catch(e){c.fillStyle='#c00';c.fillRect(0,0,6,6);console.error(it.id,e)}
  Object.assign(DV,save)}
window.decoThumb=thumb;
}

/* ---------- the Customize shop screen ---------- */
{
const css=document.createElement('style');css.textContent=`
body.decoopen{overflow:hidden}
body.decoopen #stage{position:fixed!important;left:0!important;right:0!important;top:0!important;height:38vh!important;max-height:none!important;width:auto!important;margin:0!important;border-radius:0!important;z-index:61}
body.decoopen #stage>button{display:none!important}
#deco{position:fixed;left:0;right:0;top:calc(38vh - 14px);bottom:0;z-index:62;background:var(--card);color:var(--ink);display:flex;flex-direction:column;border-radius:16px 16px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.28)}
#deco[hidden]{display:none}
#deco .dh{display:flex;align-items:center;gap:8px;padding:12px 12px 4px 16px}#deco .dh b{font:700 21px 'Barlow Condensed',sans-serif}#deco .dh span{color:var(--mute);font-size:12px;flex:1;line-height:1.2}
#deco .dx{width:40px;height:40px;border:0;background:var(--soft);border-radius:10px;font-size:24px;line-height:1;color:var(--ink);cursor:pointer}
#deco .dsc{overflow:auto;flex:1;padding:2px 16px 12px;overscroll-behavior:contain}
#deco .dq{display:flex;gap:8px;margin:4px 0 8px}#deco .dq input{flex:1;min-width:0;height:38px;border-radius:10px;border:1.5px solid var(--line);background:var(--soft);color:var(--ink);padding:0 12px;font:500 14px system-ui,sans-serif}
#deco .dar{display:flex;gap:6px;margin:0 0 8px}#deco .dar button{flex:1;min-height:36px;border-radius:10px;border:1.5px solid var(--line);background:var(--soft);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer}
#deco .dar button[aria-pressed=true]{background:var(--acc);border-color:var(--acc);color:#fff}
#deco .dsp{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:none}#deco .dsp::-webkit-scrollbar{display:none}
#deco .dsp button{flex:none;min-height:34px;padding:0 12px;border-radius:17px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px}
#deco .dsp button[aria-pressed=true]{border-color:var(--ink);background:var(--soft)}#deco .dsp i{width:8px;height:8px;border-radius:50%;background:var(--acc);display:inline-block}#deco .dsp small{color:var(--mute);font-weight:500}
#deco .dnow{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--soft);font-size:13px;margin:2px 0 8px}#deco .dnow span{flex:1}
#deco .dnow button,#deco .dbar button{min-height:36px;padding:0 14px;border-radius:10px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer}
#deco .dfl{display:flex;gap:6px;margin:0 0 4px}#deco .dfl button{min-height:30px;padding:0 10px;border-radius:15px;border:1.5px solid var(--line);background:none;color:var(--mute);font:600 12px system-ui,sans-serif;cursor:pointer}#deco .dfl button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
#deco h5{margin:14px 0 8px;font:700 15px 'Barlow Condensed',sans-serif;letter-spacing:.02em;display:flex;justify-content:space-between}#deco h5 small{font:500 12px system-ui,sans-serif;color:var(--mute)}
#deco .dg{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}
#deco .dt{display:flex;flex-direction:column;align-items:stretch;padding:0;border-radius:12px;border:2px solid var(--line);background:var(--soft);color:var(--ink);cursor:pointer;overflow:hidden;text-align:left;position:relative}
#deco .dt canvas{width:100%;aspect-ratio:4/3;display:block;background:var(--soft)}#deco .dt .dtn{font:600 11.5px/1.2 system-ui,sans-serif;padding:5px 6px 0;min-height:30px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
#deco .dt .dtp{font:600 11px system-ui,sans-serif;color:var(--mute);padding:2px 6px 6px}#deco .dt.own .dtp{color:#16a085}#deco .dt.on{border-color:#2ec4a6}#deco .dt.on .dtp{color:#16a085}#deco .dt.sel{border-color:var(--ink);box-shadow:0 0 0 2px var(--ink)}#deco .dt.lk canvas{opacity:.55}
#deco .dt .dts{font:500 10.5px system-ui,sans-serif;color:var(--mute);padding:0 6px}
#deco .dbar{border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));display:flex;gap:10px;align-items:center;min-height:58px}
#deco .dbar .dn{flex:1;min-width:0;font-size:13px;line-height:1.25}#deco .dbar .dn b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#deco .dbar .dn small{color:var(--mute)}
#deco .dbar .go{background:var(--acc);border-color:var(--acc);color:#fff}#deco .dbar .go[disabled]{opacity:.5;cursor:default}
#deco .dempty{color:var(--mute);font-size:13px;padding:14px 0}
.dcb{position:absolute;right:52px;top:8px;width:36px;height:36px;border-radius:10px;border:0;background:rgba(20,15,40,.45);color:#fff;display:grid;place-items:center;cursor:pointer;z-index:2;backdrop-filter:blur(4px)}
.dcb svg{width:20px;height:20px}
@media (min-width:900px){body.decoopen #stage{right:460px!important;height:100vh!important}#deco{top:0;left:auto;width:460px;border-radius:0}}`;
document.head.appendChild(css);
const $d=id=>document.getElementById(id),AREAS=['Inside','Service shop','Outside'];
const box=document.createElement('div');box.id='deco';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Customize shop');
box.innerHTML=`<div class="dh"><b>Customize shop</b><span id="dcount"></span><button class="dx" data-dx aria-label="Close">×</button></div><div class="dsc" id="dsc"><div class="dq"><input id="dqi" type="search" placeholder="Search ${DECO_N.toLocaleString()} decorations" aria-label="Search decorations"></div><div id="dlist"></div></div><div class="dbar" id="dbar"></div>`;document.body.appendChild(box);
const owned=()=>Object.keys(D().own).filter(k=>DECO_ITEMS[k]).length;
const esc2=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let sel=null,io=null;
const spotsOf=a=>DECO_SPOTS.filter(sp=>sp.area===a);
const passes=it=>{const d=D();return DUI.filt==='all'||(DUI.filt==='own'?d.own[it.id]:!d.own[it.id]&&canPay(it.L))};
function tile(it,showSpot){const d=D(),on=d.on[it.sp.id]===it.id&&d.own[it.id];return `<button class="dt${d.own[it.id]?' own':''}${on?' on':''}${sel===it.id?' sel':''}${!d.own[it.id]&&!canPay(it.L)?' lk':''}" data-di="${it.id}"><canvas></canvas><span class="dtn">${esc2(it.name)}</span>${showSpot?`<span class="dts">${it.sp.n}</span>`:''}<span class="dtp">${on?'✓ In use':d.own[it.id]?'✓ Owned':moneyL(it.L)}</span></button>`}
const filters=()=>`<div class="dfl">${[['all','All'],['own','Owned'],['can','Can afford']].map(([k,n])=>`<button data-dfilt="${k}" aria-pressed="${DUI.filt===k}">${n}</button>`).join('')}</div>`;
function render(){const d=D(),list=$d('dlist');$d('dcount').textContent=`${owned().toLocaleString()} of ${DECO_N.toLocaleString()} owned`;let h='';
  const q=DUI.q.trim().toLowerCase();
  if(q){const hits=DECO_LIST.filter(it=>passes(it)&&(it.name.toLowerCase().includes(q)||it.grp.toLowerCase().includes(q)||it.sp.n.toLowerCase().includes(q))).sort((a,b)=>a.L-b.L);
    h+=filters()+`<h5>${hits.length.toLocaleString()} found${hits.length>150?' <small>showing the first 150</small>':''}</h5>`+(hits.length?`<div class="dg">${hits.slice(0,150).map(it=>tile(it,true)).join('')}</div>`:`<p class="dempty">Nothing matches “${esc2(DUI.q)}”.</p>`)}
  else{const sp=DECO_SPOTS.find(x=>x.id===DUI.spot)||spotsOf(DUI.area)[0];DUI.spot=sp.id;const on=d.on[sp.id]&&DECO_ITEMS[d.on[sp.id]]&&d.own[d.on[sp.id]]?DECO_ITEMS[d.on[sp.id]]:null,locked=sp.sv&&!S.sv.open;
    h+=`<div class="dar">${AREAS.map(a=>`<button data-darea="${a}" aria-pressed="${a===DUI.area}">${a}</button>`).join('')}</div>
     <div class="dsp">${spotsOf(DUI.area).map(x=>`<button data-dspot="${x.id}" aria-pressed="${x.id===sp.id}">${d.on[x.id]&&d.own[d.on[x.id]]?'<i aria-label="decorated"></i>':''}${x.n} <small>${x.items.length}</small></button>`).join('')}</div>`;
    if(locked)h+=`<p class="dempty">This spot is in the service shop. Open the shop first, then you can decorate it.</p>`;
    else{h+=`<div class="dnow"><span>${on?`In this spot: <b>${esc2(on.name)}</b>`:'This spot is empty.'}</span>${on?`<button data-doff>Turn off</button>`:''}</div>`+filters();
      const groups={};for(const it of sp.items)if(passes(it))(groups[it.grp]=groups[it.grp]||[]).push(it);const gs=Object.entries(groups).map(([n,a])=>[n,a.sort((x,y)=>x.L-y.L)]).sort((a,b)=>a[1][0].L-b[1][0].L);
      for(const [n,a] of gs)h+=`<h5>${n}<small>${a.length}</small></h5><div class="dg">${a.map(it=>tile(it)).join('')}</div>`;
      if(!gs.length)h+=`<p class="dempty">${DUI.filt==='own'?'You don’t own anything for this spot yet.':'Nothing here you can afford yet. Keep selling.'}</p>`}}
  list.innerHTML=h;const ch=list.querySelector('.dsp [aria-pressed=true]');if(ch){const r=ch.parentNode;r.scrollLeft=Math.max(0,ch.offsetLeft-r.clientWidth/2+ch.offsetWidth/2)}
  if(io)io.disconnect();io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){const b=e.target.closest('[data-di]');decoThumb(DECO_ITEMS[b.dataset.di],e.target);io.unobserve(e.target)}},{root:$d('dsc'),rootMargin:'200px'});
  for(const c of list.querySelectorAll('.dt canvas'))io.observe(c);bar()}
function bar(){const d=D(),it=sel&&DECO_ITEMS[sel],el=$d('dbar');if(!it){el.innerHTML=`<div class="dn"><small>Tap a decoration to try it in the picture. One per spot can be on.</small></div>`;return}
  const own=d.own[it.id],isOn=d.on[it.sp.id]===it.id;
  el.innerHTML=`<div class="dn"><b>${esc2(it.name)}</b><small>${it.sp.n} · ${own?(isOn?'In use':'Owned'):moneyL(it.L)}</small></div>`+
   (own?(isOn?`<button data-doff>Turn off</button>`:`<button class="go" data-duse>Use it</button>`):`<button class="go" data-dbuy ${canPay(it.L)?'':'disabled'}>${canPay(it.L)?'Buy':'Need '+moneyL(it.L)}</button>`)}
function refresh(){if(!DUI.open)return;const d=D();for(const b of box.querySelectorAll('[data-di]')){const it=DECO_ITEMS[b.dataset.di];b.classList.toggle('lk',!d.own[it.id]&&!canPay(it.L))}bar()}
function open(){DUI.open=true;DUI.area=(DECO_SPOTS.find(x=>x.id===DUI.spot)||{}).area||'Inside';sel=null;DUI.prev=null;box.hidden=false;document.body.classList.add('decoopen');render()}
function close(){DUI.open=false;DUI.prev=null;sel=null;box.hidden=true;document.body.classList.remove('decoopen');if(io)io.disconnect();more()}
window.openDeco=open;
setInterval(()=>{if(DUI.open)refresh()},700);
let qt;$d('dqi').addEventListener('input',e=>{clearTimeout(qt);qt=setTimeout(()=>{DUI.q=e.target.value;render();$d('dsc').scrollTop=0},200)});
box.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=D();
  if(t.hasAttribute('data-dx')){close();return}
  if(t.dataset.darea){DUI.area=t.dataset.darea;DUI.spot=spotsOf(DUI.area)[0].id;sel=null;DUI.prev=null;render();return}
  if(t.dataset.dspot){DUI.spot=t.dataset.dspot;sel=null;DUI.prev=null;render();return}
  if(t.dataset.dfilt){DUI.filt=t.dataset.dfilt;render();return}
  if(t.dataset.di){sel=t.dataset.di;const it=DECO_ITEMS[sel];DUI.prev=sel;DUI.spot=it.sp.id;DUI.area=it.sp.area;for(const b of box.querySelectorAll('.dt.sel'))b.classList.remove('sel');t.classList.add('sel');bar();return}
  if(t.hasAttribute('data-doff')){const spot=sel&&DECO_ITEMS[sel]?DECO_ITEMS[sel].sp.id:DUI.spot;delete d.on[spot];DUI.prev='off:'+spot;save();render();return}
  if(t.hasAttribute('data-duse')&&sel){d.on[DECO_ITEMS[sel].sp.id]=sel;DUI.prev=null;save();if(typeof feel==='function')feel('step');render();return}
  if(t.hasAttribute('data-dbuy')&&sel){const it=DECO_ITEMS[sel];if(d.own[it.id]||!canPay(it.L))return;S.cashL=subL(S.cashL,it.L);d.sp=addL(d.sp,it.L);d.own[it.id]=1;d.on[it.sp.id]=it.id;DUI.prev=null;save();
    if(typeof feel==='function')feel('buy');note(`${it.name}: done. ${it.sp.n}.`);render()}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&DUI.open)close()});
/* taps on the picture don't jump to other tabs while you're decorating */
const st=document.getElementById('stage');if(st){for(const ev of ['click','pointerup','touchend'])st.addEventListener(ev,e=>{if(DUI.open)e.stopPropagation()},true);
  const b=document.createElement('button');b.className='dcb';b.setAttribute('aria-label','Customize shop');b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h2v5h-8v3"/><rect x="10" y="14" width="4" height="7" rx="1"/></svg>';
  b.addEventListener('click',e=>{e.stopPropagation();open()});st.appendChild(b)}
/* and a section in More */
let moreEl=null;
function more(){if(!moreEl)return;const d=D();moreEl.querySelector('.dmsum').textContent=`${owned().toLocaleString()} of ${DECO_N.toLocaleString()} decorations owned`+(d.sp>NEG/2?` · ${moneyL(d.sp)} spent`:'')}
(function(){const sec=document.getElementById('t-more');if(!sec)return;D();const after=[...sec.querySelectorAll(':scope > details.fold')].find(x=>x.firstElementChild&&x.firstElementChild.textContent==='Look');
  const h=document.createElement('details');h.className='fold';const op=(S.ui.open||{})['Customize shop'];h.open=op===undefined?true:op;h.innerHTML='<summary>Customize shop</summary>';
  h.addEventListener('toggle',()=>{S.ui.open=Object.assign({},S.ui.open,{'Customize shop':h.open});save()});
  const card=document.createElement('div');card.className='card';card.innerHTML=`<p class="sub" style="margin:0 0 10px">Your store starts bare. There are ${DECO_N.toLocaleString()} different decorations for ${DECO_SPOTS.length} spots around the store, the service shop and the lot. Each spot holds one at a time, and anything you own can be switched back on for free. Decorations only change the picture.</p><p class="sub dmsum" style="margin:0 0 10px"></p><button class="btn pri" data-dopen>Open Customize shop</button>`;
  card.querySelector('[data-dopen]').addEventListener('click',()=>open());h.appendChild(card);if(after)after.after(h);else sec.appendChild(h);moreEl=h;more()})();
}

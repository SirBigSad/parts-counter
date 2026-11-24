/* ===== Parts Counter: feel, catalog, part lookup, income chart, lifetime stats ===== */

/* ---------- sound and vibration ---------- */
let AC=null;
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return null}}if(AC.state==='suspended')AC.resume();return AC}
function tone(a,f,t,d,type,vol){const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.02)}
function hiss(a,t,d,vol){const n=Math.floor(a.sampleRate*d),buf=a.createBuffer(1,n,a.sampleRate),ch=buf.getChannelData(0);for(let i=0;i<n;i++)ch[i]=(Math.random()*2-1)*(1-i/n);
  const src=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();f.type='highpass';f.frequency.value=3000;src.buffer=buf;g.gain.value=vol;src.connect(f).connect(g).connect(a.destination);src.start(t)}
let lastSfx=0;
function sfx(kind){if(!S.ui.snd)return;const a=ac();if(!a)return;const t=a.currentTime;
  if(kind==='buy'){if(t-lastSfx<.04)return;lastSfx=t;tone(a,740,t,.06,'triangle',.07)}
  else if(kind==='step'){tone(a,988,t,.09,'sine',.07);tone(a,1319,t+.07,.12,'sine',.06)}
  else{/* cha-ching: the drawer, then the bell */hiss(a,t,.07,.05);tone(a,1568,t+.05,.12,'square',.03);tone(a,2093,t+.12,.5,'triangle',.08);tone(a,3136,t+.12,.35,'sine',.03)}}
function buzz(p){if(!S.ui.vib||!navigator.vibrate)return;try{navigator.vibrate(p)}catch(e){}}
function feel(kind){sfx(kind);buzz(kind==='buy'?8:kind==='step'?[12,40,12]:[25,50,40])}

/* ---------- catalog book ---------- */
const PART_STEPS={};for(const s of LADDER)(PART_STEPS[s.p]=PART_STEPS[s.p]||[]).push(s);
const BASE_PARTS={};for(const p of PARTS)(BASE_PARTS[p.base]=BASE_PARTS[p.base]||[]).push(p);
const catOpen={};
const stocked=s=>L(S.f,s.id)>0;
function baseCounts(b){const st=BASE_STEPS[b];const br=new Set(st.map(s=>s.b)),brS=new Set(st.filter(stocked).map(s=>s.b));
  const pa=BASE_PARTS[b],paS=pa.filter(p=>PART_STEPS[p.id].some(stocked)).length;return {br:br.size,brS:brS.size,pa:pa.length,paS}}
function renderCatalog(){let tot=0,got=0;const per={};
  for(const l of LINES){let a=0,g=0;for(const b of LINE_BASES[l.id]||[]){const c=baseCounts(b);a+=c.pa;g+=c.paS}per[l.id]=[g,a];tot+=a;got+=g}
  $('catSum').innerHTML=`<b class="num">${fmt(got)}</b> of ${fmt(tot)} parts stocked`;$('catM').style.width=got/tot*100+'%';
  setHTML('cat',LINES.map(l=>{const [g,a]=per[l.id],open=catOpen[l.id];
    let body='';if(open)body='<div class="tiles">'+(LINE_BASES[l.id]||[]).map(b=>{const c=baseCounts(b);
      return `<button class="tile ${c.paS?'':'none'}" data-info="${b}"><i style="color:${c.paS?l.c:'var(--mute)'}">${icSvg(BASE_IC[b])}</i><b>${esc(BASE_NAME[b])}</b><small>${c.paS?`${c.brS} of ${c.br} brands`:'Not stocked'}</small></button>`}).join('')+'</div>';
    return `<details class="older cat" ${open?'open':''} data-cat="${l.id}"><summary><span class="bn"><i class="lic" style="background:${l.c}">${icSvg(LINE_IC[l.id])}</i>${esc(l.n)}</span><small class="num">${g} / ${a}</small></summary>${body}</details>`}).join(''))}
document.addEventListener('toggle',e=>{const el=e.target;if(el.dataset&&el.dataset.cat){if(catOpen[el.dataset.cat]!==el.open){catOpen[el.dataset.cat]=el.open;$('cat')._h=null;renderCatalog()}}},true);

/* ---------- part lookup sheet ---------- */
let sheetBase=null;
function openSheet(b){sheetBase=b;$('sheet').hidden=false;document.body.style.overflow='hidden';renderSheet()}
function closeSheet(){sheetBase=null;$('sheet').hidden=true;document.body.style.overflow=''}
function renderSheet(){if(!sheetBase)return;const b=sheetBase,st=BASE_STEPS[b],l=LI[st[0].line],idx=BASES.indexOf(b),reached=S.top>=st[0].k;
  const prices=st.map(s=>s.price),fac=st.reduce((a,s)=>a+L(S.f,s.id),0);let earn=NEG;const lE=lg(Math.max(R.E,1e-300));for(const s of st){const n=L(S.f,s.id);if(n)earn=addL(earn,lg(n)+s.incL+lE)}
  const brands=[...new Set(st.map(s=>s.b))].map(id=>{const xs=st.filter(s=>s.b===id);return {id,n:BI[id].n,t:BI[id].t,stk:xs.filter(stocked).length,all:xs.length,fac:xs.reduce((a,s)=>a+L(S.f,s.id),0),open:xs[0].k<=S.top}});
  const fits=BASE_PARTS[b].map(p=>p.fit).filter(Boolean);
  $('sheetBody').innerHTML=`<div class="capg"><h3 class="bn"><i class="lic" style="background:${l.c}">${icSvg(BASE_IC[b])}</i>${esc(BASE_NAME[b])}</h3></div>
   <p class="sub" style="margin:6px 0 10px">Part ${idx+1} of ${NB} · ${esc(l.n)}${reached?'':' · not on your shelves yet'}</p>
   <div class="kv">${[['Retail',prices.length>1?`${money(Math.min(...prices))} – ${money(Math.max(...prices))}`:money(prices[0])],['Products',`${fmt(st.length)} (${brands.length} brands × ${fits.length||1} fitments)`],
     ['Facings',fmt(fac)],['Sold so far',fmt(S.st.sold[b]||0)+' units'],['Earning now',moneyL(earn)+'/s']].map(([k,v])=>`<span>${k}</span><span>${v}</span>`).join('')}</div>
   ${typeof triviaFor==='function'&&triviaFor(b)?`<p class="triv">${esc(triviaFor(b))}</p>`:''}<h4>Brands</h4><div class="blist">${brands.map(x=>`<div class="${x.open?'':'dim'}"><span class="pill p${x.t}">${TIER[x.t].n}</span><b>${esc(x.n)}</b><small>${x.stk} of ${x.all} stocked · ${fmt(x.fac)} facings</small></div>`).join('')}</div>
   ${fits.length?`<h4>Fits</h4><p class="fits">${fits.map(esc).join(' · ')}</p>`:`<h4>Fits</h4><p class="fits">Universal: fits any truck.</p>`}`}
document.addEventListener('click',e=>{const t=e.target.closest('[data-info]');if(t){e.preventDefault();e.stopPropagation();openSheet(t.dataset.info);return}
  if(e.target.closest('[data-close]')||e.target.id==='sheet')closeSheet()},true);

/* ---------- income history ---------- */
/* theme colours use light-dark(), which the canvas can't read, so resolve them through a hidden element */
const probe=document.createElement('i');probe.style.display='none';document.body.appendChild(probe);
const cssColor=v=>{probe.style.color=`var(${v})`;return getComputedStyle(probe).color};
function sampleHist(){if(!isFinite(R.incL)||R.incL<=NEG/2&&!S.hist.length)return;S.hist.push([Date.now(),R.incL]);if(S.hist.length>360)S.hist.splice(0,S.hist.length-360)}
function drawChart(){const cv=$('chart');if(!cv)return;const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;if(!r.width)return;cv.width=r.width*d;cv.height=r.height*d;
  const c=cv.getContext('2d');c.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;
  const ink=cssColor('--mute'),acc=cssColor('--acc'),line=cssColor('--line');
  c.clearRect(0,0,W,H);const h=S.hist.filter(x=>x[1]>NEG/2);
  if(h.length<2){c.fillStyle=ink;c.font='14px Barlow,sans-serif';c.textAlign='center';c.fillText('Play a little longer to see your income over time.',W/2,H/2);$('chartCap').textContent='';return}
  let lo=Math.min(...h.map(x=>x[1])),hi=Math.max(...h.map(x=>x[1]));if(hi-lo<.5){lo-=.25;hi+=.25}
  const pl=6,pr=6,pt=10,pb=18,X=i=>pl+i*(W-pl-pr)/(h.length-1),Y=v=>pt+(1-(v-lo)/(hi-lo))*(H-pt-pb);
  c.strokeStyle=line;c.lineWidth=1;for(let i=0;i<=3;i++){const y=pt+i*(H-pt-pb)/3;c.beginPath();c.moveTo(pl,y);c.lineTo(W-pr,y);c.stroke()}
  c.beginPath();h.forEach((x,i)=>i?c.lineTo(X(i),Y(x[1])):c.moveTo(X(i),Y(x[1])));c.strokeStyle=acc;c.lineWidth=2.5;c.lineJoin='round';c.stroke();
  c.lineTo(X(h.length-1),H-pb);c.lineTo(X(0),H-pb);c.closePath();c.globalAlpha=.12;c.fillStyle=acc;c.fill();c.globalAlpha=1;
  c.fillStyle=ink;c.font='12px Barlow,sans-serif';c.textAlign='left';c.fillText(moneyL(hi)+'/s',pl,pt+10);c.fillText(moneyL(lo)+'/s',pl,H-pb-4);
  const mins=Math.round((h[h.length-1][0]-h[0][0])/6e4);$('chartCap').textContent=`Income over your last ${mins<1?'minute':mins===1?'minute':mins+' minutes'} of play (the scale climbs by powers of ten).`}

/* ---------- lifetime stats ---------- */
function lifeStats(){const st=S.st;let bb=null,bv=0;for(const k in st.br)if(st.br[k]>bv){bv=st.br[k];bb=k}let pb=null,pv=0;for(const k in st.sold)if(st.sold[k]>pv){pv=st.sold[k];pb=k}
  return [['Parts sold, all time',fmt(st.all)],['Most-sold brand',bb?`${BI[bb].n} (${fmt(bv)})`:'None yet'],['Most-sold part',pb?`${BASE_NAME[pb]} (${fmt(pv)})`:'None yet'],
    ['Trucks serviced',S.sv.open?fmt(st.trucks):'Shop not open'],['Labor hours sold',S.sv.open?fmt(st.hrs):'Shop not open']]}

/* ---------- brand badges, purchase feedback, unlock moments ---------- */
function flyFrom(btn){if(!S.ui.anim)return;const r=btn.getBoundingClientRect(),sm=btn.querySelector('small'),t=document.createElement('div');t.className='fly';
  t.textContent='−'+(sm?sm.textContent:'');t.style.left=(r.left+r.width/2-30)+'px';t.style.top=(r.top-6)+'px';document.body.appendChild(t);setTimeout(()=>t.remove(),950)}
function flashRow(id){const el=$(id);if(!el)return;el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}
/* confetti burst */
const cf=$('confetti'),cfx=cf.getContext('2d');let bits=[],cfOn=false;
function confetti(){if(!S.ui.anim)return;const d=devicePixelRatio||1;cf.width=innerWidth*d;cf.height=innerHeight*d;cfx.setTransform(d,0,0,d,0,0);
  const cols=['#f2541b','#2563eb','#0e9f6e','#fbbf24','#e11d48','#8e24aa'];for(let i=0;i<90;i++)bits.push({x:innerWidth/2,y:innerHeight*.35,vx:(Math.random()-.5)*520,vy:-Math.random()*520-120,r:Math.random()*6,c:cols[i%6],l:1.6+Math.random()});
  if(!cfOn){cfOn=true;let t0=performance.now();const step=t=>{const dt=Math.min(.05,(t-t0)/1000);t0=t;cfx.clearRect(0,0,innerWidth,innerHeight);
    for(const b of bits){b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;b.l-=dt;b.r+=dt*6;cfx.save();cfx.translate(b.x,b.y);cfx.rotate(b.r);cfx.fillStyle=b.c;cfx.globalAlpha=Math.max(0,Math.min(1,b.l));cfx.fillRect(-4,-2,8,4);cfx.restore()}
    bits=bits.filter(b=>b.l>0&&b.y<innerHeight+20);if(bits.length)requestAnimationFrame(step);else{cfOn=false;cfx.clearRect(0,0,innerWidth,innerHeight)}};requestAnimationFrame(step)}}
/* a big card when a new part or a whole new department opens up */
function celebrate(c,prev){confetti();const newLine=prev&&c.line!==prev.line,l=LI[c.line];
  $('unlockBody').innerHTML=`<i class="lic" style="background:${l.c}">${icSvg(newLine?LINE_IC[c.line]:BASE_IC[c.base])}</i><small>${newLine?'New department':'New part'}</small><b>${esc(newLine?l.n:BASE_NAME[c.base])}</b>
   <p>${newLine?`Starting with ${esc(lc(BASE_NAME[c.base]))}.`:`Part ${BASES.indexOf(c.base)+1} of ${NB} · ${esc(l.n)}`}<br>First up: ${bdg(c.b)}${esc(BI[c.b].n)}</p>${typeof triviaFor==='function'&&triviaFor(c.base)?`<p class="triv">${esc(triviaFor(c.base))}</p>`:''}<button class="btn pri" data-close-unlock="1" style="width:100%">Let's go</button>`;
  $('unlock').hidden=false;clearTimeout(celebrate.t);celebrate.t=setTimeout(()=>$('unlock').hidden=true,6000)}
document.addEventListener('click',e=>{if(e.target.closest('[data-close-unlock]')||e.target.id==='unlock'){$('unlock').hidden=true}},true);

/* ---------- next up: the one thing worth doing now ---------- */
function nextUp(){const lim=R.lim,limN={cu:'Customers',ck:'Checkout',sk:'Stocking'};
  if(FAC>=shelfCap())return `<div class="next"><span><b>Shelves are full.</b> Add shelving in the Store before stocking more.</span><button class="btn pri" data-tab="store">Store</button></div>`;
  if(FAC&&lim!=='shelf'&&limN[lim]&&R.E<.97)return `<div class="next"><span><b>${limN[lim]} is your limit</b>: you're only selling ${Math.round(R.E*100)}% of what's on the shelves.</span><button class="btn pri" data-tab="store">Fix it</button></div>`;
  const g=S.top<NS-1?gateNeed(S.top+1):-1;if(g>=0&&L(S.f,cur().id)>=needOf(cur()))return `<div class="next"><span><b>The next part is waiting on the shop.</b></span><button class="btn pri" data-tab="service">Service</button></div>`;
  if(S.sv.open&&R.sv.work>0&&R.sv.E<.97&&R.sv.lim!=='vb')return `<div class="next"><span><b>The shop is held back</b> by ${({vc:'trucks coming in',vw:'service writers',vt:'technicians',ve:'tools'})[R.sv.lim]}.</span><button class="btn pri" data-tab="shop">Shop</button></div>`;
  return ''}

/* ---------- jump bar: shows the part you're on when it's scrolled away ---------- */
{const j=$('jump');function upd(){if(tab!=='shelves'){j.hidden=true;return}const c=cur(),row=$('r-'+c.id)||$('bd-'+c.base),r=row&&row.getBoundingClientRect(),pr=$('prog').getBoundingClientRect();
  const off=!r||r.bottom<120||r.top>innerHeight-90;j.hidden=!(off&&pr.bottom<100);if(!j.hidden){const need=needOf(c);
  j.innerHTML=`<i class="lic" style="background:${LI[c.line].c}">${icSvg(BASE_IC[c.base])}</i><span>${esc(skuName(c))} · ${fmt(Math.min(L(S.f,c.id),need))}/${need}</span>`}}
 addEventListener('scroll',upd,{passive:true});setInterval(upd,500);
 j.addEventListener('click',()=>{openCurrent();setTimeout(()=>{const c=cur(),row=$('r-'+c.id)||$('bd-'+c.base);if(row)row.scrollIntoView({behavior:'smooth',block:'center'})},60)})}

/* ---------- swipe left or right to change tabs ---------- */
{let sx=0,sy=0,st=0;const order=['shelves','store','service','shop','more'];
 document.querySelector('main').addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;st=Date.now()},{passive:true});
 document.querySelector('main').addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;if(Date.now()-st>600||Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.6)return;
   if(e.target.closest('.seg,.chips,canvas,input'))return;const i=order.indexOf(tab),n=order[i+(dx<0?1:-1)];if(n)$('tab-'+n).click()},{passive:true})}

/* ---------- long-press a buy button for the details ---------- */
{let timer=null,fired=false;
 /* listen on the whole row: a gray (disabled) button doesn't get touches of its own */
 document.addEventListener('pointerdown',e=>{const row=e.target.closest('.sku,.item'),b=row&&row.querySelector('button[data-sku],button[data-bld],button[data-shop],button[data-job]');if(!b)return;fired=false;clearTimeout(timer);
   timer=setTimeout(()=>{fired=true;buzz(15);showDetails(b.dataset)},480)});
 for(const ev of ['pointerup','pointercancel'])document.addEventListener(ev,()=>clearTimeout(timer));document.addEventListener('scroll',()=>clearTimeout(timer),{passive:true});
 document.addEventListener('click',e=>{if(fired&&e.target.closest('.sku,.item')){e.stopPropagation();e.preventDefault();fired=false}},true);
 document.addEventListener('contextmenu',e=>{if(e.target.closest('.sku,.item'))e.preventDefault()})}
function showDetails(d){let name,own,baseL,g,each,eachTxt,cap=0;
  if(d.sku){const s=SI[d.sku];name=skuName(s);own=L(S.f,s.id);baseL=s.lam;g=s.g;each=s.incL+lg(Math.max(R.E,1e-300));eachTxt='Earns per facing'}
  else if(d.job){const s=SVI[d.job];name=svName(s);own=L(S.sv.f,s.id);baseL=s.lam;g=s.g;each=s.incL+lg(Math.max(R.sv.E,1e-300));eachTxt='Earns per job booked'}
  else{const s=STEP[d.bld||d.shop],o=d.bld?S.b:S.sv.b,c=(d.bld?AISLE_SPEC:SHOP_SPEC)[s.g];name=s.n;own=L(o,s.id);baseL=bPrice(s);g=s.g2;cap=MAXC;eachTxt=`Adds per copy`;each=null;var add=`+${fmt(s.amt)} ${c.unit}`}
  const c1=costL(baseL,g,own,1),c10=costL(baseL,g,own,cap?Math.max(1,Math.min(10,cap-own)):10);
  const rows=[['You own',fmt(own)+(cap?` of ${cap}`:'')],['Next one costs',moneyL(c1)],[`Next ${cap?Math.max(1,Math.min(10,cap-own)):10} cost`,moneyL(c10)],['Each one after costs',`×${g.toFixed(2)} more`],[eachTxt,each===null?add:moneyL(each)+'/s']];
  if(each!==null)rows.push(['Pays for itself in',fmtT(10**(c1-each))]);rows.push(['That is',`${fmtT(10**(c1-R.incL))} of your current income`]);
  sheetBase=null;$('sheet').hidden=false;document.body.style.overflow='hidden';
  $('sheetBody').innerHTML=`<h3 style="margin:0 40px 10px 0">${esc(name)}</h3><div class="kv">${rows.map(([k,v])=>`<span>${k}</span><span>${v}</span>`).join('')}</div><p class="sub" style="margin:12px 0 0">Tip: press and hold any buy button to see this.</p>`}

/* ---------- catalog search (look-up only) ---------- */
$('catq').addEventListener('input',()=>{const q=$('catq').value.trim().toLowerCase();if(q.length<2){$('catres').innerHTML='';return}
  const hits=BASES.filter(b=>BASE_NAME[b].toLowerCase().includes(q)).slice(0,24);
  $('catres').innerHTML=hits.length?'<div class="tiles">'+hits.map(b=>{const c=baseCounts(b),l=LI[PARTS.find(p=>p.base===b).line];return `<button class="tile ${c.paS?'':'none'}" data-info="${b}"><i style="color:${c.paS?l.c:'var(--mute)'}">${icSvg(BASE_IC[b])}</i><b>${esc(BASE_NAME[b])}</b><small>${c.paS?`${c.brS} of ${c.br} brands`:'Not stocked'}</small></button>`}).join('')+'</div>':'<p class="sub">No parts match.</p>'});

/* ---------- welcome back ---------- */
setTimeout(()=>{if(!S.st||!S.st.totalL||S.st.totalL<=NEG/2||S.top<1)return;const c=cur(),lim={shelf:'Nothing, sales are keeping up',cu:'Customers',ck:'Checkout',sk:'Stocking'}[R.lim]||'Nothing';
  const g=S.top<NS-1?gateNeed(S.top+1):-1;
  $('welcomeBody').innerHTML=`<h3>Welcome back</h3><p class="sub" style="margin:0">${esc(rankOf(S.st.totalL))} at ${esc(typeof storeName==="function"?storeName():STORE)}</p>
   <div class="kv">${[['Working on',esc(BASE_NAME[c.base])+` (part ${BASES.indexOf(c.base)+1} of ${NB})`],['Next step',esc(skuName(c))+` · ${fmt(Math.min(L(S.f,c.id),needOf(c)))}/${needOf(c)}`],
     ['Earning',moneyL(R.incL)+'/s'],['Holding you back',FAC>=shelfCap()?'Shelf space':g>=0&&L(S.f,c.id)>=needOf(c)?'The shop (next part waits on it)':lim],...(S.sv.open?[['Shop',`job step ${fmt(S.sv.top+1)} of ${fmt(NSV)}`]]:[])].map(([k,v])=>`<span>${k}</span><span>${v}</span>`).join('')}</div>
   <button class="btn pri" style="width:100%" id="wgo">Back to the counter</button>`;$('welcome').hidden=false},900);
document.addEventListener('click',e=>{if(e.target.id==='wgo'||e.target.id==='welcome')$('welcome').hidden=true});

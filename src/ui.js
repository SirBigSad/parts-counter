/* ===== Parts Counter: interface ===== */
const $=id=>document.getElementById(id);
let oldOpen={},tab='shelves',busy=false,afilt='todo',openBase={},openLine={},built={};
document.addEventListener('pointerdown',()=>busy=true,true);
document.addEventListener('pointerup',()=>setTimeout(()=>busy=false,80),true);
document.addEventListener('pointercancel',()=>busy=false,true);
function setHTML(el,h){if(typeof el==='string')el=$(el);if(!el||el._h===h||busy)return;el._h=h;el.innerHTML=h}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const kv=rows=>rows.map(([a,b])=>`<span>${a}</span><span>${b}</span>`).join('');
/* the same rows as rounded tiles (Stats, Shop floor); the one holding things back is marked */
const kvT=(rows,hot)=>rows.map(([a,b])=>`<div class="kt${hot&&a===hot?' hot':''}"><small>${a}</small><b>${b}</b></div>`).join('');
/* money with a smaller suffix, so the digits stand out */
const mHTML=L=>{const s=moneyL(L),m=s.match(/^(.*\d)([A-Za-z]+)$/);return m?`${m[1]}<em class="sfx">${m[2]}</em>`:s};
const LOCK='<svg class="lki" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
const STARS=t=>`<span class="stars" aria-label="${TIER[t].n}">${'★'.repeat({V:1,O:2,P:3}[t]||1)}<i>${'★'.repeat(3-({V:1,O:2,P:3}[t]||1))}</i></span>`;
const BAR=id=>`<span class="rbar" id="${id}w" hidden><i id="${id}"></i></span>`;
/* the product's own short name, like "Cummins X15" or "X15" when it's the fitment */
const shortName=s=>{const p=PI[s.p];return (p&&(p.fit||p.short))||skuName(s)};
/* a little isometric pallet of crates in the department's color, drawn behind its header */
const deptArt=(c,seed)=>{const crates=[[0,0,0],[1,0,0],[0,1,0],[0,0,1],[1,1,0]].slice(0,3+seed%3);const iso=(x,y,z)=>[60+(x-y)*13,44+(x+y)*7.5-z*14];
  const face=(pts,f)=>`<polygon points="${pts.map(p=>iso(...p).join(',')).join(' ')}" fill="${f}"/>`;
  let s=face([[-.2,-.2,0],[2.2,-.2,0],[2.2,2.2,0],[-.2,2.2,0]],'rgba(120,80,50,.55)');
  for(const [x,y,z] of crates.sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2]))){s+=face([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'rgba(0,0,0,.25)')+face([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],c)+face([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'rgba(255,255,255,.35)')+face([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],c+'99')}
  return `<svg class="dart" viewBox="0 0 120 70" aria-hidden="true">${s}</svg>`};
let tt;function note(m){const el=$('toast');el.textContent=m;el.style.display='block';clearTimeout(tt);tt=setTimeout(()=>el.style.display='none',3500)}
const BASE_STEPS={};for(const s of LADDER)(BASE_STEPS[s.base]=BASE_STEPS[s.base]||[]).push(s);
const LINE_BASES={};for(const b of BASES){const l=BASE_STEPS[b][0].line;(LINE_BASES[l]=LINE_BASES[l]||[]).push(b)}

/* ---------- navigation ---------- */
const ICON={shelves:'<path d="M4 4h16v4H4zM4 10h16v4H4zM4 16h16v4H4z" fill="none" stroke="currentColor" stroke-width="2"/>',
 store:'<path d="M3 10l2-6h14l2 6M4 10v10h16V10M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
 more:'<circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/>'};
ICON.service=IC.wrench.split('|').map(d=>`<path d="${d}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`).join('');
ICON.shop='<path d="M3 21V8l9-5 9 5v13M7 21v-9h10v9M7 15h10M7 18h10" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>';
const TABS=[['shelves','Shelves'],['store','Store'],['service','Service'],['shop','Shop'],['more','More']];
$('nav').classList.add('nav5');$('nav').innerHTML=TABS.map(([id,n])=>`<button data-tab="${id}" aria-selected="${id==='shelves'}" id="tab-${id}"><svg viewBox="0 0 24 24" aria-hidden="true">${ICON[id]}</svg>${n}</button>`).join('');

/* ---------- shelves: the ladder ---------- */
function buildBase(b){const steps=BASE_STEPS[b],upto=Math.min(S.top+1,steps[steps.length-1].k);if(built[b]===upto)return;built[b]=upto;
  let h='',fit=null;for(const s of steps){if(s.k>upto)break;const p=PI[s.p];
    if(s.k===steps[0].k||BI[s.b]!==BI[LADDER[s.k-1].b]){h+=`<div class="fit">${bdg(s.b)}<span>${esc(BI[s.b].n)}</span>${STARS(s.t)}<small>${TIER[s.t].n}</small></div>`}
    const ik=`<i class="ski p3w t${s.t}">${part3d(BASE_IC[b],{name:BASE_NAME[b],part:b,color:bdgColor(s.b),tag:esc(bdgText(BI[s.b].n)),brand:s.b})}</i>`;
    h+=s.k>S.top?`<div class="sku locked tt${s.t}">${ik}<div class="sn"><b>${esc(p.fit||p.short)}</b><small>Own ${needOf(LADDER[s.k-1])} above · first one ${moneyL(costL(s.lam,s.g,0,1))}</small></div><span class="lock">${LOCK}</span></div>`:
      `<div class="sku tt${s.t}" id="r-${s.id}">${ik}<div class="sn"><b>${esc(p.fit||p.short)}</b><small id="ki-${s.id}"></small>${BAR('rb-'+s.id)}</div><button class="btn pri" data-sku="${s.id}" id="kb-${s.id}"></button></div>`}
  $('bb-'+b).innerHTML=h}
const rollL={};const roll=(id,t)=>{const p=rollL[id];const v=(p===undefined||!isFinite(p)||Math.abs(t-p)>3)?t:p+(t-p)*.4;rollL[id]=Math.abs(t-v)<.001?t:v;return rollL[id]};
function updRow(s){const b=$('kb-'+s.id);if(!b)return;const n=L(S.f,s.id),k=skuAmt(s),c=costL(s.lam,s.g,n,k),need=s.k===S.top?needOf(s):0;
  {const ke=$('ki-'+s.id),kh=`<span class="rchips"><span class="rchip go">${n?`${moneyL(roll(s.id,lg(n)+s.incL+lg(Math.max(R.E,1e-300))))}/s`:`${moneyL(s.incL+lg(Math.max(R.E,1e-300)))}/s each`}</span><span class="rchip${n>=MAXC?' ok':''}">${fmt(n)}${need&&n<need?`/${need} to unlock`:`/${MAXC}`}</span></span>`;if(ke._h!==kh){ke._h=kh;ke.innerHTML=kh}}
  const full=n>=MAXC;$('r-'+s.id).classList.toggle('full',full);if(full){b.innerHTML='Full';delete b.dataset.cl;b.disabled=true}else{b.innerHTML=`+${fmt(k)}<small>${mHTML(c)}</small>`;b.dataset.cl=c;b.disabled=!canPay(c)||FAC+k>shelfCap()||!onShelf(s)}
  const w=$('rb-'+s.id+'w');if(w){w.hidden=!(need&&n<need);if(!w.hidden)$('rb-'+s.id).style.width=Math.min(100,n/need*100)+'%'}}
function baseLvl(b){const st=BASE_STEPS[b];return st[0].k<=S.top}
function renderLadder(){const c=cur(),bi=BASES.indexOf(c.base),steps=BASE_STEPS[c.base],have=L(S.f,c.id),need=needOf(c);
  let nextTxt;if(S.top>=NS-1)nextTxt='You carry every product in the catalog.';
  else{const n=LADDER[S.top+1];nextTxt=c.last?`Stock ${need} ${shortName(c)} → unlocks ${lc(BASE_NAME[n.base])}`:`Stock ${need} ${shortName(c)} → unlocks ${shortName(n)}`}
  const gq=S.top<NS-1?gateOf(LADDER[S.top+1]):-1,gTxt=gq<0?'':!S.sv.open?`<p class="gate">The next part also needs the service shop. Open it in the Service tab.</p>`:S.sv.top<gq?`<p class="gate">The next part also needs the shop to keep up: unlock <b>${esc(svName(SVL[gq]))}</b> in the Service tab (job step ${fmt(gq+1)}, you're on ${fmt(S.sv.top+1)}).</p>`:'';
  const rp=Math.min(1,have/need),RC=2*Math.PI*23;$('prog').style.setProperty('--lc',LI[c.line].c);
  window.GOAL={txt:nextTxt,have:Math.min(have,need),need};
  $('prog').innerHTML=`<div class="phead"><div class="ring"><svg viewBox="0 0 52 52"><circle class="bg" cx="26" cy="26" r="23"/><circle class="fg" cx="26" cy="26" r="23" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${(RC*(1-rp)).toFixed(1)}"/></svg><i>${icSvg(BASE_IC[c.base])}</i></div><div style="flex:1;min-width:0"><div class="capg"><h3 class="bn">${esc(BASE_NAME[c.base])}</h3><span class="sub" style="margin:0">${esc(LI[c.line].n)}: part ${(LINE_BASES[c.line]||[]).indexOf(c.base)+1} of ${(LINE_BASES[c.line]||[]).length}</span></div>
    <p class="sub" style="margin:2px 0 0">Step ${c.k-steps[0].k+1} of ${steps.length} in this part · ${bdg(c.b)}${esc(BI[c.b].n)}</p></div></div><div style="height:10px"></div>
    <div class="meter"><i style="width:${Math.min(100,have/need*100)}%"></i></div><p style="margin:8px 0 0;font-size:15px"><b>${esc(nextTxt)}</b> <b class="num">${fmt(Math.min(have,need))} / ${need}</b></p>${gTxt}${typeof nextUp==="function"?nextUp():""}`;
  const reached=new Set(LADDER.slice(0,S.top+1).map(s=>s.line));
  for(const l of LINES){const el=$('ln-'+l.id);el.hidden=!reached.has(l.id);if(el.hidden)continue;
    let f=0;for(const b of LINE_BASES[l.id])for(const s of BASE_STEPS[b])f+=L(S.f,s.id);
    $('ls-'+l.id).textContent=`${fmt(f)} facings`;$('lv-'+l.id).textContent=moneyL(R.line[l.id]===undefined?NEG:R.line[l.id])+'/s';
    if(!el.open)continue;
    for(const b of LINE_BASES[l.id]){const be=$('bd-'+b);be.hidden=!baseLvl(b);if(be.hidden)continue;
      const st=BASE_STEPS[b],last=st[st.length-1],done=L(S.f,last.id)>=BASE_NEED;let f2=0,v2=NEG;for(const s of st){const n=L(S.f,s.id);if(n){f2+=n;v2=addL(v2,lg(n)+s.incL+lg(Math.max(R.E,1e-300)))}}
      $('bs-'+b).innerHTML=`${done?'<span class="stamp">Fully stocked</span>':''}${fmt(f2)} facings · ${moneyL(v2)}/s`;be.classList.toggle('done',done);
      if(be.open){buildBase(b);for(const s of st){if(s.k>S.top)break;updRow(s)}}}}}
$('ladder').innerHTML=LINES.map(l=>`<details class="line" id="ln-${l.id}" data-line="${l.id}" style="--lc:${l.c}" hidden><summary><i class="lic" style="background:${l.c}">${icSvg(LINE_IC[l.id])}</i><div class="lsum"><b>${l.n}</b><small id="ls-${l.id}"></small></div>${deptArt(l.c,l.id.charCodeAt(0))}<span class="lval" id="lv-${l.id}"></span></summary><div class="lbody">${
  (LINE_BASES[l.id]||[]).map(b=>`<details class="part" id="bd-${b}" data-base="${b}" hidden><summary><span class="bn">${icSvg(BASE_IC[b])}${esc(BASE_NAME[b])}<button class="ib" data-info="${b}" aria-label="Part info, fitment and sales">i</button></span><small id="bs-${b}"></small></summary><div id="bb-${b}"></div></details>`).join('')}</div></details>`).join('');
function openCurrent(){const c=cur();const ln=$('ln-'+c.line),bd=$('bd-'+c.base);if(!ln.open)ln.open=true;if(!bd.open)bd.open=true}

/* ---------- store and shop: capacity ladders ---------- */
/* o: {spec, ais, own, tops, attr} — the store uses S.b / S.sTop, the shop S.sv.b / S.sv.sTop */
const STORE_O={spec:AISLE_SPEC,ais:AISLE,own:()=>S.b,tops:()=>S.sTop,attr:'bld',amt:b=>bAmt(b),ic:AISLE_IC};
const SHOP_O={spec:SHOP_SPEC,ais:SHOP,own:()=>S.sv.b,tops:()=>S.sv.sTop,attr:'shop',amt:b=>shAmt(b),ic:SHOP_IC};
const AISLE_C={ck:'#3d8bfd',sk:'#2ec4a6',cu:'#f15bb5',sh:'#ffb627',vb:'#9b5de5',vt:'#00bbf9',vw:'#ff7a3d',vc:'#22b573',ve:'#ff5a5f'};
/* a ring that fills toward what the shelves need (or how full the shelves are), with a plain label under it */
const gauge=(p,c,slot)=>{const RC=2*Math.PI*17,f=Math.max(0,Math.min(1,p)),t=slot?Math.round(p*100)+'%':p>=10?'×10+':p>=1?'×'+p.toFixed(1):Math.round(p*100)+'%';
  return `<div class="gauge"><svg viewBox="0 0 40 40"><circle class="bg" cx="20" cy="20" r="17"/><circle cx="20" cy="20" r="17" style="stroke:${c}" stroke-dasharray="${RC.toFixed(1)}" stroke-dashoffset="${(RC*(1-f)).toFixed(1)}"/></svg><b>${t}</b><small>${slot?'shelf used':p>=1?'more than needed':'of what\'s needed'}</small></div>`};
function capCards(el,o){$(el).innerHTML=Object.entries(o.spec).map(([g,c])=>`<div class="card aisle" id="cap-${g}" style="--lc:${AISLE_C[g]||'var(--acc)'}"><div class="capg"><h3 class="bn"><i class="lic">${icSvg(o.ic[g])}</i>${c.n}</h3><span id="cgg-${g}"></span></div><div id="cg-${g}" class="cgv"></div><div class="meter" style="margin:8px 0 2px"><i id="cm-${g}"></i></div>
  <div class="sprog" id="cp-${g}"></div><div id="ci-${g}"></div><div id="co-${g}"></div></div>`).join('')}
capCards('caps',STORE_O);capCards('shcaps',SHOP_O);
const sRow=(s,c,o)=>{const own=o.own(),tops=o.tops();if(s.j>tops[s.g])return `<div class="item locked"><h3 class="bn">${icSvg(s.ic)}${esc(s.n)}</h3><span class="lock">${LOCK}</span><p>+${fmt(s.amt)} ${c.unit} each · first one ${moneyL(bPrice(s))}</p></div>`;
  const n=L(own,s.id),full=n>=MAXC,k=o.amt(s),cost=costL(bPrice(s),s.g2,n,k);
  const nx=s.j===tops[s.g]&&n<UNLOCK_N;return `<div class="item ${full?'full':''}"><h3 class="bn">${icSvg(s.ic)}<span>${esc(s.n)}</span><span class="ct">×${fmt(n)} of ${MAXC}</span>${full?'<span class="stamp">Fully stocked</span>':''}</h3><button class="btn pri" data-${o.attr}="${s.id}" ${full?'':`data-cl="${cost}"`} ${!full&&canPay(cost)?'':'disabled'}>${full?'Full':`+${fmt(k)}<small>${mHTML(cost)}</small>`}</button><p>+${fmt(s.amt)} ${c.unit} each</p><span class="rbar ib2"><i style="width:${Math.min(100,(nx?n/UNLOCK_N:n/MAXC)*100)}%" class="${nx?'':'cap'}"></i></span></div>`};
const sItem=(st,it,c,all,o)=>{const tops=o.tops(),rows=st.filter(s=>s.it===it&&(all||s.j<=tops[s.g]+3));const own=rows.filter(s=>s.j<=tops[s.g]).length,tot=st.filter(s=>s.it===it).length;
  return `<div class="ihd"><b class="bn">${icSvg(rows[0].ic)}${esc(rows[0].item)}</b><small>${own} of ${tot} unlocked</small></div>`+rows.slice().reverse().map(s=>sRow(s,c,o)).join('')};
/* vals: what each group provides now; need: what it has to keep up with; slot: the group measured in slots */
/* which shelf step unlocks a store item, in words that match the Shelves tab */
function unlockAt(kb){const it=LADDER[kb],cur=LADDER[S.top],first=b=>LADDER.findIndex(x=>x.base===b),stepOf=k=>k-first(LADDER[k].base)+1;
  if(cur&&cur.base===it.base)return `It unlocks when ${esc(shortName(it))} unlocks on the Shelves tab: step ${fmt(stepOf(kb))} of this part (you're on step ${fmt(stepOf(S.top))}).`;
  return `It unlocks when you reach ${esc(shortName(it))} on the Shelves tab: ${esc(lc(BASE_NAME[it.base]))}, step ${fmt(stepOf(kb))} (part ${BASES.indexOf(it.base)+1}).`}
function renderCaps(o,vals,need,lim,slot,used,lbl){const own=o.own(),tops=o.tops();
  for(const [g,c] of Object.entries(o.spec)){const v=vals[g],isLim=lim===g,st=o.ais[g],top=tops[g],cs=st[top];
    $('cg-'+g).innerHTML=g===slot?`<b class="num">${fmt(used)} / ${fmt(v)}</b> ${c.unit}`:`<b class="num" style="color:${isLim?'var(--bad)':'inherit'}">${fmt(v)}</b> / ${fmt(need)} ${lbl[g]||'needed'}`;
    const pct=g===slot?used/v:Math.min(1,v/Math.max(need,1e-9)),m=$('cm-'+g);setHTML('cgg-'+g,gauge(g===slot?used/Math.max(v,1e-9):v/Math.max(need,1e-9),(g===slot?pct>.95:pct<.999)?'var(--bad)':'var(--good)',g===slot));m.style.width=Math.min(100,pct*100)+'%';m.style.background=(g===slot?pct>.95:pct<.999)?'var(--bad)':'var(--good)';
    const n=L(own,cs.id);
    const nx=st[top+1],wait=nx&&n>=UNLOCK_N&&g!=='sh'&&g!=='vb'?(o===SHOP_O?(S.sv.top<nx.kb?`It unlocks once the shop reaches job step ${fmt(nx.kb+1)} (you're on ${fmt(S.sv.top+1)}).`:''):(S.top<nx.kb?unlockAt(nx.kb):'')):'';
    setHTML('cp-'+g,top<st.length-1?`<small>Step ${top+1} of ${st.length} · Own ${UNLOCK_N} ${esc(cs.n)} to unlock ${esc(nx.n)}. ${wait}</small><div class="meter"><i style="width:${Math.min(1,n/UNLOCK_N)*100}%"></i></div><small class="num">${fmt(Math.min(n,UNLOCK_N))} / ${UNLOCK_N}</small>`
      :`<small>Step ${st.length} of ${st.length} · Everything here is unlocked.</small>`);
    setHTML('ci-'+g,sItem(st,cs.it,c,false,o));
    const older=[...new Set(st.filter(s=>s.j<=top&&s.it<cs.it).map(s=>s.it))].reverse();
    let h='';if(older.length&&oldOpen[g])h=older.map(it=>sItem(st,it,c,true,o)).join('');
    setHTML('co-'+g,older.length?`<details class="older" ${oldOpen[g]?'open':''} data-old="${g}"><summary>${older.length} earlier item${older.length>1?'s':''}</summary>${h}</details>`:'')}}
function renderStore(){renderCaps(STORE_O,{ck:R.ck,sk:R.sk,cu:R.dem,sh:shelfCap()},R.supply,R.lim,'sh',FAC,{cu:'units wanted'})}

/* ---------- service: the shop's job ladder ---------- */
const SV_STEPS={};for(const s of SVL)(SV_STEPS[s.job]=SV_STEPS[s.job]||[]).push(s);
const LINE_JOBS={};for(const [jid,,l] of SV_JOBS)(LINE_JOBS[l]=LINE_JOBS[l]||[]).push(jid);
const JOB_ORDER=SV_LINES.flatMap(l=>LINE_JOBS[l.id]||[]);
let sbuilt={};
$('sladder').innerHTML=SV_LINES.map(l=>`<details class="line" id="sln-${l.id}" style="--lc:${l.c}" hidden><summary><i class="lic" style="background:${l.c}">${icSvg(SV_LINE_IC[l.id])}</i><div class="lsum"><b>${l.n}</b><small id="sls-${l.id}"></small></div>${deptArt(l.c,l.id.charCodeAt(0))}<span class="lval" id="slv-${l.id}"></span></summary><div class="lbody">${
  (LINE_JOBS[l.id]||[]).map(j=>`<details class="part" id="sjd-${j}" hidden><summary><span class="bn">${icSvg(JOB_IC[j])}${esc(JOB_NAME[j])}</span><small id="sjs-${j}"></small></summary><div id="sjb-${j}"></div></details>`).join('')}</div></details>`).join('');
function buildJob(j){const steps=SV_STEPS[j],upto=Math.min(S.sv.top+1,steps[steps.length-1].k);if(sbuilt[j]===upto)return;sbuilt[j]=upto;
  let h='';for(const s of steps){if(s.k>upto)break;
    if(s.k===steps[0].k||SVL[s.k-1].lv!==s.lv)h+=`<div class="fit"><span>${esc(SV_LV[s.lv][0])}</span>${STARS(s.t)}<small>${TIER[s.t].n} rate</small></div>`;
    const ik=`<i class="ski t${s.t}">${icSvg(JOB_IC[j])}</i>`,nm=esc(s.fit||'All trucks');
    h+=s.k>S.sv.top?`<div class="sku locked tt${s.t}">${ik}<div class="sn"><b>${nm}</b><small>Book ${svNeed(SVL[s.k-1])} above · first one ${moneyL(costL(s.lam,s.g,0,1))}</small></div><span class="lock">${LOCK}</span></div>`:
      `<div class="sku tt${s.t}" id="sr-${s.id}">${ik}<div class="sn"><b>${nm}</b><small id="si-${s.id}"></small>${BAR('srb-'+s.id)}</div><button class="btn pri" data-job="${s.id}" id="sb-${s.id}"></button></div>`}
  $('sjb-'+j).innerHTML=h}
function updJob(s){const b=$('sb-'+s.id);if(!b)return;const n=L(S.sv.f,s.id),k=jobAmt(s),c=costL(s.lam,s.g,n,k),need=s.k===S.sv.top?svNeed(s):0,lE=lg(Math.max(R.sv.E,1e-300));
  {const ke=$('si-'+s.id),kh=`<span class="rchips"><span class="rchip go">${n?moneyL(lg(n)+s.incL+lE)+'/s':moneyL(s.incL+lE)+'/s each'}</span><span class="rchip${n>=MAXC?' ok':''}">${fmt(n)}/${need&&n<need?need:MAXC}</span></span>`;if(ke._h!==kh){ke._h=kh;ke.innerHTML=kh}}
  b.innerHTML=`+${fmt(k)}<small>${mHTML(c)}</small>`;b.dataset.cl=c;b.disabled=!canPay(c)||SFAC+k>svSlots();
  const w=$('srb-'+s.id+'w');if(w){w.hidden=!(need&&n<need);if(!w.hidden)$('srb-'+s.id).style.width=Math.min(100,n/need*100)+'%'}}
function openJob(){const c=svCur(),ln=$('sln-'+c.line),jd=$('sjd-'+c.job);if(!ln.open)ln.open=true;if(!jd.open)jd.open=true}
function closedCard(){const reach=S.top>=SV_OPEN_K,pct=Math.min(1,S.top/SV_OPEN_K);
  return `<div class="card" id="prog"><div class="capg"><h3 class="bn"><i class="lic" style="background:var(--acc)">${icSvg('wrench')}</i>Service shop</h3></div>
  <p class="sub" style="margin:8px 0">There's an empty building out back. Open a shop and you can sell labor too: oil changes and inspections first, overhauls and electric trucks much later. Jobs cost far more than parts and pay back slower, the shop has its own bottlenecks to manage, and later parts won't unlock unless the shop keeps up.</p>
  <p style="margin:0 0 6px;font-size:15px">${reach?'You have enough of the parts list on the shelves.':`Keep climbing the parts list. The shop opens at step ${SV_OPEN_K+1}; you're on step ${S.top+1}.`}</p>
  <div class="meter"><i style="width:${pct*100}%"></i></div>
  <button class="btn pri" data-open="1" style="width:100%;margin-top:12px" ${reach&&canPay(SV_OPEN_L)?'':'disabled'}>Open the service shop<small>${moneyL(SV_OPEN_L)}</small></button></div>`}
function renderService(){const open=S.sv.open;$('svOpen').hidden=!open;$('svClosed').hidden=open;if(!open){setHTML('svClosed',closedCard());return}
  recountSv();$('slotTxt').textContent=`Bay slots ${fmt(SFAC)} of ${fmt(svSlots())}`;
  const c=svCur(),steps=SV_STEPS[c.job],have=L(S.sv.f,c.id),need=svNeed(c),ji=JOB_ORDER.indexOf(c.job);
  let nx;if(S.sv.top>=NSV-1)nx='The shop offers every job there is.';else{const n=SVL[S.sv.top+1];nx=c.last?`Book ${need} of ${svName(c)} to start offering ${lc(JOB_NAME[n.job])}`:`Book ${need} of ${svName(c)} to unlock ${svName(n)}`}
  $('sprog').innerHTML=`<div class="capg"><h3 class="bn">${icSvg(JOB_IC[c.job])}${esc(JOB_NAME[c.job])}</h3><span class="sub" style="margin:0">Job ${ji+1} of ${SV_JOBS_N}</span></div>
    <p class="sub" style="margin:4px 0 8px">Step ${c.k-steps[0].k+1} of ${steps.length} in this job · ${esc(SLI[c.line].n)} · Shop earns ${moneyL(R.sv.incL)}/s</p>
    <div class="meter"><i style="width:${Math.min(100,have/need*100)}%"></i></div><p style="margin:8px 0 0;font-size:15px">${esc(nx)} <b class="num">${fmt(Math.min(have,need))} / ${need}</b></p>`;
  const reached=new Set(SVL.slice(0,S.sv.top+1).map(s=>s.line));
  for(const l of SV_LINES){const el=$('sln-'+l.id);el.hidden=!reached.has(l.id);if(el.hidden)continue;
    let f=0;for(const j of LINE_JOBS[l.id])for(const s of SV_STEPS[j])f+=L(S.sv.f,s.id);
    $('sls-'+l.id).textContent=`${fmt(f)} booked`;$('slv-'+l.id).textContent=moneyL(R.sv.line[l.id]===undefined?NEG:R.sv.line[l.id])+'/s';
    if(!el.open)continue;
    for(const j of LINE_JOBS[l.id]){const je=$('sjd-'+j),st=SV_STEPS[j];je.hidden=st[0].k>S.sv.top;if(je.hidden)continue;
      const last=st[st.length-1],done=L(S.sv.f,last.id)>=BASE_NEED;let f2=0,v2=NEG;for(const s of st){const n=L(S.sv.f,s.id);if(n){f2+=n;v2=addL(v2,lg(n)+s.incL+lg(Math.max(R.sv.E,1e-300)))}}
      $('sjs-'+j).textContent=`${done?'Mastered · ':''}${fmt(f2)} booked · ${moneyL(v2)}/s`;
      if(je.open){buildJob(j);for(const s of st){if(s.k>S.sv.top)break;updJob(s)}}}}}
function renderShop(){const open=S.sv.open;$('shOpen').hidden=!open;$('shClosed').hidden=open;
  if(!open){setHTML('shClosed',`<div class="card"><p class="sub" style="margin:0">Open the service shop in the Service tab to start building bays, hiring technicians and buying tools.</p></div>`);return}
  recountSv();const v=R.sv;$('shHead').innerHTML=`${icSvg('dock')}Shop floor`;
  const limN={vb:'Booked work',vc:'Trucks coming in',vw:'Service writers',vt:'Technicians',ve:'Tools & equipment'}[v.lim];
  setHTML('shFlow',kvT([['Booked work',fmt(v.work)+' hrs/s'],['Trucks coming in',fmt(v.dem)+' hrs/s'],['Service writers',fmt(v.wr)+' hrs/s'],['Technicians',fmt(v.tech)+' hrs/s'],['Tools & equipment',fmt(v.tools)+' hrs/s'],
    ['Getting done',`${fmt(v.moved)} hrs/s (${Math.round(v.E*100)}%)`],['Holding the shop back',v.work>0?limN:'Nothing booked yet'],['Shop earns',moneyL(v.incL)+'/s']],v.work>0?limN:''));
  renderCaps(SHOP_O,{vb:svSlots(),vt:v.tech,vw:v.wr,vc:v.dem,ve:v.tools},v.work,v.lim==='vb'?null:v.lim,'vb',SFAC,{vc:'hrs wanted'})}

/* ---------- more ---------- */
function renderMore(){const done=Object.keys(S.ach).length;$('achs').textContent=`${done} of ${A.length} goals reached`;$('achm').style.width=done/A.length*100+'%';
  const list=A.filter(a=>afilt==='done'?S.ach[a.id]:!S.ach[a.id]).slice(0,afilt==='done'?400:12);
  setHTML('goals',list.map(a=>`<div class="goal ${S.ach[a.id]?'ok':''}"><i></i>${esc(a.n)}</div>`).join('')||'<div class="empty">Nothing yet.</div>');
  setHTML('log',LOG.filter(([id])=>S.log[id]).sort((a,b)=>S.log[b[0]]-S.log[a[0]]).slice(0,30).map(([id,,tx])=>`<p><small>${new Date(S.log[id]).toLocaleDateString()}</small>${esc(tx)}</p>`).join(''));
  const mastered=BASES.filter(b=>{const st=BASE_STEPS[b];return L(S.f,st[st.length-1].id)>=BASE_NEED}).length;
  setHTML('stats',kvT([['Time played',fmtT(S.st.play)],['Total earned',moneyL(S.st.totalL)],['Earning now',moneyL(R.incL)+'/s'],['Units moving',fmt(R.moved)+'/s'],
    ['Products unlocked',`${fmt(S.top+1)} of ${fmt(NS)}`],['Parts mastered',`${mastered} of ${NB}`],['Facings',fmt(FAC)],['Incidents handled',fmt(S.st.incidents)],...lifeStats(),
    ...(S.sv.open?[['Shop earns',moneyL(R.sv.incL)+'/s'],['Job steps unlocked',`${fmt(S.sv.top+1)} of ${fmt(NSV)}`],['Jobs mastered',`${SV_JOBS.filter(([j])=>{const st=SV_STEPS[j];return L(S.sv.f,st[st.length-1].id)>=BASE_NEED}).length} of ${SV_JOBS_N}`],['Jobs booked',fmt(SFAC)]]:[['Service shop','Not open yet']])]));
  $('sAnim').checked=S.ui.anim;$('sSci').checked=S.ui.sci;$('sSnd').checked=S.ui.snd;$('sVib').checked=S.ui.vib;renderCatalog();drawChart()}

/* ---------- header ---------- */
/* money rolls toward its new value instead of jumping */
let shownCash=null;function renderHeader(){if(shownCash===null||!isFinite(shownCash)||Math.abs(S.cashL-shownCash)>6)shownCash=S.cashL;else shownCash+=(S.cashL-shownCash)*.35;$('cash').innerHTML=mHTML(Math.abs(S.cashL-shownCash)<.002?S.cashL:shownCash);$('cps').textContent='+'+moneyL(R.incL)+'/s';$('rank').textContent=rankOf(S.st.totalL);$('where').textContent=typeof storeName==='function'?storeName():STORE;
  const cells=[['shelf','Shelf',R.supply],['cu','Customers',R.dem],['ck','Checkout',R.ck],['sk','Stocking',R.sk]];
  {const mx=Math.max(...cells.map(c=>c[2]),1e-9);setHTML('dash',cells.map(([k,n,v])=>`<div class="${R.lim===k&&FAC?'lim':''}" data-jump="${k==='shelf'?'sh':k}" role="button" tabindex="0"><small>${n}</small><b class="num">${fmt(v)}/s</b><span class="db"><i style="width:${Math.max(4,v/mx*100)}%"></i></span></div>`).join(''))}
  const i=S.inc;$('inc').hidden=!i;if(i){const t=now(),m={spill:['Coffee spilled by the counter. Checkout is slower.','Mop it up'],jam:['A register jammed. Checkout is crawling.','Fix it'],thief:['A shoplifter is heading for the door.','Stop him'],
    back:[i.line?`Backorder: ${lc(LI[i.line].n)} is selling at half speed for ${fmtT((i.end-t)/1000)}.`:'',''],lift:['A truck lift went down. The shop is short on equipment.','Call for repair'],
    sick:[`A technician called in sick. The shop is short-handed for ${fmtT((i.end-t)/1000)}.`,''],comeback:['A customer brought a truck back. The job has to be redone.','Fix it right']}[i.type];$('incTxt').textContent=m[0];$('incBtn').hidden=!m[1];$('incBtn').textContent=m[1]}}
function render(){recount();SCI=S.ui.sci;renderHeader();document.querySelectorAll('[data-m]').forEach(x=>x.classList.toggle('on',String(S.ui.mode)===x.dataset.m));
  if(tab==='shelves'){$('shelfTxt').textContent=`Shelf space ${fmt(FAC)} of ${fmt(shelfCap())} facings`;renderLadder()}
  if(tab==='store')renderStore();if(tab==='service')renderService();if(tab==='shop')renderShop();if(tab==='more'){renderMore();if(typeof renderFun==='function')renderFun()}}
function forceRender(){busy=false;for(const id of ['goals','log','cat','svClosed','shClosed',...['ck','sk','cu','sh','vb','vt','vw','vc','ve'].flatMap(g=>['ci-'+g,'co-'+g,'cp-'+g])])$(id)._h=null;render()}

/* ---------- input ---------- */
let lastTop=S.top,lastJob=S.sv.top,lastAisle='';
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
  if(d.tab){tab=d.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',x===b));for(const [s] of TABS)$('t-'+s).hidden=s!==tab;scrollTo({top:0})}
  else if(d.sku){const s=SI[d.sku];if(buySku(s,skuAmt(s))){feel('buy');flyFrom(b)}unlock(false)}
  else if(d.bld){const x=STEP[d.bld];if(x){if(buyBld(x,bAmt(x))){feel('buy');flyFrom(b)}unlock(false);tick(1e-6,false)}}
  else if(d.shop){const x=STEP[d.shop];if(x){if(buyShop(x,shAmt(x))){feel('buy');flyFrom(b)}unlock(false);tick(1e-6,false)}}
  else if(d.job){const s=SVI[d.job];if(s){if(buyJob(s,jobAmt(s))){feel('buy');flyFrom(b)}unlock(false);tick(1e-6,false)}}
  else if(d.open){if(openShop()){feel('big');note('The service shop is open!');tick(1e-6,false);openJob()}}
  else if(d.m){S.ui.mode=d.m==='max'?'max':+d.m}
  else if(d.theme){S.ui.theme=d.theme;applyTheme();save()}
  else if(d.af){afilt=d.af;document.querySelectorAll('[data-af]').forEach(x=>x.classList.toggle('on',x===b))}
  else return;
  forceRender()});
document.addEventListener('toggle',e=>{const el=e.target;if(el.tagName!=='DETAILS')return;if(el.dataset.old){if(oldOpen[el.dataset.old]!==el.open){oldOpen[el.dataset.old]=el.open;$('co-'+el.dataset.old)._h=null;render()}}else render()},true);
document.addEventListener('change',e=>{const t=e.target;if(t.id==='sAnim')S.ui.anim=t.checked;if(t.id==='sSci')S.ui.sci=t.checked;if(t.id==='sSnd'){S.ui.snd=t.checked;if(t.checked)feel('step')}if(t.id==='sVib'){S.ui.vib=t.checked;if(t.checked)buzz(30)}forceRender()});
$('incBtn').addEventListener('click',()=>{fixInc();forceRender()});
function arm(btn,fn){if(btn.dataset.arm){delete btn.dataset.arm;btn.textContent=btn.dataset.l;fn()}else{btn.dataset.l=btn.textContent;btn.dataset.arm=1;btn.textContent='Tap again to confirm';setTimeout(()=>{if(btn.dataset.arm){delete btn.dataset.arm;btn.textContent=btn.dataset.l}},3000)}}
/* SAVE_LOCK stops the old game from saving over a save that was just loaded, while the page reloads */
let SAVE_LOCK=false;
function save(){if(SAVE_LOCK)return;S.t=now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function resetLadder(){sbuilt={};for(const j of JOB_ORDER){$('sjb-'+j).innerHTML='';$('sjd-'+j).open=false}for(const l of SV_LINES)$('sln-'+l.id).open=false;if(S.sv.open)openJob();built={};for(const b of BASES){$('bb-'+b).innerHTML='';$('bd-'+b).open=false}for(const l of LINES)$('ln-'+l.id).open=false;openCurrent()}
$('copy').addEventListener('click',async()=>{save();const code=btoa(unescape(encodeURIComponent(JSON.stringify(S))));try{await navigator.clipboard.writeText(code);note('Save code copied.')}catch(e){$('imp').value=code;$('imp').select();note('Copy the code from the box.')}});
$('load').addEventListener('click',()=>{try{const d=JSON.parse(decodeURIComponent(escape(atob($('imp').value.trim()))));if(!d||!d.f||(d.v||0)<4)throw 0;if(typeof backupNow==='function')backupNow('Before loading a save code',true);S=load(d);S.rid=Date.now();S.t=now();save();resetLadder();applyTheme();$('imp').value='';tick(1e-6,false);note('Save loaded.');forceRender()}catch(e){note("That code didn't work.")}});
$('wipe').addEventListener('click',e=>arm(e.currentTarget,()=>{if(typeof backupNow==='function')backupNow('Before reset',true);try{localStorage.removeItem(KEY)}catch(er){}S=fresh();S.rid=Date.now();save();resetLadder();applyTheme();tick(1e-6,false);note('Saved data reset. A fresh start.');forceRender();if(typeof syncNow==='function')syncNow(false)}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();S.t=now()});

/* ---------- appearance: auto follows the phone, or force light or dark ---------- */
const darkMQ=matchMedia('(prefers-color-scheme: dark)');
function applyTheme(){const t=S.ui.theme||'auto',r=document.documentElement;if(t==='auto')delete r.dataset.theme;else r.dataset.theme=t;
  const dark=t==='dark'||(t==='auto'&&darkMQ.matches);r.classList.toggle('dk',dark);
  let m=document.querySelector('meta[name=theme-color]');if(!m){m=document.createElement('meta');m.name='theme-color';document.head.appendChild(m)}m.content=dark?'#1b1e22':'#ffffff';
  document.querySelectorAll('[data-theme]').forEach(x=>{if(x.tagName==='BUTTON')x.classList.toggle('on',x.dataset.theme===t)})}
darkMQ.addEventListener('change',applyTheme);applyTheme();

/* ---------- loop ---------- */
tick(1e-6,false);
S.t=now();/* no progress while the game is closed */
openCurrent();if(S.sv.open)openJob();checkGoals();
let ln=0;
setInterval(()=>{const t=now(),dt=Math.min(1,(t-S.t)/1000);S.t=t;if(document.hidden)return;if(dt>0)tick(dt);
  if(S.top!==lastTop){const prev=LADDER[lastTop];lastTop=S.top;if(cur().base!==prev.base){const pb=$('bd-'+prev.base);if(pb)pb.open=false;if(cur().line!==prev.line){const pl=$('ln-'+prev.line);if(pl)pl.open=false}openCurrent();feel('big');celebrate(cur(),prev)}else feel('step');setTimeout(()=>flashRow('r-'+cur().id),60)}
  if(S.sv.top!==lastJob){const prev=SVL[lastJob];lastJob=S.sv.top;if(svCur().job!==prev.job&&S.sv.open){openJob();feel('big')}else feel('step')}
  {const k=JSON.stringify(S.sTop)+JSON.stringify(S.sv.sTop);if(k!==lastAisle){if(lastAisle)feel('step');lastAisle=k}}
  if(ln%100===0)sampleHist();if(sheetBase&&ln%10===0)renderSheet();
  if(++ln%5===0)events();if(ln%20===0)checkGoals();if(ln%3===0)render()},100);
setInterval(save,5000);
render();

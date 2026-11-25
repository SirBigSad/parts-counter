/* ===== Parts Counter: state and simulation =====
   One store and its service shop. No boosts, no bonuses, no multipliers.
   Money is kept as log10 (cashL, totalL) so it can grow far past 1e308. */
const KEY='parts-counter-v6',VERSION=7;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const L=(o,k)=>(o&&o[k])||0;
const now=()=>Date.now();
const NEG=-1e9;
const addL=(a,b)=>{if(a<=NEG/2)return b;if(b<=NEG/2)return a;const m=Math.max(a,b);return m+lg(10**(a-m)+10**(b-m))};
const subL=(a,b)=>{if(b<=NEG/2)return a;const d=b-a;if(d>=0)return NEG;if(d<-16)return a;return a+lg(1-10**d)};
const freshSv=()=>({open:false,f:{},top:0,b:{vt0:1,vw0:1},sTop:{vb:0,vt:0,vw:0,vc:0,ve:0}});
const fresh=()=>({v:VERSION,cashL:lg(25),f:{},top:0,b:{ck0:1,sk0:1},sTop:{ck:0,sk:0,cu:0,sh:0},sv:freshSv(),ach:{},log:{},inc:null,nextInc:Date.now()+3e5,ui:{mode:1,anim:true,sci:false,theme:'auto',snd:true,vib:true,radio:false},fun:{spot:{},pl:{},name:'',dog:'',paint:''},deco:{own:{},on:{}},
  st:{totalL:NEG,incidents:0,shop:0,play:0,start:Date.now(),all:0,sold:{},br:{},trucks:0,hrs:0},hist:[],t:Date.now()});
function load(d){if(!d||typeof d!=='object'||(d.v||0)<6)return fresh();const f=fresh();const s=Object.assign(f,d,{st:Object.assign(f.st,d.st,{sold:Object.assign({},(d.st||{}).sold),br:Object.assign({},(d.st||{}).br)}),hist:Array.isArray(d.hist)?d.hist.slice(-360):[],ui:Object.assign(f.ui,d.ui),fun:Object.assign(f.fun,d.fun,{spot:Object.assign({},(d.fun||{}).spot),pl:Object.assign({},(d.fun||{}).pl)}),b:Object.assign({},d.b||f.b),sTop:Object.assign(f.sTop,d.sTop)});
  {const v=d.sv||{},fv=freshSv();s.sv=Object.assign(fv,v,{f:Object.assign({},v.f||{}),b:Object.assign({},v.b||fv.b),sTop:Object.assign(fv.sTop,v.sTop)});
   for(const k of Object.keys(s.sv.f))if(!SVI[k])delete s.sv.f[k];for(const k of Object.keys(s.sv.b))if(!STEP[k])delete s.sv.b[k];s.sv.top=Math.min(s.sv.top||0,NSV-1)}
  for(const k of Object.keys(s.b))if(!STEP[k])delete s.b[k];
  for(const k of Object.keys(s.f))if(!SI[k])delete s.f[k];s.top=Math.min(s.top||0,NS-1);if(!isFinite(s.cashL))s.cashL=NEG;
  /* version 7 added brands, engines, trucks and departments all through the lists: keep progress by moving
     each ladder's position to the furthest thing already owned (new items behind you just become extra options) */
  if((d.v||0)<7){let t=0;for(const k in s.f)if(s.f[k]>0)t=Math.max(t,SI[k].k);s.top=Math.max(t,0);
    for(const g in s.sTop){let m=0;for(const st of AISLE[g])if(L(s.b,st.id)>0)m=st.j;s.sTop[g]=Math.min(AISLE[g].length-1,Math.max(m,0))}
    if(s.sv){let j=0;for(const k in s.sv.f)if(s.sv.f[k]>0)j=Math.max(j,SVI[k].k);s.sv.top=j;
      for(const g in s.sv.sTop){let m=0;for(const st of SHOP[g])if(L(s.sv.b,st.id)>0)m=st.j;s.sv.sTop[g]=Math.min(SHOP[g].length-1,m)}}}
  s.v=VERSION;return s}
try{for(const k of ['parts-counter-v4','parts-counter-v5'])localStorage.removeItem(k)}catch(e){}
let S=fresh();
try{const raw=localStorage.getItem(KEY);if(raw)S=load(JSON.parse(raw))}catch(e){S=fresh()}
SCI=S.ui.sci;

/* ---------- store math ---------- */
let FAC=0;const recount=()=>{FAC=0;for(const k in S.f)FAC+=S.f[k]};
const lineFac=l=>{let n=0;for(const k in S.f)if(SI[k].line===l)n+=S.f[k];return n};
const capOf=g=>{let a=0;for(const id in S.b)if(id.slice(0,2)===g&&S.b[id])a+=S.b[id]*STEP[id].amt;return a};
const customers=()=>AISLE_SPEC.cu.base+capOf('cu');
const checkoutCap=()=>(2+capOf('ck'))*(S.inc&&S.inc.type==='spill'?.6:S.inc&&S.inc.type==='jam'?.3:1);
const stockCap=()=>2+capOf('sk');
const shelfCap=()=>AISLE_SPEC.sh.base+capOf('sh');
const onShelf=s=>s.k<=S.top;
/* a backorder slows one line to half speed; it never empties the store */
const boF=s=>S.inc&&S.inc.type==='back'&&S.inc.line===s.line?.5:1;
/* cost of k more when you own n, in log10 */
const costL=(baseL,g,n,k)=>baseL+n*lg(g)+lg((g**Math.min(k,2000)-1)/(g-1))+(k>2000?(k-2000)*lg(g):0);
const canPay=cL=>S.cashL>=cL-1e-12;
const maxAff=(baseL,g,n,room)=>{const x=S.cashL+lg(g-1)-baseL-n*lg(g);const y=x>15?x:lg(10**x+1);return Math.max(0,Math.min(room,Math.floor(y/lg(g)+1e-9)))};
const skuAmt=s=>{const room=Math.max(1,Math.min(shelfCap()-FAC,MAXC-L(S.f,s.id))),m=S.ui.mode;return Math.max(1,Math.min(m==='max'?maxAff(s.lam,s.g,L(S.f,s.id),room)||1:m,room))};
/* each copy of a store or shop item costs 8% more than the last (g2) */
const STORE_WAIT=lg(30),SHOP_WAIT=lg(75);
/* priced off the best income you have reached, so a slow minute never makes prices swing */
const incNow=()=>Math.max(isFinite(R.incL)?R.incL:-9,S.pk===undefined?NEG:S.pk,lg(.5));
/* store and shop prices only ever climb:
   - the newest item in an aisle costs at least STORE_WAIT (or SHOP_WAIT) seconds of your best income,
   - and its first copy always costs 50% more than the 25th copy of the item before it
     (except shelf space and bay slots, see below),
   - once something newer unlocks, an item keeps its price (it never drops), so finishing the older
     ones stays the cheaper choice and moving up always costs more. */
const NEXT_UP=lg(1.5),NEXT_UP_S=lg(1.5),FLAT_UP={sh:1,vb:1},SH_WAIT=lg(7.5),SH_UP=lg(1.5);
function bBase(b){const isS=!!AISLE_SPEC[b.g],st=isS?AISLE[b.g]:SHOP[b.g],tj=Math.min(st.length-1,(isS?S.sTop:S.sv.sTop)[b.g]),
    own=incNow()+(isS?STORE_WAIT:SHOP_WAIT),fl=S.bfl||(S.bfl={}),k=(isS?'s.':'v.')+b.id,
    after=p=>bBase(p)+lg(p.g2)*MAXC+(isS?NEXT_UP_S:NEXT_UP);
  /* Store-wide rule: a newer tier's first copy costs at least 50% more than the next copy of the tier before
     it. Checkout, stocking and customer items get there by starting 50% above the old tier's 25th copy.
     Shelf steps are only about 10% bigger than the last, so that would stall the game; instead a new shelf
     step's first copy is 50% above the old step's next copy and rises as you buy more of the old one. Shelf
     steps start from 4s of income (not 30s) to keep the pace. The shop follows the same 50% rule; bay slots carry on from their current price (they are one long row of the same thing).
     Prices never drop. */
  if(FLAT_UP[b.g]){const nextOf=p=>bBase(p)+lg(p.g2)*L(isS?S.b:S.sv.b,p.id)+SH_UP;
    const ch=b.g==='sh'&&b.j>0;const ow=ch?own-SH_WAIT:own;if(b.j>tj)return Math.max(ow,ch?nextOf(st[b.j-1]):NEG);
    const v=b.j===tj?Math.max(ow,ch?nextOf(st[b.j-1]):NEG):ow+lg(b.amt/st[tj].amt);fl[k]=Math.max(fl[k]===undefined?NEG:fl[k],v);return fl[k]}
  if(b.j>tj)return Math.max(own,after(st[b.j-1]));
  if(b.j===tj){const v=Math.max(own,b.j>0?after(st[b.j-1]):NEG);fl[k]=Math.max(fl[k]===undefined?NEG:fl[k],v);return fl[k]}
  if(fl[k]===undefined)fl[k]=own+lg(b.amt/st[tj].amt);
  return fl[k]}
const bPrice=b=>bBase(b);
const bAmt=b=>{const room=Math.max(1,MAXC-L(S.b,b.id)),m=S.ui.mode;return Math.max(1,Math.min(room,m==='max'?maxAff(bPrice(b),b.g2,L(S.b,b.id),room)||1:m))};
const cur=()=>LADDER[S.top];

/* ---------- shop math ---------- */
let SFAC=0;const recountSv=()=>{SFAC=0;for(const k in S.sv.f)SFAC+=S.sv.f[k]};
const capOfS=g=>{let a=0;for(const id in S.sv.b)if(id.slice(0,2)===g&&S.sv.b[id])a+=S.sv.b[id]*STEP[id].amt;return a};
const svSlots=()=>SHOP_SPEC.vb.base+capOfS('vb');
const svTrucks=()=>SHOP_SPEC.vc.base+capOfS('vc');
const svWriters=()=>SHOP_SPEC.vw.base+capOfS('vw');
const svTechs=()=>(SHOP_SPEC.vt.base+capOfS('vt'))*(S.inc&&S.inc.type==='sick'?.6:1);
const svTools=()=>(SHOP_SPEC.ve.base+capOfS('ve'))*(S.inc&&S.inc.type==='lift'?.4:1);
const svCur=()=>SVL[S.sv.top];
const jobAmt=s=>{const room=Math.max(1,svSlots()-SFAC),m=S.ui.mode;return Math.max(1,Math.min(m==='max'?maxAff(s.lam,s.g,L(S.sv.f,s.id),room)||1:m,room))};
const shAmt=b=>{const room=Math.max(1,MAXC-L(S.sv.b,b.id)),m=S.ui.mode;return Math.max(1,Math.min(room,m==='max'?maxAff(bPrice(b),b.g2,L(S.sv.b,b.id),room)||1:m))};
/* the shop job a parts step is waiting on, or -1 */
const gateNeed=k=>{const g=gateOf(LADDER[k]);return g>=0&&(!S.sv.open||S.sv.top<g)?g:-1};
const offCap=()=>12*3600;

/* ---------- simulation ---------- */
const R={incL:NEG,pIncL:NEG,supply:0,dem:0,ck:0,sk:0,moved:0,E:1,line:{},lim:'shelf',sv:{incL:NEG,work:0,dem:0,wr:0,tech:0,tools:0,moved:0,E:1,line:{},lim:'vb'}};
function earnL(v){if(v<=NEG/2||!isFinite(v))return;S.cashL=addL(S.cashL,v);S.st.totalL=addL(S.st.totalL,v)}
function tick(dt,quiet){recount();
  let supply=0;for(const k in S.f){const s=SI[k];if(S.f[k]>0&&onShelf(s))supply+=S.f[k]*s.u*boF(s)}
  const dem=customers()*PER_CUST,ck=checkoutCap(),sk=stockCap(),moved=Math.min(supply,dem,ck,sk),E=supply>0?moved/supply:1;
  let inc=NEG;const line={};const lE=lg(Math.max(E,1e-300));
  const st=S.st,track=dt>0&&!quiet;
  for(const k in S.f){const s=SI[k],n=S.f[k];if(!n||!onShelf(s))continue;const bf=boF(s);if(track){const q=n*s.u*bf*E*dt;st.all+=q;st.sold[s.base]=(st.sold[s.base]||0)+q;st.br[s.b]=(st.br[s.b]||0)+q}const v=lg(n)+s.incL+lE+lg(bf);inc=addL(inc,v);if(!quiet)line[s.line]=addL(line[s.line]===undefined?NEG:line[s.line],v)}
  /* the shop: labor hours of booked work vs trucks coming in, writers, technicians and tools */
  let sInc=NEG;if(S.sv.open){recountSv();let work=0;for(const k in S.sv.f){const n=S.sv.f[k];if(n>0)work+=n*SVI[k].u}
    const sd=svTrucks()*PER_TRUCK,wr=svWriters(),tech=svTechs(),tools=svTools(),sm=Math.min(work,sd,wr,tech,tools),sE=work>0?sm/work:1,slE=lg(Math.max(sE,1e-300));const sl={};
    for(const k in S.sv.f){const n=S.sv.f[k];if(!n)continue;const j=SVI[k],v=lg(n)+j.incL+slE;sInc=addL(sInc,v);if(!quiet)sl[j.line]=addL(sl[j.line]===undefined?NEG:sl[j.line],v)}
    if(track){st.hrs+=sm*dt;st.trucks+=sm/PER_TRUCK*dt}
    if(!quiet)R.sv={incL:sInc,work,dem:sd,wr,tech,tools,moved:sm,E:sE,line:sl,lim:work<=0?'vb':sm>=work-1e-9?'vb':sm>=sd-1e-9?'vc':sm>=wr-1e-9?'vw':sm>=tech-1e-9?'vt':'ve'}}
  R.pIncL=inc;inc=addL(inc,sInc);
  if(dt>0)earnL(inc+lg(dt));unlock(quiet);
  R.incL=inc;if(isFinite(inc)&&inc>(S.pk===undefined?NEG:S.pk))S.pk=inc;
  if(!quiet){S.st.play+=dt;const lim=supply<=0?'shelf':moved>=supply-1e-9?'shelf':moved>=dem-1e-9?'cu':moved>=ck-1e-9?'ck':'sk';
    Object.assign(R,{supply,dem,ck,sk,moved,E,line,lim})}}
function unlock(quiet){while(S.top<NS-1){const s=LADDER[S.top];if(L(S.f,s.id)<needOf(s)||gateNeed(S.top+1)>=0)break;S.top++;const n=LADDER[S.top];
    if(!quiet)note(n.first?`New part unlocked: ${BASE_NAME[n.base]}!`:`Unlocked: ${skuName(n)}.`)}
  for(const g in AISLE){const st=AISLE[g];while(S.sTop[g]<st.length-1&&L(S.b,st[S.sTop[g]].id)>=UNLOCK_N&&(g==='sh'||S.top>=st[S.sTop[g]+1].kb)){S.sTop[g]++;if(!quiet)note(`New in the store: ${st[S.sTop[g]].n}.`)}}
  if(!S.sv.open)return;
  while(S.sv.top<NSV-1){const s=SVL[S.sv.top];if(L(S.sv.f,s.id)<svNeed(s))break;S.sv.top++;const n=SVL[S.sv.top];
    if(!quiet)note(n.first?`New job in the shop: ${JOB_NAME[n.job]}!`:`Shop unlocked: ${svName(n)}.`)}
  for(const g in SHOP){const st=SHOP[g];while(S.sv.sTop[g]<st.length-1&&L(S.sv.b,st[S.sv.sTop[g]].id)>=UNLOCK_N&&(g==='vb'||S.sv.top>=st[S.sv.sTop[g]+1].kb)){S.sv.sTop[g]++;if(!quiet)note(`New for the shop: ${st[S.sv.sTop[g]].n}.`)}}}

/* ---------- buying ---------- */
function buySku(s,k){if(s.k>S.top||FAC+k>shelfCap()||L(S.f,s.id)+k>MAXC)return false;const c=costL(s.lam,s.g,L(S.f,s.id),k);if(!canPay(c))return false;S.cashL=subL(S.cashL,c);S.f[s.id]=L(S.f,s.id)+k;FAC+=k;return true}
function openShop(){if(S.sv.open||S.top<SV_OPEN_K||!canPay(SV_OPEN_L))return false;S.cashL=subL(S.cashL,SV_OPEN_L);S.sv.open=true;return true}
function buyJob(s,k){recountSv();if(!S.sv.open||s.k>S.sv.top||SFAC+k>svSlots())return false;const c=costL(s.lam,s.g,L(S.sv.f,s.id),k);if(!canPay(c))return false;S.cashL=subL(S.cashL,c);S.sv.f[s.id]=L(S.sv.f,s.id)+k;SFAC+=k;return true}
function buyShop(b,k){if(!S.sv.open||b.j>S.sv.sTop[b.g]||L(S.sv.b,b.id)+k>MAXC)return false;const c=costL(bPrice(b),b.g2,L(S.sv.b,b.id),k);if(!canPay(c))return false;S.cashL=subL(S.cashL,c);S.sv.b[b.id]=L(S.sv.b,b.id)+k;return true}
function buyBld(b,k){if(b.j>S.sTop[b.g]||L(S.b,b.id)+k>MAXC)return false;const c=costL(bPrice(b),b.g2,L(S.b,b.id),k);if(!canPay(c))return false;S.cashL=subL(S.cashL,c);S.b[b.id]=L(S.b,b.id)+k;return true}

/* ---------- incidents: they clear on their own, tapping clears them sooner ---------- */
function events(){const t=now();
  if(S.inc&&t>S.inc.end){const i=S.inc;S.inc=null;S.st.incidents++;
    if(i.type==='thief'){const lossL=Math.min(S.cashL-2,R.incL+lg(15));S.cashL=subL(S.cashL,lossL);note(`A shoplifter got away with ${moneyL(lossL)} worth of parts.`)}
    if(i.type==='comeback'){const lossL=Math.min(S.cashL-2,R.sv.incL+lg(30));S.cashL=subL(S.cashL,lossL);note(`The comeback was redone for free. It cost ${moneyL(lossL)}.`)}
    S.nextInc=t+3e5+Math.random()*3e5}
  if(!S.inc&&t>S.nextInc&&S.st.play>300&&FAC>0){const r=Math.random(),ls=[...new Set(LADDER.slice(0,S.top+1).map(s=>s.line))];
    if(S.sv.open&&SFAC>0&&Math.random()<.4){const q=Math.random();if(q<.4)S.inc={type:'lift',end:t+9e4};else if(q<.7)S.inc={type:'sick',end:t+6e4};else S.inc={type:'comeback',end:t+3e4};return}
    if(r<.3)S.inc={type:'spill',end:t+9e4};else if(r<.5)S.inc={type:'thief',end:t+2e4};else if(r<.75)S.inc={type:'jam',end:t+6e4};else if(ls.length>1)S.inc={type:'back',line:pick(ls),end:t+6e4};else S.inc={type:'spill',end:t+9e4}}}
function fixInc(){const i=S.inc;if(!i||i.type==='back'||i.type==='sick')return;S.inc=null;S.st.incidents++;if(i.type==='thief')S.st.shop++;S.nextInc=now()+3e5+Math.random()*3e5}
function away(sec){sec=Math.min(sec,offCap());const c0=S.cashL,n=Math.min(2000,Math.ceil(sec)),h=sec/n;for(let i=0;i<n;i++)tick(h,true);tick(1e-6,false);
  if(sec>60&&S.cashL>c0+1e-9)note(`Away ${fmtT(sec)}. The ${S.sv.open?'store and shop':'store'} made ${moneyL(subL(S.cashL,c0))}.`)}
function checkGoals(){for(const a of A)if(!S.ach[a.id]&&a.ok()){S.ach[a.id]=1;note('Goal reached: '+a.n)}
  for(const [id,c] of LOG)if(!S.log[id]&&c()){S.log[id]=now();if(id!=='l0')note('New logbook entry.')}}

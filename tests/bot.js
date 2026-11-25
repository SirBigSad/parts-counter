/* Parts Counter playthrough bot.
   Loads the real game logic (data.js, sdata.js, game.js) and plays a whole game on fast-forward like a
   sensible player: fix whatever link is holding the store back, otherwise climb the parts list, open the
   shop when it can. It fails (exit code 1) if the economy ever misbehaves:
     - money or income turns into NaN / Infinity
     - a store or shop price goes DOWN (the bug from November 2026)
     - a newly unlocked item starts cheaper than the 25th copy of the one before it
     - income falls to zero after the store is running
     - the player is stuck waiting too long for anything useful to buy
     - the game can't be finished
   Run: node tests/bot.js            (prints the pace report)
        node tests/bot.js --json     (machine readable)                                           */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..','src');
const PACE=require('./pace.json');
let clock=Date.parse('2026-01-05T12:00:00Z');
const ctx={console,Math,JSON,Date:class extends Date{constructor(...a){super(...(a.length?a:[clock]))}static now(){return clock}},
  localStorage:{getItem:()=>null,setItem(){},removeItem(){}},note(){},moneyL:()=>'',fmtT:()=>'',isFinite,parseFloat,Object,Array,Set,Map,String,Number,Infinity,NaN};
vm.createContext(ctx);
const src=['data.js','sdata.js','game.js'].map(f=>fs.readFileSync(path.join(ROOT,f),'utf8')).join('\n;\n');
vm.runInContext(src+`
;var __api={get S(){return S},R,LADDER,AISLE,SHOP,STEP,SI,SVL,SVI,NS,NSV,RANKS,MAXC,tick,unlock,buySku,buyBld,buyShop,buyJob,openShop,
 skuAmt,bPrice,costL,canPay,shelfCap,customers,checkoutCap,stockCap,svSlots,needOf,gateNeed,SV_OPEN_K,SV_OPEN_L,lg,get FAC(){return FAC},get SFAC(){return SFAC},recountSv,recount,
 PER_CUST,FLAT_UP,rankOf:L=>RANKS.filter(r=>L>=r[0]).pop()};`,ctx);
const G=ctx.__api,S=()=>G.S;
const fail=[];const err=m=>{if(fail.length<40)fail.push(`[${hms(t)}] ${m}`)};
const fmtL=l=>l<300?(10**l).toPrecision(4):'1e'+l.toFixed(1);
const hms=s=>{s=Math.round(s);const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}h${String(m).padStart(2,'0')}m`:`${m}m${String(s%60).padStart(2,'0')}s`};
let t=0;const maxT=(+process.env.BOT_HOURS||PACE.maxHours)*3600;
const lastPrice={};const milestones=[];let longestWait=0,waitAt=0,lastRank='',zeroInc=0;
const mark=(name)=>{milestones.push({name,t});
  if(process.env.DUMP_SAVES&&/Parts manager$|Service shop opens|Owner$/.test(name)){fs.mkdirSync(path.join(__dirname,'saves'),{recursive:true});fs.writeFileSync(path.join(__dirname,'saves',`v${S().v}-${name.replace(/^Rank: /,'').toLowerCase().replace(/[^a-z]+/g,'-')}.json`),JSON.stringify(S()))}};

/* every store/shop item price may only ever go up */
function checkPrices(){const st=S();
  for(const g in G.AISLE){const a=G.AISLE[g];for(let j=0;j<=Math.min(a.length-1,st.sTop[g]+1);j++){const b=a[j],p=G.bPrice(b),k='s'+b.id;
    if(!isFinite(p))err(`price of ${b.n} is ${p}`);
    /* store-wide: a newer tier's first copy costs at least 50% more than the next copy of the tier before it */
    if(j>0&&j<=st.sTop[g]&&!(st.b[b.id]>0)){const pv=a[j-1],nx=G.bPrice(pv)+Math.log10(pv.g2)*(st.b[pv.id]||0);if(p<nx+Math.log10(1.5)-1e-6)err(`${b.n} first copy ${fmtL(p)} is less than 1.5x the next ${pv.n} (${fmtL(nx)})`)}
    if(j<=st.sTop[g]&&lastPrice[k]!==undefined&&p<lastPrice[k]-1e-9)err(`price of ${b.n} dropped from ${fmtL(lastPrice[k])} to ${fmtL(p)}`);if(j<=st.sTop[g])lastPrice[k]=Math.max(p,lastPrice[k]??-1e9);
    if(j>0&&!G.FLAT_UP[g]){const prev=a[j-1],last=G.costL(G.bPrice(prev),prev.g2,G.MAXC-1,1);if(p<last-1e-9)err(`${b.n} (1st copy) is cheaper than the 25th ${prev.n}`)}}}
  if(st.sv.open)for(const g in G.SHOP){const a=G.SHOP[g];for(let j=0;j<=Math.min(a.length-1,st.sv.sTop[g]+1);j++){const b=a[j],p=G.bPrice(b),k='v'+b.id;
    if(j<=st.sv.sTop[g]&&lastPrice[k]!==undefined&&p<lastPrice[k]-1e-9)err(`shop price of ${b.n} dropped from ${fmtL(lastPrice[k])} to ${fmtL(p)} (step ${j}, top ${st.sv.sTop[g]})`);if(j<=st.sv.sTop[g])lastPrice[k]=Math.max(p,lastPrice[k]??-1e9)}}}

/* what a sensible player buys next: the link holding the store back, else the next part, else shelf space */
function newest(aisle,g){const st=S();const tops=aisle===G.AISLE?st.sTop:st.sv.sTop;const a=aisle[g];
  /* cheapest per unit among unlocked, not full */
  let best=null,bv=-1e9;for(let j=0;j<=tops[g];j++){const b=a[j],own=(aisle===G.AISLE?st.b:st.sv.b)[b.id]||0;if(own>=G.MAXC)continue;
    const c=G.costL(G.bPrice(b),b.g2,own,1),v=Math.log10(b.amt)-c;if(v>bv){bv=v;best=b}}return best}
function wants(){const st=S(),R=G.R,out=[];G.tick(1e-6,false);
  const lim=R.lim,cur=G.LADDER[st.top];
  const shelfFull=G.FAC>=G.shelfCap();
  const order=[];
  if(lim==='cu')order.push(['bld','cu']);if(lim==='ck')order.push(['bld','ck']);if(lim==='sk')order.push(['bld','sk']);
  if(shelfFull)order.push(['bld','sh']);
  /* keep every link at least 1.3x ahead of the shelves, like the Store tab asks */
  const sup=R.supply;for(const [g,v] of [['cu',R.dem],['ck',R.ck],['sk',R.sk]])if(v<sup*1.3)order.push(['bld',g]);
  if(!st.sv.open&&st.top>=G.SV_OPEN_K)order.push(['open']);
  const gate=G.gateNeed(st.top+1);
  if(st.sv.open){G.recountSv();const sv=G.R.sv;const vl={vb:'vb',vc:'vc',vw:'vw',vt:'vt',ve:'ve'}[sv.lim];
    if(gate>=0||st.sv.top<st.top/ (G.NS/G.NSV) ){const j=G.SVL[st.sv.top];if(G.SFAC<G.svSlots())order.push(['job',j]);else order.push(['shop','vb'])}
    if(vl&&vl!=='vb')order.push(['shop',vl])}
  order.push(['sku',cur]);
  if(st.sv.open)order.push(['job',G.SVL[st.sv.top]]);
  return order}
function tryBuy(o){const st=S();
  if(o[0]==='sku'){const s=o[1];if((st.f[s.id]||0)>=G.MAXC)return false;if(G.FAC>=G.shelfCap())return false;return G.buySku(s,1)}
  if(o[0]==='bld'){const b=newest(G.AISLE,o[1]);return b?G.buyBld(b,1):false}
  if(o[0]==='shop'){const b=newest(G.SHOP,o[1]);return b?G.buyShop(b,1):false}
  if(o[0]==='job'){const s=o[1];if((st.sv.f[s.id]||0)>=G.MAXC)return false;return G.buyJob(s,1)}
  if(o[0]==='open')return G.openShop();return false}
function costOf(o){const st=S();
  if(o[0]==='sku')return G.costL(o[1].lam,o[1].g,st.f[o[1].id]||0,1);
  if(o[0]==='bld'){const b=newest(G.AISLE,o[1]);return b?G.costL(G.bPrice(b),b.g2,st.b[b.id]||0,1):Infinity}
  if(o[0]==='shop'){const b=newest(G.SHOP,o[1]);return b?G.costL(G.bPrice(b),b.g2,st.sv.b[b.id]||0,1):Infinity}
  if(o[0]==='job')return G.costL(o[1].lam,o[1].g,st.sv.f[o[1].id]||0,1);
  if(o[0]==='open')return G.SV_OPEN_L;return Infinity}

/* play */
mark('start');let bought=0,stepsNoBuy=0,lastTop=-1,lastPct=0;
while(t<maxT){const st=S();
  /* spend: keep buying the top wish while possible (a few per tick, like a player tapping) */
  let n=0,first=null;for(let rep=0;rep<40;rep++){const order=wants();let did=false;for(const o of order){if(tryBuy(o)){did=true;bought++;n++;break}}
    if(!did){first=order[0];break}}
  /* advance the clock: one second while buying, else jump to when the top wish is affordable (max 30s) */
  G.tick(1e-6,false);const inc=G.R.incL;let dt=1;
  if(!n&&first){const c=costOf(first),gap=c-st.cashL;dt=gap>0&&isFinite(inc)&&inc>-50?Math.min(30,Math.max(1,10**(Math.log10(Math.max(1e-300,10**(Math.min(300,c-inc))-10**(Math.min(300,st.cashL-inc))))))):1;
    if(!isFinite(dt))dt=30}
  /* wait tracking: time since the last purchase */
  if(n){if(t-waitAt>longestWait){longestWait=t-waitAt;}waitAt=t}
  clock+=dt*1000;t+=dt;G.tick(dt,false);
  if(!isFinite(st.cashL)&&st.cashL!==-1e9)err('cash is '+st.cashL);
  if(!isFinite(G.R.incL)&&bought>3){if(++zeroInc>30)err('income has been zero for 30 steps')}else zeroInc=0;
  if(t%60<dt)checkPrices();
  const rk=G.rankOf(st.st.totalL)[1];if(rk!==lastRank){lastRank=rk;mark('Rank: '+rk)}
  if(st.sv.open&&!milestones.find(m=>m.name==='Service shop opens'))mark('Service shop opens');
  const pct=Math.floor(st.top/(G.NS-1)*10)*10;if(pct>lastPct){lastPct=pct;mark(`Parts list ${pct}%`)}
  if(st.top>=G.NS-1){mark('Finished the parts list');break}
  if(PACE.stopAt&&milestones.find(m=>m.name===PACE.stopAt))break;
  if(t-waitAt>PACE.maxWaitMin*60){err(`stuck: nothing bought for ${PACE.maxWaitMin} minutes (top wish: ${first&&first[0]} ${first&&first[1]&&(first[1].n||first[1].id||first[1])})`);break}}
if(!milestones.find(m=>m.name===(PACE.stopAt||'Finished the parts list')))err(`didn't reach "${PACE.stopAt}" within ${PACE.maxHours} hours (reached step ${S().top} of ${G.NS-1})`);

/* pace check against pace.json */
const report=[];for(const [name,[lo,hi]] of Object.entries(PACE.targets)){const m=milestones.find(x=>x.name===name);
  if(!m){report.push(`  ${name.padEnd(36)} never reached   (target ${lo}–${hi} min)`);err(`pace: never reached "${name}"`);continue}
  const mi=m.t/60,ok=mi>=lo&&mi<=hi;report.push(`  ${name.padEnd(36)} ${hms(m.t).padStart(9)}   target ${lo}–${hi} min ${ok?'ok':'OFF PACE'}`);if(!ok&&PACE.strict)err(`pace: "${name}" at ${mi.toFixed(1)} min, target ${lo}–${hi}`)}
if(process.argv.includes('--json'))fs.writeFileSync(process.argv[process.argv.indexOf('--json')+1]||'bot.json',JSON.stringify({milestones,longestWait,fail,step:S().top},null,1));
else{console.log('Parts Counter bot playthrough\n');for(const m of milestones)console.log('  '+hms(m.t).padStart(9)+'  '+m.name);
  console.log(`\nPurchases: ${bought}   Longest wait between purchases: ${hms(longestWait)}\n\nPace targets:\n`+report.join('\n'));
  console.log(fail.length?'\nFAILED:\n'+fail.join('\n'):'\nAll checks passed.')}
process.exit(fail.length?1:0);

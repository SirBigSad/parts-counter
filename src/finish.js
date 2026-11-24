/* ---------- the ending, rotating headlines, and the report-a-problem button ---------- */
const BUILD='2026-11-24';

/* ===== the ending: being promoted to Owner is the finish line. You can keep playing afterwards
   (the parts list, catalog, plaques and higher titles keep going), and watch the ending again from More. ===== */
const END_AT=(RANKS.find(r=>r[1]==='Owner')||[450])[0];
function endingHTML(){const st=S.st,days=Math.max(1,Math.round((Date.now()-(st.start||Date.now()))/864e5));
  const plq=typeof PLAQ!=='undefined'?PLAQ.filter(p=>{try{return p[2]()}catch(e){return false}}).length:0;
  const row=(a,b)=>`<span>${a}</span><span>${b}</span>`;
  return `<div class="endc"><small>Fremont Truck &amp; Parts</small><h3>You own the place.</h3>
  <p>You started behind the counter with one oil filter on the shelf. Now your name is on the sign out front.</p>
  <div class="kv">${row('Time at the counter',fmtT(st.play||0))}${row('Days since you started',days)}${row('Parts sold',fmt(st.all||0))}
  ${row('Products on the list',`${S.top+1} of ${NS}`)}${row('Trucks through the shop',fmt(st.trucks||0))}${row('Problems handled',fmt(st.incidents||0))}${row('Plaques on the wall',plq)}</div>
  <div class="cred"><b>Thanks for playing Parts Counter</b><span>Designed by you, built with Claude</span><span>Every part, price and person here is made up</span></div>
  <p class="sub">The parts list keeps going, and so do the titles. Keep playing as long as you like.</p>
  <button class="btn pri" id="endOk" style="width:100%">Back to the counter</button></div>`}
function showEnding(){let o=$('ending');if(!o){o=document.createElement('div');o.id='ending';document.body.appendChild(o);
    o.addEventListener('click',e=>{if(e.target.id==='endOk'||e.target===o){o.hidden=true}})}
  o.innerHTML=endingHTML();o.hidden=false;if(typeof feel==='function')feel('big');
  if(typeof confetti==='function')try{confetti()}catch(e){}}
(function(){const css=document.createElement('style');css.textContent=`#ending{position:fixed;inset:0;z-index:90;display:grid;place-items:center;background:rgba(8,10,20,.72);padding:16px;overflow:auto}#ending[hidden]{display:none}
.endc{background:var(--card);color:var(--ink);border-radius:22px;padding:22px;width:min(380px,100%);box-shadow:0 20px 60px rgba(0,0,0,.4);text-align:left}
.endc small{color:var(--mute);text-transform:uppercase;letter-spacing:.08em;font-size:12px}.endc h3{font-size:30px;margin:4px 0 8px}.endc>p{margin:0 0 12px;font-size:15px}
.endc .kv{margin:0 0 14px}.endc .cred{display:flex;flex-direction:column;gap:2px;text-align:center;padding:12px;border-radius:12px;background:var(--soft);margin:0 0 12px;font-size:13px;color:var(--mute)}.endc .cred b{color:var(--ink);font-size:15px}`;document.head.appendChild(css);
  setInterval(()=>{if(!S.ended&&S.st.totalL>=END_AT){S.ended=Date.now();save();showEnding()}},2000);
  /* More > Stats gets a way to watch it again once you've earned it */
  const st=$('stats');if(st){const b=document.createElement('button');b.className='btn';b.id='endAgain';b.textContent='Watch the ending again';b.style.marginTop='10px';
    st.after(b);b.addEventListener('click',e=>{e.stopPropagation();showEnding()});const upd=()=>{b.hidden=!S.ended};upd();setInterval(upd,3000)}})();

/* ===== rotating content: headlines that follow the calendar and a brand of the week.
   Cosmetic only: nothing here changes prices, income or anything you can buy. ===== */
function weekNo(d=new Date()){const t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const day=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-day);return Math.ceil(((t-Date.UTC(t.getUTCFullYear(),0,1))/864e5+1)/7)+t.getUTCFullYear()*53}
function brandOfWeek(){return BRANDS.length?BRANDS[weekNo()%BRANDS.length]:null}
function seasonal(){const d=new Date(),m=d.getMonth()+1,day=d.getDate(),st=typeof storeName==='function'?storeName():'the store',o=[];
  const between=(m1,d1,m2,d2)=>{const v=m*100+day;return v>=m1*100+d1&&v<=m2*100+d2};
  if(between(12,26,12,31)||between(1,1,1,7))o.push('New year, same blinker fluid question',`${st} resolves to finally organize the back room`,'Truckers report holiday weight gain "mostly in the cab"');
  if(between(2,7,2,14))o.push(`Valentine's rush: man buys wife a set of wiper blades, says "she'll love it"`,'Roses are red, coolant is too');
  if(between(3,10,3,31))o.push('Spring pothole season opens to record crowds','Front-end parts flying off the shelves as roads crumble');
  if(between(5,20,5,31))o.push('Long weekend ahead: everyone needs their truck fixed by Friday');
  if(between(6,28,7,6))o.push('Fireworks sold out; tie-down straps somehow also sold out','Fourth of July: parade float breaks down, parts run saves the day');
  if(between(8,15,9,10))o.push('Back to school: buses lining up for brakes','School bus fleet manager spotted buying every air filter in town');
  if(between(10,20,10,31))o.push(`Spooky: customer brings in the part number AND the old part`,'Haunted truck makes noise only when parked at the shop');
  if(between(11,20,11,30))o.push('Thanksgiving: counter staff thankful for exactly one quiet hour','Turkey fryer accident blamed on "bad propane regulator"');
  if(between(12,1,12,25))o.push('Holiday rush: everyone needs chains, nobody needs them until today',`${st} decorates the parts counter with brake rotors and tinsel`);
  if(m===12||m<=2)o.push('Cold snap: block heaters and batteries in short supply','Diesel gels at 10 below; fuel filter sales follow');
  if(m>=6&&m<=8)o.push('Heat wave: A/C compressors and coolant moving fast','Summer road trips bring the RVs, and the RV questions');
  const b=brandOfWeek();if(b)o.push(`Brand of the week: ${b.n}. The rep left free pens at the counter`,`${b.n} week at the counter: everyone's suddenly an expert`);
  return o}
(function(){if(typeof headline!=='function')return;const base=headline;headline=function(){const s=seasonal();return s.length&&Math.random()<.3?s[Math.floor(Math.random()*s.length)]:base()}})();

/* ===== report a problem: puts everything needed to reproduce a bug into one block you can paste or share ===== */
(function(){const sec=$('t-more');if(!sec)return;const set=[...sec.querySelectorAll(':scope > details.fold')].find(d=>d.firstElementChild&&d.firstElementChild.textContent==='Save');
  const d=document.createElement('details');d.className='fold';d.innerHTML=`<summary>Report a problem</summary><div class="card">
   <p class="sub" style="margin:0 0 8px">Something look wrong? Say what happened. The report includes your save, so the problem can be played back exactly as you saw it.</p>
   <textarea id="rpNote" placeholder="What happened? (for example: the price of brass bells dropped after I bought 10)"></textarea>
   <div class="row" style="gap:8px;margin-top:8px"><button class="btn pri" id="rpCopy">Copy report</button><button class="btn" id="rpShare">Share report</button></div>
   <p class="sub" id="rpStat" style="margin:8px 0 0">Game version ${BUILD} · save version ${VERSION}</p></div>`;
  if(set)set.before(d);else sec.appendChild(d);
  const build=()=>{if(typeof save==='function')save();const code=btoa(unescape(encodeURIComponent(JSON.stringify(S))));
    return ['Parts Counter problem report','What happened: '+($('rpNote').value.trim()||'(not filled in)'),`Version ${BUILD} (save ${VERSION})`,`Look: ${S.ui.skin||'classic'}  Appearance: ${S.ui.theme}`,
      `Played ${fmtT(S.st.play||0)} · ${rankOf(S.st.totalL)} · step ${S.top+1} of ${NS} · shop ${S.sv.open?'open':'closed'}`,`Screen ${innerWidth}x${innerHeight} @${devicePixelRatio}x · ${navigator.userAgent}`,'Save code:',code].join('\n')};
  d.addEventListener('click',async e=>{const id=e.target.id;if(id!=='rpCopy'&&id!=='rpShare')return;e.stopPropagation();const txt=build();
    if(id==='rpShare'&&navigator.share){try{await navigator.share({title:'Parts Counter problem report',text:txt});$('rpStat').textContent='Shared.';return}catch(er){}}
    try{await navigator.clipboard.writeText(txt);$('rpStat').textContent='Report copied. Paste it wherever you want to send it.'}catch(er){$('rpNote').value=txt;$('rpNote').select();$('rpStat').textContent='Copy the report from the box above.'}},true)})();

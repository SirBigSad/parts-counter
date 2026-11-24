/* ===== Parts Counter Idle: cross save. Two ways to move a save between phone and computer:
   1) Cloud save through a private GitHub gist, synced automatically while you play.
   2) A transfer code you copy on one device and paste on the other. ===== */
const fmtTime=t=>t>=3600?(t/3600).toFixed(1)+' h':Math.round(t/60)+' min';
const SYNC_KEY='parts-counter-sync',GIST_FILE='parts-counter-save.json',GIST_DESC='Parts Counter cloud save';
let SY={token:'',gist:'',on:false,last:0,status:''};
try{Object.assign(SY,JSON.parse(localStorage.getItem(SYNC_KEY)||'{}'))}catch(e){}
const sySave=()=>{try{localStorage.setItem(SYNC_KEY,JSON.stringify(SY))}catch(e){}};
function syStatus(t){SY.status=t;sySave();const el=$('syStat');if(el)el.textContent=t}
async function gh(path,opt={}){const r=await fetch('https://api.github.com'+path,Object.assign({},opt,{headers:{Authorization:'Bearer '+SY.token,Accept:'application/vnd.github+json','Content-Type':'application/json'}}));
  if(!r.ok)throw new Error(r.status===401?'That token was not accepted. Check it and try again.':r.status===403||r.status===404?'The token needs the Gists permission.':`GitHub said ${r.status}.`);return r.status===204?null:r.json()}
async function gistRead(){const g=await gh('/gists/'+SY.gist),f=g.files&&g.files[GIST_FILE];if(!f)return null;
  const txt=f.truncated?await (await fetch(f.raw_url)).text():f.content;try{return JSON.parse(txt)}catch(e){return null}}
async function gistWrite(){save();await gh('/gists/'+SY.gist,{method:'PATCH',body:JSON.stringify({files:{[GIST_FILE]:{content:JSON.stringify(S)}}})});SY.last=S.t;sySave()}
/* find this player's save gist, or make one */
async function gistFind(){for(let p=1;p<=5;p++){const list=await gh(`/gists?per_page=100&page=${p}`);const hit=list.find(g=>g.description===GIST_DESC&&g.files[GIST_FILE]);if(hit)return hit.id;if(list.length<100)break}
  save();const g=await gh('/gists',{method:'POST',body:JSON.stringify({description:GIST_DESC,public:false,files:{[GIST_FILE]:{content:JSON.stringify(S)}}})});return g.id}
/* the save with more time played wins. Play time only grows while the game is open and moves with
   the save, so it tells which copy is further along even if a device saved again without playing */
const playOf=d=>(d&&d.st&&d.st.play)||0;
/* a reset or a loaded save gets a new restart stamp (rid). The newest restart wins over play time,
   so a fresh start is never replaced by the old save still sitting in the cloud */
async function syPull(ask){const cloud=await gistRead();if(!cloud||!cloud.v)return false;
  const rc=cloud.rid||0,rl=S.rid||0;if(rc<rl)return false;
  if(rc>rl||playOf(cloud)>playOf(S)+5){
    /* never reload twice in a row: if a cloud load just happened and this device still looks behind, stop and push instead */
    let last=0;try{last=+sessionStorage.getItem('pc-sync-reload')||0}catch(e){}if(Date.now()-last<60000)return false;
    try{sessionStorage.setItem('pc-sync-reload',Date.now())}catch(e){}
    switchTo(cloud);syStatus(`Loaded your cloud save (${fmtTime(playOf(cloud))} played).`);return true}return false}
function switchTo(d){SAVE_LOCK=true;localStorage.setItem(KEY,JSON.stringify(d));location.reload()}
let syBusy=false;
async function syncNow(manual){if(!SY.on||!SY.token||!SY.gist||syBusy||!navigator.onLine)return;syBusy=true;
  try{if(await syPull(false))return;await gistWrite();syStatus('Synced '+new Date().toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}))}
  catch(e){syStatus(manual?e.message:'Offline, will sync later')}finally{syBusy=false}}
async function syConnect(){const t=$('syTok').value.trim();if(!t){syStatus('Paste a GitHub token first.');return}SY.token=t;syStatus('Connecting…');
  try{SY.gist=await gistFind();SY.on=true;sySave();if(!(await syPull(true))){await gistWrite();syStatus('Connected. This save is now in the cloud.')}renderSync()}
  catch(e){SY.on=false;syStatus(e.message);renderSync()}}
function syOff(){SY={token:'',gist:'',on:false,last:0,status:'Cloud save is off on this device.'};sySave();renderSync()}

/* transfer code: the whole save squeezed into one line of text */
const toCode=()=>{save();return 'PC1:'+btoa(unescape(encodeURIComponent(JSON.stringify(S))))};
function fromCode(c){c=(c||'').trim();if(!c.startsWith('PC1:'))throw new Error('That is not a Parts Counter save code.');const d=JSON.parse(decodeURIComponent(escape(atob(c.slice(4)))));if(!d||!d.v)throw new Error('That save code looks damaged.');return d}
function renderSync(){if(!$('syBox'))return;$('syOnRow').hidden=!SY.on;$('syOffRow').hidden=SY.on;$('syStat').textContent=SY.status||(SY.on?'Cloud save is on.':'Cloud save is off on this device.')}

document.addEventListener('click',async e=>{const id=e.target.closest('button')&&e.target.closest('button').id;if(!id)return;
  if(id==='syGo')syConnect();else if(id==='syNow')syncNow(true);else if(id==='syStop')syOff();
  else if(id==='syCopy'){const c=toCode();$('syCode').value=c;try{await navigator.clipboard.writeText(c);note('Save code copied. Paste it into the game on your other device.')}catch(_){$('syCode').select();note('Save code is in the box. Copy it from there.')}}
  else if(id==='syFile'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([toCode()],{type:'text/plain'}));a.download='parts-counter-save.txt';a.click()}
  else if(id==='syLoad'){const b=$('syLoad');try{const d=fromCode($('syCode').value);if(!b.dataset.arm){b.dataset.arm=1;b.textContent=`Tap again to replace this game (${fmtTime(playOf(d))} played)`;setTimeout(()=>{delete b.dataset.arm;b.textContent='Load this save'},6000);return}d.rid=Date.now();switchTo(d)}catch(err){note(err.message)}}});
document.addEventListener('change',e=>{if(e.target.id==='syPick'&&e.target.files[0]){e.target.files[0].text().then(t=>{$('syCode').value=t.trim();note('Save file read. Tap Load this save to use it.')})}});

/* check the cloud when the game opens, then every minute, and when you switch away */
renderSync();
if(SY.on)setTimeout(()=>syncNow(false),1500);
setInterval(()=>{if(!document.hidden)syncNow(false)},60000);
document.addEventListener('visibilitychange',()=>{if(document.hidden)syncNow(false);else if(SY.on)syPull(true).catch(()=>{})});
addEventListener('online',()=>syncNow(false));

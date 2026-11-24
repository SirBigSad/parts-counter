/* ---------- save backups: a copy of your game every 30 minutes (the last 6 are kept), plus one right before
   a reset, a loaded save code or a cloud save replaces it. Restore any of them from More > Save. ---------- */
const BK_KEY=KEY+'.backups',BK_MAX=6,BK_EVERY=30*60*1000;
const bkList=()=>{try{const a=JSON.parse(localStorage.getItem(BK_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}};
function backupNow(why,force){try{const list=bkList(),last=list[0];if(!force&&last&&Date.now()-last.t<BK_EVERY)return;
    if(typeof save==='function')save();const d=localStorage.getItem(KEY)||JSON.stringify(S);
    list.unshift({t:Date.now(),why,play:S.st.play||0,rank:rankOf(S.st.totalL),d});
    while(list.length>BK_MAX)list.pop();
    /* never let backups fill the phone's storage: drop the oldest until it fits */
    for(;;){try{localStorage.setItem(BK_KEY,JSON.stringify(list));break}catch(e){if(list.length<=1)break;list.pop()}}
    bkDraw()}catch(e){}}
function bkDraw(){const box=$('bkList');if(!box)return;const list=bkList();
  box.innerHTML=list.length?list.map((b,i)=>`<div class="bk"><div><b>${new Date(b.t).toLocaleString([], {weekday:'short',hour:'numeric',minute:'2-digit'})}</b><small>${esc(b.why)} · ${fmtT(b.play)} played · ${esc(b.rank)}</small></div><button class="btn" data-bk="${i}">Restore</button></div>`).join('')
    :'<p class="sub" style="margin:0">The first backup is made a few minutes after you start playing.</p>'}
(function(){const save0=$('copy');if(!save0)return;const card=save0.closest('.card');
  const css=document.createElement('style');css.textContent='.bk{display:flex;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}.bk>div{flex:1;min-width:0}.bk b{display:block;font-size:14px}.bk small{display:block;color:var(--mute);font-size:12.5px}';document.head.appendChild(css);
  const w=document.createElement('div');w.innerHTML='<h3 class="bn" style="font-size:16px;margin:16px 0 4px">Backups</h3><p class="sub" style="margin:0 0 6px">A copy every 30 minutes, and one before any reset or load. Restoring one keeps a backup of your game now, so you can always undo.</p><div id="bkList"></div>';card.appendChild(w);
  card.addEventListener('click',e=>{const b=e.target.closest('[data-bk]');if(!b)return;e.stopPropagation();
    arm(b,()=>{const it=bkList()[+b.dataset.bk];if(!it)return;try{const d=JSON.parse(it.d);d.rid=Date.now();switchTo(d)}catch(er){note("That backup couldn't be read.")}})},true);
  bkDraw();
  /* a resumed game gets a first backup after five minutes, then every 30 */
  setTimeout(()=>backupNow('Automatic'),5*60*1000);setInterval(()=>backupNow('Automatic'),60*1000);
  /* cloud save and transfer codes swap the whole game: keep a copy first */
  if(typeof switchTo==='function'){const sw=switchTo;switchTo=function(d){backupNow('Before loading another save',true);sw(d)}}})();

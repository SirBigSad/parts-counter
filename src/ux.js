/* ===== Parts Counter Idle: getting around. Tap the picture or the header to jump, full-screen view,
   tidy More tab, hide locked items, text size and color-blind options, start screen and a short guided start. ===== */

/* ---------- jumping to the right place ---------- */
function goTab(t){const b=document.querySelector(`[data-tab="${t}"]`);if(b)b.click()}
function flashEl(el){if(!el)return;el.scrollIntoView({behavior:S.ui.anim?'smooth':'auto',block:'center'});el.classList.remove('jumpflash');void el.offsetWidth;el.classList.add('jumpflash')}
function jumpTo(k){if(k==='service'){goTab('service');setTimeout(()=>flashEl(document.querySelector('#t-service .card')),80);return}
  if(k==='svlock'){note('The service shop opens a little further up the parts list.');return}
  const sv=k[0]==='v';goTab(sv?'shop':'store');setTimeout(()=>flashEl($('cap-'+k)),80);buzz(6)}
document.addEventListener('click',e=>{const d=e.target.closest('[data-jump]');if(d)jumpTo(d.dataset.jump)});
document.addEventListener('keydown',e=>{const d=e.target.closest&&e.target.closest('[data-jump]');if(d&&(e.key==='Enter'||e.key===' ')){e.preventDefault();jumpTo(d.dataset.jump)}});

/* ---------- full-screen store picture ---------- */
{const st=$('stage'),b=document.createElement('button');b.className='fsb';b.setAttribute('aria-label','Full-screen store view');
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';st.appendChild(b);
  const set=on=>{st.classList.toggle('full',on);document.body.classList.toggle('fsopen',on);b.setAttribute('aria-label',on?'Close full-screen view':'Full-screen store view');
    b.innerHTML=on?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>'};
  b.addEventListener('click',e=>{e.stopPropagation();set(!st.classList.contains('full'))});
  /* fold the picture down to a slim strip, remembered between visits */
  const f=document.createElement('button');f.className='fold';f.setAttribute('aria-label','Make the store picture smaller');f.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>';st.appendChild(f);
  const fs=on=>{st.classList.toggle('small',on);f.setAttribute('aria-label',on?'Make the store picture bigger':'Make the store picture smaller')};fs(!!S.ui.picSmall);
  f.addEventListener('click',e=>{e.stopPropagation();S.ui.picSmall=!S.ui.picSmall;fs(S.ui.picSmall);save()});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&st.classList.contains('full'))set(false)})}

/* ---------- More tab: each heading folds its section away ---------- */
function foldMore(){const sec=$('t-more');if(!sec||sec.dataset.folded)return;sec.dataset.folded=1;const open=(S.ui.open||{});
  for(const h of [...sec.querySelectorAll(':scope > h2')]){const d=document.createElement('details');d.className='fold';const key=h.textContent.trim();d.open=open[key]!==undefined?open[key]:['Income','Goals','Settings'].includes(key);
    const sm=document.createElement('summary');sm.textContent=key;d.appendChild(sm);h.parentNode.insertBefore(d,h);let n=h.nextSibling;h.remove();
    while(n&&!(n.nodeType===1&&n.tagName==='H2')){const nx=n.nextSibling;d.appendChild(n);n=nx}
    d.addEventListener('toggle',()=>{S.ui.open=Object.assign({},S.ui.open,{[key]:d.open});save()})}}
foldMore();

/* ---------- hide locked items, text size, color-blind colors ---------- */
function applyView(){document.body.classList.toggle('hidelock',!!S.ui.hideLocked);document.body.classList.toggle('bigtext',!!S.ui.big);document.body.classList.toggle('cb',!!S.ui.cb);
  for(const id of ['sHide','sHide2'])if($(id))$(id).checked=!!S.ui.hideLocked;if($('sBig'))$('sBig').checked=!!S.ui.big;if($('sCb'))$('sCb').checked=!!S.ui.cb}
document.addEventListener('change',e=>{const id=e.target.id;if(id==='sHide'||id==='sHide2')S.ui.hideLocked=e.target.checked;else if(id==='sBig')S.ui.big=e.target.checked;else if(id==='sCb')S.ui.cb=e.target.checked;else return;applyView();save()},true);
applyView();

/* ---------- start screen ---------- */
{const sp=$('splash');if(sp){setTimeout(()=>{sp.classList.add('out');setTimeout(()=>sp.remove(),500)},S.ui.anim?1100:200)}}

/* ---------- a short guided start for a brand-new save ---------- */
const TUT=[
 {el:()=>document.querySelector('#ladder button[data-sku]:not([disabled])')||document.querySelector('#ladder button[data-sku]'),txt:'Tap here to stock your first oil filter. Every copy on the shelf sells on its own.',done:()=>FAC>=3},
 {el:()=>$('prog'),txt:'This card shows your next goal. Stock 10 of a product to unlock the next one, and each new one earns more.',done:()=>S.top>=1,tap:true},
 {el:()=>document.querySelector('#dash .lim')||$('dash'),txt:'These four boxes are your store. The red one is holding you back. Tap it to fix it in the Store tab.',done:()=>tab==='store',tap:true},
 {el:()=>document.querySelector('#caps .card'),txt:'Buy here to keep up. Prices follow what you earn, so there is always a small wait. That is the puzzle: where to put the money.',done:()=>false,tap:true}];
let tutEl=null;
function tutStep(){const i=S.ui.tut||0;if(i>=TUT.length||S.st.play>1800){if(tutEl){tutEl.remove();tutEl=null}return}
  const t=TUT[i];if(t.done()){S.ui.tut=i+1;save();if(tutEl){tutEl.remove();tutEl=null}return}
  const el=t.el();if(!el||el.offsetParent===null){if(tutEl)tutEl.hidden=true;return}
  if(!tutEl){tutEl=document.createElement('div');tutEl.className='tut';tutEl.innerHTML='<p></p><button class="btn">Got it</button>';document.body.appendChild(tutEl);
    tutEl.querySelector('button').addEventListener('click',()=>{S.ui.tut=(S.ui.tut||0)+1;save();tutEl.remove();tutEl=null})}
  if(tutEl.dataset.step!=String(i)){tutEl.dataset.step=i;const r0=el.getBoundingClientRect();if(r0.top<90||r0.bottom>innerHeight-170)el.scrollIntoView({block:'center',behavior:'smooth'})}
  tutEl.hidden=false;tutEl.querySelector('p').textContent=t.txt;tutEl.querySelector('button').hidden=!t.tap;
  const r=el.getBoundingClientRect(),below=r.top<innerHeight*.55;tutEl.classList.toggle('up',!below);
  tutEl.style.top=(below?r.bottom+10:Math.max(8,r.top-10-tutEl.offsetHeight))+'px';tutEl.style.left=Math.max(10,Math.min(innerWidth-tutEl.offsetWidth-10,r.left+r.width/2-tutEl.offsetWidth/2))+'px';
  tutEl.style.setProperty('--ax',Math.max(16,Math.min(tutEl.offsetWidth-16,r.left+r.width/2-parseFloat(tutEl.style.left)))+'px')}
setInterval(tutStep,400);addEventListener('scroll',tutStep,{passive:true});

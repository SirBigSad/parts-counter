/* ===== Pill pass 3 (mockups of ten layout ideas). Each block stands alone so any can be dropped. ===== */
(()=>{
const $$=(s,r=document)=>r.querySelector(s),$A=(s,r=document)=>[...r.querySelectorAll(s)];
const css=document.createElement('style');css.id='pill3';css.textContent=`
/* 1. Shelves as a grid of pill cards on a computer */
@media (min-width:1100px){
 #ladder [id^=bb-]{display:grid;grid-template-columns:repeat(auto-fill,minmax(205px,1fr));gap:8px;padding:4px 2px}
 #ladder [id^=bb-]>.fit{grid-column:1/-1;justify-self:start}
 #ladder [id^=bb-]>.sku:not(.full){display:grid!important;grid-template-columns:36px minmax(0,1fr);grid-template-rows:auto auto;gap:6px 10px;align-items:center;padding:10px 12px!important;border-radius:18px!important;background:var(--card)!important;box-shadow:var(--sh)!important;border:0!important;margin:0!important}
 #ladder [id^=bb-]>.sku:not(.full) .ski{grid-row:1}
 #ladder [id^=bb-]>.sku:not(.full) .sn{display:block!important;min-width:0}
 #ladder [id^=bb-]>.sku:not(.full) .sn b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #ladder [id^=bb-]>.sku:not(.full) .sn>small{display:block;margin-top:3px!important}
 #ladder [id^=bb-]>.sku:not(.full) .sn>.rbar,#ladder [id^=bb-]>.sku:not(.full) .sn>[id$=w]{margin-top:5px!important}
 #ladder [id^=bb-]>.sku:not(.full)>.btn,#ladder [id^=bb-]>.sku:not(.full)>.lock{grid-column:1/-1;width:100%;min-height:40px!important;border-radius:999px!important;display:flex;align-items:center;justify-content:center;gap:8px}
 #ladder [id^=bb-]>.sku:not(.full)>.btn small{display:inline}
 #ladder [id^=bb-]>.sku.full{margin:0!important}
}
/* 2. Department chips */
#dchips{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 10px;scrollbar-width:none}#dchips::-webkit-scrollbar{display:none}
#dchips button{flex:none;display:flex;align-items:center;gap:7px;height:34px;padding:0 12px 0 5px;border-radius:999px;border:0;background:var(--card);box-shadow:var(--sh);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer;white-space:nowrap}
#dchips button.cur{background:color-mix(in srgb,var(--dc) 22%,var(--card));box-shadow:inset 0 0 0 1.5px var(--dc)}
#dchips svg{width:24px;height:24px;transform:rotate(-90deg)}#dchips circle{fill:none;stroke-width:4}
/* 3. Sticky part header */
#ladder details.part[open]>summary,#sladder details.part[open]>summary{position:sticky;top:calc(var(--hh,150px) + var(--segh,52px) + 10px);z-index:7;background:color-mix(in srgb,var(--card) 92%,transparent);backdrop-filter:blur(8px);border-radius:999px}
#ladder details.line,#sladder details.line,#ladder .lbody,#sladder .lbody,#ladder details.part,#sladder details.part{overflow:clip!important}
/* 4. Finished departments as one slim pill */
details.line.ldone:not([open])>summary{padding:6px 14px 6px 8px!important;opacity:.8}
details.line.ldone:not([open])>summary .lic{width:24px;height:24px}
details.line.ldone:not([open])>summary .lsum small::after{content:' · all parts ✓';color:#2ec4a6;font-weight:700}
details.line.ldone:not([open])>summary svg.dart,details.line.ldone:not([open])>summary .dart{display:none}
/* 5. Store cards fold to a pill header */
.card.aisle .capg{cursor:pointer}
.card.aisle.cfold{padding-bottom:10px!important}
.card.aisle.cfold>*:not(.capg):not(.cgv){display:none!important}
.card.aisle.cfold .cgv{margin:4px 0 0!important}
.card.aisle .capg::after{content:'⌃';font-size:14px;color:var(--mute);margin-left:4px;transition:transform .2s}
.card.aisle.cfold .capg::after{transform:rotate(180deg)}
/* 6. Money suffix as a little chip in buttons */
.btn small em.sfx{display:inline-block;margin-left:2px;padding:0 4px;border-radius:999px;background:rgba(0,0,0,.18);font-style:normal;font-size:.85em;line-height:1.35}
/* 8. Phone: buy buttons are pills with a bigger tap area */
@media (max-width:1099px){
 .sku>.btn,.item>.btn{border-radius:999px!important;position:relative}
 .sku>.btn::before,.item>.btn::before{content:'';position:absolute;inset:-8px -8px -8px -14px}
}
/* 9. Shop strip */
#shStrip{display:flex;gap:6px;margin:0 0 10px;overflow-x:auto;scrollbar-width:none}
#shStrip span{flex:1 1 0;min-width:0;padding:5px 6px;border-radius:999px;background:var(--card);box-shadow:var(--sh);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}
#shStrip span b{display:block;font:700 15px 'Barlow Condensed',sans-serif}
#shStrip span.hot{background:color-mix(in srgb,var(--bad,#d33) 18%,var(--card));box-shadow:inset 0 0 0 1.5px color-mix(in srgb,var(--bad,#d33) 55%,transparent)}#shStrip span.hot b{color:var(--bad,#d33)}
#shStrip i{align-self:center;color:var(--mute);font-style:normal}
/* 10. Empty space: jobs with nothing booked fold into one pill */
details.part.p3hide{display:none!important}
.p3more{display:inline-flex;align-items:center;gap:6px;margin:6px 0 4px 6px;padding:5px 12px;border-radius:999px;background:var(--soft);color:var(--mute);font-size:12.5px;font-weight:600}
`;document.head.appendChild(css);

/* 2. department chips above the Shelves list */
const ladder=$$('#ladder');let chips=null;
function dchips(){if(!ladder||typeof LINES==='undefined')return;if(!chips){chips=document.createElement('div');chips.id='dchips';ladder.before(chips);
    chips.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const el=$$('#ln-'+b.dataset.l);if(!el)return;el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'})})}
  const curL=LADDER[S.top].line;let h='';
  for(const l of LINES){const el=$$('#ln-'+l.id);if(!el||el.hidden)continue;const bs=LINE_BASES[l.id]||[];let d=0;for(const b of bs){const st=BASE_STEPS[b];if(L(S.f,st[st.length-1].id)>=BASE_NEED)d++}
    const p=bs.length?d/bs.length:0,C=2*Math.PI*9;
    h+=`<button data-l="${l.id}" class="${l.id===curL?'cur':''}" style="--dc:${l.c}"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" stroke="color-mix(in srgb,${l.c} 25%,transparent)"/><circle cx="12" cy="12" r="9" stroke="${l.c}" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}" stroke-linecap="round"/></svg>${l.n}</button>`}
  if(chips._h!==h){chips._h=h;chips.innerHTML=h}}
/* 4. a department whose parts are all fully stocked */
function ldone(){if(typeof LINES==='undefined')return;const curL=LADDER[S.top].line;for(const l of LINES){const el=$$('#ln-'+l.id);if(!el||el.hidden)continue;const bs=LINE_BASES[l.id]||[];
  const all=bs.length&&bs.every(b=>{const st=BASE_STEPS[b];return L(S.f,st[st.length-1].id)>=BASE_NEED});el.classList.toggle('ldone',!!all&&l.id!==curL)}}
/* 5. tap a Store card header to fold it; remembered on this device */
const FK='parts-counter-fold';let folds={};try{folds=JSON.parse(localStorage.getItem(FK)||'{}')}catch(e){}
document.addEventListener('click',e=>{const h=e.target.closest('.card.aisle .capg');if(!h||e.target.closest('button,a'))return;const c=h.closest('.card.aisle');c.classList.toggle('cfold');folds[c.id]=c.classList.contains('cfold');try{localStorage.setItem(FK,JSON.stringify(folds))}catch(e){}});
function cfold(){for(const c of $A('.card.aisle'))c.classList.toggle('cfold',!!folds[c.id])}
/* 9. the shop's links as a strip of pills, weakest in red */
function shStrip(){const open=$$('#shOpen');if(!open||open.hidden)return;let s=$$('#shStrip');if(!s){s=document.createElement('div');s.id='shStrip';open.prepend(s)}
  const want=['Trucks coming in','Service writers','Technicians','Tools & equipment'],tiles=$A('#shFlow .kt');let h='';
  want.forEach((w,i)=>{const t=tiles.find(x=>(x.querySelector('small')||{}).textContent===w);if(!t)return;h+=(i?'<i>›</i>':'')+`<span class="${t.classList.contains('hot')?'hot':''}">${w.replace(' & equipment','').replace(' coming in','').replace('Service writers','Writers').replace('Technicians','Techs')}<b>${t.querySelector('b').textContent}</b></span>`});
  const hot=tiles.find(x=>x.classList.contains('hot'));if(hot&&!want.includes(hot.querySelector('small').textContent))h=h.replace(/class="hot"/g,'class=""');
  if(s._h!==h){s._h=h;s.innerHTML=h}}
/* 10. Service: past the next job with nothing booked, the rest fold into one pill */
function tidy(){for(const ln of $A('#sladder details.line[open]')){const jobs=$A('details.part:not([hidden])',ln);let seen=0,hidden=0;
    for(const j of jobs){const sm=(j.querySelector('summary small')||{}).textContent||'';const empty=/^0 booked/.test(sm)&&!j.open;if(empty){seen++;if(seen>1){j.classList.add('p3hide');hidden++;continue}}j.classList.remove('p3hide')}
    const body=ln.querySelector('.lbody');let m=body&&body.querySelector(':scope>.p3more');if(hidden){if(!m){m=document.createElement('div');m.className='p3more';body.appendChild(m)}const t=`+${hidden} more job${hidden>1?'s':''} unlock as you book`;if(m.textContent!==t)m.textContent=t}else if(m)m.remove()}}
function segh(){const r=document.querySelector('main>section:not([hidden]) .row:has(>.seg)');if(r){const h=Math.round(r.getBoundingClientRect().height)+'px';if(document.documentElement.style.getPropertyValue('--segh')!==h)document.documentElement.style.setProperty('--segh',h)}}
setInterval(()=>{try{segh();dchips();ldone();cfold();shStrip();tidy()}catch(e){}},500);
})();

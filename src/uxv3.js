/* ===== Parts Counter Idle: a little conveyor under the four links (boxes flow at each link's rate and pile up
   in front of the one slowing you down), and a department map: the road through all 31 departments with your
   truck parked at the one you're in. ===== */
(()=>{
const css=document.createElement('style');css.textContent=`
#flow{display:block;width:100%;max-width:720px;height:16px;margin:5px auto 0;pointer-events:none}header.mini #flow{height:11px;margin-top:3px}
#mapRow{display:flex;align-items:center;gap:10px;width:100%;margin:0 0 10px;padding:10px 14px;border-radius:14px;border:0;background:var(--card);box-shadow:var(--sh);color:var(--ink);font:600 14px system-ui,sans-serif;text-align:left;cursor:pointer}
#mapRow svg{width:22px;height:22px;flex:none;color:var(--acc)}#mapRow span{flex:1;min-width:0}#mapRow small{display:block;color:var(--mute);font-weight:500;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#mapRow em{font-style:normal;color:var(--mute);font-size:18px}
#dmap{position:fixed;inset:0;z-index:70;background:var(--bg,#14121f);display:flex;flex-direction:column}#dmap[hidden]{display:none}
#dmap .mh{display:flex;align-items:center;gap:10px;padding:calc(12px + env(safe-area-inset-top)) 14px 10px 18px;border-bottom:1px solid var(--line)}#dmap .mh b{flex:1;font:700 22px 'Barlow Condensed',sans-serif;color:var(--ink)}#dmap .mh small{display:block;font:500 12.5px system-ui,sans-serif;color:var(--mute)}
#dmap .mx{width:42px;height:42px;border:0;border-radius:12px;background:var(--soft);color:var(--ink);font-size:26px;cursor:pointer}
#dmap .mb{flex:1;overflow:auto;overscroll-behavior:contain}#dmap .road{position:relative;margin:0 auto;max-width:520px}
#dmap svg.rd{position:absolute;inset:0;width:100%;height:100%}
#dmap .stop{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;width:130px;text-align:center}
#dmap .dot{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--lc);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.35);border:3px solid rgba(255,255,255,.85)}#dmap .dot svg{width:24px;height:24px}
#dmap .stop.fut .dot{background:#3b3550;border-color:#5a5470;color:#9a94b0}#dmap .stop.done .dot::after{content:'✓';position:absolute;margin:30px 0 0 34px;width:18px;height:18px;border-radius:50%;background:#2ec4a6;color:#fff;font:700 11px/18px system-ui;text-align:center}
#dmap .stop b,#dmap .stop small{background:rgba(20,18,31,.72);padding:0 6px;border-radius:6px}#dmap .stop b{margin-top:5px;font:700 14px/1.15 'Barlow Condensed',sans-serif;color:var(--ink)}#dmap .stop small{font:500 11.5px system-ui,sans-serif;color:var(--mute)}#dmap .stop.fut b{color:var(--mute)}
#dmap .stop.cur .dot{width:58px;height:58px;box-shadow:0 0 0 6px rgba(46,196,166,.35),0 3px 12px rgba(0,0,0,.4)}#dmap .stop.cur b{font-size:16px}
#dmap .stop.part .dot{width:36px;height:36px;border-width:2px}#dmap .stop.part .dot svg{width:19px;height:19px}#dmap .stop.part b{font-size:13px}#dmap .stop.part.cur .dot{width:48px;height:48px}#dmap .stop.dept .dot{width:60px;height:60px}
#dmap .truck{position:absolute;transform:translate(-50%,-100%);width:54px;pointer-events:none;animation:bob 1.6s ease-in-out infinite}@keyframes bob{50%{margin-top:-4px}}
#dmap .pbar{width:90px;height:5px;border-radius:3px;background:rgba(255,255,255,.15);margin-top:4px;overflow:hidden}#dmap .pbar i{display:block;height:100%;background:#2ec4a6}`;
document.head.appendChild(css);
const $=id=>document.getElementById(id);
/* ---------- the conveyor ---------- */
const dash=$('dash'),cv=document.createElement('canvas');cv.id='flow';cv.setAttribute('aria-hidden','true');
dash.after(cv);
const ctx=cv.getContext('2d');let t0=performance.now(),off=[0,0,0,0];
const BOX=['#d9a35a','#c98f45','#e3b06c'];
function draw(now){requestAnimationFrame(draw);if(document.hidden||typeof R==='undefined'||!R)return;const vis=cv.getBoundingClientRect();if(vis.bottom<0||vis.width<10)return;
  const dpr=Math.min(2,devicePixelRatio||1),W=vis.width,Hh=vis.height;if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(Hh*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr)}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,Hh);
  const cells=[...dash.children];if(cells.length<4)return;const dr=dash.getBoundingClientRect(),seg=cells.map(c=>{const r=c.getBoundingClientRect();return [r.left-dr.left,r.right-dr.left]});
  const rates=[R.supply,R.dem,R.ck,R.sk].map(v=>Math.max(0,+v||0)),mx=Math.max(...rates,1e-9),keys=['shelf','cu','ck','sk'],lim=FAC?keys.indexOf(R.lim):-1;
  /* what actually flows through each stretch: nothing gets past a slower link before it */
  const flowAt=k=>Math.min(...rates.slice(0,k+1));
  const dt=Math.min(.1,(now-t0)/1000);t0=now;const moving=S.ui.anim!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const y=Hh-2,bs=Math.max(4,Hh-5);
  /* the belt */
  ctx.fillStyle='rgba(255,255,255,.08)';ctx.fillRect(seg[0][0],y,seg[3][1]-seg[0][0],1.5);
  for(let k=0;k<4;k++){const [a,b]=seg[k],len=b-a,f=k===lim?rates[k]:flowAt(k),dens=Math.max(.08,f/mx),gap=Math.max(bs*1.6,bs*1.6+(1-dens)*26),speed=14+dens*22;
    if(moving)off[k]=(off[k]+speed*dt)%gap;
    const pileN=k===lim&&k>0?Math.min(9,Math.max(2,Math.round((1-rates[k]/Math.max(rates[k-1],1e-9))*11))):0;
    ctx.save();ctx.beginPath();ctx.rect(a+(pileN?bs*3.4:0),0,len-(pileN?bs*3.4:0),Hh);ctx.clip();
    for(let x=a-gap+off[k],i=0;x<b;x+=gap,i++){ctx.fillStyle=BOX[i%3];ctx.fillRect(Math.round(x),y-bs,bs,bs);ctx.fillStyle='rgba(0,0,0,.18)';ctx.fillRect(Math.round(x),y-bs/2-.5,bs,1)}
    ctx.restore();
    /* boxes waiting in front of the slow link */
    if(pileN){for(let i=0;i<pileN;i++){const row=i<5?0:1,col=row?i-5:i,px=a+1+col*(bs*.62)+(row?bs*.3:0),py=y-bs-row*(bs*.8)+(moving?Math.sin(now/180+i)*.4:0);ctx.fillStyle=BOX[i%3];ctx.fillRect(Math.round(px),Math.round(py),bs,bs);ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=.6;ctx.strokeRect(Math.round(px)+.3,Math.round(py)+.3,bs-.6,bs-.6)}}}}
requestAnimationFrame(draw);
/* ---------- the department map ---------- */
const MAPIC='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>';
const TRUCK='<svg viewBox="0 0 64 40" aria-hidden="true"><rect x="2" y="8" width="36" height="22" rx="2" fill="#f1eee8"/><rect x="2" y="8" width="36" height="5" fill="#e53935"/><path d="M38 14h12l8 9v7H38z" fill="#e53935"/><path d="M41 17h8l5 6H41z" fill="#bfe6ff"/><rect x="2" y="28" width="58" height="3" fill="#3b3355"/><circle cx="13" cy="33" r="5" fill="#2a2440"/><circle cx="13" cy="33" r="2" fill="#c9d1dc"/><circle cx="50" cy="33" r="5" fill="#2a2440"/><circle cx="50" cy="33" r="2" fill="#c9d1dc"/></svg>';
const firstK={},lastK={};LADDER.forEach((s,k)=>{if(firstK[s.line]===undefined)firstK[s.line]=k;lastK[s.line]=k});
const lines=LINES.filter(l=>firstK[l.id]!==undefined);
const box=document.createElement('div');box.id='dmap';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Department map');
box.innerHTML='<div class="mh"><b>Department map<small id="dmSub"></small></b><button class="mx" aria-label="Close">×</button></div><div class="mb" id="dmBody"></div>';document.body.appendChild(box);
box.querySelector('.mx').addEventListener('click',()=>box.hidden=true);addEventListener('keydown',e=>{if(e.key==='Escape')box.hidden=true});
function curLine(){return (LADDER[S.top]||LADDER[0]).line}
const baseLine={},baseFirst={},baseLast={};LADDER.forEach((s,k)=>{if(baseLine[s.base]===undefined){baseLine[s.base]=s.line;baseFirst[s.base]=k}baseLast[s.base]=k});
function openMap(){const cl=curLine(),ci=lines.findIndex(l=>l.id===cl),cb=(LADDER[S.top]||LADDER[0]).base,parts=BASES.filter(b=>baseLine[b]===cl);
  /* the road: departments you've finished, the one you're in followed by each of its parts, then the ones ahead */
  const stops=[];lines.forEach((l,i)=>{stops.push({dept:l,i,st:i<ci?'done':i===ci?'curd':'fut'});if(i===ci)parts.forEach((b,pi)=>stops.push({base:b,pi,st:baseLast[b]<S.top?'done':b===cb?'cur':'fut'}))});
  const pos=[];let y=70;stops.forEach((s,i)=>{pos.push([50+Math.sin(i*1.1)*28,y]);y+=s.base?92:118});const H=y+40;
  let path='';pos.forEach(([x,yy],i)=>{if(!i)path=`M${x} ${yy}`;else{const [px,py]=pos[i-1],g=(yy-py)*.55;path+=` C${px} ${py+g},${x} ${yy-g},${x} ${yy}`}});
  let h=`<div class="road" style="height:${H}px"><svg class="rd" viewBox="0 0 100 ${H}" preserveAspectRatio="none"><path d="${path}" fill="none" stroke="#4a4560" stroke-width="13" vector-effect="non-scaling-stroke" stroke-linecap="round"/><path d="${path}" fill="none" stroke="#f4d35e" stroke-width="2" stroke-dasharray="10 12" vector-effect="non-scaling-stroke"/></svg>`;
  let curY=0;
  stops.forEach((s,i)=>{const [x,yy]=pos[i];
    if(s.dept){const l=s.dept,tot=lastK[l.id]-firstK[l.id]+1,got=s.st==='done'?tot:s.st==='curd'?Math.max(0,S.top-firstK[l.id]+1):0;
      h+=`<div class="stop ${s.st==='curd'?'cur dept':s.st}" style="left:${x}%;top:${yy}px;--lc:${l.c}"><div class="dot">${icSvg(LINE_IC[l.id])}</div><b>${esc(l.n)}</b><small>${s.st==='done'?'All '+fmt(tot)+' parts':s.st==='curd'?`You're here · ${fmt(got)} of ${fmt(tot)} parts`:'Department '+(i+1>0?s.i+1:'')}</small>${s.st==='curd'?`<div class="pbar"><i style="width:${Math.max(1,Math.min(100,got/tot*100))}%"></i></div>`:''}</div>`}
    else{const b=s.base,tot=baseLast[b]-baseFirst[b]+1,got=s.st==='done'?tot:s.st==='cur'?Math.max(0,S.top-baseFirst[b]+1):0,lc=(lines[ci]||{}).c||'#2f6fb0';
      h+=`<div class="stop part ${s.st}" style="left:${x}%;top:${yy}px;--lc:${lc}"><div class="dot">${typeof BASE_IC!=='undefined'&&BASE_IC[b]?icSvg(BASE_IC[b]):''}</div><b>${esc(BASE_NAME[b]||b)}</b><small>${s.st==='done'?'Done':s.st==='cur'?`Step ${fmt(got)} of ${fmt(tot)}`:'Part '+(s.pi+1)+' of '+parts.length}</small>${s.st==='cur'?`<div class="pbar"><i style="width:${Math.max(2,Math.min(100,got/tot*100))}%"></i></div>`:''}</div>`;
      if(s.st==='cur'){h+=`<div class="truck" style="left:calc(${x}% + 40px);top:${yy-10}px">${TRUCK}</div>`;curY=yy}}});
  h+='</div>';$('dmBody').innerHTML=h;$('dmSub').textContent=`Department ${ci+1} of ${lines.length} · ${lines[ci]?lines[ci].n:''}, part ${parts.indexOf(cb)+1} of ${parts.length}`;box.hidden=false;
  requestAnimationFrame(()=>{const bd=$('dmBody');bd.scrollTop=Math.max(0,curY-bd.clientHeight/2)})}
window.openDeptMap=openMap;
/* a row on the Shelves tab, and a tile in More */
const prog=$('prog');let row=null;if(prog){row=document.createElement('button');row.id='mapRow';row.innerHTML=MAPIC+'<span>Department map<small id="mapSub"></small></span><em>›</em>';prog.before(row);row.addEventListener('click',openMap)}
setInterval(()=>{if(!row)return;const ci=lines.findIndex(l=>l.id===curLine()),cb=(LADDER[S.top]||LADDER[0]).base,ps=BASES.filter(b=>baseLine[b]===curLine()),t=`${lines[ci]?lines[ci].n:''} · part ${ps.indexOf(cb)+1} of ${ps.length} · department ${ci+1} of ${lines.length}`,el=$('mapSub');if(el&&el.textContent!==t)el.textContent=t},1000);
const addTile=()=>{const g=document.querySelector('#mtiles .tg:nth-of-type(2)')||[...document.querySelectorAll('#mtiles h4')].find(h=>h.textContent==='Progress')?.nextElementSibling;if(!g||g.querySelector('[data-dmap]'))return!!g;const b=document.createElement('button');b.dataset.dmap='1';b.style.setProperty('--tc','#2ec4a6');b.innerHTML='<b>Department map</b><small>The road through every department</small>';b.addEventListener('click',openMap);g.prepend(b);return true};
const tt=setInterval(()=>{if(addTile())clearInterval(tt)},700);
})();

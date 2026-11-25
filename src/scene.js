/* ===== Parts Counter Idle: store scene ===== */
{
const cv=$('scene'),cx=cv.getContext('2d');let W=0,H=0,last=0,ph=0,peeps=[],spawn=0,hit=null;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function resize(){const r=cv.getBoundingClientRect(),d=devicePixelRatio||1;W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
const ro=new ResizeObserver(resize);ro.observe(cv);
const BODY=['#ff5a5f','#3d8bfd','#2ec4a6','#ffb627','#9b5de5','#f15bb5','#00bbf9'];
/* has the player reached a named store or shop item? */
const firstOf={};for(const [g,set] of [['ck',AISLE],['sk',AISLE],['cu',AISLE],['sh',AISLE],['vb',SHOP],['vt',SHOP],['ve',SHOP]]){firstOf[g]={};for(const st of set[g]){if(firstOf[g][st.item]===undefined)firstOf[g][st.item]=st.j}}
const has=(g,item)=>{const j=firstOf[g][item];if(j===undefined)return false;return (g[0]==='v'?S.sv.sTop[g]:S.sTop[g])>=j};
const lerp=(a,b,t)=>a+(b-a)*t,mix=(c1,c2,t)=>{const p=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));const A=p(c1),B=p(c2);return '#'+A.map((v,i)=>Math.round(lerp(v,B[i],t)).toString(16).padStart(2,'0')).join('')};
/* daylight from the phone's clock: 1 at midday, 0 at night, with dawn and dusk in between */
function daylight(){const d=new Date(),h=d.getHours()+d.getMinutes()/60;if(h<5.5||h>20.5)return 0;if(h<7.5)return (h-5.5)/2;if(h>18.5)return (20.5-h)/2;return 1}
const STARS=Array.from({length:14},(_,i)=>[(i*37%100)/100,(i*53%60)/100]);
/* the building grows up with you: gravel-lot shop, standard store, modern dealership, distribution center */
const ERAS=[{wall:'#e8a46c',wall2:'#9b4f5a',floor:'#6b4a6e',trim:'#7a3f55',lines:'wood'},{wall:'#f2c88f',wall2:'#b06a6a',floor:'#5f5a86',trim:'#c4706a'},
 {wall:'#9fd7e0',wall2:'#4f7fa8',floor:'#3f4f7e',trim:'#2c5d9e',lines:'stripe'},{wall:'#b7c4e6',wall2:'#5b5f9e',floor:'#3a3a6e',trim:'#ffb627',lines:'steel'}];
const eraOf=()=>{const f=S.top/NS;return f<.02?0:f<.2?1:f<.55?2:3};
const DROPS=Array.from({length:26},(_,i)=>[(i*61%100)/100,(i*29%100)/100,.6+(i*17%10)/20]);
let dogHit=null,dogTap=0;
function bubble(x,y,txt){cx.font='600 10px Barlow,sans-serif';const words=txt.split(' '),lines=[];let cur='';const mw=Math.min(170,W*.5);
  for(const w of words){const t=cur?cur+' '+w:w;if(cx.measureText(t).width>mw&&cur){lines.push(cur);cur=w}else cur=t}if(cur)lines.push(cur);const ls=lines.slice(0,4),bw=Math.max(...ls.map(l=>cx.measureText(l).width))+12,bh=ls.length*12+8;
  let bx=Math.max(4,Math.min(W-bw-4,x-bw/2)),by=Math.max(2,y-bh-8);cx.fillStyle='rgba(20,15,40,.2)';cx.beginPath();cx.roundRect?cx.roundRect(bx+2,by+3,bw,bh,8):cx.rect(bx+2,by+3,bw,bh);cx.fill();cx.fillStyle='#fffdf7';cx.beginPath();cx.roundRect?cx.roundRect(bx,by,bw,bh,8):cx.rect(bx,by,bw,bh);cx.fill();
  cx.beginPath();cx.moveTo(Math.max(bx+6,Math.min(bx+bw-6,x))-4,by+bh);cx.lineTo(Math.max(bx+6,Math.min(bx+bw-6,x)),by+bh+6);cx.lineTo(Math.max(bx+6,Math.min(bx+bw-6,x))+4,by+bh);cx.fill();
  cx.fillStyle='#2a1f3d';cx.textAlign='left';ls.forEach((l,i)=>cx.fillText(l,bx+6,by+14+i*12))}
let sparks=[],dog={x:0,dir:1,t:0},driver={x:-40,on:false,t:8};
/* flat vector style helpers: rounded shapes, soft gradients and glows, no outlines */
function rr(x,y,w,h,r,c){cx.fillStyle=c;cx.beginPath();if(cx.roundRect)cx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));else cx.rect(x,y,w,h);cx.fill()}
function glow(x,y,r,col,a){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}
function vg(y0,y1,c0,c1){const g=cx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,c0);g.addColorStop(1,c1);return g}
const shade=(c,t)=>mix(c,'#1a1530',t),tint=(c,t)=>mix(c,'#ffffff',t);
function dogDraw(x,y,dir,bob){cx.save();cx.translate(x,y);cx.scale(dir,1);cx.fillStyle='rgba(20,15,40,.18)';cx.beginPath();cx.ellipse(0,0,11,2.5,0,0,7);cx.fill();
  const c='#d9893d';rr(-10,-11+bob,18,8,4,c);cx.fillStyle=c;cx.beginPath();cx.arc(9,-12+bob,5,0,7);cx.fill();cx.fillStyle=shade(c,.35);cx.beginPath();cx.ellipse(7,-15+bob,2,3.5,-.4,0,7);cx.fill();
  cx.fillStyle='#2a1f3d';cx.beginPath();cx.arc(13.5,-12+bob,1.3,0,7);cx.fill();cx.fillStyle=tint(c,.35);rr(-8,-7+bob,12,3,2,tint(c,.35));
  rr(-8,-4,3,5,1.5,shade(c,.2));rr(4,-4,3,5,1.5,shade(c,.2));cx.save();cx.translate(-10,-9+bob);cx.rotate(-.6+Math.sin(ph*12)*.4);rr(-6,-1.5,7,3,1.5,c);cx.restore();cx.restore()}
function box(x,y){rr(x,y,9,7,1.5,'#e0a35a');cx.fillStyle='#b97a38';cx.fillRect(x,y+3,9,1.2)}
function wheel(x,y,r){cx.fillStyle='#2a2440';cx.beginPath();cx.arc(x,y,r,0,7);cx.fill();cx.fillStyle='#8f8aa8';cx.beginPath();cx.arc(x,y,r*.45,0,7);cx.fill()}
function van(x,y,c,s){cx.save();cx.translate(x,y);cx.scale(s,s);rr(0,-23,36,18,4,c);rr(30,-17,14,12,4,c);cx.fillStyle=tint(c,.25);rr(2,-21,30,3,2,tint(c,.25));
  rr(35,-15,6,5,2,'#bfe6ff');cx.fillStyle='rgba(255,255,255,.6)';cx.fillRect(36,-15,1.5,5);wheel(9,-5,4.5);wheel(36,-5,4.5);cx.restore()}
function forklift(x,y,load){rr(x,y-17,19,13,3,'#ffb627');rr(x+2,y-28,13,3,1.5,'#3b3355');rr(x+3,y-27,2,11,1,'#3b3355');rr(x+12,y-27,2,11,1,'#3b3355');
  rr(x+18,y-31,3,29,1.5,'#6b6488');rr(x+18,y-5,11,2.5,1,'#6b6488');if(load)rr(x+20,y-14,9,9,1.5,'#e0a35a');wheel(x+4,y-2,3.2);wheel(x+15,y-2,3.2)}
/* people: a soft capsule body and a round head, no outlines */
function person(x,y,body,hat,bob){y+=bob;cx.fillStyle='rgba(20,15,40,.16)';cx.beginPath();cx.ellipse(x,y+30,9,2.6,0,0,7);cx.fill();
  rr(x-8,y+9,16,22,8,body);rr(x-6,y+11,5,14,3,tint(body,.22));rr(x+4,y+12,3,15,1.5,shade(body,.18));
  cx.save();cx.translate(x-7,y+13);cx.rotate(.25+bob*.08);rr(-2,0,4,12,2,shade(body,.08));cx.restore();cx.save();cx.translate(x+7,y+13);cx.rotate(-.25-bob*.08);rr(-2,0,4,12,2,shade(body,.12));cx.restore();
  cx.fillStyle='#f2c29b';cx.beginPath();cx.arc(x,y+2,6.2,0,7);cx.fill();cx.fillStyle=shade('#f2c29b',.12);cx.beginPath();cx.arc(x+2.5,y+3,3.5,0,7);cx.fill();
  cx.fillStyle=hat;cx.beginPath();cx.arc(x,y,6.6,Math.PI*1.02,Math.PI*1.98);cx.fill();rr(x-1,y-1.4,9,2.6,1.3,hat);
  cx.fillStyle='#2a1f3d';cx.beginPath();cx.arc(x+3,y+2.5,.9,0,7);cx.fill()}
function semi(x,y,c,s){cx.save();cx.translate(x,y);cx.scale(s,s);rr(0,-23,24,17,3,shade(c,.15));rr(22,-35,20,29,5,c);rr(40,-27,24,21,5,c);cx.fillStyle=tint(c,.25);rr(24,-33,15,3,2,tint(c,.25));
  rr(26,-31,11,9,2.5,'#bfe6ff');cx.fillStyle='rgba(255,255,255,.55)';cx.fillRect(28,-31,2,9);rr(17,-46,3.5,24,1.7,'#c9c4dc');wheel(10,-5,5);wheel(30,-5,5);wheel(53,-5,5);cx.restore()}
/* ===== isometric cutaway: the whole dealership as a little diorama. World units: x runs along the back wall,
   y runs toward the viewer, z is up. P() turns a world point into a screen point. ===== */
let s=1,ox=0,oy=0;
const deco=(layer,o)=>{try{return window.decoLayer?decoLayer(layer,o):false}catch(e){if(!deco.err){deco.err=1;console.error(e)}return false}};
const P=(x,y,z)=>[ox+(x-y)*.866*s,oy+((x+y)*.5-z)*s];
function quad(pts,c){cx.fillStyle=c;cx.beginPath();pts.forEach((p,i)=>{const [a,b]=P(...p);i?cx.lineTo(a,b):cx.moveTo(a,b)});cx.closePath();cx.fill()}
/* a solid block: lit top, mid right face, shaded front face */
function ibox(x,y,z,w,d,h,c,top){quad([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],shade(c,.22));quad([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],c);quad([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top||tint(c,.22))}
function iperson(x,y,body,hat,bob,tie){const [a,b]=P(x,y,0),k=s*1.05;cx.save();cx.translate(a,b);cx.scale(k,k);person(0,-30,body,hat,bob);if(tie){cx.fillStyle=tie;cx.fillRect(-1,-30+bob+10,2,9)}cx.restore()}
function itruck(x,y,c,len,lift){const z=lift||0;ibox(x,y,z+4,len,26,20,shade(c,.05),tint(c,.3));ibox(x+len,y+1,z+4,24,24,30,c);quad([[x+len+24,y+5,z+20],[x+len+24,y+21,z+20],[x+len+24,y+21,z+30],[x+len+24,y+5,z+30]],'#bfe6ff');
  for(const wx of [x+8,x+len-6,x+len+14]){const [a,b]=P(wx,y+26,z+4);cx.fillStyle='#2a2440';cx.beginPath();cx.ellipse(a,b,5*s*1.6,4*s*1.6,0,0,7);cx.fill();cx.fillStyle='#8f8aa8';cx.beginPath();cx.ellipse(a,b,2*s*1.6,1.6*s*1.6,0,0,7);cx.fill()}}
function itree(x,y){const [a,b]=P(x,y,0);rr(a-2*s*2,b-18*s*2,4*s*2,18*s*2,2,'#6b4a3a');cx.fillStyle='#2ec4a6';cx.beginPath();cx.arc(a,b-26*s*2,14*s*2,0,7);cx.fill();cx.fillStyle='rgba(126,232,210,.55)';cx.beginPath();cx.arc(a-4*s*2,b-30*s*2,6*s*2,0,7);cx.fill()}
/* the decorations (deco.js) draw with the same helpers */
window.ISO={P,quad,ibox,rr,glow,mix,shade,tint,iperson,person,cx,get s(){return s},get ox(){return ox},get oy(){return oy},get ph(){return ph},get W(){return W},get H(){return H}};
/* pinch to zoom, drag to look around, double-tap to reset */
const VIEW={z:1,x:0,y:0};window.SCENE_VIEW=VIEW;window.SCENE_PEEPS=()=>peeps;let bayTrucks=[],lastFac=-1,lastLanes=-1,pops=[],regBounce=0;window.SCENE_HITS=[];
function frame(ts){requestAnimationFrame(frame);const dt=Math.min(.05,(ts-last)/1000||0);last=ts;if(document.hidden||!W)return;ph+=dt;const mv=S.ui.anim&&!reduce;
  const day=daylight(),night=1-day,E=ERAS[eraOf()],w=weatherToday();
  /* fit the diorama to the canvas */
  s=Math.min(W/530,H/405)*VIEW.z;ox=W/2-s*64+VIEW.x;oy=H/2-s*101+VIEW.y;
  if(window.decoFocus)decoFocus(dt,(k,x,y)=>{s*=k;ox=x;oy=y});
  /* sky behind everything */
  const skyT=day>=1?'#5fb4e8':day<=0?'#141236':day>.5?mix('#ff8a6a','#5fb4e8',(day-.5)*2):mix('#141236','#ff8a6a',day*2),skyB=day>=1?'#c9ecf5':day<=0?'#3b2d6b':day>.5?mix('#ffd18a','#c9ecf5',(day-.5)*2):mix('#3b2d6b','#ffd18a',day*2);
  cx.fillStyle=vg(0,H,skyT,skyB);cx.fillRect(0,0,W,H);
  if(night>.5){cx.fillStyle=`rgba(255,255,255,${(night-.5)*1.6})`;for(const [a,b] of STARS)cx.fillRect(a*W,b*H*.6,1.5,1.5);glow(W*.9,H*.16,30,'255,250,220',.35);cx.fillStyle='#fff6dc';cx.beginPath();cx.arc(W*.9,H*.16,7,0,7);cx.fill()}
  else if(day>.5){glow(W*.9,H*.17,40,'255,220,120',.55);cx.fillStyle='#ffe08a';cx.beginPath();cx.arc(W*.9,H*.17,9,0,7);cx.fill()}
  if(day>.15&&w!=='rain')for(let i=0;i<3;i++){const cxp=((ph*(mv?5:0)+i*W*.38+30)%(W+80))-40,cyp=H*.08+i*H*.07,a=.5+.35*day;cx.fillStyle=`rgba(255,255,255,${a})`;for(const [dx,dy,r] of [[0,4,7],[9,0,10],[19,4,7],[9,6,8]]){cx.beginPath();cx.arc(cxp+dx,cyp+dy,r,0,7);cx.fill()}}
  /* the ground plate and the lot */
  const gc=w==='snow'?'#e8eefc':mix('#3b4f7e','#7cc9a0',day*.85);
  quad([[-20,-10,0],[380,-10,0],[380,222,0],[-20,222,0]],gc);
  quad([[-20,222,0],[380,222,0],[380,222,-10],[-20,222,-10]],shade(gc,.35));quad([[380,-10,0],[380,222,0],[380,222,-10],[380,-10,-10]],shade(gc,.2));
  quad([[205,158,.2],[380,158,.2],[380,222,.2],[205,222,.2]],mix('#2a2a4a','#5c6aa8',day*.8));
  for(let i=0;i<4;i++)quad([[222+i*40,170,.4],[226+i*40,170,.4],[226+i*40,210,.4],[222+i*40,210,.4]],'rgba(255,255,255,.55)');
  quad([[-20,196,.3],[205,196,.3],[205,222,.3],[-20,222,.3]],mix('#2a2a4a','#6b6f8e',day*.8));
  for(let x=-10;x<200;x+=28)quad([[x,208,.5],[x+14,208,.5],[x+14,210,.5],[x,210,.5]],'rgba(255,255,255,.6)');
  /* store and bay floors, back walls and the window */
  const fl=mix(shade(E.floor,.35),tint(E.floor,.08),.4+.6*day);
  quad([[0,0,0],[200,0,0],[200,150,0],[0,150,0]],fl);
  deco('floor',{fl,day});deco('rug',{day});
  quad([[0,0,0],[0,150,0],[0,150,80],[0,0,80]],mix(shade(E.wall2,.3),E.wall2,day));
  quad([[0,0,0],[200,0,0],[200,0,80],[0,0,80]],mix(shade(E.wall,.3),E.wall,day));
  quad([[0,150,0],[0,150,80],[-6,150,80],[-6,150,0]],shade(E.wall2,.4));quad([[0,0,80],[200,0,80],[200,-6,80],[-6,-6,80],[-6,150,80],[0,150,80]],shade(E.trim,.1));
  deco('paint',{day});
  quad([[0,30,18],[0,110,18],[0,110,62],[0,30,62]],skyB);quad([[0,30,40],[0,110,40],[0,110,62],[0,30,62]],skyT);
  quad([[.2,30,18],[.2,110,18],[.2,110,22],[.2,30,22]],mix('#2a2a4a','#4f8f7a',day));
  deco('window',{day,night});
  {const n=Object.keys(S.fun.pl).length;for(let i=0;i<Math.min(n,8);i++)quad([[0,118+i*4,50],[0,121+i*4,50],[0,121+i*4,56],[0,118+i*4,56]],'#ffcf4a')}
  /* service side: floor and back wall, or a closed shutter before it opens */
  const doors=!S.sv.open?1:has('vb','Second shop')?3:has('vb','Service bay')?2:1;
  quad([[204,0,0],[330,0,0],[330,150,0],[204,150,0]],S.sv.open?mix('#3b3561','#8a87a0',day):mix('#2a2448','#5c5880',day));
  quad([[200,0,0],[330,0,0],[330,0,80],[200,0,80]],S.sv.open?mix('#4b4f8e','#b7c4e6',day):mix('#3a3360','#6b6488',day));
  quad([[200,0,80],[330,0,80],[330,-6,80],[200,-6,80]],'#3b3355');
  {const [a,b]=P(266,0,70);cx.fillStyle=night>.5?'#ffd54f':'#2a2440';cx.font=`700 ${Math.max(7,Math.round(11*s*1.6))}px "Barlow Condensed",sans-serif`;cx.textAlign='center';cx.save();cx.translate(a,b);cx.transform(1,.577,0,1,0,0);cx.fillText(S.sv.open?'SERVICE':'COMING SOON',0,0);cx.restore()}
  if(!S.sv.open)for(let i=0;i<8;i++)quad([[214,0,6+i*8],[320,0,6+i*8],[320,0,10+i*8],[214,0,10+i*8]],'rgba(0,0,0,.12)');
  deco('wall',{day,night});deco('banner',{day,night});
  /* shelving along the back wall: more units as your shelves grow, bins coloured by the lines you stock */
  const cols=[];const seen=new Set(LADDER.slice(0,S.top+1).map(x=>x.line));for(const c of LINES){if(!seen.has(c.id))continue;const n=lineFac(c.id);for(let i=0;i<Math.min(40,Math.ceil(n/10));i++)cols.push(c.c)}
  const rackC=has('sh','Pallet racking')?'#ff7a3d':has('sh','Steel shelving')?'#5c6aa8':'#8a6a9e',want=1+Math.floor(shelfCap()/40),units=Math.min(4,want);
  for(let u=0;u<units;u++){const x=10+u*46;ibox(x,4,0,40,16,64,rackC);
    for(let k=0;k<4;k++){const i=u*4+k,z=8+k*14;if(i<cols.length){const f=R.lim==='sk'&&R.E<1?.25+.45*R.E:R.E<1?.35+.65*R.E:1;quad([[x+3,20.2,z],[x+37,20.2,z],[x+37,20.2,z+10*f],[x+3,20.2,z+10*f]],cols[i]);quad([[x+3,20.3,z+10*f-1.5],[x+37,20.3,z+10*f-1.5],[x+37,20.3,z+10*f],[x+3,20.3,z+10*f]],'rgba(255,255,255,.35)')}
      else quad([[x+3,20.2,z],[x+37,20.2,z],[x+37,20.2,z+10],[x+3,20.2,z+10]],shade(rackC,.45))}}
  if(want>units){const [a,b]=P(190,10,70);cx.fillStyle='#fff';cx.font='600 10px Barlow,sans-serif';cx.textAlign='center';cx.fillText('+'+fmt(want-units),a,b)}
  {const [a,b]=P(10+units*23,12,32);SCENE_HITS.length=0;SCENE_HITS.push({k:'sh',x:a,y:b,r:60*s*1.6})}
  /* a box pops onto a shelf when you stock a part */
  if(lastFac>=0&&FAC>lastFac&&mv)for(let q=0;q<Math.min(3,FAC-lastFac);q++)pops.push({u:Math.floor(Math.random()*units),k:Math.floor(Math.random()*4),t:0});lastFac=FAC;
  for(const p of pops){p.t+=dt;const x=10+p.u*46+8+((p.u*13+p.k*7)%24),z=8+p.k*14+12+Math.max(0,1-p.t*3)*14;const [a,b]=P(x,21,z);const k2=Math.min(1,p.t*4);cx.globalAlpha=Math.max(0,1-Math.max(0,p.t-.6)*2.5);rr(a-4*k2*s*1.6,b-4*k2*s*1.6,8*k2*s*1.6,7*k2*s*1.6,1.5,'#e0a35a');cx.globalAlpha=1}
  pops=pops.filter(p=>p.t<1);
  /* hanging lights */
  for(const [lx,ly] of [[60,60],[140,60],[266,70]]){const [a,b]=P(lx,ly,78);cx.fillStyle='#2a2440';cx.fillRect(a-.5,b-10,1.5,10);cx.fillStyle='#fff3c4';cx.beginPath();cx.ellipse(a,b,5,1.8,0,0,7);cx.fill();glow(a,b+6,30+night*30,'255,232,160',.12+.25*night)}
  deco('lights',{day,night});
  if(R.lim==='sk'&&FAC){for(let q=0;q<Math.min(6,2+Math.round((1-Math.min(1,R.E))*6));q++)ibox(20+q*22%140,30+(q%2)*8,(q>2?8:0),12,10,8,'#e0a35a')}
  /* stocking gear: forklift or pallet jack trundles along the shelves */
  if(has('sk','Forklift')||has('sk','Pallet jack')){const f=mv?(Math.sin(ph*.5)+1)/2:.3,x=20+f*140;ibox(x,46,0,22,14,12,'#ffb627');ibox(x+22,48,0,3,10,26,'#6b6488');if(Math.sin(ph*.5)>0)ibox(x+25,47,2,10,12,10,'#e0a35a')}
  /* the counter with registers, and staff standing behind it */
  const lanes=Object.keys(S.b).filter(k=>k.startsWith('ck')).reduce((a,k)=>a+S.b[k],0),regs=Math.max(1,Math.min(lanes,4)),cw=22+regs*28,cx0=30,rxw=i=>cx0+14+i*28;
  const U=uniform(),nightCrew=rushNow()<.6;for(let i=0;i<regs;i++)iperson(rxw(i)+4,80,i===0?U.body:nightCrew?'#3b3561':'#2f5d7c',i===0?U.hat:nightCrew?'#1e1a4a':'#2f5d7c',mv?Math.sin(ph*4+i)*1.2:0,i===0?U.tie:null);
  /* customers at the shelves are behind the counter: draw them first */
  stepPeeps(dt,mv,regs,rxw);
  for(const p of peeps)if(p.y<92)drawPeep(p,mv);
  deco('floorBack',{night});
  ibox(cx0,92,0,cw,20,24,'#93506e','#e0907a');
  deco('wrap',{x0:cx0,w:cw});
  {const [a,b]=P(cx0+cw/2,112,12);const sn=storeName().toUpperCase();let fs=Math.max(6,Math.round(9*s*1.6));cx.font=`700 ${fs}px "Barlow Condensed",sans-serif`;const tw=cx.measureText(sn).width,max=cw*.866*s*.9;if(tw>max){fs=Math.floor(fs*max/tw);cx.font=`700 ${fs}px "Barlow Condensed",sans-serif`}if(fs>=6){cx.fillStyle='#ffe3c4';cx.textAlign='center';cx.save();cx.translate(a,b);cx.transform(1,.577,0,1,0,0);cx.fillText(sn,0,fs*.35);cx.restore()}}
  if(lastLanes>=0&&lanes>lastLanes)regBounce=1;lastLanes=lanes;regBounce=Math.max(0,regBounce-dt*1.6);
  const pos=has('ck','POS terminal');for(let i=0;i<regs;i++){const x=rxw(i),bz=i===regs-1?Math.abs(Math.sin(regBounce*9))*regBounce*10:0;ibox(x,96,24+bz,14,10,7,'#3b3355');const jc=S.inc&&S.inc.type==='jam'&&(ph*4|0)%2?'#ff5a5f':'#4fe0a0';quad([[x+1,106.1,26],[x+13,106.1,26],[x+13,106.1,30],[x+1,106.1,30]],jc);const [a,b]=P(x+7,106,28);glow(a,b,10,jc==='#4fe0a0'?'79,224,160':'255,90,95',.35);if(pos)ibox(x+3,98,31,8,4,8,'#5c6aa8')}
  {const [a,b]=P(cx0+cw/2,102,20);SCENE_HITS.push({k:'ck',x:a,y:b,r:50*s*1.6})}
  deco('counter',{night});deco('floorFront',{night});
  /* checkout bottleneck: a line forms in front of the registers */
  if(R.lim==='ck'&&FAC){const n=Math.min(5,2+Math.round((1-Math.min(1,R.E))*4));for(let q=n-1;q>=0;q--)iperson(rxw(0)+6+q*4,140+q*12,BODY[q%BODY.length],'#333',mv?Math.sin(ph*3+q)*.8:0)}
  if(lanes>regs){const [a,b]=P(cx0+cw+8,112,10);cx.fillStyle='#fff';cx.font='600 10px Barlow,sans-serif';cx.textAlign='left';cx.fillText('+'+fmt(lanes-regs),a,b)}
  for(const p of peeps)if(p.y>=92&&p.y<=150)drawPeep(p,mv);
  /* the half wall between store and shop goes in front of anyone walking beside it */
  ibox(198,0,0,6,150,34,mix('#6b6488','#e9e1f5',day));
  peeps=peeps.filter(p=>!p.gone);
  /* service bays: a truck drives in from the lot, goes up on the lift, gets worked on, then leaves */
  if(S.sv.open){const bw=126/doors,busyN=R.sv.work>0?Math.max(1,Math.round(doors*R.sv.E)):0,liftOn=has('vb','Truck lift');
    for(let d=0;d<doors;d++){const bx=204+d*bw,busy=d<busyN;
      if(liftOn){ibox(bx+4,30,0,4,4,50,'#ffb627');ibox(bx+bw-8,30,0,4,4,50,'#ffb627')}
      if(busy){const cyc=mv?(ph*.06+d*.37):(d*.37+.5),t=cyc%1,ci=Math.floor(cyc)+d;let off=0;if(t<.14)off=(1-t/.14)*150;else if(t>.86)off=(t-.86)/.14*150;
        const lift=liftOn&&off===0?10:0,tc=S.inc&&S.inc.type==='lift'?'#8a87a0':BODY[ci%BODY.length],len=Math.max(30,bw*.8-26);
        const [a,b]=P(bx+bw/2,90,0);glow(a,b-20*s,60*s,'255,200,120',.2);
        itruck(bx+(bw-len-24)/2,36+off,tc,len,lift);
        iperson(bx+bw-6,110,'#1565c0','#1565c0',mv?Math.sin(ph*5+d)*1.5:0);
        if(mv&&off===0&&!(S.inc&&S.inc.type==='lift')&&Math.random()<.35){const [sx2,sy2]=P(bx+bw/2,62,lift+18);for(let q=0;q<2;q++)sparks.push({x:sx2+(Math.random()-.5)*8,y:sy2,vx:(Math.random()-.5)*60,vy:-30-Math.random()*40,l:.5})}}}}
  for(const k of sparks){k.x+=k.vx*dt;k.y+=k.vy*dt;k.vy+=160*dt;k.l-=dt;const a=Math.max(0,k.l*2);glow(k.x,k.y,5,'255,190,80',a*.5);cx.fillStyle=`rgba(255,240,180,${a})`;cx.beginPath();cx.arc(k.x,k.y,1.2,0,7);cx.fill()}
  sparks=sparks.filter(k=>k.l>0);if(sparks.length>80)sparks.splice(0,sparks.length-80);
  deco('floorShop',{night});deco('ceil',{night});
  /* the roof sign */
  {const [a,b]=P(100,-6,92);const sn=storeName().toUpperCase();cx.font=`700 ${Math.max(7,Math.round(11*s*1.6))}px "Barlow Condensed",sans-serif`;const tw=cx.measureText(sn).width+14,hh=Math.max(12,16*s*1.6);
    if(!deco('sign',{a,b,sn,tw,hh,night})){rr(a-tw/2,b-hh/2,tw,hh,hh/2,'#2a1838');if(night>.4)glow(a,b,tw*.7,'255,170,120',.25*night);cx.fillStyle='#ffe3c4';cx.textAlign='center';cx.textBaseline='middle';cx.fillText(sn,a,b+1);cx.textBaseline='alphabetic'}}
  deco('roof',{night});
  /* the lot: trees, parked trucks, the delivery van, lamp posts and the shop dog */
  {const L=[];const add=(d,f)=>L.push([d,f]);
   deco('lot',{add,night});
   const trucks=Math.min(3,Math.ceil(Math.log10(1+customers()))),tc=[paint(),'#1565c0','#2e7d32'];for(let i=0;i<trucks;i++)add(230+i*56+180,()=>itruck(230+i*56,176,tc[i],18));
   if(has('ck','Delivery van')||has('ck','Box truck'))add(165+170,()=>{ibox(150,160,2,28,18,18,paint());quad([[178,164,10],[178,174,10],[178,174,18],[178,164,18]],'#bfe6ff')});
   if(mv){dog.x+=dog.dir*dt*14;dog.t-=dt;if(dog.x<225||dog.x>360||dog.t<0){dog.dir*=-1;dog.t=2+Math.random()*4;dog.x=Math.max(225,Math.min(360,dog.x))}}if(!dog.x||dog.x<225)dog.x=290;
   add(dog.x+206,()=>{const [a,b]=P(dog.x,206,0);cx.save();cx.translate(a,b);cx.scale(s*1.4,s*1.4);dogDraw(0,0,dog.dir,mv?Math.abs(Math.sin(ph*10)):0);cx.restore();dogHit={x:a,y:b-6};if(dogTap>0){dogTap-=dt;bubble(a,b-14*s*1.4,dogName()+' wags')}});
   for(const p of peeps)if(p.y>150)add(p.x+p.y,()=>drawPeep(p,mv));
   if(spotNow){spotNow.t+=dt;const f=spotNow.t/8;if(f>1)spotNow=null;else{const x=390-f*440;add(x+198+60,()=>itruck(x,198,spotNow.c,40))}}
   L.sort((a,b)=>a[0]-b[0]);for(const [,f] of L)f();{const [a,b]=P(290,190,0);SCENE_HITS.push({k:'cu',x:a,y:b,r:55*s*1.6})}{const [a,b]=P(100,55,0);SCENE_HITS.push({k:'sk',x:a,y:b,r:30*s*1.6})}{const [a,b]=P(266,70,20);SCENE_HITS.push({k:S.sv.open?'service':'svlock',x:a,y:b,r:60*s*1.6})}}
  /* incidents you can tap */
  hit=null;
  if(S.inc&&S.inc.type==='spill'){const [a,b]=P(120,70,0);cx.fillStyle='rgba(140,90,40,.85)';cx.beginPath();cx.ellipse(a,b,20*s*1.6,8*s*1.6,0,0,7);cx.fill();cx.fillStyle='rgba(255,255,255,.3)';cx.beginPath();cx.ellipse(a-6*s,b-2*s,6*s*1.6,2*s*1.6,0,0,7);cx.fill();hit={x:a,y:b}}
  if(S.inc&&S.inc.type==='thief'){const f=1-Math.max(0,(S.inc.end-now())/2e4),x=30+f*170,y=40+f*120;iperson(x,y,'#2a2440','#2a2440',Math.sin(ph*14)*2);const [a,b]=P(x,y,20);hit={x:a,y:b}}
  deco('ring',{});
  /* weather over the whole picture */
  if(w==='rain'){cx.strokeStyle='rgba(170,200,235,.7)';cx.lineWidth=1;cx.beginPath();for(const [a,b,v] of DROPS){const y=(b*H+ph*160*v*(mv?1:0))%H,x=a*W;cx.moveTo(x,y);cx.lineTo(x-3,y+8)}cx.stroke()}
  if(w==='snow'){cx.fillStyle='rgba(255,255,255,.9)';for(const [a,b,v] of DROPS){const y=(b*H+ph*22*v*(mv?1:0))%H,x=a*W+Math.sin(ph*2+b*9)*4;cx.beginPath();cx.arc(x,y,1.4,0,7);cx.fill()}}
  finish(W,H,0,mv,day);
}
/* customers: in through the front opening, up the walkway beside the counter, browse a shelf, come back
   around to the front of a register, pay, and walk out to the lot. They never cross the counter. */
const AISLE_X=188;
function route(p,pts){p.path=pts.slice();}
/* the store follows your phone's clock: morning rush, lunch rush, a quieter evening and a slow night shift. Only the picture changes. */
function rushNow(){const d=new Date(),h=d.getHours()+d.getMinutes()/60;return h>=7&&h<9?1.7:h>=11.5&&h<13?1.5:h>=16.5&&h<18.5?1.2:h>=21||h<5.5?.5:1}
const NAMES=['Ray','Dolores','Hank','Tammy','Gus','Priya','Earl','Rosa','Walt','Mike','Luis','Dana','Kenji','Shay','Bo','Marlene','Andre','Cody','Ines','Vern'];
const WHO=['owner-operator','fleet mechanic','farmer','dispatcher','tow operator','bus garage tech','dump truck driver','RV owner','diesel tech','delivery driver'];
function stepPeeps(dt,mv,regs,rxw){
  const add=o=>{const p=Object.assign({x:AISLE_X,y:225,c:pick(BODY),st:0,w:0,nm:pick(NAMES),who:pick(WHO),qty:1+Math.floor(Math.random()*3)},o);p.sx=20+Math.random()*150;p.tx=rxw(Math.floor(Math.random()*regs))+6;route(p,[[AISLE_X,140],[AISLE_X,40],[p.sx,32]]);peeps.push(p)};
  if(mv&&FAC){spawn+=dt*Math.min(2.5,.25+Math.log10(1+R.moved)*.5)*(R.lim==='cu'?.45:1)*rushNow();while(spawn>1){spawn--;if(peeps.length<9)add({})}}
  if(regNow&&mv){const r=regNow.r;add({c:r.body,hat:r.hat,reg:regNow,bt:7});peeps[peeps.length-1].tx=rxw(0)+6;regNow=null}else if(regNow&&!mv)regNow=null;
  for(const p of peeps){
    if(p.path&&p.path.length){const [tx,ty]=p.path[0],dx=tx-p.x,dy=ty-p.y,d=Math.hypot(dx,dy),sp=p.st===4?90:75;
      if(d<2){p.path.shift();if(!p.path.length){if(p.st===0){p.st=1;p.w=.8+Math.random()*1.2}else if(p.st===2){p.st=3;p.w=1.2}else if(p.st===4)p.gone=true}}
      else{const m=Math.min(d,sp*dt);p.x+=dx/d*m;p.y+=dy/d*m}continue}
    if(p.st===1){p.w-=dt;if(p.w<=0){p.st=2;route(p,[[p.sx,40],[AISLE_X,40],[AISLE_X,126],[p.tx,126]])}}
    else if(p.st===3){p.w-=dt*(R.E<1?.5:1);if(p.reg&&p.bt>0)p.w=Math.max(p.w,.1);if(p.w<=0){p.st=4;route(p,[[AISLE_X,128],[AISLE_X,160],[AISLE_X+20,225]])}}}}
function drawPeep(p,mv){const walk=p.st===0||p.st===2||p.st===4,bob=walk&&mv?Math.sin(ph*12)*2:0;iperson(p.x,p.y,p.c,p.hat||'#333',bob);{const [a,b]=P(p.x,p.y,20);p.sx2=a;p.sy2=b}
  if(p.info>0){p.info-=1/60;const [a,b]=P(p.x,p.y,42);bubble(a,b,p.reg?`${p.reg.r.n}, ${p.reg.r.who}`:`${p.nm}, ${p.who}. ${p.st<=1?'Looking for':'Buying'} ${p.qty} ${curPart()}${p.qty>1?'s':''}`)}
  if(p.st===2||p.st===3){const [a,b]=P(p.x+6,p.y,16);rr(a-3*s*1.6,b-3*s*1.6,7*s*1.6,6*s*1.6,1.5,'#e0a35a')}
  if(p.reg&&p.bt>0&&p.st>=1){p.bt-=1/60;const [a,b]=P(p.x,p.y,40);bubble(a,b,p.reg.r.n+': '+p.reg.line)}}
/* the finishing pass: drifting specks of light, a warm top light, a cool shadow at the bottom and a soft vignette */
const MOTES=Array.from({length:22},()=>({x:Math.random(),y:Math.random(),r:.6+Math.random()*1.6,s:.004+Math.random()*.012,p:Math.random()*7}));
function finish(W,H,floorY,mv,day){
  for(const m of MOTES){if(mv){m.y-=m.s*.016*3;m.x+=Math.sin(ph*.6+m.p)*.0004;if(m.y<-.02){m.y=1.02;m.x=Math.random()}}
    const a=(.25+.25*Math.sin(ph*2+m.p))*(.4+.6*(1-day*.5));glow(m.x*W,m.y*H,m.r*4,'255,236,190',a*.5);cx.fillStyle=`rgba(255,248,225,${a})`;cx.beginPath();cx.arc(m.x*W,m.y*H,m.r*.7,0,7);cx.fill()}
  let g=cx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(255,190,120,.10)');g.addColorStop(.55,'rgba(255,190,120,0)');g.addColorStop(1,'rgba(40,20,90,.22)');cx.fillStyle=g;cx.fillRect(0,0,W,H);
  g=cx.createRadialGradient(W/2,H*.45,Math.min(W,H)*.35,W/2,H*.45,Math.max(W,H)*.75);g.addColorStop(0,'rgba(20,10,50,0)');g.addColorStop(1,'rgba(20,10,50,.38)');cx.fillStyle=g;cx.fillRect(0,0,W,H)}
requestAnimationFrame(frame);
{const pts=new Map();let start=null,moved=false,lastTap=0;cv.style.touchAction='pan-y';
 const dist=()=>{const v=[...pts.values()];return Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)};
 cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=false;if(pts.size===2)start={d:dist(),z:VIEW.z};else start={x:e.clientX,y:e.clientY,vx:VIEW.x,vy:VIEW.y,z:VIEW.z}});
 cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pts.size===2&&start&&start.d){VIEW.z=Math.max(1,Math.min(3,start.z*dist()/start.d));moved=true}
   else if(pts.size===1&&start&&VIEW.z>1.01&&start.x!==undefined){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.hypot(dx,dy)>6){moved=true;VIEW.x=start.vx+dx;VIEW.y=start.vy+dy}}
   cv.style.touchAction=VIEW.z>1.01?'none':'pan-y';const lim=W*(VIEW.z-1)*.7;VIEW.x=Math.max(-lim,Math.min(lim,VIEW.x));VIEW.y=Math.max(-lim,Math.min(lim,VIEW.y));if(VIEW.z<=1.01){VIEW.x=0;VIEW.y=0}});
 const up=e=>{pts.delete(e.pointerId);if(pts.size<2)start=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{if(!e.ctrlKey&&VIEW.z<=1.01)return;e.preventDefault();VIEW.z=Math.max(1,Math.min(3,VIEW.z*(e.deltaY<0?1.12:1/1.12)));if(VIEW.z<=1.01){VIEW.x=0;VIEW.y=0}},{passive:false});
 cv.addEventListener('click',e=>{if(moved){moved=false;e.stopImmediatePropagation();return}const t=Date.now();if(t-lastTap<300&&VIEW.z>1.01){VIEW.z=1;VIEW.x=0;VIEW.y=0;cv.style.touchAction='pan-y';e.stopImmediatePropagation();return}lastTap=t},true)}
cv.addEventListener('click',e=>{const r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  {let bp=null,bd=22;for(const p of peeps){if(p.sx2===undefined)continue;const d=Math.hypot(x-p.sx2,y-p.sy2);if(d<bd){bd=d;bp=p}}if(bp){bp.info=3;return}}if(dogHit&&Math.abs(x-dogHit.x)<24&&Math.abs(y-dogHit.y)<24){dogTap=2.5;return}if(hit&&Math.abs(x-hit.x)<30&&Math.abs(y-hit.y)<30){fixInc();forceRender();return}let best=null,bd=1e9;for(const h of SCENE_HITS){const d=Math.hypot(x-h.x,y-h.y);if(d<h.r&&d<bd){bd=d;best=h}}if(best&&typeof jumpTo==='function')jumpTo(best.k)});
}

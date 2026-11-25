/* ===== Parts Counter Idle: decorations. The store starts bare. The Customize shop screen sells thousands of
   decorations that only change the picture. Every decoration has a fixed spot, several share each spot, and only
   one per spot can be on at a time. Owned ones stay owned; switching between them is free. ===== */
const DECO_FIN=[['Red','#e53935'],['Orange','#fb8c00'],['Yellow','#fdd835'],['Lime','#9ccc65'],['Green','#2e7d32'],['Teal','#00897b'],['Sky','#4fc3f7'],['Blue','#1e63c8'],
 ['Purple','#7e57c2'],['Pink','#ec407a'],['Brown','#8d6e63'],['Black','#2b2b36'],['White','#f1eee8'],['Chrome','#c9d1dc'],['Gold','#f2b632'],['Rainbow','#ff5a5f']];
/* how much more a finish costs, in powers of ten: plain colours nearly the same, chrome, gold and rainbow a lot more */
const DECO_FUP=[0,.05,.1,.03,.08,.12,.06,.14,.18,.16,.02,.2,.22,.8,1.6,2.8];
const D=()=>{if(!S.deco||typeof S.deco!=='object')S.deco={};const d=S.deco;if(!d.own||typeof d.own!=='object')d.own={};if(!d.on||typeof d.on!=='object')d.on={};if(typeof d.sp!=='number')d.sp=NEG;return d};
const DUI={open:false,area:'Inside',spot:'f1',prev:null,filt:'all'};
{
const I=window.ISO,cx=I.cx,P=I.P,quad=I.quad,ibox=I.ibox,rr=I.rr,glow=I.glow,mix=I.mix,shade=I.shade,tint=I.tint;
let s=1,ph=0,night=0,day=1,mv=true;
const hsl=(h,sa,l)=>{sa/=100;l/=100;const k=n=>(n+h/30)%12,a=sa*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,9-k(n),1));return '#'+[f(0),f(8),f(4)].map(x=>Math.round(x*255).toString(16).padStart(2,'0')).join('')};
const lum=c=>{const v=[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)/255);return .3*v[0]+.59*v[1]+.11*v[2]};
const ink=c=>lum(c)>.62?'#2a1838':'#ffffff';
const dim=c=>mix(shade(c,.3),c,day);
const fol=c=>mix(c,'#3a8f5a',.3);
/* ---------- little drawing kit ---------- */
function ell(x,y,z,r,c){const [a,b]=P(x,y,z);cx.fillStyle=c;cx.beginPath();cx.ellipse(a,b,1.225*r*s,.707*r*s,0,0,7);cx.fill()}
function cyl(x,y,z,r,h,c,top){const [a,b]=P(x,y,z),[,t]=P(x,y,z+h),rx=1.225*r*s,ry=.707*r*s;cx.fillStyle=shade(c,.2);cx.beginPath();cx.ellipse(a,b,rx,ry,0,0,7);cx.fill();
  cx.fillStyle=c;cx.fillRect(a-rx,t,rx*2,b-t);cx.fillStyle=tint(c,.2);cx.fillRect(a-rx*.75,t,rx*.32,b-t);cx.fillStyle=shade(c,.12);cx.fillRect(a+rx*.5,t,rx*.5,b-t);
  cx.fillStyle=top||tint(c,.28);cx.beginPath();cx.ellipse(a,t,rx,ry,0,0,7);cx.fill()}
function cone(x,y,z,r0,r1,h,c){const [a,b]=P(x,y,z),[,t]=P(x,y,z+h),R0=1.225*r0*s,R1=1.225*r1*s;cx.fillStyle=c;cx.beginPath();cx.ellipse(a,b,R0,.707*r0*s,0,0,Math.PI);cx.lineTo(a-R1,t);cx.lineTo(a+R1,t);cx.closePath();cx.fill();
  cx.fillStyle=tint(c,.22);cx.beginPath();cx.moveTo(a-R0*.7,b);cx.lineTo(a-R1*.7,t);cx.lineTo(a-R1*.3,t);cx.lineTo(a-R0*.3,b);cx.fill();cx.fillStyle=tint(c,.3);cx.beginPath();cx.ellipse(a,t,R1,.707*r1*s,0,0,7);cx.fill()}
function ball(a,b,r,c){cx.fillStyle=c;cx.beginPath();cx.arc(a,b,r,0,7);cx.fill();cx.fillStyle=shade(c,.18);cx.beginPath();cx.arc(a+r*.18,b+r*.18,r*.82,0,7);cx.fill();cx.fillStyle=c;cx.beginPath();cx.arc(a-r*.05,b-r*.05,r*.8,0,7);cx.fill();cx.fillStyle='rgba(255,255,255,.55)';cx.beginPath();cx.arc(a-r*.35,b-r*.38,r*.26,0,7);cx.fill()}
function seg(a,b,c,d,col,w){cx.strokeStyle=col;cx.lineWidth=w;cx.lineCap='round';cx.beginPath();cx.moveTo(a,b);cx.lineTo(c,d);cx.stroke()}
function fronds(a,b,L,col,n,spread){for(let i=0;i<n;i++){const t=-Math.PI/2+(i-(n-1)/2)*spread+(mv?Math.sin(ph*1.4+i)*.05:0);cx.fillStyle=i%2?col:shade(col,.18);cx.beginPath();cx.ellipse(a+Math.cos(t)*L*.5,b+Math.sin(t)*L*.5,L*.5,L*.15,t,0,7);cx.fill()}}
function star(a,b,r,c){cx.fillStyle=c;cx.beginPath();for(let i=0;i<10;i++){const t=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r;cx.lineTo(a+Math.cos(t)*q,b+Math.sin(t)*q)}cx.fill()}
/* a flat panel on a wall (or a counter front): u runs along it, v runs up, both from -1 to 1 */
function plane(c,u,hw,hh){const [X,Y,Z]=c,[ux,uy]=u,p=(a,v)=>[X+a*hw*ux,Y+a*hw*uy,Z+v*hh],sk=ux?.577:-.577,ar=hh/hw;
  const W={p,s:(a,v)=>P(...p(a,v)),
   q(u0,v0,u1,v1,col){quad([p(u0,v0),p(u1,v0),p(u1,v1),p(u0,v1)],col)},
   poly(pts,col){quad(pts.map(([a,v])=>p(a,v)),col)},
   oval(a,v,rx,ry,col,n=20){const pts=[];for(let i=0;i<n;i++){const t=i/n*6.2832;pts.push([a+Math.cos(t)*rx*ar,v+Math.sin(t)*ry])}W.poly(pts,col)},
   circ(a,v,r,col,n){W.oval(a,v,r,r,col,n)},
   text(a,v,str,size,col,gl,wt){const [x,y]=P(...p(a,v));cx.save();cx.translate(x,y);cx.transform(1,sk,0,1,0,0);cx.font=`${wt||700} ${Math.max(4,size*hh*s)}px "Barlow Condensed",sans-serif`;cx.textAlign='center';cx.textBaseline='middle';if(gl){cx.shadowColor=col;cx.shadowBlur=gl}cx.fillStyle=col;cx.fillText(str,0,0);cx.restore()},
   path(pts,col,w,gl,close){cx.save();if(gl){cx.shadowColor=col;cx.shadowBlur=gl}cx.strokeStyle=col;cx.lineWidth=Math.max(.8,w*hh*s);cx.lineCap='round';cx.lineJoin='round';cx.beginPath();pts.forEach(([a,v],i)=>{const [x,y]=P(...p(a,v));i?cx.lineTo(x,y):cx.moveTo(x,y)});if(close)cx.closePath();cx.stroke();cx.restore()},
   segs(list,col,w){cx.strokeStyle=col;cx.lineWidth=Math.max(.6,w*s);cx.beginPath();for(const [a0,v0,a1,v1] of list){const [x0,y0]=P(...p(a0,v0)),[x1,y1]=P(...p(a1,v1));cx.moveTo(x0,y0);cx.lineTo(x1,y1)}cx.stroke()},
   neon(pts,col,w,close){W.path(pts,col,w,6+night*10,close);W.path(pts,tint(col,.6),w*.35,0,close)}};
  return W}
const wallP=g=>plane(g.c,g.u,g.m/2,g.m/2);
const cord=(x,y,z1)=>{const [a,b]=P(x,y,80),[c,d]=P(x,y,z1);seg(a,b,c,d,'#2a2440',Math.max(.8,.5*s))};
/* ---------- the catalogue: what goes where ---------- */
const NO_FIN=[-1];
const PAL={xmas:['#ff5252','#ffd740','#69f0ae','#40c4ff'],hall:['#ff8f00','#9c64ff','#76ff03'],july:['#d32f2f','#ffffff','#1565c0'],valentine:['#e91e63','#f8bbd0','#ff5c8a'],
 shamrock:['#2e7d32','#66bb6a','#ffd54f'],thanks:['#e65100','#f9a825','#bf360c'],newyear:['#ffd740','#40c4ff','#ff5252'],fall:['#ef6c00','#bf360c','#f9a825'],warm:['#ffe9b0']};
function bulbs(cols,blink,o){let i=0;const pts=[];for(let x=6;x<(S.sv.open?330:200);x+=12)pts.push([x,0]);for(let y=6;y<150;y+=12)pts.push([0,y]);
  for(const [x,y] of pts){const [a,b]=P(x,y,74+Math.sin((x+y)*.2)*2),c=cols[i%cols.length],on=!blink||((ph*2+i)|0)%4!==0;i++;
    if(on&&night>.2)glow(a,b,7,'255,240,200',.25+.3*night);cx.fillStyle=on?c:'#555';cx.beginPath();cx.arc(a,b,Math.max(1.4,1.1*s*1.6),0,7);cx.fill()}}
const T={
 floorfin:{lay:'floor',at:()=>[100,75,0],z:1.15,kinds:[
  ['Tinted floor',(g,c,o)=>quad([[0,0,.05],[200,0,.05],[200,150,.05],[0,150,.05]],mix(o.fl,dim(c),.55))],
  ['Racing stripes',(g,c)=>{for(const y0 of [60,72])quad([[0,y0,.05],[200,y0,.05],[200,y0+7,.05],[0,y0+7,.05]],dim(c))}],
  ['Wood planks',(g,c)=>{quad([[0,0,.05],[200,0,.05],[200,150,.05],[0,150,.05]],dim(mix('#9a6a48',c,.3)));cx.strokeStyle='rgba(40,20,10,.25)';cx.lineWidth=Math.max(.5,.4*s);cx.beginPath();
    for(let y=8,r=0;y<150;y+=8,r++){let [a,b]=P(0,y,.06);cx.moveTo(a,b);[a,b]=P(200,y,.06);cx.lineTo(a,b);for(let x=(r%3)*22+10;x<200;x+=66){[a,b]=P(x,y-8,.06);cx.moveTo(a,b);[a,b]=P(x,y,.06);cx.lineTo(a,b)}}cx.stroke()}],
  ['Big tiles',(g,c,o)=>{quad([[0,0,.05],[200,0,.05],[200,150,.05],[0,150,.05]],mix(o.fl,dim(c),.35));cx.strokeStyle='rgba(255,255,255,.25)';cx.lineWidth=Math.max(.6,.5*s);cx.beginPath();
    for(let x=25;x<200;x+=25){let [a,b]=P(x,0,.06);cx.moveTo(a,b);[a,b]=P(x,150,.06);cx.lineTo(a,b)}for(let y=25;y<150;y+=25){let [a,b]=P(0,y,.06);cx.moveTo(a,b);[a,b]=P(200,y,.06);cx.lineTo(a,b)}cx.stroke()}],
  ['Checker tiles',(g,c)=>{quad([[0,0,.05],[200,0,.05],[200,150,.05],[0,150,.05]],dim('#ebe7ef'));for(let i=0;i<10;i++)for(let j=0;j<8;j++)if((i+j)%2){const y1=Math.min(150,j*20+20);quad([[i*20,j*20,.06],[i*20+20,j*20,.06],[i*20+20,y1,.06],[i*20,y1,.06]],dim(c))}}],
  ['Diamond plate',(g,c)=>{quad([[0,0,.05],[200,0,.05],[200,150,.05],[0,150,.05]],dim(mix('#a7afbf',c,.3)));cx.fillStyle='rgba(255,255,255,.32)';cx.beginPath();
    for(let x=5;x<200;x+=10)for(let y=5;y<150;y+=10){const k=(x+y)%20?1:-1,[a,b]=P(x,y,.06);cx.moveTo(a-1.6*s,b-k*.6*s);cx.lineTo(a+1.6*s,b+k*.6*s);cx.lineTo(a+1.2*s,b+k*1.2*s);cx.lineTo(a-2*s,b);}cx.fill()}]]},
 paint:{lay:'paint',at:()=>[60,0,40],z:1.15,kinds:[
  ['Two-tone wall',(g,c)=>{for(const W of walls())W.q(-1,-1,1,-.25,dim(c))}],
  ['Painted stripe',(g,c)=>{for(const W of walls())W.q(-1,-.05,1,.12,dim(c))}],
  ['Wainscot panels',(g,c)=>{for(const [W,hw] of walls(1)){W.q(-1,-1,1,-.38,dim(c));W.q(-1,-.42,1,-.36,dim(shade(c,.25)));const L=[];for(let u=-1+10/hw;u<1;u+=10/hw)L.push([u,-1,u,-.42]);W.segs(L,'rgba(0,0,0,.18)',.5)}}],
  ['Full repaint',(g,c)=>{for(const W of walls())W.q(-1,-1,1,1,dim(c))}],
  ['Checker band',(g,c)=>{for(const [W,hw] of walls(1)){const st=6/hw;let i=0;for(let u=-1;u<1;u+=st,i++){W.q(u,0,Math.min(1,u+st),.08,i%2?dim(c):dim('#f4f1ea'));W.q(u,.08,Math.min(1,u+st),.16,i%2?dim('#f4f1ea'):dim(c))}}}],
  ['Brick wall',(g,c)=>{for(const [W,hw] of walls(1)){W.q(-1,-1,1,1,dim(mix('#b5523b',c,.55)));const L=[];for(let r=0;r<20;r++){const v=-1+r*.1;L.push([-1,v,1,v]);for(let u=-1+(r%2?6:0)/hw;u<1;u+=12/hw)L.push([u,v,u,v+.1])}W.segs(L,'rgba(255,255,255,.28)',.45)}}]]},
 rug:{lay:'rug',at:()=>[146,131,0],z:1.8,kinds:[
  ['Plain mat',(g,c)=>quad([[124,118,.1],[170,118,.1],[170,144,.1],[124,144,.1]],dim(c))],
  ['Striped mat',(g,c)=>{quad([[124,118,.1],[170,118,.1],[170,144,.1],[124,144,.1]],dim(c));for(const x of [131,145,159])quad([[x,118,.12],[x+4,118,.12],[x+4,144,.12],[x,144,.12]],dim(tint(c,.7)))}],
  ['Bordered mat',(g,c)=>{quad([[124,118,.1],[170,118,.1],[170,144,.1],[124,144,.1]],dim(tint(c,.45)));quad([[127,121,.12],[167,121,.12],[167,141,.12],[127,141,.12]],dim(c));quad([[133,126,.13],[161,126,.13],[161,136,.13],[133,136,.13]],dim(shade(c,.25)))}],
  ['Round rug',(g,c)=>{ell(147,131,.1,17,dim(c));ell(147,131,.12,12,dim(tint(c,.4)));ell(147,131,.14,6,dim(c))}],
  ['Long runner',(g,c)=>{quad([[112,122,.1],[180,122,.1],[180,138,.1],[112,138,.1]],dim(c));quad([[112,127,.12],[180,127,.12],[180,133,.12],[112,133,.12]],dim(shade(c,.25)));
    cx.strokeStyle=dim(tint(c,.6));cx.lineWidth=Math.max(.5,.4*s);cx.beginPath();for(let y=123;y<138;y+=2)for(const [x0,x1] of [[109,112],[180,183]]){let [a,b]=P(x0,y,.1);cx.moveTo(a,b);[a,b]=P(x1,y,.1);cx.lineTo(a,b)}cx.stroke()}],
  ['Checkered flag mat',(g,c)=>{for(let i=0;i<8;i++)for(let j=0;j<4;j++){const x=124+i*5.75,y=118+j*6.5;quad([[x,y,.1],[x+5.75,y,.1],[x+5.75,y+6.5,.1],[x,y+6.5,.1]],(i+j)%2?dim(c):dim('#f4f1ea'))}}]]},
 window:{lay:'window',at:()=>[0,70,40],z:1.7,kinds:[
  ['Flower box',(g,c)=>{const W=win();W.q(-.75,-1.3,.75,-1,c);W.q(-.75,-1.05,.75,-1,shade(c,.25));for(let i=0;i<9;i++){const u=-.66+i*.165;W.oval(u,-.9,.05,.12,'#3fae6a');W.circ(u,-.78,.07,['#ff6b8a','#ffd54f','#ffffff','#b388ff'][i%4])}}],
  ['Window decals',(g,c)=>{const W=win();for(let i=0;i<3;i++){const o=i*.16;W.poly([[.25+o,-1],[.35+o,-1],[1,-.1+o*1.6],[1,-.3+o*1.6]],i===1?tint(c,.5):c)}}],
  ['Blinds',(g,c)=>{const W=win();for(let i=0;i<7;i++){const v=1-i*.17;W.q(-1,v-.11,1,v,c);W.q(-1,v-.11,1,v-.08,shade(c,.2))}W.path([[-.9,1],[-.9,-.2]],shade(c,.4),.03)}],
  ['Curtains',(g,c)=>{const W=win();W.poly([[-1,1],[-.55,1],[-.72,-1],[-1,-1]],c);W.poly([[1,1],[.55,1],[.72,-1],[1,-1]],c);
    W.segs([[-.85,1,-.88,-1],[-.68,1,-.78,-1],[.85,1,.88,-1],[.68,1,.78,-1]],shade(c,.25),.8);W.q(-1,.78,1,1,shade(c,.15));for(let u=-.95;u<1;u+=.1)W.circ(u,.76,.05,shade(c,.15),8)}],
  ['Sale star',(g,c)=>{const W=win(),pts=[];for(let i=0;i<16;i++){const t=-Math.PI/2+i*Math.PI/8,r=i%2?.33:.52;pts.push([.55+Math.cos(t)*r*.55,.15-Math.sin(t)*r])}W.poly(pts,c);W.text(.55,.15,'SALE',.36,ink(c))}],
  ['Neon OPEN',(g,c)=>{const W=win(),on=!mv||Math.sin(ph*9)>-.97;W.text(0,.12,'OPEN',.78,on?c:shade(c,.5),on?6+night*12:0);if(on)W.text(0,.12,'OPEN',.78,tint(c,.55))}],
  ['Neon PARTS',(g,c)=>{const W=win();W.text(0,.22,'PARTS',.66,c,6+night*12);W.text(0,.22,'PARTS',.66,tint(c,.55));W.neon([[-.55,-.32],[.55,-.32]],c,.06)}],
  ['Neon wrench',(g,c)=>{const W=win(),R=.28;const pts=[];for(let i=0;i<=12;i++){const t=.9+i/12*4.5;pts.push([-.42+Math.cos(t)*R*.55,.1+Math.sin(t)*R])}W.neon(pts,c,.07);W.neon([[-.32,-.05],[.45,-.42]],c,.07);
    pts.length=0;for(let i=0;i<=10;i++){const t=-2.2+i/10*4.4;pts.push([.52+Math.cos(t+3.14)*.1,-.47+Math.sin(t+3.14)*.18])}W.neon(pts,c,.07)}],
  ['Neon truck',(g,c)=>{const W=win();W.neon([[-.6,-.4],[-.6,.25],[.15,.25],[.15,-.4]],c,.06,true);W.neon([[.15,.1],[.38,.1],[.55,-.1],[.55,-.4],[.15,-.4]],c,.06);
    for(const u of [-.42,.36]){const pts=[];for(let i=0;i<=12;i++){const t=i/12*6.2832;pts.push([u+Math.cos(t)*.07,-.45+Math.sin(t)*.13])}W.neon(pts,c,.05)}}]]},
 counter:{lay:'counter',at:()=>[37,102,30],z:2.4,kinds:[
  ['Succulent',(g,c)=>{cyl(37,102,24,2.6,3.5,c);const [a,b]=P(37,102,28);for(const [dx,dy,r] of [[-1.6,-.4,1.6],[1.5,-.2,1.5],[0,-1.6,1.8],[0,.2,1.5]])ball(a+dx*s,b+dy*s,r*s,'#58b27a')}],
  ['Tip jar',(g,c)=>{cx.globalAlpha=.5;cyl(37,102,24,2.8,7,'#cfe8f5');cx.globalAlpha=1;const [a,b]=P(37,102,25);cx.fillStyle='#f2b632';for(const [dx,dy] of [[-1,0],[1,-.3],[0,-1.2],[.8,-2]]){cx.beginPath();cx.ellipse(a+dx*s,b+dy*s,1.3*s,.6*s,0,0,7);cx.fill()}
    cx.fillStyle='#7fb87a';rr(a-1.6*s,b-3.8*s,3.2*s,1.6*s,.4*s,'#7fb87a');cyl(37,102,31,2.95,1,c)}],
  ['Service bell',(g,c)=>{ell(37,102,24,3.4,'#2a2440');const [a,b]=P(37,102,24.6);cx.fillStyle=c;cx.beginPath();cx.ellipse(a,b,3.4*s,3.2*s,0,Math.PI,0);cx.fill();cx.fillStyle='rgba(255,255,255,.45)';cx.beginPath();cx.ellipse(a-1.2*s,b-1.8*s,.8*s,1.1*s,-.5,0,7);cx.fill();rr(a-.5*s,b-4.6*s,1*s,1.6*s,.5*s,shade(c,.2))}],
  ['Candy bowl',(g,c)=>{const [a,b]=P(37,102,27.5);cx.fillStyle=c;cx.beginPath();cx.ellipse(a,b,4.4*s,3.6*s,0,0,Math.PI);cx.fill();cx.fillStyle=shade(c,.3);cx.beginPath();cx.ellipse(a,b,4.4*s,1.6*s,0,0,7);cx.fill();
    ['#ff5a5f','#ffd54f','#4fc3f7','#9ccc65','#f15bb5'].forEach((k,i)=>{cx.fillStyle=k;cx.beginPath();cx.arc(a+(i-2)*1.6*s,b-(i%2)*.9*s,1.05*s,0,7);cx.fill()})}],
  ['Bobblehead',(g,c)=>{cyl(37,102,24,2.4,1.3,shade(c,.2));const [a,b]=P(37,102,25.3),bob=mv?Math.sin(ph*7)*.7*s:0;rr(a-1.9*s,b-5*s,3.8*s,5*s,1.8*s,c);cx.fillStyle='#f2c29b';cx.beginPath();cx.arc(a+bob*.4,b-7.6*s+bob,2.8*s,0,7);cx.fill();
    cx.fillStyle=c;cx.beginPath();cx.arc(a+bob*.4,b-8.2*s+bob,2.9*s,Math.PI*1.05,Math.PI*1.95);cx.fill();cx.fillStyle='#2a1f3d';cx.beginPath();cx.arc(a+1.1*s+bob*.4,b-7.4*s+bob,.45*s,0,7);cx.fill()}],
  ['Desk radio',(g,c)=>{ibox(33,100,24,8,4,5,c);const [a,b]=P(35.5,104,26.6);cx.fillStyle='#2a2440';cx.beginPath();cx.arc(a,b,1.3*s,0,7);cx.fill();const [t1,t2]=P(40,101,29);seg(t1,t2,t1+4*s,t2-6*s,'#8f8aa8',Math.max(.6,.35*s));
    if(mv){const k=(ph*.6)%1;cx.globalAlpha=1-k;cx.fillStyle=c;cx.font=`700 ${Math.max(6,4*s)}px sans-serif`;cx.fillText('♪',a+2*s+k*3*s,b-6*s-k*8*s);cx.globalAlpha=1}}],
  ['Desk fan',(g,c)=>{ell(37,102,24,2.6,shade(c,.3));const [a,b]=P(37,102,24.5);seg(a,b,a,b-5*s,shade(c,.3),Math.max(1,.8*s));const fy=b-8.5*s,r=4*s,t=mv?ph*14:0;cx.fillStyle=tint(c,.25);
    for(let i=0;i<3;i++){const q=t+i*2.094;cx.beginPath();cx.ellipse(a+Math.cos(q)*r*.5,fy+Math.sin(q)*r*.5,r*.5,r*.22,q,0,7);cx.fill()}cx.strokeStyle=c;cx.lineWidth=Math.max(.7,.45*s);cx.beginPath();cx.arc(a,fy,r,0,7);cx.stroke();cx.fillStyle=c;cx.beginPath();cx.arc(a,fy,1*s,0,7);cx.fill()}],
  ['Lava lamp',(g,c)=>{cone(37,102,24,2.4,1.3,3,shade(c,.35));const [a,b]=P(37,102,27);cx.fillStyle='rgba(255,236,179,.75)';cx.beginPath();cx.ellipse(a,b-5*s,2*s,5.2*s,0,0,7);cx.fill();
    cx.fillStyle=c;for(let i=0;i<3;i++){const k=mv?(Math.sin(ph*.7+i*2.1)+1)/2:i/3;cx.beginPath();cx.ellipse(a+(i-1)*.5*s,b-1.5*s-k*7*s,1.2*s,1.5*s,0,0,7);cx.fill()}if(night>.3)glow(a,b-5*s,14*s,'255,200,120',.25*night);cone(37,102,34.5,1.3,.6,1.6,shade(c,.35))}],
  ['Snow globe',(g,c)=>{cyl(37,102,24,3,2,c);const [a,b]=P(37,102,30.3),r=4.2*s;cx.fillStyle='rgba(190,230,255,.45)';cx.beginPath();cx.arc(a,b,r,0,7);cx.fill();cx.fillStyle='#2e7d32';cx.beginPath();cx.moveTo(a,b-2.6*s);cx.lineTo(a+1.8*s,b+1.5*s);cx.lineTo(a-1.8*s,b+1.5*s);cx.fill();
    cx.fillStyle='#fff';for(let i=0;i<7;i++){const k=((mv?ph*.25:0)+i*.37)%1;cx.fillRect(a+Math.sin(i*2.7)*r*.7,b-r*.8+k*r*1.5,Math.max(.8,.5*s),Math.max(.8,.5*s))}cx.fillStyle='rgba(255,255,255,.6)';cx.beginPath();cx.arc(a-r*.4,b-r*.45,r*.2,0,7);cx.fill()}]]},
 wrap:{lay:'wrap',at:()=>[70,112,12],z:1.8,kinds:[
  ['Pinstripes',(g,c,o)=>{const W=front(o);W.q(-1,.45,1,.52,c);W.q(-1,-.52,1,-.45,c)}],
  ['Painted counter',(g,c,o)=>{ibox(o.x0,92,0,o.w,20,24,c,tint(c,.35))}],
  ['Racing checker',(g,c,o)=>{const W=front(o),st=5/(o.w/2);let i=0;for(let u=-1;u<1-1e-6;u+=st,i++){W.q(u,-.85,Math.min(1,u+st),-.62,i%2?c:'#f4f1ea');W.q(u,-.62,Math.min(1,u+st),-.39,i%2?'#f4f1ea':c)}}],
  ['Wood slats',(g,c,o)=>{const W=front(o);W.q(-1,-1,1,1,mix('#8d5a3b',c,.3));const L=[];for(let u=-1;u<1;u+=6/(o.w/2))L.push([u,-1,u,1]);W.segs(L,'rgba(40,20,10,.35)',.5)}],
  ['Flames',(g,c,o)=>{const W=front(o),n=Math.max(3,Math.round(o.w/14)),st=2/n;for(let i=0;i<n;i++){const u=-1+i*st,h=.55+((i*37)%5)/10+(mv?Math.sin(ph*5+i)*.06:0);
    W.poly([[u,-1],[u+st*.3,-1+h*.6],[u+st*.15,-1+h],[u+st*.6,-1+h*.7],[u+st*.75,-1+h*1.1],[u+st,-1]],c);W.poly([[u+st*.2,-1],[u+st*.45,-1+h*.55],[u+st*.7,-1+h*.45],[u+st*.8,-1]],mix(c,'#ffd54f',.6))}}],
  ['Diamond plate front',(g,c,o)=>{const W=front(o);W.q(-1,-1,1,1,mix('#a7afbf',c,.28));const L=[];for(let u=-1+.04;u<1;u+=8/(o.w/2))for(let v=-.8;v<.9;v+=.33)L.push([u,v,u+2/(o.w/2),v+.08]);W.segs(L,'rgba(255,255,255,.5)',.7)}]]},
 floor:{at:g=>[g.x,g.y,14],z:2,kinds:[
  ['Potted fern',(g,c)=>{cyl(g.x,g.y,0,4.6,8,c);ell(g.x,g.y,8,3.8,'#4a3426');const [a,b]=P(g.x,g.y,8);fronds(a,b,14*s,'#3fae6a',8,.42)}],
  ['Cactus pot',(g,c)=>{cyl(g.x,g.y,0,4,7,c);const [a,b]=P(g.x,g.y,7);rr(a-2.4*s,b-20*s,4.8*s,20*s,2.4*s,'#4caf6a');rr(a-7*s,b-14*s,3.4*s,7*s,1.7*s,'#4caf6a');rr(a-7*s,b-10*s,6*s,3*s,1.5*s,'#4caf6a');
    rr(a+3.6*s,b-17*s,3.4*s,8*s,1.7*s,'#4caf6a');rr(a+1*s,b-12*s,6*s,3*s,1.5*s,'#4caf6a');cx.fillStyle='rgba(255,255,255,.3)';cx.fillRect(a-1.4*s,b-19*s,1*s,17*s);cx.fillStyle='#ff6b8a';cx.beginPath();cx.arc(a,b-20.5*s,1.8*s,0,7);cx.fill()}],
  ['Floor lamp',(g,c)=>{ell(g.x,g.y,0,4,'#2a2440');const [a,b]=P(g.x,g.y,0);seg(a,b,a,b-34*s,'#3b3355',Math.max(1,1*s));cone(g.x,g.y,32,6,3.5,9,c);if(night>.25){const [x2,y2]=P(g.x,g.y,32);glow(x2,y2,30*s,'255,228,160',.35*night)}}],
  ['Tire stack',(g,c)=>{for(let i=0;i<3;i++)cyl(g.x,g.y,i*4.6,7,4.6,'#2b2838','#3d394e');ell(g.x,g.y,13.8,4,c);ell(g.x,g.y,13.9,1.6,'#2b2838');const [a,b]=P(g.x,g.y,7);cx.fillStyle=c;rr(a-8.6*s,b-1*s,17.2*s,1.4*s,.7*s,c)}],
  ['Gumball machine',(g,c)=>{ibox(g.x-3,g.y-3,0,6,6,4,c);cyl(g.x,g.y,4,1.4,10,c);const [a,b]=P(g.x,g.y,20),r=6*s;cx.fillStyle='rgba(220,240,255,.6)';cx.beginPath();cx.arc(a,b,r,0,7);cx.fill();
    ['#ff5a5f','#ffd54f','#4fc3f7','#9ccc65','#f15bb5','#ffffff','#9b5de5'].forEach((k,i)=>{cx.fillStyle=k;cx.beginPath();cx.arc(a+Math.cos(i*2.4)*r*.55,b+Math.sin(i*2.4)*r*.5+r*.2,1.3*s,0,7);cx.fill()});
    cx.fillStyle='rgba(255,255,255,.6)';cx.beginPath();cx.arc(a-r*.4,b-r*.45,r*.22,0,7);cx.fill();cyl(g.x,g.y,25.5,2.4,2,c)}],
  ['Water cooler',(g,c)=>{ibox(g.x-4,g.y-4,0,8,8,20,'#ece9f3');quad([[g.x-4,g.y+4.1,8],[g.x+4,g.y+4.1,8],[g.x+4,g.y+4.1,14],[g.x-4,g.y+4.1,14]],c);cx.globalAlpha=.85;cyl(g.x,g.y,20,3.5,10,'#7cc7ef');cx.globalAlpha=1;
    const [a,b]=P(g.x+1,g.y+4,16);rr(a-1.2*s,b-1*s,2.4*s,2*s,.8*s,shade(c,.2))}],
  ['Display case',(g,c)=>{ibox(g.x-7,g.y-5,0,14,10,12,c);ibox(g.x-2,g.y-2,12,4,4,5,'#f2b632');cx.globalAlpha=.32;ibox(g.x-7,g.y-5,12,14,10,13,'#bfe6ff');cx.globalAlpha=1;
    const [a,b]=P(g.x+6,g.y+5,24);seg(a-3*s,b+2*s,a-6*s,b+8*s,'rgba(255,255,255,.7)',Math.max(.7,.5*s))}],
  ['Bench seat',(g,c)=>{for(const dx of [-8,6])ibox(g.x+dx,g.y-2,0,2,5,6,'#3b3355');ibox(g.x-9,g.y-3,6,18,7,2,c);ibox(g.x-9,g.y-4,8,18,1.5,8,shade(c,.1))}],
  ['Vending machine',(g,c)=>{ibox(g.x-6,g.y-5,0,12,10,36,c);quad([[g.x-5,g.y+5.1,12],[g.x+1,g.y+5.1,12],[g.x+1,g.y+5.1,33],[g.x-5,g.y+5.1,33]],'#bfe6ff');
    for(let r=0;r<4;r++)for(let k=0;k<3;k++){const x=g.x-4.4+k*1.9,z=14.5+r*4.8;quad([[x,g.y+5.2,z],[x+1.3,g.y+5.2,z],[x+1.3,g.y+5.2,z+2.4],[x,g.y+5.2,z+2.4]],['#ff5a5f','#ffd54f','#2ec4a6','#3d8bfd'][(r+k)%4])}
    quad([[g.x+2,g.y+5.1,22],[g.x+5,g.y+5.1,22],[g.x+5,g.y+5.1,30],[g.x+2,g.y+5.1,30]],'#2a2440');if(night>.2){const [a,b]=P(g.x-2,g.y+5,22);glow(a,b,22*s,'190,230,255',.3*night)}}],
  ['Arcade cabinet',(g,c)=>{ibox(g.x-5,g.y-5,0,10,10,34,c);ibox(g.x-5,g.y+5,15,10,3,2,shade(c,.2));const hue=(ph*50)%360;quad([[g.x-4,g.y+5.1,20],[g.x+4,g.y+5.1,20],[g.x+4,g.y+5.1,29],[g.x-4,g.y+5.1,29]],'#14121f');
    for(let i=0;i<4;i++){const z=21+((i*2.3+(mv?ph*3:0))%7);quad([[g.x-3+i*1.8,g.y+5.2,z],[g.x-2+i*1.8,g.y+5.2,z],[g.x-2+i*1.8,g.y+5.2,z+1.2],[g.x-3+i*1.8,g.y+5.2,z+1.2]],hsl((hue+i*80)%360,85,60))}
    quad([[g.x-5,g.y+5.1,30],[g.x+5,g.y+5.1,30],[g.x+5,g.y+5.1,33.5],[g.x-5,g.y+5.1,33.5]],tint(c,.5));const [a,b]=P(g.x,g.y+5,25);glow(a,b,14*s,'140,200,255',.2+.3*night)}],
  ['Fish tank',(g,c)=>{ibox(g.x-8,g.y-4,0,16,8,12,c);cx.globalAlpha=.55;ibox(g.x-8,g.y-4,12,16,8,12,'#4fb6e8');cx.globalAlpha=1;
    for(let i=0;i<3;i++){const k=mv?((ph*.25+i*.33)%1):i/3,fx=g.x-6+(i%2?12-k*12:k*12),[a,b]=P(fx,g.y+4,15+i*2.6),d=i%2?-1:1;cx.fillStyle=['#ff8f00','#ffd54f','#ff5a5f'][i];cx.beginPath();cx.ellipse(a,b,1.8*s,1*s,0,0,7);cx.fill();cx.beginPath();cx.moveTo(a-d*1.6*s,b);cx.lineTo(a-d*3*s,b-1.1*s);cx.lineTo(a-d*3*s,b+1.1*s);cx.fill()}
    const [a,b]=P(g.x-6,g.y+4,13);fronds(a,b,6*s,'#3fae6a',3,.4)}],
  ['Trophy statue',(g,c)=>{ibox(g.x-5,g.y-5,0,10,10,12,c);const [a,b]=P(g.x,g.y,12);rr(a-3*s,b-2*s,6*s,2*s,.6*s,'#c48a1c');rr(a-.9*s,b-7*s,1.8*s,5*s,.6*s,'#f2b632');
    cx.fillStyle='#f2b632';cx.beginPath();cx.moveTo(a-5*s,b-15*s);cx.lineTo(a+5*s,b-15*s);cx.quadraticCurveTo(a+4.5*s,b-6*s,a,b-6.5*s);cx.quadraticCurveTo(a-4.5*s,b-6*s,a-5*s,b-15*s);cx.fill();
    cx.strokeStyle='#f2b632';cx.lineWidth=Math.max(.8,.8*s);cx.beginPath();cx.arc(a-5*s,b-12*s,2.2*s,1.6,4.7);cx.stroke();cx.beginPath();cx.arc(a+5*s,b-12*s,2.2*s,-1.6,1.6);cx.stroke();star(a,b-11*s,2*s,'#fff3c4')}]]},
 ceil:{lay:'ceil',at:g=>[g.x,g.y,62],z:1.9,kinds:[
  ['Paper lantern',(g,c)=>{cord(g.x,g.y,66);const [a,b]=P(g.x,g.y,60),sw=mv?Math.sin(ph*1.2)*.6*s:0;if(night>.2)glow(a+sw,b,26*s,'255,220,150',.35*night);cx.fillStyle=c;cx.beginPath();cx.ellipse(a+sw,b,5.2*s,6.4*s,0,0,7);cx.fill();
    cx.strokeStyle=shade(c,.3);cx.lineWidth=Math.max(.5,.35*s);for(const k of [-.55,0,.55]){cx.beginPath();cx.ellipse(a+sw,b,5.2*s*Math.abs(k||.02),6.4*s,0,0,7);cx.stroke()}rr(a+sw-2.4*s,b-7.4*s,4.8*s,1.4*s,.5*s,'#2a2440');rr(a+sw-2.4*s,b+6*s,4.8*s,1.4*s,.5*s,'#2a2440')}],
  ['Hanging sign',(g,c)=>{cord(g.x-10,g.y,60);cord(g.x+10,g.y,60);const W=plane([g.x,g.y,55],[1,0],13,5);W.q(-1,-1,1,1,c);W.q(-1,-1,1,-.75,shade(c,.25));W.text(0,0,g.sv?'SERVICE':'PARTS',1.3,ink(c))}],
  ['Ceiling fan',(g,c)=>{cord(g.x,g.y,71);ell(g.x,g.y,69,2.4,shade(c,.3));const t=mv?ph*5:0;for(let i=0;i<4;i++){const q=t+i*1.5708,dx=Math.cos(q),dy=Math.sin(q),nx=-dy*1.8,ny=dx*1.8;
    quad([[g.x+dx*2+nx,g.y+dy*2+ny,69.5],[g.x+dx*15+nx,g.y+dy*15+ny,69.5],[g.x+dx*15-nx,g.y+dy*15-ny,69.5],[g.x+dx*2-nx,g.y+dy*2-ny,69.5]],i%2?c:shade(c,.12))}cyl(g.x,g.y,66,2,3,shade(c,.3))}],
  ['Tire swing',(g,c)=>{const sw=mv?Math.sin(ph*1.1)*3:0,[a,b]=P(g.x,g.y,80),[x2,y2]=P(g.x,g.y,52);seg(a,b,x2+sw*s,y2,'#8d6e63',Math.max(.8,.6*s));const r=7*s;cx.fillStyle='#2b2838';cx.beginPath();cx.arc(x2+sw*s,y2+r,r,0,7);cx.fill();cx.fillStyle=c;cx.beginPath();cx.arc(x2+sw*s,y2+r,r*.55,0,7);cx.fill();cx.fillStyle=shade(c,.35);cx.beginPath();cx.arc(x2+sw*s,y2+r,r*.35,0,7);cx.fill()}],
  ['Model plane',(g,c)=>{cord(g.x,g.y,62);const [a,b]=P(g.x,g.y,58),sw=mv?Math.sin(ph*.9)*.12:0;cx.save();cx.translate(a,b);cx.rotate(sw);rr(-9*s,-1.7*s,18*s,3.4*s,1.7*s,c);rr(-3*s,-1*s,6*s,9*s,1.4*s,shade(c,.12));rr(-3*s,-8*s,6*s,7*s,1.4*s,tint(c,.15));
    rr(-9*s,-5*s,2.4*s,4*s,1*s,c);cx.fillStyle='#bfe6ff';cx.beginPath();cx.arc(5*s,-.4*s,1.2*s,0,7);cx.fill();const pr=mv?Math.abs(Math.sin(ph*30)):1;rr(9*s,-4*pr*s,1*s,8*pr*s,.5*s,'#2a2440');cx.restore()}],
  ['Disco ball',(g,c)=>{cord(g.x,g.y,66);const [a,b]=P(g.x,g.y,60),r=6*s;ball(a,b,r,'#d6dbe6');cx.fillStyle='rgba(60,60,90,.25)';for(let i=-2;i<=2;i++){cx.fillRect(a-r,b+i*r*.36,r*2,Math.max(.5,.25*s))}for(let i=-2;i<=2;i++)cx.fillRect(a+i*r*.36,b-r*.95,Math.max(.5,.25*s),r*1.9);
    for(let i=0;i<6;i++){const q=(mv?ph*.6:0)+i*1.047,[x,y]=P(g.x+Math.cos(q)*36,g.y+Math.sin(q)*28,0);glow(x,y,6*s,c==='#2b2b36'?'200,200,255':parseInt(c.slice(1,3),16)+','+parseInt(c.slice(3,5),16)+','+parseInt(c.slice(5,7),16),.35+.25*night)}
    if(mv&&(ph*3|0)%3===0)star(a-r*.4,b-r*.5,2.2*s,'#fff')}],
  ['Chandelier',(g,c)=>{cord(g.x,g.y,66);const [a,b]=P(g.x,g.y,62);cx.strokeStyle=c;cx.lineWidth=Math.max(1,.9*s);cx.beginPath();cx.ellipse(a,b,11*s,4*s,0,0,7);cx.stroke();for(let i=0;i<6;i++){const q=i*1.047,x=a+Math.cos(q)*11*s,y=b+Math.sin(q)*4*s;seg(a,b-4*s,x,y,c,Math.max(.6,.5*s));
    if(night>.2)glow(x,y-3*s,10*s,'255,230,170',.35*night);rr(x-.8*s,y-2.5*s,1.6*s,2.5*s,.5*s,'#fff8e1');cx.fillStyle='#ffd54f';cx.beginPath();cx.arc(x,y-3.4*s,.9*s,0,7);cx.fill()}ball(a,b-1*s,2.4*s,c)}]]},
 wall:{lay:'wall',at:g=>g.c,z:2.2,kinds:[
  ['Poster',(g,c)=>{const W=wallP(g);W.q(-.62,-.9,.62,.9,'#f6f1e6');W.q(-.62,.42,.62,.9,c);W.text(0,.66,'PARTS',.34,ink(c));W.q(-.45,-.38,.2,.1,c);W.q(.2,-.38,.45,-.08,shade(c,.2));W.circ(-.28,-.45,.13,'#2a2440');W.circ(.28,-.45,.13,'#2a2440');W.text(0,-.72,'OPEN DAILY',.15,'#555',0,600)}],
  ['Pennant',(g,c)=>{const W=wallP(g);W.path([[-.82,.75],[-.82,-.9]],'#6b4a3a',.06);W.poly([[-.8,.7],[.9,.32],[-.8,-.06]],c);W.poly([[-.8,.7],[-.56,.64],[-.56,0],[-.8,-.06]],tint(c,.6));W.text(.02,.32,'#1',.32,ink(c))}],
  ['Wall clock',(g,c)=>{const W=wallP(g),d=new Date(),hA=((d.getHours()%12)+d.getMinutes()/60)/12*6.2832,mA=d.getMinutes()/60*6.2832;W.circ(0,0,.86,c);W.circ(0,0,.7,'#fbf8f0');
    const L=[];for(let i=0;i<12;i++){const t=i/12*6.2832;L.push([Math.sin(t)*.58,Math.cos(t)*.58,Math.sin(t)*.66,Math.cos(t)*.66])}W.segs(L,'#2a2440',.6);W.path([[0,0],[Math.sin(hA)*.36,Math.cos(hA)*.36]],'#2a2440',.07);W.path([[0,0],[Math.sin(mA)*.55,Math.cos(mA)*.55]],'#2a2440',.045);W.circ(0,0,.06,c)}],
  ['License plates',(g,c)=>{const W=wallP(g);['TRK 4U','PARTS','10-4'].forEach((t,i)=>{const v=.58-i*.58;W.q(-.78,v-.22,.78,v+.22,'#f4f4f0');W.path([[-.78,v-.22],[.78,v-.22],[.78,v+.22],[-.78,v+.22]],c,.05,0,true);W.text(0,v-.01,t,.26,c)})}],
  ['Framed picture',(g,c)=>{const W=wallP(g);W.q(-.9,-.7,.9,.7,c);W.q(-.75,-.55,.75,.55,'#9fd7f0');W.poly([[-.75,-.55],[-.3,.25],[.05,-.15],[.38,.18],[.75,-.25],[.75,-.55]],'#5c8f6a');W.poly([[-.3,.25],[-.18,.05],[-.42,.05]],'#ffffff');W.circ(.45,.3,.12,'#ffd54f')}],
  ['Round mirror',(g,c)=>{const W=wallP(g);W.oval(0,0,.68,.9,c);W.oval(0,0,.55,.77,'#d7e8f2');W.poly([[-.35,.45],[-.15,.6],[.3,-.4],[.1,-.55]],'rgba(255,255,255,.55)')}],
  ['Specials chalkboard',(g,c)=>{const W=wallP(g);W.q(-.95,-.8,.95,.8,c);W.q(-.85,-.7,.85,.7,'#23392f');W.text(0,.34,'TODAY',.34,'#f4f1de');const t=(typeof curPart==='function'?curPart():'').split(' ').slice(-2).join(' ');W.text(0,-.2,t.length>14?t.slice(0,13)+'…':t,.22,'#f4f1de',0,600);W.path([[-.6,-.5],[.6,-.5]],'#ffcf4a',.04)}],
  ['Hubcap',(g,c)=>{const W=wallP(g);W.circ(0,0,.86,c);W.circ(0,0,.7,'#d7dde6');const L=[];for(let i=0;i<5;i++){const t=i/5*6.2832;L.push([Math.sin(t)*.18,Math.cos(t)*.18,Math.sin(t)*.66,Math.cos(t)*.66])}W.segs(L,'#8f96a8',1.4);W.circ(0,0,.2,c)}],
  ['Tool pegboard',(g,c)=>{const W=wallP(g);W.q(-.9,-.85,.9,.85,'#d9b48a');const L=[];for(let u=-.75;u<.8;u+=.25)for(let v=-.7;v<.8;v+=.25)L.push([u,v,u+.02,v]);W.segs(L,'rgba(80,50,30,.45)',1);
    W.path([[-.55,.55],[-.55,-.55]],c,.1);W.circ(-.55,.6,.15,c);W.path([[0,.5],[0,-.6]],shade(c,.2),.1);W.q(-.2,.4,.2,.62,c);W.path([[.5,.55],[.5,-.3]],c,.08);W.poly([[.38,-.3],[.62,-.3],[.5,-.62]],c)}],
  ['Wall TV',(g,c)=>{const W=wallP(g);W.q(-.95,-.62,.95,.62,'#1e1b2e');W.q(-.85,-.52,.85,.52,shade(c,.55));for(let i=0;i<5;i++){const h=.25+((Math.sin((mv?ph*2:0)+i*1.3)+1)/2)*.6;W.q(-.7+i*.3,-.45,-.52+i*.3,-.45+h,i%2?c:tint(c,.4))}W.text(0,.38,'PARTS TV',.2,'#fff');W.q(-.1,-.75,.1,-.62,'#1e1b2e')}],
  ['Trophy shelf',(g,c)=>{const W=wallP(g);W.q(-.95,-.5,.95,-.38,c);W.q(-.95,-.38,.95,-.33,tint(c,.3));for(const u of [-.55,0,.55]){const k=u?1:1.25;W.q(u-.16*k,-.33,u+.16*k,-.22,'#c48a1c');W.q(u-.04,-.22,u+.04,.0,'#f2b632');W.poly([[u-.24*k,.32*k],[u+.24*k,.32*k],[u+.16*k,0],[u-.16*k,0]],'#f2b632')}W.circ(0,.12,.07,'#fff3c4')}],
  ['Neon bolt',(g,c)=>{const W=wallP(g);W.neon([[.15,.85],[-.45,-.05],[.05,-.05],[-.2,-.85],[.5,.15],[0,.15],[.3,.85]],c,.08,true)}]]},
 banner:{lay:'banner',at:()=>[100,0,72],z:1.3,kinds:[
  ['Pennant string',(g,c)=>{const W=ban(),pts=[],sag=u=>.85-.35*Math.sin(Math.PI*(u+1)/2*2%Math.PI);for(let u=-1;u<=1.001;u+=.05)pts.push([u,sag(u)]);W.path(pts,'#3b3355',.08);let i=0;for(let u=-.97;u<.98;u+=.05,i++){const v=sag(u);W.poly([[u-.018,v],[u+.018,v],[u,v-1.3]],i%2?'#f4f1ea':c)}}],
  ['Checker strip',(g,c)=>{const W=ban(),st=4/92;let i=0;for(let u=-1;u<1-1e-6;u+=st,i++){W.q(u,-.6,Math.min(1,u+st),.15,i%2?c:'#f4f1ea');W.q(u,.15,Math.min(1,u+st),.9,i%2?'#f4f1ea':c)}}],
  ['Garland',(g,c)=>{const W=ban(),pts=[];for(let u=-1;u<=1.001;u+=.02)pts.push([u,.2+Math.sin(u*Math.PI*6)*.5]);W.path(pts,c,.35);W.path(pts,tint(c,.35),.1);for(let u=-1+1/12;u<1;u+=1/6)W.circ(u,-.35,.22,'#f2b632',10)}],
  ['Name banner',(g,c)=>{const W=ban();W.path([[-1,1],[-.55,.9]],'#3b3355',.08);W.path([[1,1],[.55,.9]],'#3b3355',.08);W.q(-.55,-.95,.55,.95,c);W.q(-.55,-.95,.55,-.7,shade(c,.2));W.text(0,0,storeName().toUpperCase(),1.25,ink(c))}],
  ['Bunting fans',(g,c)=>{const W=ban();for(let i=0;i<6;i++){const u=-.83+i*.332,pts=[[u-.09,1]];for(let k=0;k<=10;k++){const t=Math.PI*k/10;pts.push([u-.09*Math.cos(t),1-1.6*Math.sin(t)])}W.poly(pts,c);const p2=[[u-.05,1]];for(let k=0;k<=10;k++){const t=Math.PI*k/10;p2.push([u-.05*Math.cos(t),1-.9*Math.sin(t)])}W.poly(p2,'#f4f1ea')}}],
  ['LED ticker',(g,c)=>{const W=ban();W.q(-1,-1,1,1,'#14121f');cx.save();cx.beginPath();[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([u,v],i)=>{const [a,b]=W.s(u,v);i?cx.lineTo(a,b):cx.moveTo(a,b)});cx.closePath();cx.clip();
    const msg='★ '+storeName().toUpperCase()+' ★ PARTS · SERVICE · FRIENDLY ADVICE',len=msg.length*.03,off=mv?(ph*.12)%(len+2):0;W.text(1+len/2-off,0,msg,1.3,c,4);W.text(1+len/2-off+len+.5,0,msg,1.3,c,4);cx.restore()}]]},
 lights:{lay:'lights',at:()=>[100,0,76],z:1.15,kinds:[
  ['String lights',(g,c)=>bulbs([c],false)],
  ['Twinkle lights',(g,c)=>bulbs([c,'#fff8e1'],true)],
  ['Holiday lights (follow the calendar)',()=>{const sn=typeof seasonToday==='function'?seasonToday():'';bulbs(PAL[sn]||PAL.warm,sn==='xmas'||sn==='newyear')},NO_FIN,PAL.xmas.concat(PAL.hall)],
  ['Christmas lights',()=>bulbs(PAL.xmas,true),NO_FIN,PAL.xmas],
  ['Halloween lights',()=>bulbs(PAL.hall,true),NO_FIN,PAL.hall],
  ['Fourth of July lights',()=>bulbs(PAL.july,false),NO_FIN,PAL.july],
  ["Valentine's lights",()=>bulbs(PAL.valentine,false),NO_FIN,PAL.valentine],
  ["St. Patrick's lights",()=>bulbs(PAL.shamrock,false),NO_FIN,PAL.shamrock],
  ['Thanksgiving lights',()=>bulbs(PAL.thanks,false),NO_FIN,PAL.thanks],
  ['New Year lights',()=>bulbs(PAL.newyear,true),NO_FIN,PAL.newyear]]},
 sign:{lay:'sign',at:()=>[100,-6,92],z:1.6,kinds:[
  ['Painted sign',(g,c,o)=>{rr(o.a-o.tw/2,o.b-o.hh/2,o.tw,o.hh,o.hh/2,c);signText(o,ink(c))}],
  ['Wood plank sign',(g,c,o)=>{rr(o.a-o.tw/2-3,o.b-o.hh/2,o.tw+6,o.hh,3,'#8d5a3b');cx.fillStyle='rgba(40,20,10,.25)';for(const k of [-.25,.2])cx.fillRect(o.a-o.tw/2,o.b+k*o.hh,o.tw,Math.max(.6,.4*s));signText(o,c,'#2a1838')}],
  ['Neon tube sign',(g,c,o)=>{rr(o.a-o.tw/2,o.b-o.hh/2,o.tw,o.hh,o.hh/2,'#1a1424');cx.save();cx.shadowColor=c;cx.shadowBlur=6+o.night*10;cx.strokeStyle=c;cx.lineWidth=Math.max(1.2,.9*s);cx.beginPath();cx.roundRect?cx.roundRect(o.a-o.tw/2+2,o.b-o.hh/2+2,o.tw-4,o.hh-4,o.hh/2-2):cx.rect(o.a-o.tw/2+2,o.b-o.hh/2+2,o.tw-4,o.hh-4);cx.stroke();cx.restore();
    if(o.night>.3)glow(o.a,o.b,o.tw*.7,parseInt(c.slice(1,3),16)+','+parseInt(c.slice(3,5),16)+','+parseInt(c.slice(5,7),16),.25*o.night);signText(o,c,null,6+o.night*10)}],
  ['Marquee sign',(g,c,o)=>{const w=o.tw+8,h=o.hh+6;rr(o.a-w/2,o.b-h/2,w,h,4,c);const n=Math.max(6,Math.floor(w/7)),pts=[];for(let i=0;i<n;i++)pts.push([o.a-w/2+3+i*(w-6)/(n-1),o.b-h/2+2.5],[o.a-w/2+3+i*(w-6)/(n-1),o.b+h/2-2.5]);
    pts.forEach(([x,y],i)=>{const on=!mv||((ph*4+i)|0)%2===0;if(on)glow(x,y,4,'255,240,180',.5);cx.fillStyle=on?'#fff3c4':'#8a7f6a';cx.beginPath();cx.arc(x,y,1.3,0,7);cx.fill()});signText(o,ink(c))}],
  ['Chrome sign',(g,c,o)=>{const gr=cx.createLinearGradient(0,o.b-o.hh/2,0,o.b+o.hh/2);gr.addColorStop(0,'#f6f8fc');gr.addColorStop(.5,'#aab3c4');gr.addColorStop(1,'#e3e7ef');cx.fillStyle=gr;cx.beginPath();cx.roundRect?cx.roundRect(o.a-o.tw/2,o.b-o.hh/2,o.tw,o.hh,3):cx.rect(o.a-o.tw/2,o.b-o.hh/2,o.tw,o.hh);cx.fill();
    if(mv){const k=((ph*.3)%1.6-.3)*o.tw;cx.fillStyle='rgba(255,255,255,.55)';cx.beginPath();cx.moveTo(o.a-o.tw/2+k,o.b-o.hh/2);cx.lineTo(o.a-o.tw/2+k+6,o.b-o.hh/2);cx.lineTo(o.a-o.tw/2+k+2,o.b+o.hh/2);cx.lineTo(o.a-o.tw/2+k-4,o.b+o.hh/2);cx.fill()}signText(o,c,'#2a1838')}],
  ['Billboard',(g,c,o)=>{const w=o.tw*1.25+10,h=o.hh*2;rr(o.a-w*.35,o.b+h/2-2,2.5,h*.6,1,'#3b3355');rr(o.a+w*.35-2.5,o.b+h/2-2,2.5,h*.6,1,'#3b3355');rr(o.a-w/2,o.b-h/2,w,h,2,c);rr(o.a-w/2+3,o.b-h/2+3,w-6,h-6,2,'#f6f1e6');
    if(o.night>.3)for(const k of [-.3,.3])glow(o.a+k*w,o.b-h/2,w*.4,'255,240,200',.3*o.night);signText(o,c,null,0,1.5)}]]},
 roof:{lay:'roof',at:g=>[g.x,g.y,92],z:2,kinds:[
  ['Antenna',(g,c)=>{const [a,b]=P(g.x,g.y,80);seg(a,b,a,b-34*s,c,Math.max(.8,.7*s));for(const [h,w] of [[22,7],[28,5],[33,3]])seg(a-w*s,b-h*s,a+w*s,b-h*s,c,Math.max(.6,.5*s));const on=!mv||(ph*1.5|0)%2;if(on){glow(a,b-35*s,6*s,'255,80,80',.6);cx.fillStyle='#ff5252';cx.beginPath();cx.arc(a,b-35*s,1.2*s,0,7);cx.fill()}}],
  ['Roof flag',(g,c)=>flag(g.x,g.y,80,28,c,14)],
  ['Satellite dish',(g,c)=>{ibox(g.x-2,g.y-2,80,4,4,3,'#6b6488');const [a,b]=P(g.x,g.y,88);cx.save();cx.translate(a,b);cx.rotate(-.55);cx.fillStyle=c;cx.beginPath();cx.ellipse(0,0,9*s,5*s,0,0,7);cx.fill();cx.fillStyle=shade(c,.2);cx.beginPath();cx.ellipse(.8*s,.4*s,7*s,3.8*s,0,0,7);cx.fill();cx.restore();seg(a,b,a+5*s,b-7*s,'#3b3355',Math.max(.6,.5*s));cx.fillStyle='#3b3355';cx.beginPath();cx.arc(a+5*s,b-7*s,1.2*s,0,7);cx.fill();seg(a,b+2*s,a,b+6*s,'#6b6488',Math.max(.8,.8*s))}],
  ['Weather vane',(g,c)=>{const [a,b]=P(g.x,g.y,80);seg(a,b,a,b-26*s,'#3b3355',Math.max(.8,.6*s));const t=mv?ph*.5:0.6,k=Math.cos(t),y=b-22*s;seg(a-9*s*k,y,a+9*s*k,y,c,Math.max(1,1*s));cx.fillStyle=c;cx.beginPath();cx.moveTo(a+11*s*k,y);cx.lineTo(a+7*s*k,y-2.6*s);cx.lineTo(a+7*s*k,y+2.6*s);cx.fill();
    cx.beginPath();cx.moveTo(a-9*s*k,y);cx.lineTo(a-12*s*k,y-3.5*s);cx.lineTo(a-6*s*k,y);cx.fill();cx.fillStyle='#3b3355';cx.font=`700 ${Math.max(5,4*s)}px sans-serif`;cx.textAlign='center';cx.fillText('N',a,b-27*s);cx.beginPath();cx.arc(a,b-16*s,1.6*s,0,7);cx.fill()}],
  ['Water tank',(g,c)=>{for(const [dx,dy] of [[-5,-5],[4,-5],[-5,4],[4,4]])ibox(g.x+dx,g.y+dy,80,1.2,1.2,12,'#3b3355');cyl(g.x,g.y,92,7,12,c);cone(g.x,g.y,104,7.4,.6,6,shade(c,.15))}],
  ['Giant wrench',(g,c)=>{const [a,b]=P(g.x,g.y,80);ibox(g.x-3,g.y-3,80,6,6,3,'#6b6488');cx.save();cx.translate(a,b-4*s);cx.rotate(-.35);rr(-2.4*s,-32*s,4.8*s,30*s,2.2*s,c);cx.fillStyle=c;cx.beginPath();cx.arc(0,-34*s,6*s,0,7);cx.fill();cx.fillStyle='#000';cx.globalCompositeOperation='destination-out';cx.fillRect(-2.2*s,-42*s,4.4*s,7*s);cx.globalCompositeOperation='source-over';
    cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(-1.6*s,-30*s,1*s,26*s);cx.restore()}],
  ['Spotlight',(g,c)=>{const [a,b]=P(g.x,g.y,82),t=mv?Math.sin(ph*.5)*.6:0;const al=.08+.3*night;cx.save();cx.translate(a,b);cx.rotate(t);const gr=cx.createLinearGradient(0,0,0,-150*s);gr.addColorStop(0,`rgba(255,250,220,${al})`);gr.addColorStop(1,'rgba(255,250,220,0)');cx.fillStyle=gr;cx.beginPath();cx.moveTo(-2*s,0);cx.lineTo(-22*s,-150*s);cx.lineTo(22*s,-150*s);cx.lineTo(2*s,0);cx.fill();rr(-3.5*s,-5*s,7*s,7*s,2*s,c);cx.fillStyle='#fff8e1';cx.beginPath();cx.ellipse(0,-5*s,3*s,1.2*s,0,0,7);cx.fill();cx.restore();ibox(g.x-2,g.y-2,80,4,4,2,'#3b3355')}],
  ['Rooftop balloon',(g,c)=>{const [a,b]=P(g.x,g.y,80),bob=mv?Math.sin(ph*1.3)*2*s:0,sw=mv?Math.sin(ph*.7)*3*s:0;cx.strokeStyle='#6b6488';cx.lineWidth=Math.max(.6,.4*s);cx.beginPath();cx.moveTo(a,b);cx.quadraticCurveTo(a+sw,b-16*s,a+sw,b-30*s+bob);cx.stroke();
    cx.fillStyle=shade(c,.2);cx.beginPath();cx.moveTo(a+sw,b-28*s+bob);cx.lineTo(a+sw-1.6*s,b-25.5*s+bob);cx.lineTo(a+sw+1.6*s,b-25.5*s+bob);cx.fill();ball(a+sw,b-38*s+bob,10*s,c)}]]},
 lot:{lay:'lot',at:g=>[g.x,g.y,20],z:1.9,kinds:[
  ['Flower bed',(g,c)=>{ell(g.x,g.y,.3,12,'#5a3c2c');for(let i=0;i<10;i++){const t=i*2.4,r=3+((i*7)%8),[a,b]=P(g.x+Math.cos(t)*r,g.y+Math.sin(t)*r*.8,0);seg(a,b,a,b-4*s,'#3fae6a',Math.max(.6,.5*s));cx.fillStyle=i%3?c:tint(c,.45);cx.beginPath();cx.arc(a,b-4.8*s,2*s,0,7);cx.fill();cx.fillStyle='#fff3c4';cx.beginPath();cx.arc(a,b-4.8*s,.7*s,0,7);cx.fill()}}],
  ['Shade tree',(g,c)=>{const [a,b]=P(g.x,g.y,0),k=s*2,f=fol(c);rr(a-2*k,b-18*k,4*k,18*k,2,'#6b4a3a');cx.fillStyle=f;cx.beginPath();cx.arc(a,b-26*k,14*k,0,7);cx.fill();cx.fillStyle=tint(f,.3);cx.beginPath();cx.arc(a-4*k,b-30*k,6*k,0,7);cx.fill();cx.fillStyle=shade(f,.15);cx.beginPath();cx.arc(a+6*k,b-22*k,6*k,0,7);cx.fill()}],
  ['Pine tree',(g,c)=>{const [a,b]=P(g.x,g.y,0),k=s*2,f=mix(c,'#2e6b4a',.4);rr(a-1.6*k,b-8*k,3.2*k,8*k,1,'#6b4a3a');for(let i=0;i<3;i++){const w=(11-i*3)*k,y=b-6*k-i*8*k;cx.fillStyle=i%2?tint(f,.12):f;cx.beginPath();cx.moveTo(a,y-14*k);cx.lineTo(a+w,y);cx.lineTo(a-w,y);cx.fill()}}],
  ['Palm tree',(g,c)=>{const [a,b]=P(g.x,g.y,0),k=s*2;for(let i=0;i<8;i++){const t=i/8;rr(a+Math.sin(t*1.6)*6*k-1.8*k,b-(i+1)*4.4*k,3.6*k,4.8*k,1.4*k,i%2?'#8d6e63':'#a1887f')}const tx=a+Math.sin(1.6)*6*k,ty=b-36*k;fronds(tx,ty+4*k,22*k,fol(c),7,.5);fronds(tx,ty+8*k,18*k,shade(fol(c),.1),5,1.1);
    cx.fillStyle='#6b4a3a';for(const d of [-1,1]){cx.beginPath();cx.arc(tx+d*1.8*k,ty+1*k,1.6*k,0,7);cx.fill()}}],
  ['Park bench',(g,c)=>{for(const dx of [-11,9])ibox(g.x+dx,g.y-2,0,2,6,7,'#3b3355');ibox(g.x-12,g.y-3,7,24,8,2,c);ibox(g.x-12,g.y-4,9,24,1.6,9,shade(c,.1));ibox(g.x-12,g.y-4,13,24,1.6,1.5,tint(c,.15))}],
  ['Lamp post',(g,c)=>{ibox(g.x,g.y,0,2,2,60,c);const [a,b]=P(g.x+1,g.y+1,60);cx.fillStyle=night>.3?'#fff3c4':'#8f8aa8';cx.beginPath();cx.ellipse(a,b,5,2,0,0,7);cx.fill();
    if(night>.3){const al=Math.min(1,(night-.3)*2),[c2,d2]=P(g.x,g.y,0);const gr=cx.createRadialGradient(a,b,1,c2,d2,40*s*2);gr.addColorStop(0,`rgba(255,214,120,${.5*al})`);gr.addColorStop(1,'rgba(255,214,120,0)');cx.fillStyle=gr;cx.beginPath();cx.moveTo(a-2,b);cx.lineTo(c2-36*s*2,d2+6);cx.lineTo(c2+36*s*2,d2+6);cx.lineTo(a+2,b);cx.fill()}}],
  ['Flag pole',(g,c)=>flag(g.x,g.y,0,70,c,22)],
  ['Picnic table',(g,c)=>{for(const dx of [-9,8])ibox(g.x+dx,g.y-4,0,2,8,12,'#3b3355');ibox(g.x-12,g.y-12,6,24,4,1.6,shade(c,.1));ibox(g.x-12,g.y+8,6,24,4,1.6,shade(c,.1));ibox(g.x-12,g.y-6,12,24,12,2,c)}],
  ['Tube man',(g,c)=>{ibox(g.x-4,g.y-4,0,8,8,6,'#3b3355');const [a,b]=P(g.x,g.y,6),k=s*1.8;let x=a,y=b;for(let i=0;i<9;i++){const w=mv?Math.sin(ph*7+i*.8)*i*.55:i*.2,nx=a+w*k,ny=b-(i+1)*4.2*k;seg(x,y,nx,ny,i%2?c:tint(c,.15),3.6*k);x=nx;y=ny;
    if(i===5)for(const d of [-1,1]){const fl=mv?Math.sin(ph*9+d)*.8:0;seg(nx,ny,nx+d*9*k,ny-6*k+fl*6*k,c,2.2*k)}}cx.fillStyle='#fff';for(const d of [-1,1]){cx.beginPath();cx.arc(x+d*1.1*k,y+1*k,.9*k,0,7);cx.fill()}cx.fillStyle='#2a1f3d';cx.fillRect(x-1*k,y+3*k,2*k,.6*k)}],
  ['Giant tire',(g,c)=>{ibox(g.x-6,g.y-3,0,12,6,2,'#6b6488');const [a,b]=P(g.x,g.y,2),r=15*s;cx.fillStyle='#2b2838';cx.beginPath();cx.arc(a,b-r,r,0,7);cx.fill();cx.strokeStyle='#3d394e';cx.lineWidth=Math.max(1,1.2*s);for(let i=0;i<16;i++){const t=i/16*6.2832;cx.beginPath();cx.moveTo(a+Math.cos(t)*r*.82,b-r+Math.sin(t)*r*.82);cx.lineTo(a+Math.cos(t)*r*.98,b-r+Math.sin(t)*r*.98);cx.stroke()}
    cx.fillStyle=c;cx.beginPath();cx.arc(a,b-r,r*.52,0,7);cx.fill();cx.fillStyle=shade(c,.3);cx.beginPath();cx.arc(a,b-r,r*.2,0,7);cx.fill();cx.fillStyle='rgba(255,255,255,.35)';cx.beginPath();cx.arc(a-r*.2,b-r*1.2,r*.14,0,7);cx.fill()}],
  ['Fountain',(g,c)=>{cyl(g.x,g.y,0,13,5,c);ell(g.x,g.y,5,10.5,'#7cc7ef');cyl(g.x,g.y,5,1.6,10,c);const [a,b]=P(g.x,g.y,16);cx.fillStyle='rgba(200,235,255,.9)';for(let i=0;i<10;i++){const k=((mv?ph*.8:0)+i*.1)%1,t=i*.628;
    cx.beginPath();cx.arc(a+Math.cos(t)*k*12*s,b-Math.sin(k*Math.PI)*8*s+Math.sin(t)*k*6*s+k*k*8*s,Math.max(.8,.7*s),0,7);cx.fill()}}],
  ['Statue',(g,c)=>{ibox(g.x-6,g.y-6,0,12,12,14,'#bdb6c9');const [a,b]=P(g.x,g.y,14),k=s*1.2;rr(a-4*k,b-16*k,8*k,16*k,3*k,c);cx.fillStyle=c;cx.beginPath();cx.arc(a,b-20*k,4*k,0,7);cx.fill();rr(a+3*k,b-26*k,2.4*k,11*k,1.2*k,c);rr(a+1.6*k,b-31*k,5.2*k,6*k,1.4*k,shade(c,.15));
    cx.fillStyle='rgba(255,255,255,.35)';cx.fillRect(a-3*k,b-15*k,1.2*k,12*k);cx.beginPath();cx.arc(a-1.4*k,b-21.4*k,1.2*k,0,7);cx.fill()}]]}};
function flag(x,y,z,h,c,w){const [a,b]=P(x,y,z);seg(a,b,a,b-h*s,'#8f8aa8',Math.max(.8,.7*s));cx.fillStyle='#d6dbe6';cx.beginPath();cx.arc(a,b-h*s,1.4*s,0,7);cx.fill();const top=b-h*s+1.5*s,fw=w*s,fh=w*.6*s;
  cx.fillStyle=c;cx.beginPath();cx.moveTo(a,top);for(let i=0;i<=10;i++){const t=i/10;cx.lineTo(a+t*fw,top+Math.sin((mv?ph*4:0)-t*5)*t*2.2*s)}for(let i=10;i>=0;i--){const t=i/10;cx.lineTo(a+t*fw,top+fh+Math.sin((mv?ph*4:0)-t*5)*t*2.2*s)}cx.fill();
  cx.fillStyle='rgba(255,255,255,.55)';cx.beginPath();cx.moveTo(a,top+fh*.4);for(let i=0;i<=10;i++){const t=i/10;cx.lineTo(a+t*fw,top+fh*.4+Math.sin((mv?ph*4:0)-t*5)*t*2.2*s)}for(let i=10;i>=0;i--){const t=i/10;cx.lineTo(a+t*fw,top+fh*.6+Math.sin((mv?ph*4:0)-t*5)*t*2.2*s)}cx.fill()}
function signText(o,col,stroke,gl,big){cx.save();const fs=Math.max(7,Math.round(11*s*1.6*(big||1)));cx.font=`700 ${fs}px "Barlow Condensed",sans-serif`;cx.textAlign='center';cx.textBaseline='middle';if(gl){cx.shadowColor=col;cx.shadowBlur=gl}
  if(stroke){cx.strokeStyle=stroke;cx.lineWidth=2;cx.lineJoin='round';cx.strokeText(o.sn,o.a,o.b+1)}cx.fillStyle=col;cx.fillText(o.sn,o.a,o.b+1);cx.restore()}
const walls=withW=>{const a=plane([100,.2,40],[1,0],100,40),b=plane([.2,75,40],[0,-1],75,40);return withW?[[a,100],[b,75]]:[a,b]};
const win=()=>plane([.5,70,40],[0,-1],40,22),ban=()=>plane([100,.4,72],[1,0],92,6),front=o=>plane([o.x0+o.w/2,112.1,12],[1,0],o.w/2,12);
/* the spots: [id, name, area, type, where] */
const SP=[['fl','Store floor','Inside','floorfin'],['pt','Wall paint','Inside','paint'],['rg','Rug by the counter','Inside','rug'],['wn','Front window','Inside','window'],
 ['ct','Counter top','Inside','counter'],['cf','Counter front','Inside','wrap'],['f1','Window corner','Inside','floor',{x:12,y:138,lay:'floorFront'}],['f2','Back corner','Inside','floor',{x:8,y:50,lay:'floorBack'}],
 ['f3','Beside the counter','Inside','floor',{x:177,y:100,lay:'floorFront'}],['c1','Store ceiling','Inside','ceil',{x:100,y:118}],['w1','Side wall','Inside','wall',{c:[.4,130,32],u:[0,-1],m:28}],
 ['w2','Corner wall','Inside','wall',{c:[.4,20,40],u:[0,-1],m:18}],['bn','Above the shelves','Inside','banner'],['li','Roofline lights','Inside','lights'],
 ['w3','Shop wall, left','Service shop','wall',{c:[231,.4,46],u:[1,0],m:30,sv:1}],['w4','Shop wall, right','Service shop','wall',{c:[304,.4,46],u:[1,0],m:30,sv:1}],
 ['f4','Shop corner','Service shop','floor',{x:320,y:138,lay:'floorShop',sv:1}],['c2','Shop ceiling','Service shop','ceil',{x:266,y:125,sv:1}],
 ['sg','Roof sign','Outside','sign'],['r1','Roof, left','Outside','roof',{x:22,y:-3}],['r2','Roof, right','Outside','roof',{x:182,y:-3}],['r3','Roof corner','Outside','roof',{x:-3,y:128}],['r4','Shop roof','Outside','roof',{x:300,y:-3,sv:1}],
 ['l1','Lawn by the window','Outside','lot',{x:-10,y:190}],['l2','Front curb','Outside','lot',{x:62,y:212}],['l3','Curbside','Outside','lot',{x:150,y:212}],['l4','Lot entrance','Outside','lot',{x:226,y:214}],
 ['l5','Back of the lot','Outside','lot',{x:376,y:160}],['l6','Lot edge','Outside','lot',{x:370,y:213}]];
const TSHIFT={floorfin:0,paint:.15,rug:.05,window:.1,counter:.08,wrap:.2,floor:.03,ceil:.25,wall:.12,banner:.18,lights:0,sign:.3,roof:.22,lot:.06};
const nice=L=>{if(L<1)return L;let e=Math.floor(L),m=Math.round(10**(L-e)*10)/10;if(m>=10){m=1;e++}return e+Math.log10(m)};
const SPOTS=[],SPOT={},ITEMS={},BYLAYER={};let NITEMS=0;
for(const [id,n,area,t,g0] of SP){const ty=T[t],g=Object.assign({},g0||{}),same=SP.filter(x=>x[3]===t),si=same.findIndex(x=>x[0]===id),sp={id,n,area,t,g,sv:!!g.sv,lay:g.lay||ty.lay,kinds:[]};
  ty.kinds.forEach(([kn,d,fins,pal],k)=>{const nk=ty.kinds.length,tf=Math.min(.995,(k+TSHIFT[t]+si/same.length*.6)/nk),base=1.8+430*tf,K={n:kn,d,fixed:!!fins,pal,items:[]};
    for(const f of (fins||DECO_FIN.map((_,i)=>i))){const fid=f<0?0:f,iid=`${id}.${k}.${fid}`,it={id:iid,sp,k,f,K,L:nice(base+(f<0?0:DECO_FUP[f])),name:f<0?kn:`${DECO_FIN[f][0]} ${kn.charAt(0).toLowerCase()+kn.slice(1)}`};ITEMS[iid]=it;K.items.push(it);NITEMS++}
    sp.kinds.push(K)});
  SPOTS.push(sp);SPOT[id]=sp;(BYLAYER[sp.lay]=BYLAYER[sp.lay]||[]).push(sp)}
window.DECO_ITEMS=ITEMS;window.DECO_SPOTS=SPOTS;window.DECO_N=NITEMS;
const finC=f=>f===15?hsl((ph*60)%360,78,58):f<0?'#ffffff':DECO_FIN[f][1];
const activeId=id=>{if(DUI.open&&DUI.prev&&ITEMS[DUI.prev]&&ITEMS[DUI.prev].sp.id===id)return DUI.prev;if(DUI.open&&DUI.prev==='off:'+id)return null;const v=D().on[id];return v&&ITEMS[v]&&D().own[v]?v:null};
const atOf=sp=>T[sp.t].at(sp.g);
window.decoLayer=function(layer,o){s=I.s;ph=I.ph;mv=S.ui.anim&&!matchMedia('(prefers-reduced-motion: reduce)').matches;if(o&&o.night!==undefined)night=o.night;if(o&&o.day!==undefined)day=o.day;
  if(layer==='ring')return ring();
  const list=BYLAYER[layer];if(!list)return false;let drew=false;
  for(const sp of list){if(sp.sv&&!S.sv.open)continue;const id=activeId(sp.id);if(!id)continue;const it=ITEMS[id],c=finC(it.f),run=()=>{it.K.d(sp.g,c,o);if(it.f>=13)shine(sp,it)};
    if(layer==='lot')o.add(sp.g.x+sp.g.y,run);else run();drew=true}
  return drew};
function shine(sp,it){const t=(ph*.9+sp.id.charCodeAt(1)*.37)%2.6;if(t>.5||!mv)return;const [x,y,z]=atOf(sp),[a,b]=P(x,y,z);star(a+Math.sin(sp.id.charCodeAt(0))*6*s,b-4*s,(.5-Math.abs(t-.25))*10*s,'rgba(255,255,240,.9)')}
function ring(){if(!DUI.open||!DUI.spot)return false;const sp=SPOT[DUI.spot];if(!sp||['floorfin','paint','lights','sign','banner','wrap'].includes(sp.t))return false;const [x,y,z]=atOf(sp),[a,b]=P(x,sp.t==='wall'||sp.t==='window'?y:y,sp.t==='lot'||sp.t==='floor'?0:z);
  const r=(sp.t==='lot'?18:sp.t==='counter'?6:12)*s*(1+.08*Math.sin(ph*5));cx.save();cx.setLineDash([4,3]);cx.lineDashOffset=-ph*12;cx.strokeStyle='rgba(255,255,255,.95)';cx.lineWidth=2;cx.beginPath();
  if(sp.t==='lot'||sp.t==='floor')cx.ellipse(a,b,r*1.225,r*.707,0,0,7);else cx.arc(a,b,r,0,7);cx.stroke();cx.strokeStyle='rgba(42,24,56,.55)';cx.lineDashOffset=-ph*12+3.5;cx.stroke();cx.restore();return true}
/* the camera glides to the spot you're decorating */
let fz=0,fsp=null;
window.decoFocus=function(dt,set){const want=DUI.open&&DUI.spot?SPOT[DUI.spot]:null;if(want)fsp=want;fz+=((want?1:0)-fz)*Math.min(1,dt*5);if(fz<.003||!fsp)return;
  s=I.s;const [x,y,z]=atOf(fsp),zoom=T[fsp.t].z,[a0,b0]=P(x,y,z),e=fz*fz*(3-2*fz),k=1+(zoom-1)*e,s2=s*k,ax=(x-y)*.866,ay=(x+y)*.5-z;
  const W=I.W,H=I.H,tx=a0+(W/2-a0)*e,ty=b0+(H*.55-b0)*e;set(k,tx-ax*s2,ty-ay*s2)};
}

/* ---------- the Customize shop screen ---------- */
{
const css=document.createElement('style');css.textContent=`
body.decoopen{overflow:hidden}
body.decoopen #stage{position:fixed!important;left:0!important;right:0!important;top:0!important;height:40vh!important;max-height:none!important;width:auto!important;margin:0!important;border-radius:0!important;z-index:61}
body.decoopen #stage>button{display:none!important}
#deco{position:fixed;left:0;right:0;top:calc(40vh - 14px);bottom:0;z-index:62;background:var(--card);color:var(--ink);display:flex;flex-direction:column;border-radius:16px 16px 0 0;box-shadow:0 -8px 30px rgba(0,0,0,.28)}
#deco[hidden]{display:none}
#deco .dh{display:flex;align-items:center;gap:8px;padding:12px 12px 4px 16px}#deco .dh b{font:700 21px 'Barlow Condensed',sans-serif}#deco .dh span{color:var(--mute);font-size:12px;flex:1;line-height:1.2}
#deco .dx{width:40px;height:40px;border:0;background:var(--soft);border-radius:10px;font-size:24px;line-height:1;color:var(--ink);cursor:pointer}
#deco .dsc{overflow:auto;flex:1;padding:2px 16px 12px;overscroll-behavior:contain}
#deco .dar{display:flex;gap:6px;margin:6px 0 8px}#deco .dar button{flex:1;min-height:36px;border-radius:10px;border:1.5px solid var(--line);background:var(--soft);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer}
#deco .dar button[aria-pressed=true]{background:var(--acc);border-color:var(--acc);color:#fff}
#deco .dsp{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:none}#deco .dsp::-webkit-scrollbar{display:none}
#deco .dsp button{flex:none;min-height:34px;padding:0 12px;border-radius:17px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer;white-space:nowrap;display:flex;align-items:center;gap:6px}
#deco .dsp button[aria-pressed=true]{border-color:var(--ink);background:var(--soft)}#deco .dsp i{width:8px;height:8px;border-radius:50%;background:var(--acc);display:inline-block}
#deco .dnow{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;background:var(--soft);font-size:13px;margin:2px 0 8px}#deco .dnow span{flex:1}
#deco .dnow button,#deco .dbar button{min-height:36px;padding:0 14px;border-radius:10px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:600 13px system-ui,sans-serif;cursor:pointer}
#deco .dfl{display:flex;gap:6px;margin:0 0 4px}#deco .dfl button{min-height:30px;padding:0 10px;border-radius:15px;border:1.5px solid var(--line);background:none;color:var(--mute);font:600 12px system-ui,sans-serif;cursor:pointer}#deco .dfl button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
#deco .dk{padding:10px 0;border-top:1px solid var(--line)}#deco .dkh{display:flex;justify-content:space-between;align-items:baseline;gap:8px}#deco .dkh b{font-size:14px}#deco .dkh small{color:var(--mute);font-size:12px;text-align:right}
#deco .dsw{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:7px;margin-top:8px}
#deco .dsw button{aspect-ratio:1;min-height:30px;border-radius:50%;border:2px solid rgba(0,0,0,.14);background:var(--c);cursor:pointer;position:relative;padding:0}
#deco .dsw button.lk{opacity:.4}#deco .dsw button.own::after{content:'';position:absolute;right:-3px;bottom:-3px;width:12px;height:12px;border-radius:50%;background:#2ec4a6 url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath d='M3 6.2l2 2 4-4.4' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round'/%3E%3C/svg%3E") center/100%;border:1.5px solid var(--card)}
#deco .dsw button.on{box-shadow:0 0 0 2px var(--card),0 0 0 4px #2ec4a6}#deco .dsw button.sel{box-shadow:0 0 0 2px var(--card),0 0 0 4px var(--ink)}
#deco .dsw button.fx{border-radius:10px;grid-column:span 2;aspect-ratio:auto}
#deco .dbar{border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));display:flex;gap:10px;align-items:center;min-height:58px}
#deco .dbar .dn{flex:1;min-width:0;font-size:13px;line-height:1.25}#deco .dbar .dn b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#deco .dbar .dn small{color:var(--mute)}
#deco .dbar .go{background:var(--acc);border-color:var(--acc);color:#fff}#deco .dbar .go[disabled]{opacity:.5;cursor:default}
#deco .dempty{color:var(--mute);font-size:13px;padding:14px 0}
.dcb{position:absolute;right:52px;top:8px;width:36px;height:36px;border-radius:10px;border:0;background:rgba(20,15,40,.45);color:#fff;display:grid;place-items:center;cursor:pointer;z-index:2;backdrop-filter:blur(4px)}
.dcb svg{width:20px;height:20px}
@media (min-width:900px){body.decoopen #stage{right:440px!important;height:100vh!important}#deco{top:0;left:auto;width:440px;border-radius:0}}`;
document.head.appendChild(css);
const $d=id=>document.getElementById(id),AREAS=['Inside','Service shop','Outside'];
const box=document.createElement('div');box.id='deco';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-label','Customize shop');
box.innerHTML=`<div class="dh"><b>Customize shop</b><span id="dcount"></span><button class="dx" data-dx aria-label="Close">×</button></div><div class="dsc" id="dsc"></div><div class="dbar" id="dbar"></div>`;document.body.appendChild(box);
const swBg=it=>it.K.fixed?`linear-gradient(90deg,${(it.K.pal||['#fff']).join(',')})`:it.f===15?'conic-gradient(#ff5252,#ffd740,#69f0ae,#40c4ff,#b388ff,#ff5252)':it.f===13?'linear-gradient(135deg,#f6f8fc,#8d96a8 55%,#e3e7ef)':it.f===14?'linear-gradient(135deg,#ffe082,#c48a1c 55%,#ffd54f)':DECO_FIN[it.f][1];
const owned=()=>Object.keys(D().own).filter(k=>DECO_ITEMS[k]).length;
let sel=null;
function spotsOf(a){return DECO_SPOTS.filter(sp=>sp.area===a)}
function render(){const d=D(),sp=DECO_SPOTS.find(x=>x.id===DUI.spot)||spotsOf(DUI.area)[0];DUI.spot=sp.id;
  $d('dcount').textContent=`${owned().toLocaleString()} of ${DECO_N.toLocaleString()} owned`;
  const on=d.on[sp.id]&&DECO_ITEMS[d.on[sp.id]]&&d.own[d.on[sp.id]]?DECO_ITEMS[d.on[sp.id]]:null,locked=sp.sv&&!S.sv.open;
  let h=`<div class="dar">${AREAS.map(a=>`<button data-darea="${a}" aria-pressed="${a===DUI.area}">${a}</button>`).join('')}</div>
   <div class="dsp">${spotsOf(DUI.area).map(x=>`<button data-dspot="${x.id}" aria-pressed="${x.id===sp.id}">${d.on[x.id]&&d.own[d.on[x.id]]?'<i aria-label="decorated"></i>':''}${x.n}</button>`).join('')}</div>`;
  if(locked)h+=`<p class="dempty">This spot is in the service shop. Open the shop first, then you can decorate it.</p>`;
  else{h+=`<div class="dnow"><span>${on?`In this spot: <b>${on.name}</b>`:'This spot is empty.'}</span>${on?`<button data-doff>Turn off</button>`:''}</div>
   <div class="dfl">${[['all','All'],['own','Owned'],['can','Can afford']].map(([k,n])=>`<button data-dfilt="${k}" aria-pressed="${DUI.filt===k}">${n}</button>`).join('')}</div>`;
   let any=false;
   for(const K of sp.kinds){const its=K.items.filter(it=>DUI.filt==='all'||(DUI.filt==='own'?d.own[it.id]:!d.own[it.id]&&canPay(it.L)));if(!its.length)continue;any=true;const n=K.items.filter(it=>d.own[it.id]).length;
     h+=`<div class="dk"><div class="dkh"><b>${K.n}</b><small>${n?`${n} owned · `:''}${K.fixed?moneyL(K.items[0].L):'from '+moneyL(K.items[0].L)}</small></div><div class="dsw">${its.map(it=>`<button data-di="${it.id}" class="${K.fixed?'fx ':''}${d.own[it.id]?'own ':''}${on&&on.id===it.id?'on ':''}${sel===it.id?'sel ':''}${!d.own[it.id]&&!canPay(it.L)?'lk':''}" style="--c:${swBg(it)}" aria-label="${it.name}, ${d.own[it.id]?'owned':moneyL(it.L)}"></button>`).join('')}</div></div>`}
   if(!any)h+=`<p class="dempty">${DUI.filt==='own'?'You don’t own anything for this spot yet.':'Nothing here you can afford yet. Keep selling.'}</p>`}
  const sc=$d('dsc'),top=sc.scrollTop;sc.innerHTML=h;sc.scrollTop=top;const ch=sc.querySelector('.dsp [aria-pressed=true]');if(ch){const r=ch.parentNode;r.scrollLeft=Math.max(0,ch.offsetLeft-r.clientWidth/2+ch.offsetWidth/2)}bar()}
function bar(){const d=D(),it=sel&&DECO_ITEMS[sel],el=$d('dbar');if(!it){el.innerHTML=`<div class="dn"><small>Tap a colour to try it in the picture. Only one decoration per spot can be on.</small></div>`;return}
  const own=d.own[it.id],isOn=d.on[it.sp.id]===it.id;
  el.innerHTML=`<div class="dn"><b>${it.name}</b><small>${it.sp.n} · ${own?(isOn?'In use':'Owned'):moneyL(it.L)}</small></div>`+
   (own?(isOn?`<button data-doff>Turn off</button>`:`<button class="go" data-duse>Use it</button>`):`<button class="go" data-dbuy ${canPay(it.L)?'':'disabled'}>${canPay(it.L)?'Buy':'Need '+moneyL(it.L)}</button>`)}
function refresh(){if(!DUI.open)return;const d=D();for(const b of box.querySelectorAll('[data-di]')){const it=DECO_ITEMS[b.dataset.di];b.classList.toggle('lk',!d.own[it.id]&&!canPay(it.L))}bar()}
function open(spot){DUI.open=true;if(spot&&DECO_ITEMS[spot]){DUI.spot=DECO_ITEMS[spot].sp.id}DUI.area=(DECO_SPOTS.find(x=>x.id===DUI.spot)||{}).area||'Inside';sel=null;DUI.prev=null;box.hidden=false;document.body.classList.add('decoopen');render()}
function close(){DUI.open=false;DUI.prev=null;sel=null;box.hidden=true;document.body.classList.remove('decoopen');more()}
window.openDeco=open;
let iv=setInterval(()=>{if(DUI.open)refresh()},700);
box.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=D();
  if(t.hasAttribute('data-dx')){close();return}
  if(t.dataset.darea){DUI.area=t.dataset.darea;DUI.spot=spotsOf(DUI.area)[0].id;sel=null;DUI.prev=null;render();$d('dsc').scrollTop=0;return}
  if(t.dataset.dspot){DUI.spot=t.dataset.dspot;sel=null;DUI.prev=null;render();$d('dsc').scrollTop=0;return}
  if(t.dataset.dfilt){DUI.filt=t.dataset.dfilt;render();return}
  if(t.dataset.di){sel=t.dataset.di;DUI.prev=sel;for(const b of box.querySelectorAll('.dsw .sel'))b.classList.remove('sel');t.classList.add('sel');bar();return}
  if(t.hasAttribute('data-doff')){delete d.on[DUI.spot];DUI.prev='off:'+DUI.spot;save();render();return}
  if(t.hasAttribute('data-duse')&&sel){d.on[DECO_ITEMS[sel].sp.id]=sel;DUI.prev=null;save();if(typeof feel==='function')feel('step');render();return}
  if(t.hasAttribute('data-dbuy')&&sel){const it=DECO_ITEMS[sel];if(d.own[it.id]||!canPay(it.L))return;S.cashL=subL(S.cashL,it.L);d.sp=addL(d.sp,it.L);d.own[it.id]=1;d.on[it.sp.id]=it.id;DUI.prev=null;save();
    if(typeof feel==='function')feel('buy');note(`${it.name} is in: ${it.sp.n.toLowerCase()}.`);render()}});
addEventListener('keydown',e=>{if(e.key==='Escape'&&DUI.open)close()});
/* taps on the picture don't jump to other tabs while you're decorating */
const st=document.getElementById('stage');if(st){for(const ev of ['click','pointerup','touchend'])st.addEventListener(ev,e=>{if(DUI.open)e.stopPropagation()},true);
  const b=document.createElement('button');b.className='dcb';b.setAttribute('aria-label','Customize shop');b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="15" height="6" rx="1.5"/><path d="M18 6h2v5h-8v3"/><rect x="10" y="14" width="4" height="7" rx="1"/></svg>';
  b.addEventListener('click',e=>{e.stopPropagation();open()});st.appendChild(b)}
/* and a section in More */
let moreEl=null;
function more(){if(!moreEl)return;const d=D();moreEl.querySelector('.dmsum').textContent=`${owned().toLocaleString()} of ${DECO_N.toLocaleString()} decorations owned`+(d.sp>NEG/2?` · ${moneyL(d.sp)} spent`:'')}
(function(){const sec=document.getElementById('t-more');if(!sec)return;const after=[...sec.querySelectorAll(':scope > details.fold')].find(x=>x.firstElementChild&&x.firstElementChild.textContent==='Look');
  const h=document.createElement('details');h.className='fold';const op=(S.ui.open||{})['Customize shop'];h.open=op===undefined?true:op;h.innerHTML='<summary>Customize shop</summary>';
  h.addEventListener('toggle',()=>{S.ui.open=Object.assign({},S.ui.open,{'Customize shop':h.open});save()});
  const card=document.createElement('div');card.className='card';card.innerHTML=`<p class="sub" style="margin:0 0 10px">Your store starts bare. Buy decorations for ${SPOT_COUNT()} spots around the store, the service shop and the lot. Each spot holds one at a time, and anything you own can be switched on again for free. Decorations only change the picture.</p><p class="sub dmsum" style="margin:0 0 10px"></p><button class="btn pri" data-dopen>Open Customize shop</button>`;
  card.querySelector('[data-dopen]').addEventListener('click',()=>open());h.appendChild(card);if(after)after.after(h);else sec.appendChild(h);moreEl=h;more()})();
function SPOT_COUNT(){return DECO_SPOTS.length}
}

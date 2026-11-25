/* ===== Parts Counter Idle: the decoration art kit. Everything a decoration needs to draw itself, on the store
   picture or in a little thumbnail. DV holds the current view; deco.js points it at the right canvas. ===== */
const DV={cx:null,s:1,ox:0,oy:0,ph:0,night:0,day:1,mv:true};
const DK=(()=>{
const P=(x,y,z)=>[DV.ox+(x-y)*.866*DV.s,DV.oy+((x+y)*.5-z)*DV.s];
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
const shade=(c,t)=>mix(c,'#1a1530',t),tint=(c,t)=>mix(c,'#ffffff',t),rgb=c=>hx(c).join(','),dim=c=>mix(shade(c,.3),c,DV.day);
const lum=c=>{const v=hx(c);return (.3*v[0]+.59*v[1]+.11*v[2])/255},ink=c=>lum(c)>.6?'#2a1838':'#ffffff';
const H=str=>{let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function quad(pts,c){const cx=DV.cx;cx.fillStyle=c;cx.beginPath();pts.forEach((p,i)=>{const [a,b]=P(...p);i?cx.lineTo(a,b):cx.moveTo(a,b)});cx.closePath();cx.fill()}
function ibox(x,y,z,w,d,h,c,top){quad([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],shade(c,.22));quad([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],c);quad([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top||tint(c,.22))}
function glow(x,y,r,col,a){const cx=DV.cx;if(r<=0)return;const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);cx.fillStyle=g;cx.beginPath();cx.arc(x,y,r,0,7);cx.fill()}
function ell(x,y,z,r,c){const [a,b]=P(x,y,z),cx=DV.cx;cx.fillStyle=c;cx.beginPath();cx.ellipse(a,b,1.225*r*DV.s,.707*r*DV.s,0,0,7);cx.fill()}
function cyl(x,y,z,r,h,c,top){const s=DV.s,cx=DV.cx,[a,b]=P(x,y,z),[,t]=P(x,y,z+h),rx=1.225*r*s,ry=.707*r*s;cx.fillStyle=shade(c,.2);cx.beginPath();cx.ellipse(a,b,rx,ry,0,0,7);cx.fill();
  cx.fillStyle=c;cx.fillRect(a-rx,t,rx*2,b-t);cx.fillStyle=tint(c,.2);cx.fillRect(a-rx*.75,t,rx*.32,b-t);cx.fillStyle=shade(c,.12);cx.fillRect(a+rx*.5,t,rx*.5,b-t);cx.fillStyle=top||tint(c,.28);cx.beginPath();cx.ellipse(a,t,rx,ry,0,0,7);cx.fill()}
/* a pen draws flat shapes through a mapping: upright on screen (a sprite), or flat on a wall or counter front */
function pen(map,unit,skew){const cx=DV.cx,pts=a=>a.map(([x,y])=>map(x,y));
  const fill=(q,col)=>{cx.fillStyle=col;cx.beginPath();q.forEach(([a,b],i)=>i?cx.lineTo(a,b):cx.moveTo(a,b));cx.closePath();cx.fill()};
  const O={u:unit,map,
   poly(a,col){fill(pts(a),col)},
   ell(x,y,rx,ry,col,rot=0,n=22){const a=[],c=Math.cos(rot),d=Math.sin(rot);for(let i=0;i<n;i++){const t=i/n*6.2832,p=Math.cos(t)*rx,q=Math.sin(t)*ry;a.push([x+p*c-q*d,y+p*d+q*c])}O.poly(a,col)},
   half(x,y,rx,ry,col,up){const a=[];for(let i=0;i<=14;i++){const t=Math.PI*i/14;a.push([x+Math.cos(t)*rx,y+(up?1:-1)*Math.sin(t)*ry])}O.poly(a,col)},
   circ(x,y,r,col){O.ell(x,y,r,r,col,0,r*unit>6?26:14)},
   rect(x,y,w,h,col,r=0){if(!r)return O.poly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],col);r=Math.min(r,w/2,h/2);const a=[];for(const [qx,qy,t0] of [[x+w-r,y+r,-1.5708],[x+w-r,y+h-r,0],[x+r,y+h-r,1.5708],[x+r,y+r,3.1416]])for(let i=0;i<=4;i++){const t=t0+i/4*1.5708;a.push([qx+Math.cos(t)*r,qy+Math.sin(t)*r])}O.poly(a,col)},
   line(a,col,w,gl,close){cx.save();if(gl){cx.shadowColor=col;cx.shadowBlur=gl}cx.strokeStyle=col;cx.lineWidth=Math.max(.6,w*unit);cx.lineCap='round';cx.lineJoin='round';cx.beginPath();pts(a).forEach(([p,q],i)=>i?cx.lineTo(p,q):cx.moveTo(p,q));if(close)cx.closePath();cx.stroke();cx.restore()},
   arc(x,y,r,col,w,a0=0,a1=6.2832){const a=[];for(let i=0;i<=24;i++){const t=a0+(a1-a0)*i/24;a.push([x+Math.cos(t)*r,y+Math.sin(t)*r])}O.line(a,col,w)},
   neon(a,col,w,close){O.line(a,col,w,5+DV.night*10,close);O.line(a,tint(col,.65),w*.38,0,close)},
   text(x,y,str,size,col,o={}){const [p,q]=map(x,y);cx.save();cx.translate(p,q);if(skew)cx.transform(1,skew,0,1,0,0);let fs=size*unit;const f=z=>`${o.wt||700} ${Math.max(3,z)}px "Barlow Condensed",sans-serif`;cx.font=f(fs);
     if(o.max){const w=cx.measureText(str).width,mw=o.max*unit;if(w>mw){fs*=mw/w;cx.font=f(fs)}}if(fs<2.5){cx.restore();return}cx.textAlign='center';cx.textBaseline='middle';if(o.glow){cx.shadowColor=col;cx.shadowBlur=o.glow}
     if(o.stroke){cx.strokeStyle=o.stroke;cx.lineWidth=Math.max(1,fs*.16);cx.lineJoin='round';cx.strokeText(str,0,0)}cx.fillStyle=col;cx.fillText(str,0,0);cx.restore()},
   lines(x,y,str,size,col,o={}){const ls=wrap(str,o.cols||11),n=ls.length,lh=size*1.05;ls.forEach((l,i)=>O.text(x,y+((n-1)/2-i)*lh,l,size,col,o))},
   star(x,y,r,col,n=5,inner=.45,rot=0){const a=[];for(let i=0;i<n*2;i++){const t=Math.PI/2+rot+i*Math.PI/n,q=i%2?r*inner:r;a.push([x+Math.cos(t)*q,y+Math.sin(t)*q])}O.poly(a,col)},
   ball(x,y,r,col){O.circ(x,y,r,shade(col,.15));O.circ(x-r*.08,y+r*.08,r*.86,col);O.circ(x-r*.36,y+r*.38,r*.24,'rgba(255,255,255,.55)')},
   gear(x,y,r,col,n=8){const a=[];for(let i=0;i<n*4;i++){const t=i/(n*4)*6.2832+(DV.mv?DV.ph*.3:0),q=(i%4<2)?r:r*.78;a.push([x+Math.cos(t)*q,y+Math.sin(t)*q])}O.poly(a,col);O.circ(x,y,r*.32,shade(col,.35))},
   sub(dx,dy,sc){return pen((x,y)=>map(dx+x*sc,dy+y*sc),unit*sc,skew)},
   warp(fn){return pen((x,y)=>{const [X,Y]=fn(x,y);return map(X,Y)},unit,skew)}};
  return O}
function wrap(str,cols){const w=String(str).split(' '),out=[];let cur='';for(const x of w){if(cur&&(cur+' '+x).length>cols){out.push(cur);cur=x}else cur=cur?cur+' '+x:x}if(cur)out.push(cur);return out.slice(0,4)}
const spr=(a,b,k)=>pen((x,y)=>[a+x*k,b-y*k],k,0);
const stand=(x,y,z,k=1)=>{const [a,b]=P(x,y,z);return spr(a,b,DV.s*k)};
const shadowE=(x,y,r)=>ell(x,y,.05,r,'rgba(20,15,40,.18)');
const wallPen=(c,u)=>pen((x,y)=>P(c[0]+x*u[0],c[1]+x*u[1],c[2]+y),DV.s,u[0]?.577:-.577);
const sw=i=>DV.mv?Math.sin(DV.ph*1.4+i)*.05:0;
/* ---------- shared pieces ---------- */
const PALS=[['Sunset',['#ff6b4a','#ffb347','#7b2d5b']],['Ocean',['#1e63c8','#4fc3f7','#e8f6ff']],['Forest',['#2e6b4a','#8bc34a','#5d4037']],['Candy',['#ff5c8a','#ffd1e0','#3fb8e8']],
 ['Fire',['#d32f2f','#ff9800','#ffeb3b']],['Glacier',['#4fc3f7','#ffffff','#1a5e8a']],['Royal',['#4527a0','#ffc107','#ffffff']],['Desert',['#d7a86e','#a0522d','#f4e1c1']],
 ['Lime pop',['#c6ff00','#212121','#ffffff']],['Midnight',['#1a237e','#7986cb','#ffd54f']],['Peach',['#ff8a65','#fff3e0','#6d4c41']],['Mint',['#26a69a','#e0f2f1','#ff7043']],
 ['Rust',['#a0451f','#e0a35a','#3e2723']],['Grape',['#7b1fa2','#ce93d8','#fff59d']],['Bumblebee',['#fdd835','#212121','#fff8e1']],['Racing',['#c62828','#ffffff','#212121']]];
const palOf=str=>PALS[H(str)%PALS.length][1];
const NEONC=['#ff4081','#40c4ff','#69f0ae','#ffd740','#ff6e40','#e040fb','#ffffff','#76ff03','#ff5252','#18ffff'];
const neonOf=str=>NEONC[H(str)%NEONC.length];
const SKIN=['#f2c29b','#d9a07a','#a8714f','#7a4b32','#ffd9b8'];
/* plants, drawn from the top of their pot */
const G1='#3fae6a',G2='#2e8b57';
const PLANTS=[
 ['Fern',p=>{for(let i=0;i<9;i++){const t=Math.PI/2+(i-4)*.3+sw(i);p.ell(Math.cos(t)*7,Math.sin(t)*7,8,1.8,i%2?G1:G2,t)}}],
 ['Monstera',p=>{for(const [x,y] of [[-4,10],[5,12],[0,16]])p.line([[0,0],[x,y]],'#2e6b4a',.8);for(const [x,y,r] of [[-4,10,4.5],[5,12,5],[0,16,5.5]]){p.ell(x,y,r,r*.85,'#2e7d4f');p.line([[x-r*.7,y],[x-r*.2,y+r*.2]],'#163f2a',.35);p.line([[x+r*.7,y],[x+r*.2,y-r*.2]],'#163f2a',.35)}}],
 ['Snake plant',p=>{[[-4,14,-.15],[-1.5,19,-.05],[1.5,17,.06],[4,13,.18]].forEach(([x,h,l],i)=>{p.poly([[x-1.6,0],[x+1.6,0],[x+l*h,h]],i%2?'#4a8f3c':'#6aa84f');p.line([[x-1.3,1],[x+l*h-.3,h-1]],'#d4e157',.25)})}],
 ['Cactus',p=>{p.rect(-2.5,0,5,18,'#4caf6a',2.5);p.rect(-7,6,3.4,8,'#4caf6a',1.7);p.rect(-7,6,5,3,'#4caf6a',1.5);p.rect(3.6,9,3.4,7,'#4caf6a',1.7);p.rect(2,9,5,3,'#4caf6a',1.5);p.rect(-1.5,1,1,16,'rgba(255,255,255,.25)');p.circ(0,18.5,1.6,'#ff6b8a')}],
 ['Succulent',p=>{for(let r=0;r<3;r++)for(let i=0;i<7;i++){const t=i/7*6.28+r*.4;p.ell(Math.cos(t)*(5-r*1.5),2+r*1.3+Math.sin(t)*1.2,2.6-r*.5,1.4-r*.2,r%2?'#8fd1a8':'#6fbf8f',t)}}],
 ['Bonsai',p=>{p.line([[0,0],[1,4],[-2,8],[2,12]],'#6b4a3a',1.6);for(const [x,y,w] of [[-5,9,6],[4,12,5],[0,15,5]]){p.ell(x,y,w,2.2,'#3f8f5a');p.ell(x-1,y+.8,w*.6,1,'#5aaa6a')}}],
 ['Sunflower',p=>{p.line([[0,0],[0,20]],'#4a8f3c',.8);p.ell(-2.5,8,3,1.2,G1,.5);p.ell(2.5,12,3,1.2,G1,-.5);p.star(0,21,5.2,'#ffd54f',12,.62);p.circ(0,21,2.4,'#6b4a3a')}],
 ['Tulips',p=>{[-3,0,3].forEach((x,i)=>{const h=12+i%2*3;p.line([[x*.3,0],[x,h]],'#4a8f3c',.6);p.ell(x,h+1.6,1.8,2.4,['#ff5a5f','#ffd54f','#f15bb5'][i]);p.poly([[x-1.8,h+1.6],[x-1,h+4],[x,h+2.6],[x+1,h+4],[x+1.8,h+1.6]],['#ff5a5f','#ffd54f','#f15bb5'][i])})}],
 ['Palm',p=>{p.line([[0,0],[1,7],[0,14]],'#8d6e63',1.4);for(let i=0;i<7;i++){const t=Math.PI/2+(i-3)*.5+sw(i);p.ell(Math.cos(t)*5,14+Math.sin(t)*3,6,1.3,i%2?G1:G2,t)}}],
 ['Rubber plant',p=>{p.line([[0,0],[0,17]],'#5d4037',.7);for(let i=0;i<6;i++){const y=3+i*2.6,d=i%2?1:-1;p.ell(d*3,y,3.4,1.7,i%3?'#1f5c3a':'#2d7a4f',d*.4)}}],
 ['Bamboo',p=>{[-2.5,0,2.5].forEach((x,i)=>{const h=16+i*2;p.rect(x-.7,0,1.4,h,'#9ccc65');for(let y=4;y<h;y+=4)p.rect(x-.9,y,1.8,.5,'#7cb342');p.ell(x+2,h-2,2.5,.8,G1,.3)})}],
 ['Azalea',p=>{p.circ(0,7,7,'#4a9a5a');p.circ(-3,9,4,'#5aaa6a');for(let i=0;i<11;i++)p.circ(Math.cos(i*2.4)*5,7+Math.sin(i*2.4)*5,1.1,'#ff8fb3')}],
 ['Venus flytrap',p=>{p.line([[0,0],[0,10]],'#4a8f3c',.7);const o=DV.mv?Math.abs(Math.sin(DV.ph*2))*.5:.35;p.ell(-2.6,12,4,2,'#c62828',.5+o);p.ell(2.6,12,4,2,'#c62828',-.5-o);for(let i=-2;i<=2;i++){p.line([[-2+i*.4,13.5+o*2],[-2.6+i*.4,15+o*2]],'#e8f5e9',.25);p.line([[2-i*.4,13.5+o*2],[2.6-i*.4,15+o*2]],'#e8f5e9',.25)}p.ell(-4,4,3,1.2,G1,.5)}],
 ['Money tree',p=>{p.line([[-1,0],[1,5],[-1,10]],'#8d6e63',.8);p.line([[1,0],[-1,5],[1,10]],'#a1887f',.8);for(const [x,y] of [[-4,12],[3,13],[0,16],[-2,10],[4,9]])for(let i=0;i<5;i++){const t=i*1.26;p.ell(x+Math.cos(t)*1.6,y+Math.sin(t)*1.6,1.5,.7,G1,t)}}],
 ['Orchid',p=>{p.ell(-3,1,4,1.4,G2,.2);p.ell(3,1.5,4,1.4,G1,-.2);p.line([[0,0],[1,10],[4,15]],'#6b8f4a',.4);for(const [x,y] of [[1.5,10],[3,13],[4.5,15.5]]){p.star(x,y,1.8,'#f3e5f5',5,.7);p.circ(x,y,.6,'#ab47bc')}}],
 ['Herb pot',p=>{for(let i=0;i<14;i++){const t=Math.PI/2+(i-7)*.2;p.ell(Math.cos(t)*4,4+Math.sin(t)*3,1.5,.9,i%2?'#7cb342':'#558b2f',t)}p.circ(-2,7,.9,'#fff');p.circ(2,8,.9,'#fff')}]];
/* pots: drawn from the rim down to y=-9 */
const POTS=[
 ['clay pot',p=>{p.poly([[-5.5,0],[5.5,0],[4,-9],[-4,-9]],'#c8693c');p.rect(-6,-1.6,12,2,'#d98252')}],
 ['white pot',p=>{p.poly([[-5,0],[5,0],[4.4,-8],[3,-9],[-3,-9],[-4.4,-8]],'#f1eee8');p.rect(-3.5,-7,1.2,6,'rgba(0,0,0,.06)')}],
 ['blue glazed pot',p=>{p.ell(0,-4.5,6,5,'#1e63c8');p.arc(0,-4.5,4,'#90caf9',.5,3.4,6);p.rect(-4.5,-1,9,1.6,'#164d9e')}],
 ['steel bucket',p=>{p.poly([[-5.5,0],[5.5,0],[4.5,-9],[-4.5,-9]],'#9aa3b5');p.rect(-5.2,-3,10.4,.8,'#7d8698');p.arc(0,0,5.8,'#7d8698',.4,0,3.14)}],
 ['oil drum',p=>{p.rect(-5,-9,10,9,'#1e63c8');for(const y of [-7,-2])p.rect(-5,y,10,.8,'#164d9e');p.circ(-2,-4.5,1.4,'#ffd54f')}],
 ['tire planter',p=>{p.ell(0,-4,7,4.2,'#2b2838');p.ell(0,-2.6,5.4,2.2,'#4a3426');p.arc(0,-4,6.2,'#ffd54f',.5,3.3,6.1)}],
 ['wooden crate',p=>{p.rect(-6,-9,12,9,'#b58150');for(const y of [-6,-3])p.rect(-6,y,12,.6,'#8d5a3b');p.line([[-6,-9],[6,0]],'#8d5a3b',.5)}],
 ['hubcap bowl',p=>{p.poly([[-7,0],[7,0],[4,-4],[-4,-4]],'#c9d1dc');p.poly([[-7,0],[7,0],[6,-1],[-6,-1]],'#eef1f6');p.rect(-1,-9,2,5,'#9aa3b5');p.rect(-4,-9,8,1.2,'#9aa3b5')}],
 ['work boot',p=>{p.poly([[-4,0],[3,0],[3,-6],[7,-7],[7,-9],[-4,-9]],'#8d5a3b');p.rect(-4,-9,11,1.4,'#3e2723');for(let y=-1;y>-6;y-=1.6)p.line([[-2,y],[1,y]],'#f4e1c1',.3)}],
 ['toilet',p=>{p.rect(-4.5,0,9,8,'#f1eee8',1);p.rect(1,4,2.4,.9,'#c9d1dc');p.poly([[-3,-1],[3,-1],[2,-9],[-2,-9]],'#f1eee8');p.ell(0,-.6,6.5,2.4,'#e6e2da');p.ell(0,-.6,5,1.5,'#4a3426')}],
 ['hard hat',p=>{p.half(0,0,6,8,'#fdd835');p.rect(-7.5,-1,15,1.4,'#f9a825');p.rect(-.6,-8,1.2,7,'#f9a825')}],
 ['coffee mug',p=>{p.arc(6,-4.5,2.6,'#f1eee8',1.2,-1.6,1.6);p.rect(-5,-9,10,9,'#f1eee8',1.2);p.text(0,-4.5,'#1',3.6,'#c62828');p.ell(0,0,5,1,'#5d4037')}],
 ['teacup',p=>{p.half(0,0,6,8,'#f8bbd0');p.arc(6.4,-3,2,'#f8bbd0',1,-1.6,1.6);p.ell(0,-8.5,6,1.2,'#f48fb1');p.circ(-2,-4,1,'#fff');p.circ(2,-5,1,'#fff')}],
 ['cowboy hat',p=>{p.ell(0,-7,9,2,'#8d5a3b');p.rect(-4.5,-7,9,7,'#a0693f',2);p.rect(-4.5,-3,9,1.2,'#3e2723')}],
 ['old sink',p=>{p.rect(-6,-3,12,3,'#f1eee8');p.rect(-1.5,-9,3,6,'#e6e2da');p.ell(0,0,6,1.2,'#d0ccd8');p.line([[3,0],[3,3],[1.5,3]],'#9aa3b5',.6)}]];
/* fiberglass giants: ground at y=0, about 55 tall */
const GIANTS=[
 ['chicken',p=>{p.line([[-3,0],[-3,12]],'#ff8f00',1.2);p.line([[3,0],[3,12]],'#ff8f00',1.2);p.ell(12,28,4,8,'#e6dfd0',.6);p.ell(0,22,13,11,'#f6f1e6');p.ell(3,22,7,5,'#e6dfd0',-.3);p.circ(-8,36,6,'#f6f1e6');p.star(-8,42.5,3.2,'#e53935',4,.6);p.poly([[-13.5,37],[-18,35],[-13.5,33.5]],'#fdd835');p.circ(-10,37.5,.9,'#2a1f3d');p.ell(-12.5,31.5,1.4,2.4,'#e53935')}],
 ['cowboy',p=>{for(const x of [-6,1]){p.rect(x,0,5,22,'#1e63c8');p.rect(x-1,0,6,4,'#5d4037',1)}p.rect(-7,22,14,2,'#3e2723');p.rect(-8,24,16,18,'#e53935',2);p.rect(-13,26,5,15,'#e53935',2);p.rect(8,26,5,15,'#e53935',2);p.circ(-10.5,25,2.4,'#f2c29b');p.circ(10.5,25,2.4,'#f2c29b');
   p.circ(0,47,5.5,'#f2c29b');p.circ(2,48,.8,'#2a1f3d');p.circ(-2,48,.8,'#2a1f3d');p.arc(0,45.5,2,'#2a1f3d',.4,3.6,5.8);p.ell(0,52,11,2,'#8d5a3b');p.rect(-5,52,10,6,'#8d5a3b',2);p.rect(-5,52.5,10,1.2,'#3e2723')}],
 ['T. rex',p=>{p.poly([[8,18],[26,10],[30,8],[10,12]],'#43a047');p.rect(-2,0,5,14,'#388e3c',1);p.rect(7,0,5,12,'#388e3c',1);p.ell(2,22,14,10,'#4caf50');p.ell(0,19,9,6,'#a5d6a7');p.ell(-10,32,5,8,'#4caf50',.4);p.ell(-14,40,10,6,'#4caf50');p.rect(-24,34,10,3,'#4caf50',1);
   for(let i=0;i<4;i++)p.poly([[-23+i*2.4,37],[-22+i*2.4,35.6],[-21+i*2.4,37]],'#fff');p.circ(-14,42,1.2,'#2a1f3d');p.line([[-8,26],[-12,22]],'#388e3c',1);for(let i=0;i<5;i++)p.poly([[-4+i*4,31-i*1.5],[-2+i*4,34-i*1.5],[0+i*4,30.5-i*1.5]],'#2e7d32')}],
 ['donut',p=>{p.rect(-1,0,2,14,'#6b6488');p.arc(0,30,11,'#e0a35a',8.5);p.arc(0,30,11,'#f48fb1',6.6,-.2,3.4);for(let i=0;i<12;i++){const t=-.1+i*.3;p.rect(Math.cos(t)*11-.5,30+Math.sin(t)*11,1,2.2,['#ffd54f','#4fc3f7','#fff','#9ccc65'][i%4])}}],
 ['hot dog',p=>{p.rect(-1,0,2,22,'#6b6488');p.ell(0,30,18,6,'#e0a35a');p.ell(0,32.5,20,4,'#c0503a');p.line([[-16,34],[-12,36],[-8,33],[-4,36],[0,33],[4,36],[8,33],[12,36],[16,34]],'#fdd835',1.1);p.ell(0,27,17,4,'#d9944a')}],
 ['ice cream cone',p=>{p.poly([[-8,26],[8,26],[0,0]],'#e0a35a');for(let i=-2;i<=2;i++){p.line([[i*3-1,24],[i*1.2,4]],'#b97a38',.4)}p.circ(0,30,8.5,'#f8bbd0');p.circ(0,40,7.5,'#7b4a32');p.circ(0,48.5,6.4,'#fff8e1');p.circ(1,55,2.2,'#e53935');p.line([[1,57],[3,60]],'#4a8f3c',.4)}],
 ['coffee cup',p=>{p.poly([[-10,32],[10,32],[8,4],[-8,4]],'#f1eee8');p.poly([[-9.4,22],[9.4,22],[8.9,14],[-8.9,14]],'#8d5a3b');p.text(0,18,'JOE',4.5,'#fff');p.ell(0,32,10.5,2.4,'#d0ccd8');for(let i=0;i<3;i++){const o=DV.mv?Math.sin(DV.ph*2+i)*1.5:0;p.line([[-4+i*4,35],[-3+i*4+o,39],[-4+i*4,43],[-3+i*4-o,47]],'rgba(255,255,255,.7)',.7)}}],
 ['spark plug',p=>{p.rect(-3,0,6,6,'#9aa3b5');for(let y=1;y<6;y+=1.4)p.rect(-3,y,6,.4,'#7d8698');p.poly([[-6,6],[6,6],[6,11],[-6,11]],'#6b6488');p.rect(-4.5,11,9,26,'#f1eee8',2);for(let y=16;y<36;y+=4)p.rect(-4.8,y,9.6,1,'#e0dcd2');p.rect(-2,37,4,8,'#9aa3b5');p.line([[0,0],[0,-2],[3,-2]],'#9aa3b5',.8)}],
 ['rubber duck',p=>{p.ell(0,13,16,11,'#fdd835');p.ell(4,15,8,5,'#ffe57f',-.3);p.circ(-8,29,8,'#fdd835');p.ell(-16.5,27,5,2.2,'#ff8f00');p.circ(-10,31,1.3,'#2a1f3d');p.circ(-9.6,31.4,.4,'#fff')}],
 ['cow',p=>{for(const x of [-12,-6,6,12])p.rect(x-1.5,0,3,14,'#f6f1e6');p.rect(-15,13,30,14,'#f6f1e6',5);p.ell(-6,20,4,3,'#2a2440');p.ell(6,23,5,3,'#2a2440');p.ell(0,14,3,2,'#f8bbd0');p.rect(-24,20,10,10,'#f6f1e6',3);p.ell(-24,22,4,3,'#f8bbd0');
   p.circ(-21,27,.9,'#2a1f3d');p.line([[-19,30],[-17,33]],'#e0d6c2',.8);p.line([[-23,30],[-25,33]],'#e0d6c2',.8);p.line([[15,24],[19,16]],'#f6f1e6',.6)}],
 ['moose',p=>{for(const x of [-10,-5,5,10])p.rect(x-1.4,0,2.8,16,'#5d4037');p.ell(0,24,15,9,'#6d4c41');p.ell(-14,28,4,7,'#6d4c41',.5);p.ell(-18,33,4,6,'#6d4c41');p.ell(-20,29,3,3,'#4e342e');p.circ(-17,35,.8,'#2a1f3d');
   for(const d of [-1,1])p.poly([[-17,38],[-17+d*9,44],[-17+d*12,48],[-17+d*9,46],[-17+d*7,49],[-17+d*5,45],[-17+d*3,48],[-17+d*2,42]],'#d7b98a')}],
 ['alien',p=>{p.rect(-5,0,10,22,'#7cb342',3);const w=DV.mv?Math.sin(DV.ph*3)*.4:0;p.line([[5,18],[11,26+w*8]],'#7cb342',2);p.line([[-5,18],[-9,10]],'#7cb342',2);p.ell(0,32,11,13,'#9ccc65');p.ell(-4.5,32,3.4,5,'#1a1530',-.5);p.ell(4.5,32,3.4,5,'#1a1530',.5);
   p.line([[-3,44],[-6,51]],'#7cb342',.6);p.line([[3,44],[6,51]],'#7cb342',.6);p.circ(-6,51,1.6,'#ff4081');p.circ(6,51,1.6,'#ff4081')}],
 ['flying saucer',p=>{p.poly([[-8,0],[8,0],[4,22],[-4,22]],'rgba(200,255,200,.25)');p.ell(0,30,8,6.5,'#9be7ff');p.circ(0,29,2.4,'#7cb342');p.ell(0,26,20,5,'#c9d1dc');p.ell(0,25,20,2,'#eef1f6');for(let i=0;i<7;i++){const on=!DV.mv||((DV.ph*4+i)|0)%2;p.circ(-15+i*5,25,1.1,on?'#ffd740':'#8a7f6a')}}],
 ['rocket',p=>{const f=DV.mv?Math.abs(Math.sin(DV.ph*14))*3:2;p.poly([[-3,6],[3,6],[0,-f]],'#ff9800');p.poly([[-5,6],[-10,4],[-5,16]],'#e53935');p.poly([[5,6],[10,4],[5,16]],'#e53935');p.rect(-5,6,10,34,'#f1eee8',4);p.poly([[-5,38],[5,38],[0,50]],'#e53935');p.circ(0,30,3,'#1e63c8');p.circ(0,30,2,'#90caf9');p.rect(-5,12,10,2,'#e53935')}],
 ['pencil',p=>{p.poly([[-4,8],[4,8],[0,0]],'#f4e1c1');p.poly([[-1.3,2.6],[1.3,2.6],[0,0]],'#2a2440');p.rect(-4,8,8,36,'#fdd835');p.rect(-1.3,8,2.6,36,'#ffe57f');p.rect(-4,44,8,4,'#c9d1dc');p.rect(-4,48,8,5,'#f48fb1',2)}],
 ['lighthouse',p=>{for(let i=0;i<5;i++){const y=i*8,w=7-i*.6;p.poly([[-w,y],[w,y],[w-.6,y+8],[-w+.6,y+8]],i%2?'#f1eee8':'#e53935')}p.rect(-5,40,10,2,'#2a2440');p.rect(-3.4,42,6.8,6,'#fff59d');p.poly([[-4.5,48],[4.5,48],[0,54]],'#e53935');
   if(DV.night>.2){const t=DV.ph*.8;p.poly([[0,45],[Math.cos(t)*40,45+Math.sin(t)*5+4],[Math.cos(t)*40,45+Math.sin(t)*5-4]],'rgba(255,245,200,.3)')}}],
 ['windmill',p=>{p.poly([[-7,0],[7,0],[4,34],[-4,34]],'#a0693f');p.rect(-2,0,4,8,'#5d4037');p.poly([[-5,34],[5,34],[0,40]],'#6d4c41');const t=DV.mv?DV.ph*.8:.4;for(let i=0;i<4;i++){const a=t+i*1.5708,c=Math.cos(a),d=Math.sin(a);p.poly([[c*2-d*1.5,36+d*2+c*1.5],[c*22-d*3,36+d*22+c*3],[c*22,36+d*22],[c*2,36+d*2]],'#f1eee8')}p.circ(0,36,1.8,'#3e2723')}],
 ['inflatable gorilla',p=>{p.ell(0,16,14,16,'#3e3a4a');p.ell(0,18,8,10,'#6b6488');p.ell(-14,30,4,10,'#3e3a4a',.5);p.ell(14,30,4,10,'#3e3a4a',-.5);p.circ(0,38,9,'#3e3a4a');p.ell(0,36,6,5,'#8f8aa8');p.circ(-2.4,39,1,'#2a1f3d');p.circ(2.4,39,1,'#2a1f3d');p.arc(0,35,2.2,'#2a1f3d',.4,3.5,5.9)}],
 ['lumberjack',p=>{for(const x of [-6,1]){p.rect(x,0,5,22,'#37474f');p.rect(x-1,0,6,4,'#3e2723',1)}p.rect(-8,22,16,20,'#c62828',2);for(let i=0;i<4;i++){p.rect(-8,24+i*5,16,1.2,'#2a1f3d');p.rect(-6+i*4,22,1.2,20,'#2a1f3d')}
   p.rect(-13,26,5,15,'#c62828',2);p.rect(8,26,5,15,'#c62828',2);p.line([[11,27],[18,48]],'#8d5a3b',1.2);p.poly([[16,46],[22,49],[20,52],[16,50]],'#9aa3b5');p.circ(0,47,5.5,'#f2c29b');p.half(0,45,6,6,'#6d4c41');p.rect(-6,50,12,5,'#1e63c8',2.5);p.circ(-2,48,.8,'#2a1f3d');p.circ(2,48,.8,'#2a1f3d')}],
 ['fish',p=>{p.rect(-1,0,2,24,'#6b6488');p.poly([[16,34],[25,42],[25,26]],'#29b6f6');p.ell(0,34,18,9,'#4fc3f7');p.ell(0,31,14,4,'#e1f5fe');p.poly([[-2,42],[6,47],[8,41]],'#29b6f6');p.circ(-12,36,2,'#fff');p.circ(-12.5,36,1,'#2a1f3d');for(let i=0;i<4;i++)p.arc(-3+i*4,34,3,'#0288d1',.3,-1,1)}],
 ['bowling pin',p=>{p.ell(0,12,9,12,'#f6f1e6');p.rect(-3.4,20,6.8,14,'#f6f1e6');p.circ(0,38,5,'#f6f1e6');p.rect(-3.6,26,7.2,1.6,'#e53935');p.rect(-3.5,29,7,1.6,'#e53935');p.ell(-3,12,2,7,'rgba(255,255,255,.6)')}],
 ['pickle',p=>{const w=DV.mv?Math.sin(DV.ph*3)*4:2;p.line([[-8,24],[-15,30+w]],'#558b2f',1.4);p.line([[8,24],[15,18]],'#558b2f',1.4);p.line([[-3,4],[-4,0]],'#558b2f',1.4);p.line([[3,4],[4,0]],'#558b2f',1.4);p.ell(0,25,9,22,'#7cb342');for(let i=0;i<10;i++)p.circ(Math.sin(i*2.1)*6,10+i*3.2,.8,'#9ccc65');
   p.circ(-3,34,2,'#fff');p.circ(3,34,2,'#fff');p.circ(-3,34,1,'#2a1f3d');p.circ(3,34,1,'#2a1f3d');p.arc(0,30,3,'#2a1f3d',.5,3.5,5.9)}],
 ['pineapple',p=>{for(let i=0;i<7;i++){const t=Math.PI/2+(i-3)*.35;p.ell(Math.cos(t)*7,34+Math.sin(t)*7,8,1.8,i%2?'#43a047':'#2e7d32',t)}p.ell(0,16,11,16,'#f9a825');for(let i=-3;i<=3;i++){p.line([[i*4-6,2],[i*4+6,30]],'#c17900',.4);p.line([[i*4+6,2],[i*4-6,30]],'#c17900',.4)}}],
 ['teapot',p=>{p.poly([[12,18],[22,28],[20,30],[10,22]],'#ec407a');p.arc(-15,18,6,'#ec407a',2.2,1.6,4.7);p.ell(0,16,16,13,'#ec407a');p.ell(-4,20,6,4,'rgba(255,255,255,.3)');p.ell(0,28,9,2.4,'#c2185b');p.circ(0,31,2.2,'#c2185b');for(let i=0;i<5;i++)p.circ(-10+i*5,12,1.4,'#fff')}],
 ['cowboy boot',p=>{p.poly([[-8,0],[14,0],[16,4],[14,8],[4,10],[4,40],[-10,40],[-9,4]],'#8d5a3b');p.rect(-10,0,6,3,'#3e2723');p.line([[-6,12],[0,24],[-6,34]],'#f4e1c1',.6);p.star(14,2,3,'#c9d1dc',8,.4);p.rect(-10.5,38,15,3,'#6d4c41')}],
 ['guitar',p=>{p.rect(-1.6,24,3.2,26,'#5d4037');p.rect(-2.6,48,5.2,8,'#3e2723',1);p.ell(0,9,12,10,'#ff7043');p.ell(0,22,9,8,'#ff7043');p.circ(0,17,3.4,'#3e2723');p.rect(-4,6,8,2,'#3e2723');for(let i=-1;i<=1;i++)p.line([[i*.8,7],[i*.8,52]],'#eceff1',.15)}],
 ['peanut',p=>{p.line([[-5,26],[-12,20]],'#2a1f3d',.6);p.line([[5,26],[12,32]],'#2a1f3d',.6);p.line([[-3,3],[-4,-1]],'#2a1f3d',.6);p.line([[3,3],[4,-1]],'#2a1f3d',.6);p.ell(0,13,9,11,'#d7a86e');p.ell(0,32,8,10,'#d7a86e');for(let i=0;i<14;i++)p.circ(Math.sin(i*1.7)*5,4+i*2.6,.5,'#b98a4e');
   p.rect(-7,33,6,3,'#1a1530',1);p.rect(1,33,6,3,'#1a1530',1);p.line([[-1,34.5],[1,34.5]],'#1a1530',.4);p.arc(0,30,2.5,'#2a1f3d',.4,3.5,5.9)}],
 ['corn cob',p=>{p.ell(0,26,8,22,'#fdd835');for(let r=0;r<12;r++)for(let c=-2;c<=2;c++)p.circ(c*2.6,8+r*3.2,1,'#f9a825');p.poly([[-2,4],[-12,30],[-8,10]],'#7cb342');p.poly([[2,4],[12,32],[8,10]],'#689f38')}],
 ['milk bottle',p=>{p.poly([[-9,0],[9,0],[9,24],[4,32],[4,38],[-4,38],[-4,32],[-9,24]],'#f6f1e6');p.rect(-4.4,38,8.8,4,'#e53935',1);p.rect(-7,8,14,10,'#1e63c8',2);p.text(0,13,'MILK',5,'#fff')}],
 ['tire',p=>{p.rect(-6,0,12,2,'#6b6488');p.circ(0,17,15,'#2b2838');for(let i=0;i<16;i++){const t=i/16*6.28;p.line([[Math.cos(t)*12.5,17+Math.sin(t)*12.5],[Math.cos(t)*14.6,17+Math.sin(t)*14.6]],'#3d394e',.8)}p.circ(0,17,8,'#c9d1dc');p.circ(0,17,3,'#7d8698')}],
 ['wrench',p=>{p.rect(-3,0,6,2,'#6b6488');p.rect(-2.4,2,4.8,34,'#9aa3b5',2);p.circ(0,40,6,'#9aa3b5');p.rect(-2.2,40,4.4,7,'#87ceeb');p.rect(-1.6,4,1,30,'rgba(255,255,255,.4)')}],
 ['garden gnome',p=>{p.rect(-6,0,12,4,'#5d4037',1);p.ell(0,12,8,9,'#1e63c8');p.circ(0,24,5,'#f2c29b');p.poly([[-6,22],[6,22],[0,10]],'#f1eee8');p.poly([[-5.5,26],[5.5,26],[2,42]],'#e53935');p.circ(2,42,1.4,'#e53935');p.circ(-2,25,.7,'#2a1f3d');p.circ(2,25,.7,'#2a1f3d');p.circ(0,23,1.4,'#f48fb1')}],
 ['flamingo',p=>{p.line([[-1,0],[-1,16]],'#ec407a',.7);p.line([[2,0],[2,8],[-1,12]],'#ec407a',.7);p.ell(0,20,10,6,'#f48fb1',-.2);p.line([[-7,22],[-9,30],[-5,38],[-8,42]],'#f48fb1',1.6);p.circ(-8,43,2.4,'#f48fb1');p.poly([[-10,43],[-13,40],[-10.5,41.6]],'#2a1f3d');p.circ(-8.6,44,.5,'#2a1f3d')}],
 ['pizza slice',p=>{p.rect(-1,0,2,10,'#6b6488');p.poly([[-14,46],[14,46],[0,10]],'#ffca28');p.rect(-15,44,30,4,'#d9944a',2);for(const [x,y] of [[-5,36],[4,38],[0,26],[-2,18]])p.circ(x,y,2.6,'#c62828')}],
 ['sneaker',p=>{p.poly([[-18,0],[16,0],[18,4],[18,8],[-18,8]],'#f1eee8');p.poly([[-18,8],[18,8],[14,18],[0,22],[-6,30],[-16,30],[-18,20]],'#e53935');for(let i=0;i<4;i++)p.line([[-4+i*3,20-i*2],[0+i*3,24-i*2]],'#fff',.5);p.arc(-6,14,5,'#fff',.8,2,4)}],
 ['robot',p=>{p.rect(-6,0,4,12,'#9aa3b5');p.rect(2,0,4,12,'#9aa3b5');p.rect(-10,12,20,20,'#c9d1dc',2);p.rect(-6,18,12,8,'#5c6aa8',1);for(let i=0;i<3;i++)p.circ(-3+i*3,22,1,['#ff5252','#ffd740','#69f0ae'][i]);p.rect(-15,14,5,14,'#9aa3b5',2);p.rect(10,14,5,14,'#9aa3b5',2);
   p.rect(-7,33,14,11,'#c9d1dc',2);const on=!DV.mv||Math.sin(DV.ph*2)>-.9;p.circ(-3,39,1.6,on?'#40c4ff':'#455');p.circ(3,39,1.6,on?'#40c4ff':'#455');p.line([[0,44],[0,49]],'#7d8698',.6);p.circ(0,50,1.4,'#ff5252')}],
 ['snail',p=>{p.ell(-2,4,18,4,'#c5e1a5');p.circ(-14,10,4,'#c5e1a5');p.line([[-15,13],[-18,20]],'#aed581',.6);p.line([[-13,13],[-12,20]],'#aed581',.6);p.circ(-18,20.5,1,'#2a1f3d');p.circ(-12,20.5,1,'#2a1f3d');p.circ(2,16,12,'#ff8a65');p.arc(2,16,8,'#d84315',1.2);p.arc(2,16,4,'#d84315',1.2)}]];
/* flags: 8 patterns, drawn in a 0..1 by 0..0.64 box */
const FLAGPAT=[['striped',(p,c)=>{for(let i=0;i<5;i++)p.rect(0,i*.128,1,.128,i%2?c[1]:c[0])}],['tricolor',(p,c)=>{for(let i=0;i<3;i++)p.rect(i/3,0,1/3,.64,c[i])}],
 ['cross',(p,c)=>{p.rect(0,0,1,.64,c[0]);p.rect(.28,0,.16,.64,c[1]);p.rect(0,.24,1,.16,c[1]);p.rect(.32,0,.08,.64,c[2]);p.rect(0,.28,1,.08,c[2])}],
 ['diagonal',(p,c)=>{p.poly([[0,0],[1,0],[0,.64]],c[0]);p.poly([[1,0],[1,.64],[0,.64]],c[1]);p.poly([[.85,0],[1,0],[.15,.64],[0,.64]],c[2])}],
 ['star',(p,c)=>{p.rect(0,0,1,.64,c[0]);p.circ(.5,.32,.22,c[1]);p.star(.5,.32,.18,c[2])}],
 ['checkered',(p,c)=>{for(let i=0;i<6;i++)for(let j=0;j<4;j++)p.rect(i/6,j*.16,1/6,.16,(i+j)%2?c[0]:c[1])}],
 ['sunburst',(p,c)=>{p.rect(0,0,1,.64,c[0]);for(let i=0;i<12;i++){const t=i/12*6.283;p.line([[.5,.32],[.5+Math.cos(t)*.7,.32+Math.sin(t)*.7]],c[2],.03)}p.rect(0,0,1,.03,c[0]);p.circ(.5,.32,.14,c[1])}],
 ['chevron',(p,c)=>{p.rect(0,0,1,.64,c[0]);p.poly([[0,0],[.45,.32],[0,.64],[.2,.64],[.65,.32],[.2,0]],c[1]);p.poly([[0,.06],[.36,.32],[0,.58]],c[2])}]];
function flagPen(base,w){return base.warp((x,y)=>[x,y+(DV.mv?Math.sin(DV.ph*4-x*6)*x*.05:x*.03)])}
/* little scenes for picture frames, calendars and snow globes, in a -1..1 by -0.7..0.7 box */
const SCENES=[
 ['Mountains',p=>{p.rect(-1,-.7,2,1.4,'#9fd7f0');p.poly([[-1,-.7],[-.4,.35],[0,-.1],[.4,.3],[1,-.4],[1,-.7]],'#5c8f6a');p.poly([[-.4,.35],[-.28,.12],[-.52,.12]],'#fff');p.circ(.55,.38,.12,'#ffd54f')}],
 ['Sunset',p=>{p.rect(-1,-.7,2,1.4,'#ff8a65');p.rect(-1,-.1,2,.8,'#ffb74d');p.circ(0,-.05,.32,'#fff176');p.rect(-1,-.7,2,.65,'#3f51b5');for(let i=0;i<3;i++)p.rect(-.5+i*.2,-.25-i*.12,.6-i*.2,.03,'#fff176')}],
 ['Desert',p=>{p.rect(-1,-.7,2,1.4,'#ffe0b2');p.rect(-1,-.7,2,.5,'#e0a35a');p.poly([[-.9,-.2],[-.8,.25],[-.3,.25],[-.2,-.2]],'#bf6c3a');p.rect(.4,-.3,.08,.5,'#4caf6a');p.rect(.3,0,.1,.06,'#4caf6a');p.rect(.3,0,.04,.15,'#4caf6a')}],
 ['Forest',p=>{p.rect(-1,-.7,2,1.4,'#c8e6c9');for(let i=0;i<6;i++){const x=-.85+i*.34,h=.6+(i%3)*.15;p.poly([[x-.2,-.6],[x+.2,-.6],[x,-.6+h]],i%2?'#2e7d32':'#388e3c')}}],
 ['City at night',p=>{p.rect(-1,-.7,2,1.4,'#1a237e');for(let i=0;i<7;i++){const x=-1+i*.29,h=.4+((i*37)%5)/8;p.rect(x,-.7,.25,h,'#283593');for(let j=0;j<4;j++)p.rect(x+.05,-.6+j*.12,.05,.05,'#ffd54f')}p.circ(.7,.45,.1,'#fff9c4')}],
 ['Lighthouse',p=>{p.rect(-1,-.7,2,1.4,'#b3e5fc');p.rect(-1,-.7,2,.4,'#1565c0');p.poly([[-.15,-.35],[.15,-.35],[.1,.4],[-.1,.4]],'#fff');p.rect(-.13,-.1,.26,.1,'#e53935');p.rect(-.13,.15,.24,.1,'#e53935');p.poly([[-.12,.4],[.12,.4],[0,.55]],'#e53935')}],
 ['Big rig',p=>{p.rect(-1,-.7,2,1.4,'#fff3e0');p.rect(-1,-.7,2,.3,'#8d8d9a');p.rect(-.8,-.35,1,.5,'#c62828');p.rect(.25,-.35,.45,.4,'#e53935');p.rect(.45,-.15,.2,.15,'#bfe6ff');for(const x of [-.6,-.1,.45])p.circ(x,-.38,.1,'#2a2440')}],
 ['Old pickup',p=>{p.rect(-1,-.7,2,1.4,'#c5e1a5');p.rect(-.75,-.35,1.4,.3,'#26a69a');p.rect(-.1,-.05,.5,.3,'#26a69a');p.rect(.05,0,.25,.2,'#e0f7fa');for(const x of [-.5,.4])p.circ(x,-.38,.12,'#2a2440')}],
 ['Good dog',p=>{p.rect(-1,-.7,2,1.4,'#e1bee7');p.ell(0,-.3,.45,.35,'#d9893d');p.circ(0,.15,.32,'#d9893d');p.ell(-.28,.18,.1,.22,'#8d5a2b',.3);p.ell(.28,.18,.1,.22,'#8d5a2b',-.3);p.circ(-.1,.2,.04,'#2a1f3d');p.circ(.1,.2,.04,'#2a1f3d');p.circ(0,.08,.06,'#2a1f3d')}],
 ['Cat',p=>{p.rect(-1,-.7,2,1.4,'#fff9c4');p.ell(0,-.3,.4,.35,'#90a4ae');p.circ(0,.15,.3,'#90a4ae');p.poly([[-.28,.3],[-.2,.5],[-.08,.36]],'#90a4ae');p.poly([[.28,.3],[.2,.5],[.08,.36]],'#90a4ae');p.circ(-.1,.17,.05,'#69f0ae');p.circ(.1,.17,.05,'#69f0ae')}],
 ['Cow in a field',p=>{p.rect(-1,-.7,2,1.4,'#b3e5fc');p.rect(-1,-.7,2,.6,'#8bc34a');p.rect(-.4,-.4,.7,.35,'#fff');p.ell(-.15,-.25,.1,.07,'#2a2440');p.rect(-.6,-.3,.25,.25,'#fff');p.rect(-.35,-.55,.06,.15,'#fff');p.rect(.2,-.55,.06,.15,'#fff')}],
 ['Horse',p=>{p.rect(-1,-.7,2,1.4,'#ffe0b2');p.ell(0,-.15,.45,.22,'#6d4c41');p.poly([[-.35,-.05],[-.6,.35],[-.45,.4],[-.25,.05]],'#6d4c41');for(const x of [-.3,-.15,.15,.3])p.rect(x,-.6,.06,.4,'#6d4c41');p.line([[.42,-.1],[.6,-.35]],'#3e2723',.06)}],
 ['Eagle',p=>{p.rect(-1,-.7,2,1.4,'#90caf9');p.poly([[0,0],[-.9,.3],[-.5,0],[-.8,-.1],[0,-.15],[.8,-.1],[.5,0],[.9,.3]],'#5d4037');p.circ(0,.08,.1,'#fff');p.poly([[.08,.08],[.18,.05],[.08,.02]],'#ffc107')}],
 ['Moon & stars',p=>{p.rect(-1,-.7,2,1.4,'#1a1550');p.circ(.3,.15,.3,'#fff9c4');p.circ(.42,.22,.26,'#1a1550');for(let i=0;i<9;i++)p.star(-.8+((i*37)%17)/10,-.55+((i*53)%12)/10,.05,'#fff')}],
 ['Volcano',p=>{p.rect(-1,-.7,2,1.4,'#ffccbc');p.poly([[-1,-.7],[-.2,.25],[.2,.25],[1,-.7]],'#5d4037');p.poly([[-.2,.25],[.2,.25],[.05,-.1],[0,.1],[-.1,-.2]],'#ff5722');for(let i=0;i<3;i++)p.circ(-.1+i*.12,.45+i*.07,.1,'#9e9e9e')}],
 ['UFO over a field',p=>{p.rect(-1,-.7,2,1.4,'#283593');p.rect(-1,-.7,2,.4,'#2e7d32');p.poly([[-.15,.25],[.15,.25],[.4,-.45],[-.4,-.45]],'rgba(255,255,180,.4)');p.ell(0,.3,.4,.1,'#c9d1dc');p.ell(0,.36,.15,.1,'#80deea')}],
 ['Squares',p=>{p.rect(-1,-.7,2,1.4,'#f5f5f5');p.rect(-.8,-.5,.8,.8,'#e53935');p.rect(.1,-.1,.6,.6,'#1e63c8');p.rect(.1,-.6,.4,.4,'#fdd835');p.rect(-1,.3,2,.04,'#212121');p.rect(0,-.7,.04,1.4,'#212121')}],
 ['Circles',p=>{p.rect(-1,-.7,2,1.4,'#fff3e0');p.circ(-.4,0,.4,'#ff7043');p.circ(.3,.2,.3,'#26a69a');p.circ(.4,-.35,.22,'#7e57c2');p.circ(-.1,-.4,.12,'#ffca28')}],
 ['Engine blueprint',p=>{p.rect(-1,-.7,2,1.4,'#1565c0');const L=[[-.6,-.4],[.6,-.4],[.6,.3],[-.6,.3]];p.line(L,'#e3f2fd',.03,0,true);for(let i=0;i<4;i++)p.arc(-.45+i*.3,.1,.1,'#e3f2fd',.025);p.line([[-.8,-.55],[.8,-.55]],'#e3f2fd',.02)}],
 ['Treasure map',p=>{p.rect(-1,-.7,2,1.4,'#f4e1c1');p.poly([[-.6,-.3],[-.2,.4],[.3,.3],[.6,-.2],[.1,-.5]],'#c8e6c9');p.line([[-.4,-.1],[-.1,.1],[.1,-.1],[.3,0]],'#8d5a3b',.03);p.line([[.25,.05],[.35,-.05]],'#c62828',.05);p.line([[.25,-.05],[.35,.05]],'#c62828',.05)}],
 ['Beach',p=>{p.rect(-1,-.7,2,1.4,'#81d4fa');p.rect(-1,-.7,2,.5,'#ffe082');p.rect(-1,-.25,2,.15,'#29b6f6');p.circ(.6,.4,.15,'#fff176');p.line([[-.5,-.5],[-.45,.2]],'#8d6e63',.05);for(let i=0;i<4;i++){const t=Math.PI/2+(i-1.5)*.8;p.ell(-.45+Math.cos(t)*.18,.2+Math.sin(t)*.06,.2,.04,'#43a047',t)}}],
 ['Hot air balloons',p=>{p.rect(-1,-.7,2,1.4,'#b3e5fc');[[-.5,.1,'#e53935'],[.2,.3,'#fdd835'],[.55,-.2,'#7e57c2']].forEach(([x,y,c])=>{p.circ(x,y,.18,c);p.rect(x-.04,y-.3,.08,.07,'#8d5a3b')})}]];
/* neon symbols, drawn as tubes in a -1..1 box */
const ARC=(x,y,r,a0,a1,n=12)=>{const a=[];for(let i=0;i<=n;i++){const t=a0+(a1-a0)*i/n;a.push([x+Math.cos(t)*r,y+Math.sin(t)*r])}return a};
const ICONS=[
 ['wrench',[ARC(-.45,.45,.35,-.6,4.2),[[-.25,.2],[.55,-.6]],ARC(.6,-.65,.2,2.3,5.6)]],['truck',[[[-.8,-.4],[-.8,.4],[.2,.4],[.2,-.4],[-.8,-.4]],[[.2,.2],[.55,.2],[.8,-.1],[.8,-.4],[.2,-.4]],ARC(-.5,-.45,.15,0,6.3),ARC(.5,-.45,.15,0,6.3)]],
 ['heart',[[[0,-.7],[-.8,.1],[-.75,.5],[-.4,.7],[0,.4],[.4,.7],[.75,.5],[.8,.1],[0,-.7]]]],['star',[Array.from({length:11},(_,i)=>{const t=Math.PI/2+i*Math.PI/5,r=i%2?.38:.85;return [Math.cos(t)*r,Math.sin(t)*r]})]],
 ['flame',[[[0,-.8],[-.5,-.4],[-.45,.2],[-.15,.5],[-.1,.85],[.3,.4],[.5,0],[.45,-.45],[0,-.8]],[[0,-.6],[-.2,-.2],[0,.15],[.2,-.2],[0,-.6]]]],
 ['pizza slice',[[[-.6,.6],[.6,.6],[0,-.8],[-.6,.6]],ARC(-.1,.2,.12,0,6.3),ARC(.15,-.1,.1,0,6.3)]],['coffee cup',[[[-.5,.3],[-.4,-.6],[.4,-.6],[.5,.3],[-.5,.3]],ARC(.55,-.1,.2,-1.5,1.5),[[-.2,.5],[-.1,.8]],[[.1,.5],[.2,.8]]]],
 ['cactus',[[[-.12,-.8],[-.12,.7]],[[.12,-.8],[.12,.7]],[[-.12,0],[-.5,0],[-.5,.4]],[[.12,-.2],[.5,-.2],[.5,.25]]]],['lightning bolt',[[[.2,.85],[-.4,-.05],[.05,-.05],[-.2,-.85],[.45,.1],[0,.1],[.2,.85]]]],
 ['alien',[ARC(0,.1,.6,0,6.3,20),[[-.35,.15],[-.1,0]],[[.35,.15],[.1,0]],[[-.25,.65],[-.4,.9]],[[.25,.65],[.4,.9]]]],['cat',[[[-.5,-.6],[-.5,.3],[-.4,.7],[-.2,.35],[.2,.35],[.4,.7],[.5,.3],[.5,-.6],[-.5,-.6]],[[-.2,0],[-.2,.05]],[[.2,0],[.2,.05]],[[.5,-.4],[.85,-.1]]]],
 ['palm tree',[[[0,-.8],[.1,0],[0,.5]],[[0,.5],[-.6,.3]],[[0,.5],[.6,.35]],[[0,.5],[-.3,.85]],[[0,.5],[.35,.85]]]],['crescent moon',[ARC(0,0,.7,.9,5.4,18),ARC(.35,0,.55,1.5,4.8,14)]],
 ['anchor',[[[0,-.6],[0,.7]],ARC(0,.75,.12,0,6.3),[[-.35,.45],[.35,.45]],ARC(0,-.2,.55,3.6,5.8)]],['piston',[[[-.4,.2],[.4,.2],[.4,.8],[-.4,.8],[-.4,.2]],[[0,.2],[-.2,-.5]],ARC(-.2,-.6,.15,0,6.3)]],
 ['tire',[ARC(0,0,.75,0,6.3,20),ARC(0,0,.35,0,6.3,14)]],['crown',[[[-.7,-.4],[-.7,.4],[-.35,0],[0,.55],[.35,0],[.7,.4],[.7,-.4],[-.7,-.4]]]],
 ['music note',[[[.1,-.5],[.1,.7],[.55,.5]],ARC(-.1,-.55,.2,0,6.3)]],['ghost',[[[-.5,-.7],[-.5,.2],...ARC(0,.2,.5,3.14,0),[.5,-.7],[.25,-.5],[0,-.7],[-.25,-.5],[-.5,-.7]],[[-.2,.25],[-.2,.3]],[[.2,.25],[.2,.3]]]],
 ['arrow',[[[-.8,0],[.7,0]],[[.35,.35],[.7,0],[.35,-.35]]]],['cherries',[ARC(-.3,-.4,.25,0,6.3),ARC(.3,-.5,.25,0,6.3),[[-.3,-.15],[.1,.7]],[[.3,-.25],[.1,.7]],[[.1,.7],[.4,.75]]]],
 ['flamingo',[[[-.1,-.8],[-.1,-.1]],ARC(.1,0,.3,3,6.3),[[.4,0],[.3,.5],[.05,.7],[.2,.8]]]],['burger',[ARC(0,0,.6,0,3.14),[[-.6,0],[.6,0]],[[-.65,-.15],[.65,-.15]],[[-.6,-.3],[.6,-.3],[.5,-.45],[-.5,-.45],[-.6,-.3]]]],
 ['rocket',[[[0,.85],[.3,.4],[.3,-.4],[-.3,-.4],[-.3,.4],[0,.85]],[[-.3,-.2],[-.55,-.6],[-.3,-.45]],[[.3,-.2],[.55,-.6],[.3,-.45]],ARC(0,.15,.1,0,6.3)]]];
return {P,mix,shade,tint,rgb,dim,lum,ink,H,quad,ibox,glow,ell,cyl,pen,wrap,spr,stand,shadowE,wallPen,sw,PALS,palOf,NEONC,neonOf,SKIN,PLANTS,POTS,GIANTS,FLAGPAT,flagPen,SCENES,ICONS}
})();

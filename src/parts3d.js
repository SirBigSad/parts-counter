/* ===== Parts Counter Idle: little isometric drawings of each kind of part, in the same flat, softly lit
   style as the store picture. part3d(key) returns an SVG for a part key from icons.js (BASE_IC). ===== */
const P3=(()=>{
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16)),hex=a=>'#'+a.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
const mx=(a,b,t)=>{const A=hx(a),B=hx(b);return hex(A.map((v,i)=>v+(B[i]-v)*t))},dk=(c,t=.28)=>mx(c,'#1a1530',t),lt=(c,t=.3)=>mx(c,'#ffffff',t);
/* iso projection inside a 48x48 box: x to the lower right, y to the lower left, z up */
/* set for each drawing: the brand's color, the part's name and a number that varies the shape per part */
let BC='#2f6fd6',NAME='',SEED=0,BH=0;
const P=(x,y,z)=>[24+(x-y)*.866,30+(x+y)*.5-z],pt=a=>a.map(n=>n.toFixed(1)).join(',');
const poly=(pts,f)=>`<polygon points="${pts.map(p=>pt(P(...p))).join(' ')}" fill="${f}"/>`;
const el=(cx,cy,rx,ry,f,extra='')=>`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx}" ry="${ry}" fill="${f}"${extra}/>`;
const shadow=(cx=24,cy=40,rx=15)=>el(cx,cy,rx,rx*.36,'rgba(20,15,48,.22)');
/* a block with a lit top, a mid right face and a shaded left face */
const box=(x,y,z,w,d,h,c,top)=>poly([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],dk(c,.25))+poly([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],c)+poly([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],top||lt(c,.25));
/* a standing cylinder: lit left half, shaded right half, bright top */
const cylV=(cx,base,rx,h,c,top,ry)=>{ry=ry||rx*.45;const t=base-h;return `<path d="M${cx-rx} ${t}V${base}A${rx} ${ry} 0 0 0 ${cx+rx} ${base}V${t}Z" fill="${c}"/><path d="M${cx} ${t+ry}V${base+ry}A${rx} ${ry} 0 0 0 ${cx+rx} ${base}V${t}A${rx} ${ry} 0 0 1 ${cx} ${t+ry}Z" fill="${dk(c,.22)}"/>`+el(cx,t,rx,ry,top||lt(c,.28))};
/* a disc on its side, facing the lower right: rotors, tires, wheels, drums */
const disc=(cx,cy,r,depth,c,face,hole)=>{const ox=-depth*.866,oy=-depth*.5,rx=r*.62;return el(cx+ox,cy+oy,rx,r,dk(c,.35))+`<polygon points="${pt([cx+ox,cy+oy-r])} ${pt([cx,cy-r])} ${pt([cx,cy+r])} ${pt([cx+ox,cy+oy+r])}" fill="${dk(c,.2)}"/>`+el(cx,cy,rx,r,face||c)+(hole?el(cx,cy,rx*hole,r*hole,dk(c,.5)):'')};
/* a flat ring lying down: tape, gaskets, hose coils */
const ring=(cx,cy,r,h,c,hole=.5)=>cylV(cx,cy,r,h,c)+el(cx,cy-h,r*hole,r*hole*.45,dk(c,.55));
const svg=(body,tag)=>{const sx=.8+(SEED%17)/70,sy=.8+(Math.floor(SEED/17)%13)/52;return `<svg class="p3" viewBox="0 0 48 48" aria-hidden="true"><g transform="translate(24 41) scale(${sx.toFixed(2)} ${sy.toFixed(2)}) translate(-24 -37.5)">${body}</g>${tag||''}</svg>`};
/* a little brand tag hung on every part, in the brand's color */
const tag=t=>t?`<g><rect x="${46-Math.max(12,t.length*4.6+5)}" y="37" width="${Math.max(12,t.length*4.6+5)}" height="9" rx="2.5" fill="${BC}" stroke="#fff" stroke-width=".8"/><rect x="${46-Math.max(12,t.length*4.6+5)+2}" y="44" width="${Math.max(12,t.length*4.6+5)-4}" height="1" fill="hsl(${BH%360} 70% 70%)" opacity=".9"/><text x="${46-Math.max(12,t.length*4.6+5)/2}" y="43.6" text-anchor="middle" font-family="Barlow Condensed,Arial Narrow,sans-serif" font-weight="700" font-size="6.6" fill="${lum(BC)>.62?'#1a1530':'#fff'}">${t}</text></g>`:'';
const lum=c=>{const [r,g,b]=hx(toHex(c));return (r*.299+g*.587+b*.114)/255};
const M={
 filter:()=>/air filter|prefilter|air cleaner/.test(NAME)&&!/cabin/.test(NAME)?shadow(24,40,15)+ring(24,38,14,16,BC,.5)+[0,1,2,3,4,5,6,7].map(i=>`<rect x="${11+i*3.4}" y="23" width="1.2" height="14" fill="${dk(BC,.25)}" opacity=".6"/>`).join('')
  :/cabin/.test(NAME)?shadow()+box(-12,-7,0,24,14,5,lt(BC,.6))+[0,1,2,3,4,5,6].map(i=>poly([[-10+i*3.2,-7,5.1],[-9+i*3.2,-7,5.1],[-9+i*3.2,7,5.1],[-10+i*3.2,7,5.1]],dk(lt(BC,.6),.2))).join('')+box(-12,-7,0,24,14,1.5,BC)
  :/separator/.test(NAME)?shadow()+cylV(24,24,10,14,BC)+el(24,10,10,4.5,'#c9cbd6')+cylV(24,40,8,14,'#cfe8ff','#e8f4ff')+el(24,36,6,2.6,'#b0d8f5')+cylV(24,42,2,3,'#c9a43b')
  :/fuel/.test(NAME)?shadow(24,40,9)+cylV(24,38,8,26,BC)+el(24,12,8,3.6,'#c9cbd6')+el(24,12,4,1.8,'#7a7f94')+`<rect x="16" y="22" width="16" height="4" fill="${lt(BC,.55)}"/>`
  :/coolant|hydraulic|transmission|def/.test(NAME)?shadow(24,40,10)+cylV(24,38,10,14,BC)+el(24,24,10,4.5,'#c9cbd6')+el(24,24,5,2.2,'#7a7f94')
  :shadow()+cylV(24,38,11,22,BC)+el(24,16,11,5,'#c9cbd6')+el(24,16,6,2.7,'#7a7f94')+`<rect x="13" y="24" width="22" height="5" fill="${lt(BC,.55)}"/>`,
 jug:()=>/pail/.test(NAME)?shadow(24,40,13)+cylV(24,40,12,20,BC)+el(24,20,12,5.4,lt(BC,.3))+`<path d="M12 21q12-14 24 0" stroke="#8a8fa3" stroke-width="1.6" fill="none"/><rect x="12" y="27" width="24" height="7" fill="#fff" opacity=".85"/>`
  :/quart|qt|oz|bottle/.test(NAME)?shadow(24,40,8)+cylV(24,40,6,18,BC)+cylV(24,22,3,4,'#2a2440')
  :shadow()+box(-9,-6,0,17,12,17,BC)+box(1,-4,17,5,5,4,'#2a2440')+box(-8,-5,17,5,3,5,dk(BC,.15))+poly([[-9,6,4],[8,6,4],[8,6,11],[-9,6,11]],'#fff7e0'),
 barrel:()=>shadow(24,41,13)+cylV(24,40,12,26,BC)+`<rect x="12" y="22" width="24" height="2" fill="${dk(BC,.3)}"/><rect x="12" y="31" width="24" height="2" fill="${dk(BC,.3)}"/>`+el(19,14,2,1,'#c9cbd6'),
 tube:()=>shadow(24,40,10)+`<g transform="rotate(-28 24 26)">`+cylV(24,40,6,22,BC)+cylV(24,18,2.5,6,'#fff')+`</g>`,
 glove:()=>shadow()+box(-10,-6,0,20,12,12,BC)+`<path d="M20 15q-3-6 1-7t3 4q0-6 3-6t2 5q2-4 4-2t-2 8z" fill="#7fc3ff"/>`,
 box:()=>shadow()+box(-10,-8,0,20,16,16,'#d9a05b')+poly([[-1.5,-8,16],[1.5,-8,16],[1.5,8,16],[-1.5,8,16]],BC)+poly([[10,-1.5,0],[10,1.5,0],[10,1.5,16],[10,-1.5,16]],'#c99555'),
 can:()=>shadow(24,40,9)+cylV(24,40,7,22,BC)+el(24,18,7,3.2,'#c9cbd6')+cylV(24,17,3,4,'#d0d3de')+`<rect x="23" y="11" width="4" height="2" fill="#2a2440"/><rect x="17" y="26" width="14" height="6" fill="#fff" opacity=".85"/>`,
 tie:()=>/wire|cable|harness/.test(NAME)?shadow()+disc(26,26,11,12,'#8a6a3a','#a7845a',.3)+el(26,26,6.5,10.5,BC)+el(26,26,3,4.8,'#5a4a2a')+`<path d="M33 36q6 4 10 0" stroke="${BC}" stroke-width="1.6" fill="none"/>`
  :shadow()+box(-10,-7,0,20,14,10,'#cfd8e6')+[0,1,2].map(i=>`<path d="M${15+i*6} 22q3-10 6 0" stroke="#2a2440" stroke-width="1.6" fill="none"/>`).join(''),
 tape:()=>shadow(24,38,13)+ring(24,36,12,7,BC,.5),
 bolt:()=>shadow(24,40,8)+cylV(24,40,3.5,16,'#a7adbf')+[0,1,2,3].map(i=>`<rect x="20.5" y="${28+i*3}" width="7" height="1" fill="#7a7f94"/>`).join('')+cylV(24,24,8,5,'#c9cdd9',null,3.4),
 bulb:()=>shadow(24,40,8)+cylV(24,40,4.5,7,'#a7adbf')+el(24,24,9,10,'#fff3b0')+el(21,20,3,4,'#fff')+el(24,24,13,13,'#ffe066',' opacity=".25"'),
 hose:()=>/clamp/.test(NAME)?shadow()+ring(18,36,8,4,'#c9cdd9',.8)+ring(30,32,7,4,'#b5bacb',.8)+box(-2,6,0,8,6,6,BC)
  :/hose|line|tube/.test(NAME)&&!/coil/.test(NAME)?shadow()+`<path d="M8 34q10-24 32-14" stroke="#2a2a3a" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M8 33q10-24 32-14" stroke="#44445c" stroke-width="2" fill="none"/>`+cylV(8,38,3.5,5,'#c9a43b')+cylV(40,22,3.5,5,'#c9a43b')
  :shadow(24,40,14)+ring(24,40,13,4,'#2a2a3a',.62)+ring(24,35,13,4,'#34344a',.62)+ring(24,30,13,4,'#3f3f58',.62)+box(10,8,4,4,4,4,'#c9a43b'),
 wrench:()=>shadow()+`<g transform="rotate(-35 24 26)"><rect x="21" y="10" width="6" height="28" rx="3" fill="${dk('#c9cdd9',.2)}" transform="translate(1.5 1.5)"/><rect x="21" y="10" width="6" height="28" rx="3" fill="#c9cdd9"/><path d="M17 8a7 7 0 1 0 14 0h-4v4h-6v-4z" fill="#dfe2ea"/><circle cx="24" cy="40" r="5" fill="#dfe2ea"/><circle cx="24" cy="40" r="2.4" fill="#7a7f94"/></g>`,
 jack:()=>shadow()+box(-9,-9,0,18,18,5,'#2a2440')+cylV(24,33,7,14,BC)+cylV(24,19,3,6,'#c9cdd9'),
 meter:()=>shadow()+box(-8,-3,0,16,6,22,BC)+poly([[-5,3,11],[5,3,11],[5,3,19],[-5,3,19]],'#bfe6ff')+el(P(0,3,6)[0],P(0,3,6)[1],3,3,'#2a2440'),
 tire:()=>/steer/.test(NAME)?shadow(24,42,14)+disc(27,26,14,8,'#2a2a3a','#33334a',.45)+el(27,26,5,8,'#a7adbf')+[0,1,2].map(i=>`<path d="M${14+i*2} ${15+i*1} q-3 11 0 22" stroke="#55556e" stroke-width="1.2" fill="none"/>`).join('')
  :shadow(24,42,14)+disc(27,26,14,9,'#2a2a3a','#33334a',.45)+el(27,26,5,8,'#a7adbf')+[0,1,2,3,4,5].map(i=>`<rect x="${12+i*1.2}" y="${16+i*3}" width="3" height="1.2" fill="#55556e" transform="rotate(-30 20 26)"/>`).join(''),
 battery:()=>shadow()+box(-11,-7,0,22,14,16,'#2a2a3a','#5a5a72')+cylV(P(-6,-3,16)[0],P(-6,-3,16)[1],2.2,3,'#e04848')+cylV(P(6,-3,16)[0],P(6,-3,16)[1],2.2,3,'#c9cdd9')+poly([[-11,7,4],[11,7,4],[11,7,10],[-11,7,10]],BC),
 snow:()=>shadow()+box(-10,-6,0,20,12,18,'#e8ecf4')+el(P(10,0,9)[0],P(10,0,9)[1],4,6,'#9aa3bd')+el(P(10,0,9)[0],P(10,0,9)[1],2,3,'#5fb4e8'),
 light:()=>/tail|stop|turn/.test(NAME)?shadow()+box(-8,-3,0,16,6,12,'#2a2a3a')+poly([[-7,3.1,1],[7,3.1,1],[7,3.1,11],[-7,3.1,11]],'#e04848')+el(P(0,3,6)[0],P(0,3,6)[1],5,3,'#ff8080',' opacity=".5"')
  :/work|flood|shop/.test(NAME)?shadow()+box(-8,-5,8,16,8,14,'#2a2a3a')+poly([[-7,3.1,9],[7,3.1,9],[7,3.1,21],[-7,3.1,21]],'#fff7d6')+box(-2,-2,0,4,4,8,'#5a5f74')
  :/strobe|beacon|warning/.test(NAME)?shadow(24,40,9)+cylV(24,40,8,4,'#2a2a3a')+`<path d="M16 36a8 12 0 0 1 16 0z" fill="#ffb627"/>`+el(24,30,14,10,'#ffb627',' opacity=".2"')
  :shadow(24,38,10)+box(-7,-4,0,14,8,6,'#2a2a3a')+el(P(0,0,9)[0],P(0,0,9)[1],7,4.5,'#ffb627')+el(P(-2,0,10)[0],P(-2,0,10)[1],2.5,1.2,'#ffe7a0')+el(24,27,13,8,'#ffb627',' opacity=".18"'),
 drum:()=>shadow(24,42,14)+disc(28,26,13,12,'#8a8fa3','#b5bacb',.62),
 comp:()=>shadow()+disc(30,32,8,22,BC,lt(BC,.2))+box(-4,-4,12,10,8,7,'#3b3355')+cylV(P(1,0,19)[0],P(1,0,19)[1],2.5,3,'#c9cdd9'),
 triangle:()=>shadow()+`<path d="M24 8L38 34H10Z" fill="#e04848"/><path d="M24 15L32 30H16Z" fill="#2a2440"/><path d="M24 8L38 34H36L24 11Z" fill="#b83030"/>`,
 ext:()=>shadow(24,41,8)+cylV(24,41,7,26,'#e04848')+cylV(24,15,3,4,'#2a2440')+`<path d="M27 12h6v2h-6z" fill="#2a2440"/><path d="M18 16q-6 6-2 16" stroke="#2a2440" stroke-width="1.6" fill="none"/>`,
 cone:()=>shadow(24,40,12)+box(-10,-10,0,20,20,2,'#ff7a1a')+`<path d="M19 38L24 9L29 38Z" fill="#ff7a1a"/><path d="M24 9L29 38H26Z" fill="#d95e0a"/><path d="M21 27h6l.7 4h-7.4z" fill="#fff"/>`,
 vest:()=>shadow()+el(24,32,15,6,'#e8b800')+`<path d="M12 31a12 11 0 0 1 24 0z" fill="#ffcf1a"/><path d="M24 20a12 11 0 0 1 12 11h-4a10 10 0 0 0-8-10z" fill="#e8b800"/><rect x="22" y="20" width="4" height="11" fill="#ffe066"/>`,
 strap:()=>shadow()+ring(22,38,10,9,BC,.35)+box(4,-8,0,10,6,5,'#a7adbf'),
 chain:()=>shadow()+[0,1,2,3].map(i=>el(12+i*7,34-i*5,5,3,'none',` stroke="${i%2?'#8a8fa3':'#b5bacb'}" stroke-width="2.4"`)).join(''),
 chock:()=>shadow()+poly([[-10,-6,0],[10,-6,0],[10,-6,4],[-10,-6,16]],'#d9a000')+poly([[10,-6,0],[10,6,0],[10,6,4],[10,-6,4]],'#ffcf1a')+poly([[-10,6,0],[10,6,0],[10,6,4],[-10,6,16]],dk('#ffcf1a',.2))+poly([[-10,-6,16],[10,-6,4],[10,6,4],[-10,6,16]],'#ffdb4d'),
 plug:()=>shadow()+ring(22,38,11,4,BC,.6)+ring(22,34,11,4,lt(BC,.15),.6)+cylV(34,30,4,9,'#2a2440'),
 aid:()=>shadow()+box(-10,-6,0,20,12,15,'#f4f4f8')+poly([[-2,6,4],[2,6,4],[2,6,12],[-2,6,12]],BC)+poly([[-5,6,6],[5,6,6],[5,6,10],[-5,6,10]],BC),
 hook:()=>shadow()+`<path d="M22 10v16a8 8 0 1 0 12 7" stroke="#8a8fa3" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M22 10v16a8 8 0 1 0 12 7" stroke="#c9cdd9" stroke-width="2" fill="none" stroke-linecap="round"/>`+el(22,8,4,3,'none',' stroke="#b5bacb" stroke-width="2"'),
 headlight:()=>shadow()+box(-10,-6,0,20,12,14,dk(BC,.45))+el(P(0,6,7)[0],P(0,6,7)[1],6.5,6,'#e8f4ff')+el(P(0,6,7)[0],P(0,6,7)[1],3.5,3.2,'#fff')+el(P(0,6,7)[0]+4,P(0,6,7)[1]+2,12,8,'#ffffff',' opacity=".22"'),
 motor:()=>shadow()+disc(28,27,11,14,'#a7adbf','#c9cdd9',.4)+disc(31,28,5,4,BC,lt(BC,.15),.35),
 switch:()=>shadow()+box(-8,-6,0,16,12,8,'#2a2a3a')+cylV(P(0,0,8)[0],P(0,0,8)[1],2,8,'#c9cdd9')+el(P(0,0,16)[0],P(0,0,16)[1],2.6,1.4,BC),
 horn:()=>shadow()+`<path d="M10 24l20-8v20l-20-8z" fill="#c9cdd9"/><path d="M10 24l20 4v8l-20-8z" fill="#9aa1b5"/>`+el(31,26,4,10,'#dfe2ea')+el(31,26,2,6,'#7a7f94'),
 flame:()=>shadow(24,40,8)+cylV(24,40,3,22,'#c9cdd9')+cylV(24,22,5,4,'#a7adbf',null,2)+el(24,41,4,3,'#ff8a3d')+el(24,41,9,6,'#ffb35a',' opacity=".35"'),
 pin:()=>shadow()+cylV(24,36,11,6,'#2a2a3a','#3b3b52')+el(24,28,6,2.6,'#5fb4e8')+el(24,28,10,5,'#5fb4e8',' opacity=".25"'),
 camera:()=>shadow()+box(-8,-6,0,16,12,11,'#2a2a3a')+el(P(8,0,6)[0],P(8,0,6)[1],3.5,5,'#5b5f7e')+el(P(8,0,6)[0],P(8,0,6)[1],1.8,2.6,lt(BC,.45)),
 tablet:()=>shadow()+box(-11,-8,0,22,16,3,'#2a2a3a')+poly([[-9,-6,3.1],[9,-6,3.1],[9,6,3.1],[-9,6,3.1]],lt(BC,.35)),
 sensor:()=>shadow()+box(-10,-7,0,20,14,7,BC,lt(BC,.2))+box(-3,7,1,6,3,5,'#2a2440')+[0,1,2].map(i=>poly([[-7+i*5,-4,7.1],[-4+i*5,-4,7.1],[-4+i*5,3,7.1],[-7+i*5,3,7.1]],dk(BC,.3))).join(''),
 radio:()=>shadow()+box(-11,-6,0,22,12,9,'#2a2a3a')+poly([[-9,6,2],[1,6,2],[1,6,7],[-9,6,7]],lt(BC,.5))+el(P(6,6,4.5)[0],P(6,6,4.5)[1],2,2,'#c9cdd9'),
 shoe:()=>shadow()+`<path d="M10 30a14 14 0 0 1 28 0h-4a10 10 0 0 0-20 0z" fill="#a7adbf"/><path d="M10 30a14 14 0 0 1 28 0h-2.5a11.5 11.5 0 0 0-23 0z" fill="#5a4a3a" transform="translate(0 -3)"/><rect x="10" y="30" width="4" height="4" fill="#8a8fa3"/><rect x="34" y="30" width="4" height="4" fill="#8a8fa3"/>`,
 rotor:()=>shadow(24,42,14)+disc(27,26,13,5,'#8a8fa3','#c9cdd9',.32)+[0,1,2,3,4].map(i=>{const a=i*1.256;return el(27+Math.cos(a)*5,26+Math.sin(a)*8.5,.9,1.4,'#7a7f94')}).join(''),
 chamber:()=>shadow()+disc(26,26,10,8,'#2a2a3a','#3b3b52')+disc(33,30,8,6,'#2a2a3a','#44445c')+`<rect x="34" y="30" width="10" height="2.4" fill="#c9cdd9"/>`,
 gear:()=>shadow(24,42,13)+disc(27,26,12,5,'#8a8fa3','#b5bacb',.3)+[0,1,2,3,4,5,6,7].map(i=>{const a=i*.785;return el(27+Math.cos(a)*7.4,26+Math.sin(a)*12,1.6,2,'#8a8fa3')}).join(''),
 valve:()=>shadow()+box(-7,-7,0,14,14,12,'#c9a43b','#e2c35e')+cylV(P(7,0,6)[0]+3,P(7,0,6)[1]+2,2.4,4,'#c9a43b')+cylV(P(0,0,12)[0],P(0,0,12)[1],3,5,BC),
 fitting:()=>shadow()+cylV(18,36,4,10,'#c9a43b')+cylV(30,32,4,10,BC)+`<rect x="16" y="22" width="16" height="3" rx="1.5" fill="#e2c35e"/>`,
 wiper:()=>shadow()+`<path d="M8 34L40 16" stroke="#2a2a3a" stroke-width="3" stroke-linecap="round"/><path d="M8 37L40 19" stroke="#55556e" stroke-width="2" stroke-linecap="round"/>`,
 mirror:()=>shadow()+box(-6,-4,6,12,6,24,'#2a2a3a')+poly([[6,-2,9],[6,1,9],[6,1,28],[6,-2,28]],'#bfe6ff')+box(-1,-1,0,2,2,8,'#8a8fa3'),
 handle:()=>shadow()+`<path d="M12 30q0-12 12-12t12 12" stroke="#c9cdd9" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M12 30q0-12 12-12t12 12" stroke="#eef0f6" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
 seat:()=>shadow()+box(-9,-6,6,18,14,6,dk(BC,.35))+box(-9,-8,6,18,4,22,dk(BC,.2))+box(-3,-3,0,6,6,6,'#2a2440'),
 mat:()=>shadow()+poly([[-12,-9,0],[12,-9,0],[12,9,0],[-12,9,0]],'#2a2a3a')+poly([[-12,9,0],[12,9,0],[12,9,-1.5],[-12,9,-1.5]],'#1a1a26')+[0,1,2,3].map(i=>poly([[-10,-7+i*4,.1],[10,-7+i*4,.1],[10,-6+i*4,.1],[-10,-6+i*4,.1]],'#44445c')).join(''),
 visor:()=>shadow()+`<path d="M8 22q16-10 32 0v6q-16-8-32 0z" fill="#c9cdd9"/><path d="M8 28q16-8 32 0v2q-16-8-32 0z" fill="#8a8fa3"/>`,
 tree:()=>`<path d="M24 6L33 20h-4l6 9h-5l5 8H13l5-8h-5l6-9h-4z" fill="#2ec48a"/><path d="M24 6L33 20h-4l6 9h-5l5 8h-11z" fill="#22a372"/><rect x="23" y="37" width="2" height="5" fill="#8a6a3a"/><path d="M24 2v6" stroke="#8a8fa3"/>`,
 antenna:()=>shadow(24,40,8)+cylV(24,40,5,5,'#2a2a3a')+`<rect x="23.2" y="6" width="1.6" height="30" fill="#c9cdd9"/>`+el(24,6,1.6,1.6,'#e04848'),
 shock:()=>shadow(24,42,8)+el(24,40,3.5,3.5,'none',' stroke="#8a8fa3" stroke-width="2"')+cylV(24,37,5.5,15,'#2a2a3a')+cylV(24,33,5.6,4,BC)+cylV(24,22,2.2,10,'#c9cdd9')+el(24,10,3.5,3.5,'none',' stroke="#8a8fa3" stroke-width="2"'),
 bed:()=>shadow()+box(-12,-8,0,24,16,8,'#e8ecf4','#f8fafd')+poly([[-12,8,2],[12,8,2],[12,8,5],[-12,8,5]],BC),
 gasket:()=>/door seal|weatherstrip|strip/.test(NAME)?shadow()+`<path d="M10 36V14h28v22" stroke="#2a2a3a" stroke-width="4" fill="none" stroke-linejoin="round"/>`
  :/wheel seal|axle seal|oil seal/.test(NAME)?shadow(24,38,11)+ring(24,36,10,6,'#a7adbf',.55)+el(24,30,10,4.5,'none',` stroke="${BC}" stroke-width="2"`)
  :shadow(24,38,13)+ring(24,35,12,3,'#2a2a3a',.68),
 window:()=>shadow()+poly([[-12,-2,4],[12,-2,4],[12,-2,24],[-12,-2,24]],'#9fd7ff')+poly([[-12,-2,4],[12,-2,4],[12,0,4],[-12,0,4]],'#5c6aa8')+`<path d="M14 12l8 18" stroke="#fff" stroke-width="2.5" opacity=".7"/>`,
 spring:()=>shadow(24,40,11)+[0,1,2].map(i=>cylV(24,40-i*8,10-i%2*1.5,7,'#2a2a3a','#44445c')).join('')+cylV(24,16,9,3,'#8a8fa3'),
 knob:()=>shadow(24,40,8)+cylV(24,40,6,4,'#2a2a3a')+`<rect x="22.6" y="18" width="2.8" height="19" fill="#8a8fa3"/>`+el(24,16,7,7,'#2a2a3a')+el(21.5,13.5,2.5,2,'#5a5a72'),
 ladder:()=>shadow()+box(-10,-6,0,20,6,4,'#c9cdd9')+box(-10,0,8,20,6,4,'#c9cdd9')+box(-10,6,16,20,6,4,'#c9cdd9'),
 belt:()=>shadow()+el(18,22,7,7,'#8a8fa3')+el(32,32,5,5,'#8a8fa3')+`<path d="M11 22a7 7 0 0 1 14 -3l12 9a5 5 0 1 1-8 7l-15-6a7 7 0 0 1-3-7z" fill="none" stroke="#2a2a3a" stroke-width="2.6"/>`,
 thermo:()=>shadow(24,38,10)+cylV(24,38,10,4,'#c9a43b','#e2c35e')+`<path d="M20 34v-14h8v14" stroke="#8a8fa3" stroke-width="1.6" fill="none"/>`+[0,1,2].map(i=>el(24,22+i*4,4,1.4,'none',' stroke="#c9cdd9" stroke-width="1.2"')).join(''),
 pump:()=>shadow()+box(-9,-7,0,14,14,13,BC)+disc(34,26,7,3,'#2a2440','#3b3355',.3)+cylV(P(-2,0,13)[0],P(-2,0,13)[1],3,4,'#a7adbf'),
 fan:()=>shadow(24,42,13)+[0,1,2,3,4].map(i=>`<ellipse cx="24" cy="15" rx="4" ry="10" fill="${i%2?'#3b3355':'#4b4370'}" transform="rotate(${i*72} 24 26) "/>`).join('')+el(24,26,4,4,'#8a8fa3'),
 radiator:()=>shadow()+box(-11,-2,0,22,4,26,'#3b3355')+[0,1,2,3,4,5,6].map(i=>poly([[-9+i*3,2,3],[-8+i*3,2,3],[-8+i*3,2,23],[-9+i*3,2,23]],'#8a8fa3')).join(''),
 turbo:()=>shadow()+disc(22,26,10,8,'#a7adbf','#c9cdd9',.3)+disc(34,30,6,6,'#8a8fa3','#b5bacb',.4),
 bearing:()=>shadow(24,40,12)+ring(24,36,11,6,'#a7adbf',.55)+[0,1,2,3,4,5].map(i=>{const a=i*1.047;return el(24+Math.cos(a)*8,30+Math.sin(a)*3.6,1.7,1.4,'#eef0f6')}).join(''),
 wheel:()=>shadow(24,42,13)+disc(27,26,12,6,'#a7adbf','#d8dbe6',.3)+[0,1,2,3,4,5].map(i=>{const a=i*1.047;return el(27+Math.cos(a)*4.5,26+Math.sin(a)*7.5,.9,1.3,'#7a7f94')}).join(''),
 flap:()=>shadow()+poly([[-9,-1,4],[9,-1,4],[9,-1,28],[-9,-1,28]],'#2a2a3a')+poly([[-9,-1,4],[9,-1,4],[9,1,4],[-9,1,4]],'#44445c')+poly([[-7,-1.1,8],[7,-1.1,8],[7,-1.1,10],[-7,-1.1,10]],'#c9cdd9'),
 fifth:()=>shadow()+box(-12,-10,4,24,20,4,'#3b3f55')+poly([[-2,10,8.1],[2,10,8.1],[2,0,8.1],[-2,0,8.1]],'#1a1a26')+box(-4,-4,0,8,8,4,'#2a2a3a'),
 shaft:()=>shadow()+`<path d="M10 34L38 18" stroke="#8a8fa3" stroke-width="4.5" stroke-linecap="round"/><path d="M10 33L38 17" stroke="#c9cdd9" stroke-width="1.5" stroke-linecap="round"/>`+el(10,34,4,4,'#5a5f74')+el(38,18,4,4,'#5a5f74'),
 body:()=>shadow()+`<path d="M8 34a16 16 0 0 1 32 0h-5a11 11 0 0 0-22 0z" fill="#2a2a3a"/><path d="M8 34a16 16 0 0 1 32 0h-3a13 13 0 0 0-26 0z" fill="#44445c"/>`,
 landing:()=>shadow()+box(-9,-2,0,4,4,26,'#3b3355')+box(5,-2,0,4,4,26,'#3b3355')+box(-9,-2,8,18,4,3,'#55507a')+box(-11,-4,0,8,8,2,'#2a2440')+box(3,-4,0,8,8,2,'#2a2440'),
 trailer:()=>shadow(24,41,16)+box(-14,-6,4,28,12,16,'#f4f4f8')+[[-9],[-3]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.8,2.8,'#2a2a3a')).join(''),
 door:()=>shadow()+box(-12,-2,0,24,3,26,'#c9cdd9')+[0,1,2,3,4,5].map(i=>poly([[-12,1.1,3+i*4],[12,1.1,3+i*4],[12,1.1,4+i*4],[-12,1.1,4+i*4]],'#8a8fa3')).join(''),
 bumper:()=>shadow()+box(-13,-3,6,26,6,7,'#c9cdd9','#eef0f6')+box(-10,-2,0,3,3,6,'#3b3355')+box(7,-2,0,3,3,6,'#3b3355'),
 cyl:()=>shadow()+disc(16,30,5,0,'#2a2440')+`<polygon points="13,27 33,16 37,22 17,33" fill="#8a8fa3"/>`+disc(36,19,4.5,0,'#a7adbf','#c9cdd9')+`<path d="M36 19l8-4" stroke="#eef0f6" stroke-width="2.5" stroke-linecap="round"/>`,
 tank:()=>shadow(24,42,15)+disc(34,28,9,22,'#c9cdd9','#e4e7ef')+cylV(P(-4,0,14)[0]-2,P(-4,0,14)[1],2.5,3,'#2a2440'),
 nozzle:()=>shadow()+`<path d="M8 28L40 12" stroke="#8a8fa3" stroke-width="5" stroke-linecap="round"/>`+[0,1,2,3].map(i=>`<rect x="${12+i*7}" y="${24-i*3.5}" width="2.4" height="9" fill="#2a2a3a"/>`).join(''),
 injector:()=>shadow(24,40,8)+`<g transform="rotate(-20 24 26)">`+cylV(24,42,3,10,'#8a8fa3')+cylV(24,32,4.5,14,'#2a2a3a')+cylV(24,18,3,5,'#e04848')+`</g>`,
 engine:()=>shadow(24,41,15)+box(-12,-8,0,22,16,16,'#5a6074')+box(-10,-5,16,18,10,5,BC)+box(10,-3,4,3,6,8,'#2a2440'),
 crank:()=>shadow(24,40,9)+cylV(24,30,9,12,'#c9cdd9')+[0,1].map(i=>`<rect x="15" y="${20+i*2.5}" width="18" height="1" fill="#8a8fa3"/>`).join('')+`<rect x="22" y="30" width="4" height="12" fill="#8a8fa3"/>`+el(24,42,4,3,'#8a8fa3'),
 clutch:()=>shadow(24,42,13)+disc(27,26,12,4,'#5a4a3a','#7a6248',.32)+el(27,26,5,8.5,'#a7adbf'),
 ujoint:()=>shadow()+`<path d="M12 26h24M24 14v24" stroke="#8a8fa3" stroke-width="5" stroke-linecap="round"/>`+[[12,26],[36,26],[24,14],[24,38]].map(([x,y])=>el(x,y,3.5,3.5,'#c9cdd9')).join(''),
 trans:()=>shadow(24,41,15)+box(-12,-7,0,20,14,14,'#8a8fa3')+disc(36,30,6,6,'#7a7f94','#a7adbf',.4)+box(-6,-3,14,8,6,5,BC),
 cat:()=>shadow(24,42,15)+disc(32,28,9,20,'#c9cdd9','#e4e7ef',.35)+`<polygon points="${pt(P(-12,0,8))} ${pt(P(-16,0,8))} ${pt(P(-16,0,12))} ${pt(P(-12,0,12))}" fill="#8a8fa3"/>`,
 stack:()=>shadow(24,42,7)+cylV(24,42,5,30,'#c9cdd9','#eef0f6')+`<rect x="20" y="12" width="2" height="28" fill="#fff" opacity=".6"/>`,
 undefined:()=>shadow()+box(-11,-7,0,22,14,13,BC)+box(-4,-2,13,8,4,3,'#2a2440')+poly([[-11,7,5],[11,7,5],[11,7,8],[-11,7,8]],'#ffcf4a'),
 lightbar:()=>shadow()+box(-14,-2,6,28,5,6,'#2a2a3a')+[0,1,2,3,4].map(i=>poly([[-12+i*5.4,3.1,7.5],[-9+i*5.4,3.1,7.5],[-9+i*5.4,3.1,10.5],[-12+i*5.4,3.1,10.5]],'#ffb627')).join(''),
 grille:()=>shadow()+box(-11,-2,0,22,3,26,'#c9cdd9','#eef0f6')+[0,1,2,3,4,5].map(i=>poly([[-9,1.1,4+i*3.6],[9,1.1,4+i*3.6],[9,1.1,5.6+i*3.6],[-9,1.1,5.6+i*3.6]],'#3b3355')).join(''),
 truck:()=>shadow(24,42,17)+box(-15,-6,4,18,12,14,'#f4f4f8')+box(3,-5,4,10,10,14,BC)+poly([[13,-3,11],[13,3,11],[13,3,16],[13,-3,16]],'#bfe6ff')+[[-11],[-5],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,'#2a2a3a')).join(''),
 charger:()=>shadow()+box(-6,-5,0,12,10,28,'#e8ecf4')+poly([[6,-3,16],[6,3,16],[6,3,24],[6,-3,24]],BC)+`<path d="M${P(6,0,10)[0]} ${P(6,0,10)[1]}q10 4 6 14" stroke="#2a2a3a" stroke-width="2" fill="none"/>`,
 zap:()=>shadow()+box(-12,-8,0,24,16,10,BC,lt(BC,.25))+`<path d="M25 16l-5 7h4l-2 6 6-8h-4z" fill="#ffcf1a"/>`
};
/* ---------- more specific drawings, picked by the part's name ---------- */
const A=()=>BC,A2=()=>lt(BC,.3),A3=()=>dk(BC,.3);
const steel='#a7adbf',steelL='#c9cdd9',steelD='#7a7f94',ink='#2a2a3a',rub='#2a2a3a',brass='#c9a43b',chrome='#dfe2ea';
const M2={
 gauge:()=>shadow(24,40,10)+disc(26,26,10,4,ink,'#f4f4f8',0)+`<path d="M26 26l-4-6" stroke="${A()}" stroke-width="1.6" stroke-linecap="round"/>`+el(26,26,1.3,1.8,ink)+`<rect x="17" y="36" width="3" height="8" fill="${steel}" transform="rotate(30 18 40)"/>`,
 scan:()=>shadow()+box(-6,-4,0,12,7,24,A())+poly([[-4,3.1,12],[4,3.1,12],[4,3.1,21],[-4,3.1,21]],'#9fd7ff')+[0,1,2].map(i=>el(P(-3+i*3,3,7)[0],P(-3+i*3,3,7)[1],1.2,1.2,'#fff')).join('')+`<path d="M${P(-2,0,0)[0]} ${P(-2,0,0)[1]}q-6 4 -8 -4" stroke="${ink}" stroke-width="1.6" fill="none"/>`,
 chest:()=>shadow(24,42,15)+box(-12,-8,4,22,14,26,A())+[0,1,2,3].map(i=>poly([[-12,6.1,7+i*5.5],[10,6.1,7+i*5.5],[10,6.1,11+i*5.5],[-12,6.1,11+i*5.5]],A3())).join('')+[0,1,2,3].map(i=>poly([[-6,6.2,9+i*5.5],[4,6.2,9+i*5.5],[4,6.2,9.8+i*5.5],[-6,6.2,9.8+i*5.5]],chrome)).join('')+el(P(-10,6,0)[0],P(-10,6,0)[1],2,2,ink)+el(P(8,6,0)[0],P(8,6,0)[1],2,2,ink),
 press:()=>shadow()+box(-12,-3,0,4,6,30,A())+box(8,-3,0,4,6,30,A())+box(-12,-3,30,24,6,4,A3())+box(-8,-3,12,16,6,3,steelD)+cylV(P(0,0,30)[0],P(0,0,30)[1]+8,3,12,'#e04848'),
 washer:()=>shadow()+box(-10,-6,0,16,12,12,A())+el(P(-6,6,0)[0],P(-6,6,0)[1],3,3,ink)+el(P(4,6,0)[0],P(4,6,0)[1],3,3,ink)+`<path d="M30 24q8 -2 10 6l4 -2" stroke="${ink}" stroke-width="1.8" fill="none"/><path d="M44 28l2 6" stroke="${steel}" stroke-width="2"/>`,
 impact:()=>shadow()+`<path d="M12 18h20a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-6l-2 10h-7l1-10h-6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z" fill="${A()}"/><path d="M12 18h20a4 4 0 0 1 4 4v1H8v-1a4 4 0 0 1 4-4z" fill="${A2()}"/><rect x="36" y="21" width="6" height="5" fill="${steelD}"/><rect x="17" y="36" width="7" height="5" fill="${ink}"/>`,
 torque:()=>shadow()+`<g transform="rotate(-25 24 26)"><rect x="8" y="23" width="32" height="5" rx="2.5" fill="${steelL}"/><rect x="8" y="23" width="14" height="5" rx="2.5" fill="${A()}"/><circle cx="40" cy="25.5" r="4.5" fill="${steel}"/><rect x="38" y="30" width="4" height="4" fill="${steelD}"/></g>`,
 sockets:()=>shadow()+box(-12,-8,0,24,16,4,A())+[0,1,2,3,4].map(i=>cylV(P(-9+i*4.5,-1,4)[0],P(-9+i*4.5,-1,4)[1],1.6+i*.3,3+i*.6,steelL)).join(''),
 changer:()=>shadow(24,42,15)+box(-10,-8,0,18,16,14,A())+disc(28,18,9,4,ink,'#33334a',.5)+cylV(P(4,0,14)[0],P(4,0,14)[1],2,12,steel),
 stem:()=>shadow(24,40,8)+cylV(24,40,4,6,rub)+cylV(24,34,2.2,14,steelL)+cylV(24,20,2.8,3,A()),
 cable:()=>shadow()+`<path d="M10 34q14-26 28-6" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M10 34q14-26 28-6" stroke="${A()}" stroke-width="2" fill="none"/>`+el(10,36,3.5,2.4,brass)+el(38,30,3.5,2.4,brass),
 grease:()=>shadow(24,41,13)+cylV(24,41,12,18,A())+el(24,23,12,5.4,lt(BC,.35))+`<path d="M14 23q10-12 20 0" stroke="${steel}" stroke-width="1.6" fill="none"/>`+el(24,23,7,3,'#5a4a3a'),
 gun:()=>shadow()+`<g transform="rotate(-20 24 26)"><rect x="9" y="20" width="22" height="8" rx="4" fill="${A()}"/><rect x="31" y="22" width="9" height="4" fill="${steelL}"/><path d="M40 24l6 -4" stroke="${steel}" stroke-width="1.6"/><path d="M14 28l-2 10" stroke="${steelD}" stroke-width="2.4" stroke-linecap="round"/></g>`,
 towel:()=>shadow()+disc(30,28,9,18,'#f4f4f8','#ffffff',.25)+el(30,28,2.2,3.6,A()),
 tarp:()=>shadow()+box(-12,-9,0,24,18,4,A())+box(-12,-9,4,24,18,3,A2())+box(-12,-9,7,24,18,3,A()),
 pile:()=>shadow()+[0,1,2].map(i=>box(-11,-8,i*5,22,16,4.5,i%2?A2():A())).join(''),
 aerosol:()=>shadow(24,40,8)+cylV(24,40,6,20,A())+el(24,20,6,2.7,steelL)+cylV(24,19,2.4,4,steelL)+`<rect x="18" y="27" width="12" height="5" fill="#fff" opacity=".85"/>`,
 jerry:()=>shadow()+box(-9,-7,0,18,14,22,A())+box(4,-6,22,4,4,4,ink)+poly([[-9,7,5],[9,7,5],[9,7,15],[-9,7,15]],'#fff7e0'),
 kitcase:()=>shadow()+box(-12,-8,0,24,16,5,A())+[0,1,2].map(i=>poly([[-10+i*7.5,-6,5.1],[-4+i*7.5,-6,5.1],[-4+i*7.5,6,5.1],[-10+i*7.5,6,5.1]],i%2?brass:'#e04848')).join(''),
 stud:()=>shadow(24,40,10)+[0,1,2].map(i=>cylV(16+i*8,40-i*2,2.6,16,steelL)).join(''),
 lugnut:()=>shadow(24,40,12)+[0,1,2].map(i=>cylV(15+i*9,38-i*3,4.5,6,A(),null,2)+el(15+i*9,32-i*3,2,1,steelD)).join(''),
 ubolt:()=>shadow()+`<path d="M15 40V20a9 9 0 0 1 18 0v20" stroke="${steelL}" stroke-width="3.6" fill="none"/><path d="M15 40V20a9 9 0 0 1 18 0v20" stroke="${steel}" stroke-width="1.4" fill="none"/>`+cylV(15,42,3,3,A())+cylV(33,42,3,3,A()),
 rhose:()=>shadow()+`<path d="M10 36c0-14 6-20 14-20s12 6 16 0" stroke="${ink}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M10 35c0-14 6-20 14-20s12 6 16 0" stroke="#44445c" stroke-width="2" fill="none"/>`+el(10,38,4,2.4,steel)+el(40,16,4,2.4,steel),
 reel:()=>shadow()+disc(28,26,12,10,A(),A2(),.3)+el(28,26,7,11,ink)+box(-12,-4,0,6,8,4,steelD),
 module:()=>shadow()+box(-11,-8,0,22,16,6,steel,steelL)+[0,1,2,3].map(i=>poly([[-9+i*5,8.1,1],[-7+i*5,8.1,1],[-7+i*5,8.1,5],[-9+i*5,8.1,5]],steelD)).join('')+box(-4,8,1,8,3,4,A()),
 cluster:()=>shadow()+box(-13,-3,0,26,6,16,ink)+[[-6],[6]].map(([x])=>el(P(x,3,8)[0],P(x,3,8)[1],4.5,4.5,'#f4f4f8')+`<path d="M${P(x,3,8)[0]} ${P(x,3,8)[1]}l3 -3" stroke="${A()}" stroke-width="1.2"/>`).join(''),
 probe:()=>shadow(24,40,9)+cylV(24,40,2.2,10,steelL)+cylV(24,30,4.5,4,steel,null,2)+cylV(24,26,4,10,A())+`<path d="M28 18q8 -4 12 4" stroke="${ink}" stroke-width="1.6" fill="none"/>`,
 caliper:()=>shadow()+`<path d="M12 18a14 14 0 0 1 24 0l-3 6a9 9 0 0 0-18 0z" fill="${A()}"/><path d="M12 18a14 14 0 0 1 24 0l-1.5 3a11 11 0 0 0-21 0z" fill="${A2()}"/>`+cylV(18,34,4,8,A3())+cylV(30,34,4,8,A3()),
 pads:()=>shadow()+[0,1].map(i=>box(-10+i*6,-4+i*4,i*6,18,4,10,i?'#5a4a3a':steel)).join('')+box(-4,4,6,18,2,10,A()),
 slack:()=>shadow()+`<rect x="22" y="8" width="5" height="22" rx="2.5" fill="${A()}" transform="rotate(20 24 20)"/>`+disc(22,32,7,5,steel,steelL,.35),
 steerbox:()=>shadow()+box(-10,-7,0,18,14,14,steel)+cylV(P(4,0,14)[0],P(4,0,14)[1],3,8,steelD)+`<path d="M${P(8,0,6)[0]} ${P(8,0,6)[1]}l8 6" stroke="${A()}" stroke-width="3" stroke-linecap="round"/>`,
 yoke:()=>shadow()+cylV(24,40,6,10,steel)+`<path d="M18 30V16h4v14M26 30V16h4v14" fill="${steelL}"/>`+el(20,18,1.6,1.6,steelD)+el(28,18,1.6,1.6,steelD),
 pedal:()=>shadow()+box(-8,-6,0,16,12,4,steelD)+`<path d="M16 34L30 12l4 2-12 22z" fill="${A()}"/>`+box(-3,-3,4,6,6,8,ink),
 armvalve:()=>shadow()+box(-7,-7,0,14,14,12,A())+`<path d="M${P(7,0,8)[0]} ${P(7,0,8)[1]}l12 -8" stroke="${steel}" stroke-width="2.4" stroke-linecap="round"/>`+el(P(7,0,8)[0]+12,P(7,0,8)[1]-8,2,2,steelD),
 egrv:()=>shadow()+box(-8,-6,0,16,12,8,steel,steelL)+cylV(P(0,0,8)[0],P(0,0,8)[1],6,10,A())+cylV(P(0,0,18)[0],P(0,0,18)[1],2,4,ink),
 drainv:()=>shadow(24,40,8)+cylV(24,40,4,10,brass)+`<path d="M24 30l10 -2" stroke="${A()}" stroke-width="2.4" stroke-linecap="round"/>`,
 leaf:()=>shadow()+[0,1,2,3].map(i=>`<path d="M${6+i*2} ${30-i*2}q18 -${10-i*1.5} ${36-i*4} 0" stroke="${i?steel:A()}" stroke-width="3" fill="none"/>`).join(''),
 bushing:()=>shadow(24,40,10)+ring(24,38,9,10,steel,.6)+ring(24,28,6.5,2,A(),.75),
 tensioner:()=>shadow()+box(-8,-6,0,12,12,8,steel)+`<path d="M${P(2,0,8)[0]} ${P(2,0,8)[1]}l10 -10" stroke="${steel}" stroke-width="4" stroke-linecap="round"/>`+disc(34,16,6,3,ink,A(),.3),
 pulley:()=>shadow(24,42,12)+disc(28,26,11,6,steel,steelL,.35)+el(28,26,5,8,A()),
 cap:()=>shadow(24,38,10)+cylV(24,38,9,6,A())+el(24,32,4,1.8,steelL)+[0,1,2,3,4,5].map(i=>`<rect x="${15+i*3}" y="33" width="1" height="5" fill="${A3()}"/>`).join(''),
 boot:()=>shadow()+`<path d="M8 32q16 -20 32 -4" stroke="${ink}" stroke-width="10" fill="none"/>`+el(8,34,5,3,steel)+el(40,30,5,3,steel),
 cooler:()=>shadow()+box(-12,-3,0,24,6,18,steel)+[0,1,2,3,4,5,6,7].map(i=>poly([[-11+i*3,3.1,2],[-10+i*3,3.1,2],[-10+i*3,3.1,16],[-11+i*3,3.1,16]],steelD)).join('')+cylV(P(12,0,6)[0]+3,P(12,0,6)[1],2.4,5,A()),
 hub:()=>shadow(24,42,13)+disc(28,26,10,12,steel,steelL,0)+disc(30,27,5,4,A(),A2(),.4)+[0,1,2,3,4,5].map(i=>{const a=i*1.047;return el(28+Math.cos(a)*7,26+Math.sin(a)*11,.8,1.2,steelD)}).join(''),
 hubcap:()=>shadow(24,40,10)+`<path d="M14 36a10 14 0 0 1 20 0z" fill="${chrome}"/><path d="M24 22a10 14 0 0 1 10 14h-4a8 12 0 0 0-6 -12z" fill="${steelL}"/>`+el(24,36,10,3,steel)+el(24,27,3,2,A()),
 bearings:()=>shadow()+[0,1,2].map(i=>`<path d="M${10+i*10} ${32-i*4}a6 6 0 0 1 12 0h-3a3 3 0 0 0-6 0z" fill="${i===1?A():steelL}"/>`).join(''),
 platform:()=>shadow(24,42,15)+box(-12,-8,0,24,16,2,steel)+box(10,-8,2,2,16,24,steelD)+box(-12,-8,2,2,2,10,A()),
 tierod:()=>shadow()+`<path d="M8 36L36 20" stroke="${steel}" stroke-width="4.5" stroke-linecap="round"/>`+cylV(38,24,4,6,A())+el(8,36,4,3,steelD),
 drivesh:()=>shadow()+`<path d="M6 34L42 16" stroke="${steel}" stroke-width="7" stroke-linecap="round"/><path d="M6 33L42 15" stroke="${steelL}" stroke-width="2"/>`+el(6,35,4,4,A())+el(42,17,4,4,A()),
 pitman:()=>shadow()+`<path d="M14 14l16 22" stroke="${A()}" stroke-width="6" stroke-linecap="round"/>`+el(14,14,4,4,steel)+el(30,36,4,3,steelD),
 hinge:()=>shadow()+box(-10,-1,4,9,2,18,steelL)+box(1,-1,4,9,2,18,steel)+cylV(P(0,0,4)[0],P(0,0,4)[1],1.8,18,A()),
 toolbox:()=>shadow(24,42,15)+box(-13,-7,0,26,14,14,chrome,'#f4f6fa')+poly([[-11,7.1,8],[11,7.1,8],[11,7.1,10],[-11,7.1,10]],steelD)+el(P(0,7,9)[0],P(0,7,9)[1],2,1.2,A()),
 fairing:()=>shadow()+`<path d="M8 36q0-20 32-24v24z" fill="${A()}"/><path d="M8 36q0-20 32-24v3q-28 4-29 21z" fill="${A2()}"/>`,
 hood:()=>shadow(24,42,16)+`<path d="M6 32l10-14h22l4 14z" fill="${A()}"/><path d="M16 18h22l4 14h-6z" fill="${A3()}"/>`+[0,1,2].map(i=>`<rect x="${20+i*4}" y="22" width="2" height="8" fill="${A3()}"/>`).join(''),
 ornament:()=>shadow(24,40,8)+cylV(24,40,5,4,chrome)+`<path d="M18 36q2-16 14-22l-4 10q6 0 8 4z" fill="${chrome}"/><path d="M18 36q2-16 14-22l-2 4q-8 6-10 18z" fill="${steelL}"/>`,
 crossbar:()=>shadow()+box(-14,-2,6,28,4,5,A())+box(-14,-6,6,2,12,5,A3())+box(12,-6,6,2,12,5,A3()),
 crankshaft:()=>shadow()+`<path d="M6 32l6-4v-6l6 4 6-4v-6l6 4 6-4v-6l6 4" stroke="${steelL}" stroke-width="3.4" fill="none" stroke-linejoin="round"/>`+[0,1,2].map(i=>el(12+i*12,24-i*4,3,4,A())).join(''),
 conrod:()=>shadow()+`<path d="M24 12v20" stroke="${steelL}" stroke-width="5"/>`+el(24,12,4.5,4.5,steelL)+el(24,12,2,2,steelD)+el(24,36,8,6,steelL)+el(24,36,4.5,3,A()),
 rocker:()=>shadow()+`<path d="M8 28l32-10" stroke="${steelL}" stroke-width="5" stroke-linecap="round"/>`+el(24,23,4,4,A())+el(24,23,1.8,1.8,steelD),
 flywheel:()=>shadow(24,42,14)+disc(28,26,14,4,steel,steelL,.25)+[...Array(14)].map((_,i)=>{const a=i*.449;return el(28+Math.cos(a)*8.4,26+Math.sin(a)*13.6,.8,1.2,steelD)}).join('')+el(28,26,4,6,A()),
 head:()=>shadow(24,42,15)+box(-13,-6,0,26,12,10,steel,steelL)+[0,1,2].map(i=>el(P(-8+i*8,0,10)[0],P(-8+i*8,0,10)[1],2.4,1.2,steelD)).join('')+[0,1,2].map(i=>poly([[-11+i*8,6.1,3],[-7+i*8,6.1,3],[-7+i*8,6.1,7],[-11+i*8,6.1,7]],A())).join(''),
 liner:()=>shadow(24,40,10)+cylV(24,40,9,20,steelL)+el(24,20,6.5,2.8,steelD)+cylV(24,22,10,2,A()),
 muffler:()=>shadow(24,42,15)+disc(32,26,8,20,chrome,'#f4f6fa',.25)+cylV(P(-10,0,10)[0],P(-10,0,10)[1],2.4,5,steel),
 shield:()=>shadow()+poly([[-12,-2,4],[12,-2,4],[12,-2,26],[-12,-2,26]],chrome)+[...Array(12)].map((_,i)=>el(P(-9+(i%4)*6,-2,8+Math.floor(i/4)*6)[0],P(-9+(i%4)*6,-2,8+Math.floor(i/4)*6)[1],1.2,1.2,steelD)).join(''),
 clampring:()=>shadow(24,38,11)+ring(24,36,10,4,steelL,.75)+box(8,-2,4,4,4,6,A()),
 pipe:()=>shadow()+`<path d="M8 34L30 22V8" stroke="${steelL}" stroke-width="7" fill="none" stroke-linejoin="round"/><path d="M8 33L30 21V8" stroke="${chrome}" stroke-width="2" fill="none"/>`,
 newtruck:()=>shadow(24,42,17)+box(-15,-6,4,16,12,12,'#f4f4f8')+box(1,-6,4,12,12,16,A(),lt(BC,.4))+poly([[13,-4,13],[13,4,13],[13,4,19],[13,-4,19]],'#cfefff')+[[-11],[-5],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,ink)).join(''),
 sleeper:()=>shadow(24,42,17)+box(-15,-6,4,8,12,8,steel)+box(-7,-6,4,10,12,18,A())+box(3,-6,4,10,12,14,A(),lt(BC,.4))+poly([[13,-4,11],[13,4,11],[13,4,16],[13,-4,16]],'#cfefff')+[[-11],[-1],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,ink)).join(''),
 dump:()=>shadow(24,42,17)+poly([[-15,-6,8],[1,-6,8],[1,6,8],[-15,6,8]],A3())+box(-15,-6,8,16,12,10,A())+box(3,-5,4,10,10,14,A2())+[[-11],[-4],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,ink)).join(''),
 mixer:()=>shadow(24,42,17)+disc(14,22,8,16,A(),A2(),0)+box(3,-5,4,10,10,14,'#f4f4f8')+[[-11],[-4],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,ink)).join(''),
 wrecker:()=>shadow(24,42,17)+box(-15,-5,4,14,10,6,A3())+`<path d="M${P(-8,0,10)[0]} ${P(-8,0,10)[1]}l-6 -14" stroke="${A()}" stroke-width="3"/>`+box(1,-5,4,12,10,14,A())+[[-11],[-4],[9]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.6,2.6,ink)).join(''),
 flatbed:()=>shadow(24,42,17)+box(-16,-6,6,30,12,2,A())+[[-12],[-7]].map(([x])=>el(P(x,6,4)[0],P(x,6,4)[1],2.6,2.6,ink)).join(''),
 reefer:()=>shadow(24,41,16)+box(-14,-6,4,26,12,16,'#f4f4f8')+box(12,-4,8,3,8,10,A())+[[-9],[-3]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.8,2.8,ink)).join(''),
 van:()=>shadow(24,41,16)+box(-14,-6,4,28,12,16,'#f4f4f8')+poly([[-14,6.1,10],[14,6.1,10],[14,6.1,13],[-14,6.1,13]],A())+[[-9],[-3]].map(([x])=>el(P(x,6,3)[0],P(x,6,3)[1],2.8,2.8,ink)).join(''),
 broom:()=>shadow(24,42,14)+disc(28,28,10,16,'#e8b800','#f2c92e',.3)+[...Array(10)].map((_,i)=>`<rect x="${12+i*2.6}" y="${38-i*.9}" width="1" height="5" fill="#b08a00"/>`).join(''),
 sign:()=>shadow()+box(-13,-2,6,26,3,12,ink)+poly([[-11,1.1,8],[11,1.1,8],[11,1.1,16],[-11,1.1,16]],'#1a1a10')+`<text x="24" y="31" text-anchor="middle" font-size="6" font-weight="700" fill="#ffb627" font-family="Barlow Condensed,sans-serif" transform="skewY(-30) translate(0 14)">ROUTE 9</text>`,
 roofhvac:()=>shadow(24,40,15)+box(-12,-8,0,24,16,8,'#f4f4f8')+disc(P(0,0,8)[0]+4,P(0,0,8)[1]-2,5,1,steel,ink,.2),
 stoparm:()=>shadow()+box(-10,-2,8,4,4,4,ink)+`<path d="M24 8l7 3 3 7-3 7-7 3-7-3-3-7 3-7z" fill="#e04848" stroke="#fff" stroke-width="1"/><text x="24" y="21" text-anchor="middle" font-size="5" font-weight="700" fill="#fff">STOP</text>`,
 gate:()=>shadow()+box(-10,-2,0,4,4,14,ink)+`<path d="M12 22L44 8" stroke="#ffb627" stroke-width="3" stroke-linecap="round"/><path d="M12 22L44 8" stroke="${ink}" stroke-width="3" stroke-dasharray="3 3"/>`,
 roller:()=>shadow(24,42,12)+disc(28,28,9,14,ink,steel,.3)+box(-12,-4,14,14,8,3,'#e5b800'),
 teeth:()=>shadow()+[0,1,2].map(i=>`<path d="M${10+i*10} ${36-i*4}l4 -16 4 16z" fill="${i===1?A():'#e5b800'}"/>`).join(''),
 blade:()=>shadow()+poly([[-14,-2,2],[14,-2,2],[14,-2,10],[-14,-2,10]],steel)+poly([[-14,-2,2],[14,-2,2],[14,2,0],[-14,2,0]],steelD)+[...Array(5)].map((_,i)=>el(P(-10+i*5,-2,6)[0],P(-10+i*5,-2,6)[1],1,1,ink)).join(''),
 pin2:()=>shadow()+disc(32,26,4,18,steelL,chrome,0)+ring(14,40,6,4,A(),.55),
 awning:()=>shadow()+box(-13,-8,18,26,4,2,steelD)+[...Array(6)].map((_,i)=>poly([[-13+i*4.3,-4,19],[-8.7+i*4.3,-4,19],[-8.7+i*4.3,8,12],[-13+i*4.3,8,12]],i%2?'#fff':A())).join(''),
 liftgate:()=>shadow(24,42,16)+box(-14,-6,8,22,12,14,'#f4f4f8')+box(8,-6,2,10,12,2,steel)+box(8,-6,4,2,12,10,A()),
 bucket:()=>shadow()+`<path d="M10 20h24l6 16H14z" fill="${A()}"/><path d="M34 20l6 16-4 2-4-16z" fill="${A3()}"/>`
};
Object.assign(M,M2);
/* which drawing a part uses, matched against its name in order; anything unmatched uses its type's drawing */
const ROUTES=[
 [/tow chain|safety chain|binder chain/,'chain'],[/winch strap|tow strap|ratchet strap/,'strap'],[/winch cable|^winch$/,'reel'],[/snatch block/,'pulley'],[/tow light bar/,'lightbar'],[/wheel lift|tow bar|tow hitch/,'pitman'],[/wheel dollies/,'platform'],[/rollback bed/,'flatbed'],[/wrecker body/,'wrecker'],[/tow air supply/,'rhose'],
 [/tire inflator|pressure gauge|gauge$|^dash gauge/,'gauge'],[/scan tool|tablet|eld unit/,'scan'],[/tool chest/,'chest'],[/shop press/,'press'],[/pressure washer/,'washer'],
 [/impact wrench/,'impact'],[/torque wrench/,'torque'],[/socket set|wrench set/,'sockets'],[/tire changer/,'changer'],[/valve stem/,'stem'],
 [/battery cable|high-voltage cable|7-way trailer cord|abs power cord/,'cable'],[/grease, 35 lb|grease pail/,'grease'],[/grease gun/,'gun'],[/towels, roll|shop towels/,'towel'],[/tarp/,'tarp'],[/blankets/,'pile'],
 [/brake cleaner|penetrating|contact cleaner/,'aerosol'],[/5 gal$|solvent/,'jerry'],[/connector kit|heat shrink|fuse assortment|cotter pin|nut and bolt/,'kitcase'],[/wheel studs|head bolt/,'stud'],[/lug nut/,'lugnut'],[/u-bolt/,'ubolt'],
 [/radiator hose|intake hose|overflow hose|turbo hose|heater hose/,'rhose'],[/hose reel/,'reel'],[/control module|ecm|aftertreatment control/,'module'],[/instrument cluster/,'cluster'],
 [/sensor|sending unit/,'probe'],[/caliper/,'caliper'],[/brake pad|disc brake pad/,'pads'],[/slack adjuster/,'slack'],[/steering gear/,'steerbox'],[/end yoke|yoke/,'yoke'],[/treadle/,'pedal'],
 [/height control valve|park control/,'armvalve'],[/egr valve/,'egrv'],[/drain valve|tank valve/,'drainv'],[/leaf spring/,'leaf'],[/bushing/,'bushing'],[/tensioner/,'tensioner'],[/idler pulley|pulley/,'pulley'],
 [/radiator cap|fuel cap|hub oil cap/,'cap'],[/coolant tank|def tank|hydraulic tank/,'tank'],[/cooler boot/,'boot'],[/oil cooler|egr cooler|transmission cooler|condenser|evaporator/,'cooler'],[/hub assembly|fan drive hub|wheel-end kit/,'hub'],[/hub cap$|lug nut covers/,'hubcap'],
 [/bearing set|release bearing/,'bearings'],[/wheelchair lift|liftgate$/,'platform'],[/tie rod|drag link|torque rod/,'tierod'],[/driveshaft|pto shaft|axle shaft|input shaft|mainshaft/,'drivesh'],[/pitman/,'pitman'],
 [/hinge/,'hinge'],[/tool box/,'toolbox'],[/fairing|sleeper extender|side skirt/,'fairing'],[/^hood$/,'hood'],[/ornament/,'ornament'],[/crossmember|bumper bracket/,'crossbar'],
 [/crankshaft/,'crankshaft'],[/connecting rod/,'conrod'],[/rocker arm|cam follower/,'rocker'],[/flywheel/,'flywheel'],[/cylinder head/,'head'],[/cylinder liner/,'liner'],[/muffler/,'muffler'],[/heat shield|deck plate/,'shield'],
 [/v-band clamp|exhaust clamp|dpf gasket and clamp/,'clampring'],[/exhaust pipe/,'pipe'],[/sleeper tractor|long-hood/,'sleeper'],[/dump truck/,'dump'],[/mixer truck/,'mixer'],[/tow truck|wrecker|heavy hauler/,'wrecker'],
 [/flatbed/,'flatbed'],[/reefer trailer/,'reefer'],[/dry van|box truck/,'van'],[/day cab|vocational|medium duty truck|electric tractor|refuse truck/,'newtruck'],[/sweeper broom|mixer drum roller/,'broom'],[/destination sign/,'sign'],
 [/rooftop hvac/,'roofhvac'],[/stop arm/,'stoparm'],[/crossing gate/,'gate'],[/track roller/,'roller'],[/bucket teeth/,'teeth'],[/cutting edge/,'blade'],[/loader pin/,'pin2'],[/awning/,'awning'],[/^liftgate/,'liftgate']];

/* hsl() brand colors become hex so they can be shaded */
const toHex=c=>{if(c[0]==='#')return c;const m=c.match(/hsl\((\d+)\s+(\d+)%\s+(\d+)%/);if(!m)return '#2f6fd6';const h=+m[1]/360,sa=+m[2]/100,l=+m[3]/100;const f=n=>{const k=(n+h*12)%12,a=sa*Math.min(l,1-l);return l-a*Math.max(-1,Math.min(k-3,9-k,1))};return hex([f(0)*255,f(8)*255,f(4)*255])};
const hash=t=>{let h=7;for(const c of t)h=(h*31+c.charCodeAt(0))>>>0;return h};
/* every part gets its own size from its place in the catalog, so no two parts share a drawing */
const ORDER={};(typeof BASES!=='undefined'?BASES:[]).forEach((b,i)=>ORDER[b]=i);
return (k,o={})=>{BC=o.color?toHex(o.color):'#2f6fd6';NAME=(o.name||'').toLowerCase();SEED=ORDER[o.part]!==undefined?ORDER[o.part]:hash(o.part||k);BH=hash(o.brand||'');const r=ROUTES.find(([re])=>re.test(NAME)),f=(r&&M[r[1]])||M[k]||M.undefined;let body;try{body=f()}catch(e){body=M.undefined()}return svg(body,tag(o.tag))}})();
const part3d=P3;

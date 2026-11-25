/* Opens the built game in a phone-sized browser, switches to every look (Classic and A to AA) and every tab,
   and fails if anything throws an error, spills off the side of the screen, or hides the tab bar or cash.
   Needs Playwright: npm i playwright && npx playwright install chromium
   Run: node tests/looks.js        (screenshots of failures go to tests/out/) */
const {chromium}=require('playwright'),path=require('path'),fs=require('fs');
(async()=>{const b=await chromium.launch(process.env.CHROME?{executablePath:process.env.CHROME}:{}),pg=await b.newPage({viewport:{width:390,height:844}});const errs=[],fail=[];
  pg.on('pageerror',e=>errs.push(String(e)));
  await pg.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  await pg.goto('file://'+path.join(__dirname,'..','parts-counter.html'));await pg.waitForTimeout(800);
  await pg.evaluate(()=>{S.cashL=40;for(let k=0;k<30;k++)S.f[LADDER[k].id]=needOf(LADDER[k]);for(const g of ['ck','sk','cu','sh']){S.b[g+'0']=12;S.b[g+'1']=3}S.ui.tut=99;forceRender()});
  /* every decoration must draw without an error */
  const deco=await pg.evaluate(()=>{const cv=document.createElement('canvas');cv.style.cssText='width:110px;height:82px;position:fixed;left:0;top:0';document.body.appendChild(cv);const bad=[];const ce=console.error;console.error=(...a)=>bad.push(a.join(' '));
    for(const it of DECO_LIST){try{decoThumb(it,cv)}catch(e){bad.push(it.id+': '+e)}}console.error=ce;cv.remove();return {n:DECO_LIST.length,bad:bad.slice(0,10)}});
  console.log(`Drew ${deco.n} decorations`);if(deco.bad.length)fail.push('decorations: '+deco.bad.join(' | '));
  const ids=['',...await pg.evaluate(()=>SKINS.map(k=>k.id))];fs.mkdirSync(path.join(__dirname,'out'),{recursive:true});
  for(const id of ids)for(const tab of ['shelves','store','service','shop','more']){
    const n0=errs.length;
    await pg.evaluate(([id,tab])=>{S.ui.skin=id;applySkin();document.querySelector(`nav.bar [data-tab=${tab}]`).click();scrollTo(0,0);forceRender()},[id,tab]);await pg.waitForTimeout(150);
    const p=await pg.evaluate(()=>{const out=[];const W=innerWidth;
      if(document.documentElement.scrollWidth>W+2)out.push('page is wider than the screen ('+document.documentElement.scrollWidth+'px)');
      const vis=el=>{if(!el)return false;const r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&+cs.opacity>.2};
      if(!vis(document.getElementById('cash')))out.push('cash is not visible');if(!vis(document.querySelector('nav.bar')))out.push('tab bar is not visible');
      for(const el of document.querySelectorAll('main .btn.pri:not([disabled])')){const r=el.getBoundingClientRect();if(r.width&&(r.right>W+1||r.left<-1)){out.push('a buy button is off screen');break}}
      const cash=document.getElementById('cash'),cs=getComputedStyle(cash);if(cs.color===getComputedStyle(document.querySelector('header')).backgroundColor)out.push('cash text is the same colour as the header');
      return out});
    if(errs.length>n0)p.push('script error: '+errs.slice(n0).join(' | '));
    if(p.length){const name=`${id||'classic'}-${tab}`;fail.push(name+': '+p.join('; '));await pg.screenshot({path:path.join(__dirname,'out',name+'.png')})}}
  await b.close();console.log(`Checked ${ids.length} looks x 5 tabs`);if(fail.length){console.log('FAILED:\n'+fail.join('\n'));process.exit(1)}console.log('All looks passed.')})();

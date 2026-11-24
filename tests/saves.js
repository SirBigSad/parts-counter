/* Old saves must keep loading. Every file in tests/saves is a real save from an earlier version of the game.
   Each one is loaded with the current code, played for ten minutes, and checked for broken numbers.
   When the save format changes (VERSION in game.js), add a new file here and never delete the old ones. */
const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=path.join(__dirname,'..','src'),dir=path.join(__dirname,'saves');let bad=0;
for(const f of fs.readdirSync(dir).filter(f=>f.endsWith('.json'))){
  const raw=fs.readFileSync(path.join(dir,f),'utf8');const store={'parts-counter-v6':raw};
  const ctx={console,localStorage:{getItem:k=>store[k]??null,setItem(k,v){store[k]=v},removeItem(k){delete store[k]}},note(){},moneyL:()=>'',fmtT:()=>''};vm.createContext(ctx);
  try{vm.runInContext(['data.js','sdata.js','game.js'].map(x=>fs.readFileSync(path.join(ROOT,x),'utf8')).join('\n;\n')+`
    ;var __r=(()=>{const before=JSON.parse(${JSON.stringify(raw)});const p=[];
      if(S.top<Math.min(before.top||0,NS-1))p.push('lost parts-list progress');
      for(let i=0;i<600;i++)tick(1,true);tick(1e-6,false);
      if(!isFinite(S.cashL))p.push('cash is '+S.cashL);if(!isFinite(R.incL))p.push('income is '+R.incL);
      for(const g in AISLE)for(let j=0;j<=S.sTop[g];j++)if(!isFinite(bPrice(AISLE[g][j])))p.push('bad price '+AISLE[g][j].n);
      return p})();`,ctx);
    if(ctx.__r.length){bad++;console.log('FAIL',f,ctx.__r.join('; '))}else console.log('ok  ',f)}
  catch(e){bad++;console.log('FAIL',f,e.message)}}
process.exit(bad?1:0);

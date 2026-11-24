/* Builds parts-counter.html (the single file the APK and .exe are made from) out of src/.
   Run: node build.js            writes parts-counter.html
        node build.js --check    fails if parts-counter.html is out of date with src/ */
const fs=require('fs'),path=require('path');const S=path.join(__dirname,'src');
const html=fs.readFileSync(path.join(S,'index.html'),'utf8').replace(/<script src="([a-z0-9]+\.js)"><\/script>/g,(m,f)=>'<script>\n'+fs.readFileSync(path.join(S,f),'utf8').replace(/<\/script/g,'<\\/script')+'\n</script>');
if(/<script src=/.test(html))throw new Error('a script was not inlined');
const out=path.join(__dirname,'parts-counter.html');
if(process.argv.includes('--check')){const cur=fs.existsSync(out)?fs.readFileSync(out,'utf8'):'';if(cur!==html){console.error('parts-counter.html is out of date: run node build.js');process.exit(1)}console.log('parts-counter.html is up to date')}
else{fs.writeFileSync(out,html);console.log('built parts-counter.html',(html.length/1024).toFixed(0)+' KB')}

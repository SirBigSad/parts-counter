/* ---------- skin layouts: rearranges the same game screens for each look, plus small live
   add-ons that only read numbers the game already shows. No game logic lives here. ---------- */
const KIT={
 /* store items and shelf products as tiles instead of rows */
 tiles:(n,bg,r,pad='10px')=>`& div:has(>.item){display:grid;grid-template-columns:repeat(${n},minmax(0,1fr));gap:10px}
& div:has(>.item)>:not(.item){grid-column:1/-1}
& .item{display:flex;flex-direction:column;align-items:stretch;gap:4px;padding:${pad};border:0;border-radius:${r};background:${bg};position:relative}
& .item h3.bn{flex-direction:column;align-items:flex-start;gap:2px}& .item h3.bn>svg{display:none}
& .item h3 .ct{order:-1;margin:0;font-size:${n>2?15:20}px;white-space:nowrap;line-height:1;color:var(--ink)}
& .item p{font-size:12px}& .item .btn{order:5;width:100%;min-width:0;margin-top:auto}& .item .lock{order:5;padding:6px 0}& .item .rbar{order:4}
& div:has(>.sku){display:grid;grid-template-columns:repeat(${n},minmax(0,1fr));gap:8px}
& div:has(>.sku)>:not(.sku){grid-column:1/-1}
& .sku,& .sku:nth-child(odd){display:flex;flex-direction:column;align-items:stretch;gap:6px;padding:${pad};border-radius:${r};background:${bg}}
& .sku .btn{width:100%;min-width:0}& .sku .sn small{font-size:11.5px}`,
 /* rows that look like separate cards */
 rows:(bg,r,extra='')=>`& .item{background:${bg};border:0;border-radius:${r};padding:10px 12px;margin-top:8px;${extra}}& .sku,& .sku:nth-child(odd){background:${bg};border-radius:${r};margin-top:6px;padding:10px;${extra}}`,
 /* four stages as horizontal pipes, one per line */
 pipes:(fill,track)=>`& header.mini .dash{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important}& header.mini .dash div{display:block!important;padding:3px 6px!important}& header.mini .dash div::after{display:none!important}& header.mini .dash .db{display:none!important}& header.mini .dash b{text-align:left}
& .dash{grid-template-columns:1fr!important;gap:6px}& .dash div{display:grid;grid-template-columns:82px 1fr 58px;align-items:center;gap:8px;padding:4px 8px}
& .dash div::after{display:none}& .dash small{font-size:12px!important;display:block!important}& .dash b{text-align:right;order:3}
& .dash .db{order:2;height:14px;margin:0;border-radius:8px;background:${track}}& .dash .db i{background:${fill}!important;border-radius:8px}`,
 /* stages as vertical bars, tallest = most */
 vert:(fill,track,h=46)=>`& .dash div{display:flex;flex-direction:column;align-items:center;text-align:center}& .dash .db{order:-1;width:60%;height:${h}px;margin:0 0 4px;display:flex;align-items:flex-end;background:${track};border-radius:4px 4px 0 0}
& .dash .db i{width:100%!important;height:max(4%,var(--wp,0%));background:${fill}!important;border-radius:4px 4px 0 0}& header.mini .dash .db{display:none}`,
 /* stages as half-circle gauges */
 gauge:(fill,track,lim)=>`& .dash div{display:flex;flex-direction:column;align-items:center;text-align:center}
& .dash .db{order:-1;width:58px;height:29px;margin:0 0 4px;border-radius:58px 58px 0 0;background:conic-gradient(from -90deg at 50% 100%,${fill} calc(var(--w,0)*180deg),${track} 0 180deg,transparent 0)}
& .dash .lim .db{background:conic-gradient(from -90deg at 50% 100%,${lim} calc(max(var(--w,0),.03)*180deg),${track} 0 180deg,transparent 0)}& .dash .db i{display:none}& header.mini .dash .db{display:none}`,
 /* stages as round stickers or bumpers */
 round:`& .dash{gap:8px!important}& .dash div{aspect-ratio:1;border-radius:50%!important;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:4px!important}& .dash .db{display:none}& .dash div::after{display:none}& header.mini .dash div{aspect-ratio:auto;border-radius:12px!important}`,
 /* stages as a table, one row each */
 table:(status)=>`& header.mini .dash{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important}& header.mini .dash div{display:block!important;padding:3px 6px!important}& header.mini .dash div::after{display:none!important}& header.mini .dash .db{display:none!important}& header.mini .dash b{text-align:left}
& .dash{grid-template-columns:1fr!important;gap:0!important}& .dash div{display:grid;grid-template-columns:1fr 70px 84px;align-items:center;border-radius:0!important;background:transparent!important;border:0!important;border-top:1px solid var(--hdl,rgba(127,127,127,.25))!important;padding:5px 2px;animation:none!important;box-shadow:none!important}
& .dash div::after{position:static!important;transform:none!important;content:'${status[0]}'!important;font-size:11px!important;font-weight:700;text-align:right;color:var(--good)!important}
& .dash .lim::after{content:'${status[1]}'!important;color:var(--bad)!important}& .dash small{font-size:13px!important;display:block!important;color:inherit!important}& .dash .lim small,& .dash .lim b{color:var(--bad)!important}& .dash .db{display:none}`,
 /* keep the ×1 ×10 ×25 Max picker under your thumb */
 thumbQty:(bg)=>`& section>.row:has(>.seg),& #svOpen>.row:has(>.seg),& #shOpen>.row:has(>.seg){position:sticky;bottom:calc(66px + env(safe-area-inset-bottom));z-index:9;background:${bg};padding:6px;border-radius:12px;margin:8px 0!important}& section>.row:has(>.seg) .seg,& #svOpen>.row .seg,& #shOpen>.row .seg{display:grid;grid-template-columns:repeat(4,1fr);width:100%}`,
 counters:(fmt)=>`& div:has(>.item),& div:has(>.sku){counter-reset:pc}& .item,& .sku{counter-increment:pc}& .item h3{flex-wrap:wrap}& .item h3::before,& .sku .sn::before{content:${fmt};display:block;order:-2;flex:none;width:100%;font-size:10px;font-weight:700;letter-spacing:.06em;opacity:.8}`,
 hideStage:`& .stage{display:none}`
};

/* per-look layout, hint line, and live add-on */
const LAY={
 a:{hint:'{L} is the bottleneck. Lines are backing up.',
   l:KIT.rows('var(--card)','14px')+`& .item .btn,& .sku .btn{border-radius:10px}& .dash div:not(:last-child)::after{content:'›'}`},
 b:{hint:'** {L} IS HOLDING UP THE LINE **',
   l:KIT.table(['OK','HOLD'])+`& header::before{content:'COUNTER #2 · TICKET';display:block;font:500 11px 'IBM Plex Mono',monospace;color:#6b6457;max-width:720px;margin:0 auto 4px}
& .item,& .sku,& .sku:nth-child(odd){background:transparent;border-top:1px dotted #b9b0a0;border-radius:0}& div:has(>.item)>.ihd::after{content:'QTY · DESCRIPTION · PRICE';font:500 10px 'IBM Plex Mono',monospace;color:#6b6457}
& .item h3 .ct,& .sku .sn small{font-family:'IBM Plex Mono',monospace}& .btn.pri{font-family:'IBM Plex Mono',monospace}`},
 c:{l:KIT.vert('#3a3a3a','transparent',40)+`& .dash .lim .db i{background:#ff5a3c!important}& .dash div{background:transparent!important;border:0!important}`+KIT.tiles(2,'#1c1c1c','8px','12px')+`& .item .btn,& .sku .btn{border-radius:0 0 8px 8px;margin:6px -12px -12px;width:calc(100% + 24px);min-height:50px;font-size:17px}`+KIT.thumbQty('#0d0d0d')},
 d:{deco:'story',l:KIT.hideStage+`& .dash{display:none}& .item,& .sku,& .sku:nth-child(odd){background:transparent;border-top:1px dashed #1f3a1f;border-radius:0}
& .item .btn,& .sku .btn{text-align:left;justify-content:flex-start}& .item p::before{content:'  '}& nav.bar button svg{display:none}& nav.bar button{text-transform:lowercase;font-size:13px}
& nav.bar button[aria-selected=true]::before{content:'['!important;position:static!important;width:auto!important;height:auto!important;background:none!important;transform:none!important;display:inline}& nav.bar button[aria-selected=true]::after{content:']'}& nav.bar button[aria-selected=true]{flex-direction:row}`},
 e:{l:KIT.tiles(3,'var(--card)','18px','10px')+`& .item,& .sku{box-shadow:0 4px 0 #c9d6f5}& .item h3 .ct{display:flex;align-items:center;justify-content:center;height:50px;border-radius:12px;background:#ffb54a;color:#fff;margin-bottom:4px}& .item:nth-child(3n) h3 .ct{background:#8a6bff}& .item:nth-child(3n+1) h3 .ct{background:#5b8cff}
& .item h3{font-size:13px}& .dash{background:#fff;border-radius:18px;padding:8px;box-shadow:0 4px 0 #c9d6f5}& .dash div{box-shadow:none!important}`},
 f:{hint:'Money only flows as fast as the thinnest pipe.',l:KIT.pipes('repeating-linear-gradient(90deg,#4f7cff 0 12px,#7fa0ff 12px 24px)','#eceae2')+`& .dash .lim .db i{background:#ff5c5c!important}& .dash div{border:0!important;box-shadow:none!important;background:transparent!important}
& .dash{border:2.5px solid #111;border-radius:14px;padding:8px;box-shadow:4px 4px 0 #111;background:#fff}`+KIT.rows('#fff','14px','border:2.5px solid #111;box-shadow:4px 4px 0 #111;')},
 g:{l:KIT.tiles(2,'#fff','16px','16px 12px 12px')+`& .item,& .sku{box-shadow:0 4px 0 #c7a774;margin-top:14px}& .item::before,& .sku::before{content:'';position:absolute;top:-14px;left:50%;margin-left:-5px;width:10px;height:14px;background:#8a8a8a;border-radius:3px}
& .item::after,& .sku::after{content:'';position:absolute;top:6px;left:50%;margin-left:-9px;width:18px;height:6px;border-radius:3px;background:#e8cfa6}& .sku{position:relative}& .item h3 .ct{display:flex;align-items:center;justify-content:center;height:50px;border-radius:12px;background:#4f8cff;color:#fff}`},
 h:{l:KIT.rows('#d9b07a','6px','box-shadow:0 3px 0 #9c7442;')+`& .item h3,& .item p,& .sku .sn{background:#fff;border-radius:3px;padding:4px 8px}& .item h3{flex-wrap:wrap}& .item h3::before{content:'SHIP TO: STORE';display:block;flex:none;width:100%;font-size:9.5px;font-weight:700;color:#7a6a55}& .item p{margin-top:-4px}`},
 i:{hint:'CHECK {L} · it\'s redlining the whole store',l:KIT.gauge('#4fa3ff','#2a3756','#ff5470')+`& .dash div{border:0!important;background:transparent!important}`+KIT.rows('#1a2438','12px')},
 j:{hint:'↑ NOTE 1: {L} is the narrowest point. Widen first.',l:KIT.counters("counter(pc,decimal-leading-zero)")+`& .item,& .sku,& .sku:nth-child(odd){background:transparent;border:1.5px solid #fff;border-radius:0;margin-top:8px;padding:8px}`},
 k:{l:KIT.rows('#3a3a3a','24px','box-shadow:inset 0 2px 5px rgba(0,0,0,.6);')+`& .card{position:relative;padding-bottom:26px}& .card::after{content:'';position:absolute;left:50%;bottom:9px;width:120px;margin-left:-60px;height:8px;border-radius:4px;background:linear-gradient(#f4f4f4,#9aa0a8)}`},
 l:{hint:'TRAFFIC BACKED UP AT {L}',l:KIT.counters("'EXIT ' counter(pc)")+KIT.rows('#0f7a3e','10px','color:#fff;border:2px solid #fff;outline:2px solid #0f7a3e;')+`& .item p,& .item h3 .ct,& .sku .sn small,& .item h3,& .sku .sn b{color:#fff!important}& .item.locked,& .sku.locked{background:#5d7a6a;outline-color:#5d7a6a}& .item .btn.pri,& .sku .btn.pri{background:#fff;color:#0f7a3e}
& header::after{content:'';display:block;height:4px;margin:8px -16px -10px;background:repeating-linear-gradient(90deg,#ffd23f 0 20px,transparent 20px 40px);animation:road .6s linear infinite}@keyframes road{to{background-position:-40px 0}}`},
 m:{l:KIT.round+KIT.tiles(2,'#cfe3ff','22px','10px 12px')+`& .item,& .sku{border:6px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.14)}& .item:nth-child(odd),& .sku:nth-child(odd){transform:rotate(-1.5deg)}& .item:nth-child(even),& .sku:nth-child(even){transform:rotate(1.5deg);background:#e5d4ff}`},
 n:{l:KIT.table(['ON TIME','DELAYED'])+`& .dash small{font-family:'Roboto Mono',monospace}& .item h3 .ct,& .sku .sn small{font-family:'Roboto Mono',monospace}& .item h3 .ct{background:#222;color:#f5f5f0;padding:1px 5px;border-radius:3px;background-image:linear-gradient(transparent 48%,#000 48% 52%,transparent 52%)}`+KIT.rows('#1b1b1b','8px')},
 o:{deco:'bubble',l:KIT.rows('#fff','0','border:3px solid #111;box-shadow:4px 4px 0 #111;')+`& .item .btn.pri,& .sku .btn.pri{transform:rotate(-3deg);border:3px solid #111;font-family:Bangers,sans-serif;font-size:19px;letter-spacing:1px}& .item:has(.stamp){background:#c8f5c8}& .stamp{font-family:Bangers,sans-serif;font-size:16px;color:#1a8a2e;border:0}& .stamp::after{content:'!'}`},
 p:{hint:'{L} is the slowest step. Everything waits on it.',l:KIT.rows('#fff','12px')+`& .item h3>span:not(.ct),& .sku .sn b{display:inline-block;background:#3b6fd8;color:#fff;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:3px 7px;border-radius:3px;box-shadow:0 2px 0 rgba(0,0,0,.25);text-shadow:0 -1px 0 rgba(0,0,0,.35)}`},
 q:{hint:'The shortest stack sets your speed. Build {L} up.',l:KIT.vert('repeating-linear-gradient(0deg,#5aa9ff 0 10px,transparent 10px 13px)','transparent',46)+`& .dash .lim .db i{background:repeating-linear-gradient(0deg,#ff6a4d 0 10px,transparent 10px 13px)!important}& .dash div{background:transparent!important}& .dash{background:#fff;border-radius:18px;padding:8px}`+KIT.rows('#fff','16px')},
 r:{l:KIT.counters("'A' counter(pc)")+KIT.tiles(3,'#16295a','6px','8px')+`& .item,& .sku{border-bottom:4px solid #aab4cc}& .item h3{font-size:12px}& .item p{font-size:11px}`},
 s:{hint:'HIT {L} TO LIGHT THE STORE',l:KIT.round+`& .dash div:nth-child(1){background:#2fd6ff!important;color:#06202b}& .dash div:nth-child(2){background:#7cff6b!important;color:#0b2a06}& .dash div:nth-child(3){background:#ffd23f!important;color:#2b2000}& .dash div:nth-child(4){background:#ff9d2e!important;color:#2b1500}& .dash small{color:inherit!important}& .dash .lim{background:#ff3d6e!important;color:#fff}
& .item,& .sku,& .sku:nth-child(odd){border-left:10px solid #2fd6ff;background:#1e1440;border-radius:12px;margin-top:8px}`+KIT.thumbQty('#000')},
 t:{hint:'Everyone\'s piled up on the {L} space.',l:KIT.tiles(3,'#fff','8px','0')+`& .item,& .sku{border:2.5px solid #1d2b26;overflow:hidden}& .item h3{background:#4f8cff;color:#fff;padding:6px;text-align:center;align-items:center!important;font-size:12px}& .item h3::before{content:'TITLE DEED';font-size:9px}& .item h3 .ct{color:#fff;font-size:14px}& .item p{padding:0 6px;text-align:center}
& .item .btn,& .sku .btn{border-radius:0!important;border:0!important;border-top:2.5px solid #1d2b26!important}& .item .lock{text-align:center}& .sku .sn{padding:6px}`},
 u:{hint:'Storm warning at {L}: long lines all day.',l:`& .hrow{flex-direction:column-reverse;align-items:center;text-align:center}& .money{text-align:center}& .who small{display:none}
& .dash div{display:flex;flex-direction:column;align-items:center;text-align:center}& .dash div::before{content:'';width:30px;height:30px;background:center/contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Ccircle cx='17' cy='17' r='7' fill='%23ffc533'/%3E%3Cpath d='M17 3v4M17 27v4M3 17h4M27 17h4M7 7l3 3M24 24l3 3M27 7l-3 3M7 27l3-3' stroke='%23ffc533' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E")}
& .dash .lim::before{background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 34'%3E%3Cpath d='M9 20a6 6 0 0 1 1-12 8 8 0 0 1 15 2 5 5 0 0 1 0 10z' fill='%236b7a93'/%3E%3Cpath d='M16 21l-3 6h4l-2 5' stroke='%23ffc533' stroke-width='2.2' fill='none'/%3E%3C/svg%3E")}& .dash .db{display:none}& header.mini .dash div::before{display:none}`+KIT.rows('#fff','16px')},
 v:{l:`& .dash{grid-template-columns:1fr!important;gap:0!important}& .dash div{display:flex;justify-content:space-between;background:transparent!important;border:0!important;padding:1px 2px!important;animation:none!important}& .dash div::after{display:none}& .dash small{font-size:16px!important;display:block!important}& .dash .db{display:none}
& .dash .lim{border:0!important}& .dash .lim small::after{content:'  <- way too slow!!';font-size:13px}& .dash .lim b{border:2px solid #c62828;border-radius:50%;padding:0 6px}& header.mini .dash{grid-template-columns:repeat(4,minmax(0,1fr))!important}& header.mini .dash div{display:block!important}& header.mini .dash .lim small::after{content:none}& header.mini .dash small{font-size:11px!important}& header.mini .dash .lim b{border:0;padding:0}
& .item,& .sku,& .sku:nth-child(odd){background:transparent;border:0;border-top:0;padding:8px 0}& .item .btn.pri,& .sku .btn.pri{transform:rotate(-3deg)}& .item:has(.stamp) h3>span:not(.ct){text-decoration:line-through}& .stamp{font-family:Caveat,cursive;font-size:20px;border:0;color:#1b7a3d}`},
 w:{hint:'Weakest stat: {L}. Your store plays at its speed.',l:KIT.pipes('#6fb8ff','#3a3166')+`& .dash .lim .db i{background:#ff5c85!important}& .dash div{background:transparent!important;border:0!important;padding:2px 4px!important;animation:none!important}& .dash .db{height:6px}`+KIT.tiles(3,'#fff','9px','0')+`& .item,& .sku{border:4px solid #ffd84d;color:#1a1530;overflow:hidden}& .item h3 .ct{display:flex;align-items:center;justify-content:center;height:56px;background:linear-gradient(135deg,#6fb8ff,#3a6bff);color:#fff;margin:0 -0px 4px}
& .item h3,& .item p,& .sku .sn{padding:0 6px;color:#1a1530}& .item h3::before{content:'COMMON';font-size:9px;color:#3a6bff;order:0}& .item p,& .sku .sn small{color:#555}& .item .btn{border-radius:0}& .item:has(.stamp){border-color:transparent;background:linear-gradient(115deg,#ffd1f0,#c7f2ff,#d7ffc7,#fff2b8,#ffd1f0);background-size:200% 100%;animation:holo 4s linear infinite}`},
 x:{hint:'{L} is too SLOW!',l:KIT.rows('#fff','0','box-shadow:0 -4px 0 #1d1b3a,0 4px 0 #1d1b3a,-4px 0 0 #1d1b3a,4px 0 0 #1d1b3a;margin:12px 4px;')},
 y:{hint:'{L} is muting the whole mix',l:`& .dash div{display:flex;flex-direction:column;align-items:center;text-align:center;background:transparent!important;border:0!important}& .dash .db{order:-1;width:6px;height:46px;margin:0 0 4px;display:flex;align-items:flex-end;justify-content:center;background:#3a3d44;overflow:visible;border-radius:3px}
& .dash .db i{width:24px!important;height:12px;flex:none;margin-bottom:calc(var(--w,0)*34px);background:#2b2d33!important;border-radius:3px}& .dash .lim .db i{background:#ff5a4e!important;box-shadow:0 0 10px #ff5a4e}& header.mini .dash .db{display:none}
& .item,& .sku,& .sku:nth-child(odd){background:#e9e3d4;border-radius:8px;margin-top:8px;padding:8px}& .item h3>span:not(.ct),& .sku .sn b{background:#ffb340;padding:3px 8px;border-radius:4px;font-family:Kalam,cursive;display:inline-block}`+KIT.thumbQty('#1e2024')},
 z:{deco:'chat',l:KIT.hideStage+`& .dash{display:none}& .hrow::before{content:'PC';flex:none;width:40px;height:40px;border-radius:50%;background:#ffb020;color:#fff;font-weight:800;display:grid;place-items:center;align-self:center}
& .item,& .sku,& .sku:nth-child(odd){background:transparent;border-top:1px solid #eef0f4;border-radius:0}& .card{border-radius:18px 18px 18px 6px}`+KIT.thumbQty('#fff')},
 aa:{deco:'map',l:KIT.hideStage+KIT.rows('#fff','12px','border:1.5px solid #e4ddd0;')}
};

/* ---------- live add-ons ---------- */
const STAGE_TALK={Shelf:['Sending out {v}','Shelf'],Customers:['{v} of us walking in!','Customers'],Checkout:['Ringing up {v}','Checkout'],Stocking:['Restocking {v}, all good','Stocking']};
const STAGE_HELP={Shelf:"We're out of parts on the shelf. HELP",Customers:"Where is everybody? Only {v} walking in.",Checkout:"I can only ring up {v}. Line's out the door. HELP",Stocking:"Can't restock fast enough, only {v}. HELP"};
const BUBBLE={Shelf:'"Where are all the parts?!"',Customers:'"Hello? Is this place even open?"',Checkout:'"Is anyone working this register?!"',Stocking:'"Why are these shelves empty?!"'};
const AVC={Shelf:'#4f8cff',Customers:'#9b6bff',Checkout:'#ff5a4e',Stocking:'#20b26b'};
const esc2=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const DECO={
 story:(st,g)=>{const p=n=>st.find(x=>x.n===n)||{v:'?'},L=st.find(x=>x.lim);
   return `<p class="dim">You're behind the counter. The lights hum. It smells like brake cleaner.</p><p>Shelf ships ${p('Shelf').v}. ${p('Customers').v} customers walk in. Checkout rings up ${p('Checkout').v}. Stocking keeps up at ${p('Stocking').v}.</p>`+
   (L?`<p class="red">${esc2(L.n)} is holding everything up at ${esc2(L.v)}. The line is growing.</p>`:'')+(g?`<p>Note on the register: <b>${esc2(g)}</b></p>`:'')+`<p class="cmd">&gt; look around</p>`},
 chat:(st,g)=>st.map(s=>{const t=s.lim?STAGE_HELP[s.n]||'Help!':(STAGE_TALK[s.n]||['{v}'])[0];return `<div class="msg${s.lim?' bad':''}"><i style="background:${AVC[s.n]||'#999'}"></i><p><b>${esc2(s.n)}</b>${esc2(t.replace('{v}',s.v+''))}</p></div>`}).join('')+(g?`<div class="msg"><i style="background:#16181d"></i><p><b>Parts rep</b>${esc2(g)}</p></div>`:''),
 bubble:(st)=>{const L=st.find(x=>x.lim);return L?`<div class="bub">${BUBBLE[L.n]||'"Hurry up!"'}</div>`:''},
 map:(st)=>{const p=n=>(st.find(x=>x.n===n)||{v:'?',lim:false});const c=n=>p(n).lim?' lim':'';
   return `<div class="map"><b class="a1">FILTERS</b><b class="a2">ENGINES</b><b class="a3">BRAKES</b><span class="sh${c('Shelf')}">Shelf ${esc2(p('Shelf').v)}</span><span class="door${c('Customers')}">Door · ${esc2(p('Customers').v)} in</span>
   <span class="ck${c('Checkout')}">Checkout<br>${esc2(p('Checkout').v)}</span><span class="sk${c('Stocking')}">Stockroom<br>${esc2(p('Stocking').v)}</span><i class="d"></i><i class="d" style="animation-delay:1.2s;background:#ffb020"></i><i class="d" style="animation-delay:2.4s;background:#9b6bff"></i><i class="d" style="animation-delay:3.6s;background:#20b26b"></i></div>`}
};
const DECO_CSS=`#skdeco{margin:0 0 12px}#skdeco:empty{display:none}#skhint{max-width:720px;margin:6px auto 0;font-size:12.5px;font-weight:600;color:var(--bad)}#skhint:empty{display:none}header.mini #skhint{display:none}
:root[data-skin=d] #skdeco p{margin:0 0 8px;line-height:1.45}:root[data-skin=d] #skdeco .dim{color:#6fbf6f}:root[data-skin=d] #skdeco .red{color:#ff8f7a}:root[data-skin=d] #skdeco .cmd{color:#d8ffd8}:root[data-skin=d] #skdeco .cmd::after{content:'';display:inline-block;width:8px;height:15px;background:#9df29d;margin-left:6px;vertical-align:-2px;animation:blk 1s steps(1) infinite}@keyframes blk{50%{opacity:0}}
:root[data-skin=z] #skdeco{display:flex;flex-direction:column;gap:8px}:root[data-skin=z] .msg{display:flex;gap:8px;align-items:flex-end}:root[data-skin=z] .msg i{width:28px;height:28px;border-radius:50%;flex:none}:root[data-skin=z] .msg p{margin:0;background:#fff;border-radius:16px 16px 16px 4px;padding:8px 12px;font-size:14px}:root[data-skin=z] .msg b{display:block;font-size:11px;color:var(--mute)}:root[data-skin=z] .msg.bad p{background:#ffe6e3}:root[data-skin=z] .msg.bad b{color:#c4302a}
:root[data-skin=o] .bub{position:relative;margin:4px 0 4px auto;width:max-content;max-width:90%;background:#fff;border:3px solid #111;border-radius:18px;padding:6px 12px;font-weight:900;font-size:14px}:root[data-skin=o] .bub::before{content:'';position:absolute;top:-11px;right:36px;width:16px;height:16px;background:#fff;border-left:3px solid #111;border-top:3px solid #111;transform:rotate(45deg)}
:root[data-skin=aa] .map{position:relative;height:190px;background:#fff;border:3px solid #1e2430;border-radius:6px;overflow:hidden;font-size:10px;font-weight:800}:root[data-skin=aa] .map b{position:absolute;left:20px;width:72px;height:18px;border-radius:3px;display:grid;place-items:center}
:root[data-skin=aa] .a1{top:16px;background:#c9dcff}:root[data-skin=aa] .a2{top:44px;background:#ffe3a8}:root[data-skin=aa] .a3{top:72px;background:#d6f2df}:root[data-skin=aa] .map span{position:absolute;padding:4px 7px;border-radius:4px;background:#efe6d6;text-align:center;line-height:1.2}:root[data-skin=aa] .map .lim{background:#ff5a4e;color:#fff}
:root[data-skin=aa] .sh{left:110px;top:14px}:root[data-skin=aa] .door{left:10px;bottom:10px}:root[data-skin=aa] .ck{right:12px;top:36px;min-width:70px}:root[data-skin=aa] .sk{right:12px;bottom:12px;min-width:78px}
:root[data-skin=aa] .d{position:absolute;width:10px;height:10px;border-radius:50%;background:#4f8cff;animation:walkin 5s linear infinite}@keyframes walkin{0%{left:20px;top:150px}40%{left:120px;top:150px}70%{left:120px;top:60px}100%{left:calc(100% - 100px);top:60px}}`;

let decoTimer=0,decoLast='',hintLast='';
function skinDecoTick(){const id=S.ui.skin||'',L=LAY[id],box=$('skdeco'),hint=$('skhint');if(!box)return;
  const st=[...document.querySelectorAll('#dash>div')].map(d=>{const i=d.querySelector('.db i'),w=i?Math.min(100,parseFloat(i.style.width)||0):0;d.style.setProperty('--w',(w/100).toFixed(3));d.style.setProperty('--wp',w+'%');
    return{n:(d.querySelector('small')||{}).textContent||'',v:(d.querySelector('b')||{}).textContent||'',lim:d.classList.contains('lim')}});
  const g=($('gbTxt')||{}).textContent||'';
  const html=L&&L.deco&&DECO[L.deco]?DECO[L.deco](st,g):'';if(html!==decoLast){decoLast=html;box.innerHTML=html}
  const lim=st.find(x=>x.lim),ht=L&&L.hint&&lim?L.hint.replace('{L}',lim.n):'';if(ht!==hintLast){hintLast=ht;hint.textContent=ht}}

(function(){const st=document.createElement('style');st.id='skinlay';
  st.textContent=DECO_CSS+'\n'+Object.entries(LAY).map(([id,o])=>(o.l||'').replace(/&/g,`:root[data-skin=${id}]`)).join('\n');document.head.appendChild(st);
  const box=document.createElement('div');box.id='skdeco';const main=document.querySelector('main');main.insertBefore(box,main.firstChild);
  const h=document.createElement('div');h.id='skhint';const dash=$('dash');dash.after(h);
  const base=applySkin;applySkin=function(){base();decoLast=hintLast='\u0000';clearInterval(decoTimer);const on=!!(S.ui.skin);if(on){skinDecoTick();decoTimer=setInterval(skinDecoTick,500)}else{$('skdeco').innerHTML='';$('skhint').textContent=''}};
  applySkin()})();

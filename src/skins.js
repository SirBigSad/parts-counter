/* ---------- skins: 27 looks from the UI concepts canvas (A to AA). Only colours, type and
   decoration change; every number, button and rule of the game stays exactly the same. ---------- */
const SKINS=[
 {id:'a',n:'Shop Floor',s:'dark',f:'Inter',d:'Space Grotesk',g:['Inter:wght@400;500;600;700','Space+Grotesk:wght@500;700'],
  bg:'#14161a',card:'#1b1e23',ink:'#e9e6df',mute:'#a9a49a',line:'#2a2e35',soft:'#23272e',acc:'#f4b740',oa:'#14161a',acc2:'#2e2716',good:'#7fd49a',bad:'#ff7a6b',
  hb:'#1b1e23',hi:'#e9e6df',hm:'#a9a49a',ht:'#23272e',hg:'#7fd49a',r:'14px'},
 {id:'b',n:'Counter Ticket',s:'light',f:'IBM Plex Sans',d:'IBM Plex Mono',g:['IBM+Plex+Sans:wght@400;600;700','IBM+Plex+Mono:wght@400;500;700'],
  bg:'#efe9dc',card:'#fbf8f1',ink:'#22201b',mute:'#6b6457',line:'#d6cdbb',soft:'#f3ede0',acc:'#2f6b3d',oa:'#fff',acc2:'#e7e0cf',good:'#2f6b3d',bad:'#b3261e',
  hb:'#efe9dc',hi:'#22201b',hm:'#6b6457',ht:'rgba(0,0,0,.05)',hg:'#2f6b3d',r:'4px',cb:'1px solid #d6cdbb',sh:'none',br:'3px',
  x:'& header{border-bottom:2px dashed #b9b0a0}& .stamp{color:#b3261e;border-color:#b3261e;border-width:2px}& h2{text-transform:uppercase;letter-spacing:.04em;font-size:20px}'},
 {id:'c',n:'Garage Bold',s:'dark',f:'Archivo',d:'Archivo Narrow',g:['Archivo:wght@500;700;900','Archivo+Narrow:wght@600;700'],
  bg:'#0d0d0d',card:'#1c1c1c',ink:'#f2f2f2',mute:'#a8a8a8',line:'#2e2e2e',soft:'#262626',acc:'#ffcc00',oa:'#0d0d0d',acc2:'#2b2600',good:'#7ee08a',bad:'#ff8a73',
  hb:'#ffcc00',hi:'#0d0d0d',hm:'#3d3300',ht:'rgba(0,0,0,.12)',hg:'#0d0d0d',r:'8px',sh:'none',br:'6px',
  x:'& header{border-radius:0!important;border-bottom:8px solid transparent;border-image:repeating-linear-gradient(135deg,#ffcc00 0 10px,#0d0d0d 10px 20px) 8}& #cash{font-weight:900}& .btn.pri{font-weight:800}'},
 {id:'d',n:'Text Adventure',s:'dark',f:'IBM Plex Mono',d:'VT323',g:['IBM+Plex+Mono:wght@400;600','VT323'],
  bg:'#0a0f0a',card:'#0d150d',ink:'#9df29d',mute:'#6fbf6f',line:'#1f3a1f',soft:'#112011',acc:'#9df29d',oa:'#0a0f0a',acc2:'#112011',good:'#9df29d',bad:'#ff8f7a',
  hb:'#0a0f0a',hi:'#d8ffd8',hm:'#6fbf6f',ht:'#112011',hg:'#9df29d',r:'2px',cb:'1px solid #1f3a1f',sh:'none',br:'2px',
  x:'& header{border-bottom:1px solid #1f3a1f;border-radius:0!important}& #cash{font-size:40px}& h2{font-size:30px;font-weight:400}& h2::before{content:"> "}& .btn.pri{background:#112011!important;color:#d8ffd8;border:1px solid #3f7a3f}& .btn.pri::before{content:"> "}& body{background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.25) 0 1px,transparent 1px 3px)}'},
 {id:'e',n:'Tiny Store',s:'light',f:'Bricolage Grotesque',d:'Bricolage Grotesque',g:['Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800'],
  bg:'#eaf1ff',card:'#ffffff',ink:'#1b2340',mute:'#5a6488',line:'#dbe4f7',soft:'#f0f4fd',acc:'#2fbf7a',oa:'#fff',acc2:'#dff4ea',good:'#0f8a52',bad:'#c0262d',
  hb:'#eaf1ff',hi:'#1b2340',hm:'#5a6488',ht:'#ffffff',hg:'#0f6b3c',r:'22px',sh:'0 4px 0 #c9d6f5',br:'12px',
  x:'& .btn.pri{box-shadow:0 3px 0 #1f8a57}& .dash div{box-shadow:0 3px 0 #c9d6f5}& nav.bar{margin:0 10px 8px;border-radius:20px;box-shadow:0 4px 0 #c9d6f5}& .dash .lim{animation:wob .6s infinite}@keyframes wob{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}'},
 {id:'f',n:'Flow Pipes',s:'light',f:'Sora',d:'Sora',g:['Sora:wght@400;600;800'],
  bg:'#fffdf7',card:'#ffffff',ink:'#111111',mute:'#555555',line:'#e2e0d8',soft:'#f4f2ea',acc:'#4f7cff',oa:'#fff',acc2:'#fff4c2',good:'#1a7f45',bad:'#d12d2d',
  hb:'#fffdf7',hi:'#111',hm:'#555',ht:'#fff',hg:'#1a7f45',r:'14px',cb:'2.5px solid #111',sh:'4px 4px 0 #111',br:'10px',
  x:'& .btn.pri{border:2.5px solid #111;box-shadow:2px 2px 0 #111}& .dash div{border:2.5px solid #111!important;box-shadow:3px 3px 0 #111}& .dash .lim{background:#ff5c5c!important}& .dash .lim small{color:#111}& .meter i{background:repeating-linear-gradient(90deg,#4f7cff 0 12px,#7fa0ff 12px 24px);animation:pflow .5s linear infinite}@keyframes pflow{to{background-position:24px 0}}'},
 {id:'g',n:'Pegboard',s:'light',f:'Fredoka',d:'Fredoka',g:['Fredoka:wght@400;500;600;700'],
  bg:'#e8cfa6',card:'#ffffff',ink:'#2b2118',mute:'#6b5a48',line:'#eadfcd',soft:'#f7efe2',acc:'#ffcf4d',oa:'#2b2118',acc2:'#fff4d6',good:'#2f9e57',bad:'#d6452e',
  hb:'#2b2118',hi:'#fff',hm:'#e8cfa6',ht:'rgba(255,255,255,.1)',hg:'#8ef0a8',r:'16px',sh:'0 4px 0 #c7a774',br:'12px',
  x:'& body{background-image:radial-gradient(circle,#c7a774 2.5px,transparent 3px);background-size:22px 22px}& #cash{color:#ffcf4d}& .btn.pri{box-shadow:0 3px 0 #c99a1e}& .dash .lim{animation:sway .7s infinite}@keyframes sway{0%,100%{transform:rotate(-1.5deg)}50%{transform:rotate(1.5deg)}}'},
 {id:'h',n:'Shipping Boxes',s:'light',f:'Barlow',d:'Barlow Condensed',g:[],
  bg:'#f4efe6',card:'#ffffff',ink:'#2a2219',mute:'#7a6a55',line:'#e2d8c6',soft:'#f6efe2',acc:'#1d7a3d',oa:'#fff',acc2:'#efe3cc',good:'#1d7a3d',bad:'#d4301f',
  hb:'#c89a62',hi:'#2a2219',hm:'#4a3820',ht:'rgba(255,255,255,.35)',hg:'#1d5e30',r:'6px',cb:'1.5px solid #e2d8c6',sh:'0 3px 0 #d9c7a6',br:'4px',
  x:'& header{background-image:linear-gradient(90deg,transparent 42%,rgba(230,196,143,.8) 42% 58%,transparent 58%)!important;box-shadow:0 4px 0 #9c7442}& .card.aisle{border-top-style:dashed}& .stamp{color:#1d5e30;border-color:#1d5e30;border-width:2.5px}'},
 {id:'i',n:'Dashboard Gauges',s:'dark',f:'Inter',d:'Chakra Petch',g:['Inter:wght@400;600;700','Chakra+Petch:wght@500;600;700'],
  bg:'#101826',card:'#1a2438',ink:'#e8eefb',mute:'#8fa0bf',line:'#2a3756',soft:'#1d2840',acc:'#ff9f43',oa:'#101826',acc2:'#2a2230',good:'#5ee08f',bad:'#ff5470',
  hb:'#101826',hi:'#e8eefb',hm:'#8fa0bf',ht:'#1d2840',hg:'#5ee08f',r:'12px',sh:'none',br:'9px',
  x:'& .dash div{border-bottom:3px solid #4fa3ff!important;border-radius:10px 10px 4px 4px}& .dash .lim{border-bottom-color:#ff5470!important}& #cash{letter-spacing:.04em}'},
 {id:'j',n:'Blueprint',s:'dark',f:'Space Grotesk',d:'Space Mono',g:['Space+Grotesk:wght@500;700','Space+Mono:wght@400;700'],
  bg:'#1747a6',card:'rgba(23,71,166,.85)',ink:'#ffffff',mute:'#bcd0ff',line:'rgba(255,255,255,.35)',soft:'rgba(255,255,255,.08)',acc:'#ffd84a',oa:'#10306f',acc2:'rgba(255,216,74,.15)',good:'#9dffc4',bad:'#ffd84a',
  hb:'#1747a6',hi:'#fff',hm:'#bcd0ff',ht:'transparent',hg:'#9dffc4',r:'0',cb:'1.5px solid #fff',sh:'none',br:'0',
  x:'& body{background-image:linear-gradient(#2a5bbd 1px,transparent 1px),linear-gradient(90deg,#2a5bbd 1px,transparent 1px);background-size:20px 20px}& header{border-bottom:1.5px solid #fff;border-radius:0!important}& .dash div{border:1.5px solid #fff!important;border-radius:0}& .dash .lim{border:2px dashed #ffd84a!important;background:transparent!important}& .dash .lim small{color:#ffd84a}'},
 {id:'k',n:'Toolbox Drawer',s:'light',f:'Inter',d:'Oswald',g:['Inter:wght@400;600;700','Oswald:wght@500;700'],
  bg:'#d9dde3',card:'#2b2b2b',ink:'#f2f2f2',mute:'#bbbbbb',line:'#444',soft:'#3a3a3a',acc:'#ffd23f',oa:'#1e1e1e',acc2:'#3a3320',good:'#7dff9e',bad:'#ff6b6b',
  hb:'#c8161d',hi:'#fff',hm:'#ffc9cb',ht:'#e7e9ec',hg:'#7dff9e',r:'10px',sh:'inset 0 3px 8px rgba(0,0,0,.5)',br:'18px',
  x:'& header{box-shadow:inset 0 -6px 0 #9e0f15}& .dash div{color:#1e1e1e}& .dash small{color:#555}& .dash .lim{background:#1e1e1e!important;border-color:#ffd23f!important}& .dash .lim b,& .dash .lim small{color:#ffd23f}& h2{color:#1e1e1e}& .sub{color:#444}& main>.sub,& section>.sub,& .tog.mini,& details.intro>summary,& #t-more>details.fold>summary,& .empty{color:#1e1e1e}& nav.bar{background:#1e1e1e;border-top:0}& .sku:nth-child(odd){background:#333}'},
 {id:'l',n:'Highway Signs',s:'light',f:'Overpass',d:'Overpass',g:['Overpass:wght@400;600;800'],
  bg:'#e9f3f8',card:'#ffffff',ink:'#13202b',mute:'#4d6170',line:'#d5e2ea',soft:'#eef5f9',acc:'#0f7a3e',oa:'#fff',acc2:'#dbeaf8',good:'#0f7a3e',bad:'#e0601f',
  hb:'#3b4652',hi:'#fff',hm:'#c6d2db',ht:'#fff',hg:'#ffd23f',r:'10px',cb:'3px solid #13202b',sh:'none',br:'6px',
  x:'& header{border-bottom:5px solid transparent;border-image:repeating-linear-gradient(90deg,#ffd23f 0 20px,#3b4652 20px 40px) 5}& .dash div{color:#13202b}& .dash small{color:#4d6170}& .dash .lim{background:#ff7a3d!important;border-color:#13202b!important}& .dash .lim small{color:#13202b}& .btn.pri{border:2px solid #fff;outline:2px solid #0f7a3e}'},
 {id:'m',n:'Sticker Sheet',s:'light',f:'Baloo 2',d:'Baloo 2',g:['Baloo+2:wght@500;600;700;800'],
  bg:'#fafafa',card:'#ffffff',ink:'#1f1d2b',mute:'#55536a',line:'#eceaf2',soft:'#f4f3f8',acc:'#1f1d2b',oa:'#fff',acc2:'#fff2b3',good:'#1f8a4c',bad:'#e04848',
  hb:'#ffe066',hi:'#1f1d2b',hm:'#6a5a00',ht:'#fff',hg:'#1f6b3c',r:'22px',cb:'5px solid #fff',sh:'0 4px 12px rgba(0,0,0,.14)',br:'14px',
  x:'& .card{outline:1px solid #eceaf2}& .dash div{border:4px solid #fff!important;border-radius:999px;box-shadow:0 2px 6px rgba(0,0,0,.12)}& .dash div:nth-child(odd){transform:rotate(-3deg)}& .dash div:nth-child(even){transform:rotate(3deg)}& .dash .lim{background:#ff6b6b!important;color:#fff}& .dash .lim small{color:#fff}& .stamp{transform:rotate(-8deg)}'},
 {id:'n',n:'Split-Flap Board',s:'dark',f:'Inter',d:'Roboto Mono',g:['Inter:wght@400;600;700','Roboto+Mono:wght@500;700'],
  bg:'#111111',card:'#1b1b1b',ink:'#f5f5f0',mute:'#9a9a92',line:'#2a2a2a',soft:'#222',acc:'#ffc629',oa:'#111',acc2:'#2b2410',good:'#7be495',bad:'#ff7a6b',
  hb:'#111',hi:'#f5f5f0',hm:'#9a9a92',ht:'#222',hg:'#7be495',r:'8px',sh:'none',br:'6px',
  x:'& #cash,& .dash b{background-image:linear-gradient(transparent 48%,rgba(0,0,0,.7) 48% 52%,transparent 52%)}& #cash{background-color:#222;padding:2px 8px;border-radius:4px}'},
 {id:'o',n:'Comic Panels',s:'light',f:'Nunito',d:'Bangers',g:['Nunito:wght@500;700;900','Bangers'],
  bg:'#ffffff',card:'#ffffff',ink:'#111',mute:'#444',line:'#111',soft:'#f2f2f2',acc:'#ffe14d',oa:'#111',acc2:'#fff6c2',good:'#1a8a2e',bad:'#e03535',
  hb:'#ffe14d',hi:'#111',hm:'#333',ht:'#fff',hg:'#1a8a2e',r:'0',cb:'3px solid #111',sh:'4px 4px 0 #111',br:'0',
  x:'& header{background-image:radial-gradient(#f2c500 1.5px,transparent 2px)!important;background-size:8px 8px!important;border-bottom:3px solid #111;border-radius:0!important}& h2,& #cash{letter-spacing:1px;font-weight:400}& .dash div{border:3px solid #111!important;border-radius:0}& .dash .lim{background:#ff4f4f!important;color:#fff}& .dash .lim small{color:#fff}& .btn.pri{border:3px solid #111}'},
 {id:'p',n:'Label Maker',s:'light',f:'Rubik',d:'Rubik',g:['Rubik:wght@400;600;800'],
  bg:'#eceef1',card:'#ffffff',ink:'#20242b',mute:'#5b616b',line:'#e1e4e9',soft:'#f3f4f6',acc:'#2c9a55',oa:'#fff',acc2:'#e4f3ea',good:'#2c9a55',bad:'#e03a3a',
  hb:'#eceef1',hi:'#20242b',hm:'#5b616b',ht:'#fff',hg:'#2c9a55',r:'12px',sh:'none',br:'6px',
  x:'& h2{display:inline-block;background:#20242b;color:#fff;font-size:17px;letter-spacing:.12em;text-transform:uppercase;padding:5px 10px;border-radius:3px;text-shadow:0 -1px 0 rgba(0,0,0,.4);box-shadow:0 2px 0 rgba(0,0,0,.25)}& #cash{background:#e03a3a;color:#fff;padding:2px 10px;border-radius:3px;letter-spacing:.06em;text-shadow:0 -1px 0 rgba(0,0,0,.35)}& .btn.pri{letter-spacing:.06em;box-shadow:0 3px 0 #1d6e3c}'},
 {id:'q',n:'Block Stacks',s:'light',f:'Outfit',d:'Outfit',g:['Outfit:wght@400;600;800'],
  bg:'#f1f7f4',card:'#ffffff',ink:'#14261d',mute:'#557063',line:'#dfe9e3',soft:'#eef5f1',acc:'#13a35a',oa:'#fff',acc2:'#d3f2e1',good:'#13824a',bad:'#c13a1f',
  hb:'#f1f7f4',hi:'#14261d',hm:'#557063',ht:'#fff',hg:'#13824a',r:'16px',sh:'none',br:'12px',
  x:'& .meter i{background:repeating-linear-gradient(90deg,#13a35a 0 10px,transparent 10px 12px)}& .dash .lim{outline:2.5px dashed #ff6a4d;outline-offset:2px;background:#fff!important}'},
 {id:'r',n:'Vending Machine',s:'dark',f:'Rubik',d:'Share Tech Mono',g:['Rubik:wght@500;700;800','Share+Tech+Mono'],
  bg:'#2357c9',card:'#0c1a3d',ink:'#ffffff',mute:'#9fb2e0',line:'#1a2c5e',soft:'#16295a',acc:'#ffd12e',oa:'#1b2a55',acc2:'#1b2c5e',good:'#7dff9e',bad:'#ff8a8a',
  hb:'#1b46a8',hi:'#fff',hm:'#c9d6ff',ht:'#0c1a3d',hg:'#7dff9e',r:'8px',cb:'3px solid #1a2c5e',sh:'none',br:'8px',
  x:'& #cash{background:#0a2a12;color:#7dff9e;padding:2px 8px;border-radius:5px}& .btn.pri{box-shadow:0 3px 0 #b58f0a}& nav.bar{background:#0c1a3d;border-top:0}'},
 {id:'s',n:'Pinball Table',s:'dark',f:'Exo 2',d:'Orbitron',g:['Exo+2:wght@500;700','Orbitron:wght@600;800'],
  bg:'#120b26',card:'#1e1440',ink:'#ffffff',mute:'#c9bff0',line:'#3b2a6b',soft:'#2a1d55',acc:'#2fd6ff',oa:'#06202b',acc2:'#2b1a5c',good:'#7cff6b',bad:'#ff3d6e',
  hb:'#000',hi:'#fff',hm:'#c9bff0',ht:'#1e1440',hg:'#ffcf8a',r:'12px',cb:'2px solid #3b2a6b',sh:'none',br:'20px',
  x:'& #cash{color:#ff9d2e}& .btn.pri{box-shadow:0 0 12px rgba(47,214,255,.6)}& .dash div{border-radius:999px!important;text-align:center}& .dash .lim{animation:pblink .8s infinite}@keyframes pblink{50%{box-shadow:0 0 16px #ff3d6e}}& h2{font-size:18px}'},
 {id:'t',n:'Board Game',s:'light',f:'Nunito',d:'Lilita One',g:['Nunito:wght@600;800','Lilita+One'],
  bg:'#cfe8dc',card:'#ffffff',ink:'#1d2b26',mute:'#3d5c50',line:'#d9e6df',soft:'#f5f0e1',acc:'#8bd17c',oa:'#1d2b26',acc2:'#fff3cc',good:'#1f7a4c',bad:'#b3311b',
  hb:'#f5f0e1',hi:'#1d2b26',hm:'#3d5c50',ht:'#fff',hg:'#1f7a4c',r:'12px',cb:'3px solid #1d2b26',sh:'none',br:'8px',
  x:'& header{border-bottom:3px solid #1d2b26}& .dash div{border:2px solid #1d2b26!important;border-top-width:10px!important}& .dash div:nth-child(1){border-top-color:#4f8cff!important}& .dash div:nth-child(2){border-top-color:#a56bff!important}& .dash div:nth-child(3){border-top-color:#f7c948!important}& .dash .lim{border-top-color:#ff5a3d!important;background:#ffe3dc!important}& .btn.pri{border:2.5px solid #1d2b26}'},
 {id:'u',n:'Store Forecast',s:'light',f:'Manrope',d:'Manrope',g:['Manrope:wght@400;600;800'],
  bg:'#eef6ff',card:'#ffffff',ink:'#0f2440',mute:'#5a7090',line:'#e1ebf6',soft:'#f2f7fd',acc:'#0f2440',oa:'#fff',acc2:'#fff4e5',good:'#1b7a46',bad:'#b3261e',
  hb:'linear-gradient(180deg,#4aa3ff,#8fd0ff)',hi:'#fff',hm:'rgba(255,255,255,.85)',ht:'rgba(255,255,255,.25)',hg:'#fff',r:'20px',sh:'0 6px 20px rgba(15,36,64,.1)',br:'12px',
  x:'& #cash{font-size:46px}& .dash .lim{background:rgba(70,80,100,.55)!important;border-color:#ffc533!important}& .dash .lim small{color:#fff}'},
 {id:'v',n:'Counter Notebook',s:'light',f:'Patrick Hand',d:'Caveat',g:['Patrick+Hand','Caveat:wght@600;700'],
  bg:'#fffdf5',card:'rgba(255,255,255,.6)',ink:'#1f2a44',mute:'#5a6788',line:'#d6e4f5',soft:'rgba(214,228,245,.35)',acc:'#d9f5df',oa:'#1b7a3d',acc2:'#ffe066',good:'#1b7a3d',bad:'#c62828',
  hb:'#fffdf5',hi:'#1f2a44',hm:'#5a6788',ht:'transparent',hg:'#1b7a3d',r:'4px',cb:'1px solid #d6e4f5',sh:'none',br:'20px 14px 22px 12px',
  x:'& body{background-image:linear-gradient(#d6e4f5 1px,transparent 1px);background-size:100% 28px;font-size:17px}& #cash{font-size:48px}& h2{font-size:30px}& .btn.pri{border:2.5px solid #1b7a3d}& .dash .lim{border:2px solid #c62828!important;border-radius:50%;background:transparent!important}& .dash .lim small{color:#c62828}'},
 {id:'w',n:'Trading Cards',s:'dark',f:'Inter',d:'Russo One',g:['Inter:wght@400;600;800','Russo+One'],
  bg:'#1a1530',card:'#251e45',ink:'#ffffff',mute:'#b9aef0',line:'#3a3166',soft:'#2e2752',acc:'#ffd84d',oa:'#1a1530',acc2:'#2e2752',good:'#7dffb0',bad:'#ff8fa8',
  hb:'#1a1530',hi:'#fff',hm:'#b9aef0',ht:'#251e45',hg:'#7dffb0',r:'12px',cb:'3px solid #3a3166',sh:'none',br:'8px',
  x:'& #prog,& .card.aisle{border:3px solid transparent;background:linear-gradient(#251e45,#251e45) padding-box,linear-gradient(115deg,#ffd1f0,#c7f2ff,#d7ffc7,#fff2b8,#ffd1f0) border-box;background-size:auto,200% 100%;animation:holo 4s linear infinite}@keyframes holo{to{background-position:0 0,200% 0}}'},
 {id:'x',n:'Pixel Shop',s:'light',f:'Pixelify Sans',d:'Press Start 2P',g:['Pixelify+Sans:wght@400;600;700','Press+Start+2P'],
  bg:'#8fd3ff',card:'#ffffff',ink:'#1d1b3a',mute:'#4a4770',line:'#c9c6d9',soft:'#eceaf6',acc:'#0b9b4e',oa:'#fff',acc2:'#fff3c2',good:'#0b6b2e',bad:'#c02a26',
  hb:'#8fd3ff',hi:'#1d1b3a',hm:'#2d2a55',ht:'#fff',hg:'#0b6b2e',r:'0',sh:'0 -4px 0 0 #1d1b3a,0 4px 0 0 #1d1b3a,-4px 0 0 0 #1d1b3a,4px 0 0 0 #1d1b3a',br:'0',
  x:'& #cash{font-size:22px}& h2{font-size:15px;line-height:1.5}& h3,& h3.bn,& .capg h3,& details.line>summary .lsum b{font-size:12px;line-height:1.5}& .dash b{font-size:11px}& .lval,& .capg b{font-size:12px}& .card,& details.line{margin:4px 4px 16px}& .dash div{box-shadow:0 -3px 0 #1d1b3a,0 3px 0 #1d1b3a,-3px 0 0 #1d1b3a,3px 0 0 #1d1b3a;border-radius:0}& .dash .lim{background:#e8433f!important;color:#fff}& .dash .lim small{color:#fff}'},
 {id:'y',n:'Mixtape Deck',s:'dark',f:'DM Sans',d:'DM Mono',g:['DM+Sans:wght@500;700;800','DM+Mono:wght@500','Kalam:wght@700'],
  bg:'#2b2d33',card:'#e9e3d4',ink:'#222222',mute:'#5f594c',line:'#d3cbb7',soft:'#ddd5c2',acc:'#ffb340',oa:'#222',acc2:'#3a3d44',good:'#1b7a46',bad:'#d6352b',
  hb:'#9fd8b8',hi:'#0d3320',hm:'#2e5a43',ht:'rgba(0,0,0,.08)',hg:'#0d3320',r:'8px',sh:'none',br:'6px',
  x:'& header{box-shadow:inset 0 0 0 3px #7bb898}& h2{color:#f1ede4}& main>.sub,& section>.sub,& section>p.sub,& .tog.mini{color:#c9c4b8}& details.intro>summary,& #t-more>details.fold>summary,& .empty{color:#f1ede4}& nav.bar{background:#1e2024;border-top:0}& nav.bar button{color:#c9c4b8}& .dash .lim{background:#ff5a4e!important;color:#fff}& .dash .lim small{color:#fff}'},
 {id:'z',n:'Group Chat',s:'light',f:'Plus Jakarta Sans',d:'Plus Jakarta Sans',g:['Plus+Jakarta+Sans:wght@400;600;800'],
  bg:'#f2f3f7',card:'#ffffff',ink:'#16181d',mute:'#5f6573',line:'#e3e5ec',soft:'#f4f5f8',acc:'#2b6ef5',oa:'#fff',acc2:'#e6eeff',good:'#17824a',bad:'#c4302a',
  hb:'#ffffff',hi:'#16181d',hm:'#5f6573',ht:'#f2f3f7',hg:'#17824a',r:'18px',sh:'0 2px 10px rgba(0,0,0,.05)',br:'999px',
  x:'& header{border-bottom:1px solid #e3e5ec}& .card{border-radius:18px 18px 18px 6px}& .dash div{border-radius:14px 14px 14px 4px}& .dash .lim{background:#ffe6e3!important}& .dash .lim small{color:#c4302a}'},
 {id:'aa',n:'Floor Plan',s:'light',f:'Figtree',d:'Figtree',g:['Figtree:wght@400;600;800'],
  bg:'#fbf7f0',card:'#ffffff',ink:'#1e2430',mute:'#667085',line:'#e4ddd0',soft:'#f6f1e8',acc:'#16804a',oa:'#fff',acc2:'#e6f5ec',good:'#16804a',bad:'#d6453a',
  hb:'#1e2430',hi:'#fff',hm:'#c9ced8',ht:'rgba(255,255,255,.08)',hg:'#ffcf5a',r:'12px',cb:'1.5px solid #e4ddd0',sh:'none',br:'9px',
  x:'& body{background-image:linear-gradient(rgba(30,36,48,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(30,36,48,.04) 1px,transparent 1px);background-size:24px 24px}& .stage{border:3px solid #1e2430}& .dash .lim{background:#ff5a4e!important}'}
];
const SKIN_LETTER=i=>i<26?String.fromCharCode(65+i):'AA';

function skinCss(k){const Q=`:root[data-skin=${k.id}]`,F=`'${k.f}',system-ui,sans-serif`,D=`'${k.d}','${k.f}',system-ui,sans-serif`;
  let c=`${Q}{color-scheme:${k.s};--bg:${k.bg};--card:${k.card};--ink:${k.ink};--mute:${k.mute};--line:${k.line};--soft:${k.soft};--acc:${k.acc};--on-acc:${k.oa};--acc-2:${k.acc};--acc2:${k.acc2};--good:${k.good};--bad:${k.bad};--warn:${k.warn||'#d98a06'};--sh:${k.sh||'0 1px 2px rgba(0,0,0,.06),0 4px 14px rgba(0,0,0,.06)'}}`+
  `${Q} body{font-family:${F}}`+
  `${Q} .btn,${Q} .chip,${Q} .seg button,${Q} nav.bar button,${Q} .search,${Q} .lk,${Q} .tile,${Q} .fld input,${Q} .jump,${Q} nav.bar .n{font-family:${F}}`+
  `${Q} .num,${Q} #cash,${Q} h2,${Q} h3,${Q} .dash b,${Q} .lval,${Q} .capg b,${Q} .big,${Q} .who b,${Q} details.line>summary .lsum b,${Q} .ihd b,${Q} .stamp,${Q} .bdg,${Q} .ticker .tk,${Q} .fly,${Q} .gauge b,${Q} .sheet h4,${Q} #unlock .u b,${Q} .awn span{font-family:${D}}`+
  `${Q} header{background:${k.hb}!important;background-image:none;color:${k.hi};backdrop-filter:none;-webkit-backdrop-filter:none}`+
  `${Q} .who small,${Q} .dash small,${Q} .goalbar{color:${k.hm}}${Q} #cps{color:${k.hg}}${Q} .dash div{background:${k.ht};color:${k.hi}}${Q} .dash div:not(:last-child)::after{color:${k.hm}}`+
  `${Q} .dash .lim{border-color:${k.bad};background:color-mix(in srgb,${k.bad} 22%,transparent)}${Q} .dash .lim small{color:${k.bad}}`+
  `${Q} .goalbar i{background:color-mix(in srgb,${k.hi} 20%,transparent)}${Q} .goalbar b{background:${k.hi}}`+
  `${Q} .jump{background:${k.hb};color:${k.hi}}`+
  `${Q} .card,${Q} details.line,${Q} .stage,${Q} .mbox,${Q} #welcome .u,${Q} .sheet{border-radius:${k.r};box-shadow:var(--sh)${k.cb?`;border:${k.cb}`:''}}`+
  `${Q} details.line{border-left-width:5px}`+
  `${Q} .btn{border-radius:${k.br||'10px'}}${Q} .btn.pri{background:${k.acc};color:${k.oa};box-shadow:none}`+
  `${Q} nav.bar{background:color-mix(in srgb,${k.card.startsWith('rgba')?k.bg:k.card} 94%,transparent)}`;
  if(k.x)c+=k.x.replace(/&/g,Q);
  return c}

let skinStyle=null;const skinFonts={};
function applySkin(){const id=S.ui.skin||'',r=document.documentElement,k=SKINS.find(x=>x.id===id);
  if(!skinStyle){skinStyle=document.createElement('style');skinStyle.id='skins';skinStyle.textContent=SKINS.map(skinCss).join('\n');document.head.appendChild(skinStyle)}
  if(!k){delete r.dataset.skin}else{r.dataset.skin=k.id;
    if(k.g.length&&!skinFonts[k.id]){skinFonts[k.id]=1;const l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+k.g.join('&family=')+'&display=swap';document.head.appendChild(l)}
    r.classList.toggle('dk',k.s==='dark');const m=document.querySelector('meta[name=theme-color]');if(m)m.content=k.hb.startsWith('#')?k.hb:k.bg}
  document.querySelectorAll('#skinGrid [data-skin]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.skin===(k?k.id:'')));
  const th=$('theme');if(th){th.closest('.tog').style.opacity=k?.45:1}}

/* the look picker lives in More, just above Settings */
(function(){const set=[...document.querySelectorAll('#t-more > details.fold')].find(d=>d.firstElementChild&&d.firstElementChild.textContent==='Settings');if(!set)return;
  const css=document.createElement('style');css.textContent=`#skinGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
#skinGrid button{display:flex;flex-direction:column;align-items:stretch;gap:5px;padding:6px;border-radius:12px;border:2px solid var(--line);background:var(--soft);color:var(--ink);font:600 12px/1.15 system-ui,sans-serif;cursor:pointer;text-align:left;min-height:44px}
#skinGrid button[aria-pressed=true]{border-color:var(--acc);box-shadow:0 0 0 2px color-mix(in srgb,var(--acc) 35%,transparent)}
#skinGrid .sw{height:34px;border-radius:7px;overflow:hidden;display:grid;grid-template-rows:12px 1fr;border:1px solid rgba(0,0,0,.12)}
#skinGrid .sw i{display:block}#skinGrid .sw span{display:flex;align-items:center;gap:4px;padding:0 5px}#skinGrid .sw span u{display:block;height:8px;border-radius:2px;flex:1}#skinGrid .sw span s{display:block;width:16px;height:10px;border-radius:3px}
#skinGrid em{font-style:normal;font-weight:800;color:var(--mute);margin-right:3px}`;document.head.appendChild(css);
  const h=document.createElement('details');h.className='fold';const op=(S.ui.open||{}).Look;h.open=op===undefined?true:op;h.innerHTML='<summary>Look</summary>';
  h.addEventListener('toggle',()=>{S.ui.open=Object.assign({},S.ui.open,{Look:h.open});save()});const card=document.createElement('div');card.className='card';
  const tile=(id,letter,name,bg,hb,card2,acc)=>`<button data-skin="${id}" aria-pressed="false"><div class="sw" aria-hidden="true"><i style="background:${hb}"></i><span style="background:${bg}"><u style="background:${card2}"></u><s style="background:${acc}"></s></span></div><span><em>${letter}</em>${name}</span></button>`;
  card.innerHTML=`<p class="sub" style="margin:0 0 10px">Change how the game looks. Gameplay stays exactly the same. Light and dark under Appearance only apply to Classic.</p><div id="skinGrid">`+
    tile('','','Classic','#f3edf4','linear-gradient(135deg,#4b3f99,#8a5db5)','#fff','#e0583f')+
    SKINS.map((k,i)=>tile(k.id,SKIN_LETTER(i),k.n,k.bg,k.hb,k.card.startsWith('rgba')?k.soft:k.card,k.acc)).join('')+`</div>`;
  h.appendChild(card);set.before(h);
  card.addEventListener('click',e=>{const b=e.target.closest('[data-skin]');if(!b)return;S.ui.skin=b.dataset.skin;applySkin();save();
    if(typeof feel==='function')feel('step');if(typeof forceRender==='function')forceRender()});
})();

/* keep the skin on top whenever the light/dark setting is applied (also after a load or reset) */
const _applyThemeBase=applyTheme;applyTheme=function(){_applyThemeBase();applySkin()};
darkMQ.addEventListener('change',applySkin);
applyTheme();

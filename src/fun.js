/* ===== Parts Counter Idle: fun stuff. Spotter's log, plaques, trivia, career uniform, make-it-yours,
   regulars, seasons, shop radio and the news ticker. None of it changes how much anything earns or costs. ===== */

/* ---------- small shared helpers ---------- */
const storeName=()=>(S.fun&&S.fun.name)||STORE;
const dogName=()=>(S.fun&&S.fun.dog)||'Diesel';
const PAINTS=['#c62828','#1565c0','#2e7d32','#ef6c00','#f4b400','#6a1b9a','#212121','#eceff1'];
const paint=()=>(S.fun&&S.fun.paint)||PAINTS[0];
const rankIdx=()=>Math.max(0,RANKS.filter(r=>S.st.totalL>=r[0]).length-1);
const curBase=()=>LADDER[Math.min(S.top,LADDER.length-1)].base;
const curPart=()=>lc(BASE_NAME[curBase()]);
const curBrand=()=>BI[LADDER[Math.min(S.top,LADDER.length-1)].b].n;
function topBrand(){let b=null,m=-1;for(const k in S.st.br)if(S.st.br[k]>m){m=S.st.br[k];b=k}return b&&BI[b]?BI[b].n:curBrand()}

/* today's weather from the date, the same all day: snow mostly in winter, rain more often in spring */
function weatherToday(){const d=new Date(),seed=(d.getFullYear()*372+d.getMonth()*31+d.getDate())*2654435761%1000/1000,m=d.getMonth();
  if(m===11||m<2)return seed<.4?'snow':seed<.55?'cloud':seed<.65?'rain':'clear';
  if(m===3||m===4)return seed<.4?'rain':seed<.6?'cloud':'clear';
  return seed<.25?'rain':seed<.45?'cloud':'clear'}
/* which holiday decorations are up today, from the real date */
function seasonToday(){const d=new Date(),m=d.getMonth()+1,day=d.getDate();
  if((m===12&&day===31)||(m===1&&day<=2))return 'newyear';
  if(m===12)return 'xmas';if(m===10)return 'fall';if(m===11)return 'thanks';
  if(m===2&&day>=7&&day<=14)return 'valentine';if(m===3&&day>=10&&day<=17)return 'shamrock';
  if((m===6&&day>=28)||(m===7&&day<=6))return 'july';return ''}

/* ---------- spotter's log: trucks that roll past the lot ---------- */
/* weight: how often it shows up (30 common, 10 uncommon, 3 rare, 1 legendary) */
const TRUCKS=[
 ['Freightliner Cascadia',30,'#eceff1'],['Kenworth T680',30,'#1565c0'],['Peterbilt 579',30,'#c62828'],['Volvo VNL 860',30,'#455a64'],['International LT',30,'#e0e0e0'],
 ['Mack Anthem',30,'#212121'],['Freightliner M2 106',30,'#f5f5f5'],['International MV',30,'#ffffff'],['Isuzu NPR',30,'#eceff1'],['Hino L6',30,'#90a4ae'],
 ['Kenworth T880',10,'#f4b400'],['Peterbilt 567',10,'#ef6c00'],['Mack Granite',10,'#d32f2f'],['Western Star 49X',10,'#1b5e20'],['Western Star 57X',10,'#0d47a1'],
 ['Volvo VNR',10,'#607d8b'],['Freightliner 122SD',10,'#37474f'],['International HX',10,'#b71c1c'],['Kenworth W990',10,'#6a1b9a'],['Peterbilt 389',10,'#880e4f'],
 ['Mack Pinnacle',10,'#263238'],['Freightliner eCascadia',10,'#26a69a'],['Volvo VNR Electric',10,'#00897b'],['Autocar ACX',10,'#fbc02d'],
 ['Kenworth W900L',3,'#4a148c'],['Peterbilt 379',3,'#1a237e'],['International 9900i',3,'#3e2723'],['Freightliner Coronado',3,'#bf360c'],['Western Star 4900',3,'#004d40'],
 ['Mack RD688',3,'#f57f17'],['Ford LTL9000',3,'#33691e'],['Volvo VHD',3,'#78909c'],
 ['1974 Peterbilt 359',1,'#b71c1c'],['Mack R-model',1,'#e65100'],['Kenworth K100 cabover',1,'#ffffff'],['GMC Astro 95',1,'#1565c0'],['Mack B-61',1,'#827717'],
 ['International Transtar',1,'#5d4037'],['Freightliner FLD 120',1,'#283593'],['Marmon 57P',1,'#9e9d24'],['Diamond T 921',1,'#2e7d32'],['White Freightliner cabover',1,'#cfd8dc']];
const RAR={30:'Common',10:'Uncommon',3:'Rare',1:'Legendary'};
const TRUCK_W=TRUCKS.reduce((a,t)=>a+t[1],0);
let spotIn=40+Math.random()*60,spotNow=null;
function spotTruck(){let r=Math.random()*TRUCK_W,i=0;for(;i<TRUCKS.length-1;i++){r-=TRUCKS[i][1];if(r<0)break}
  const [n,w,c]=TRUCKS[i],first=!S.fun.spot[i];S.fun.spot[i]=(S.fun.spot[i]||0)+1;spotNow={i,n,c,t:0};
  if(first){note(`Spotted a ${n}. ${RAR[w]}, and new in your spotter's log.`);if(w<=3)feel('step')}}

/* ---------- plaques on the wall ---------- */
const PLAQ=[];
for(const [v,t] of [[100,'100'],[1e4,'10,000'],[1e6,'1 million'],[1e8,'100 million'],[1e10,'10 billion'],[1e12,'1 trillion'],[1e15,'1 quadrillion'],[1e18,'1 quintillion']])
  PLAQ.push(['u'+v,`${t} units sold`,()=>S.st.all>=v]);
for(const l of LINES)PLAQ.push(['d'+l.id,`${l.n}: every part mastered`,()=>(LINE_BASES[l.id]||[]).length>0&&(LINE_BASES[l.id]||[]).every(b=>{const st=BASE_STEPS[b];return L(S.f,st[st.length-1].id)>=BASE_NEED})]);
PLAQ.push(['sv','Opened the service shop',()=>S.sv.open]);
for(const [v,t] of [[100,'100'],[1e4,'10,000'],[1e6,'1 million'],[1e9,'1 billion']])PLAQ.push(['t'+v,`${t} trucks serviced`,()=>S.st.trucks>=v]);
for(const [h,t] of [[1,'1 hour'],[10,'10 hours'],[50,'50 hours'],[100,'100 hours'],[250,'250 hours'],[500,'500 hours'],[1000,'1,000 hours']])PLAQ.push(['h'+h,`${t} behind the counter`,()=>S.st.play>=h*3600]);
for(const [v,t] of [[10,'10'],[100,'100'],[1000,'1,000']])PLAQ.push(['i'+v,`${t} problems handled`,()=>S.st.incidents>=v]);
for(const [v,t] of [[10,'10 truck models'],[25,'25 truck models']])PLAQ.push(['s'+v,`Spotted ${t}`,()=>Object.keys(S.fun.spot).length>=v]);
PLAQ.push(['sAll','Spotted every truck in the log',()=>Object.keys(S.fun.spot).length>=TRUCKS.length]);
PLAQ.push(['leg','Spotted a legendary truck',()=>TRUCKS.some((t,i)=>t[1]===1&&S.fun.spot[i])]);
for(let i=2;i<RANKS.length;i+=3)PLAQ.push(['r'+i,`Promoted to ${RANKS[i][1].toLowerCase()}`,()=>rankIdx()>=i]);
function checkPlaques(quiet){for(const [id,n,ok] of PLAQ)if(!S.fun.pl[id]&&ok()){S.fun.pl[id]=Date.now();if(!quiet){note(`New plaque for the wall: ${n}.`);feel('step')}}}

/* ---------- trivia: one real fact for every part ---------- */
const TRIVIA=[
 [/oil filter/i,'A heavy-truck oil filter can hold more than a gallon of oil, and most diesels change it every 25,000 to 50,000 miles.'],
 [/fuel water separator/i,'Water in diesel is heavier than fuel, so a separator lets it sink into a bowl you drain from the bottom.'],
 [/fuel filter/i,'Modern common-rail injectors run near 30,000 psi. Fuel filters catch dirt too small to see that would wreck them.'],
 [/cabin air/i,'The cabin air filter cleans the air the driver breathes for 10 or more hours a day.'],
 [/air filter|prefilter/i,'A big diesel can pull in enough air every minute to fill a small bedroom, all of it through the air filter.'],
 [/coolant filter/i,'Coolant filters often carry additives that slowly dissolve to protect cylinder liners from pitting.'],
 [/def/i,'DEF is about one-third urea and two-thirds purified water. It freezes at 12°F, so trucks have heaters for it.'],
 [/15w-40|10w-30|5w-40|oil,/i,'In 15W-40, the "W" stands for winter. The first number is how it flows cold, the second how it holds up hot.'],
 [/coolant|antifreeze/i,'Extended-life coolant can last 600,000 miles or more in a heavy truck if it is kept topped up and tested.'],
 [/grease/i,'A tractor-trailer can have 30 or more grease fittings, from kingpins and U-joints to fifth wheel plates.'],
 [/gear oil|transmission oil|transmission fluid/i,'Heavy-truck manual transmissions usually take straight 50-weight synthetic, not regular gear oil.'],
 [/brake fluid/i,'Most big trucks use air brakes, so brake fluid is mainly for medium-duty trucks with hydraulic brakes.'],
 [/refrigerant/i,'R-134a has been the standard truck A/C refrigerant since the mid-1990s, when it replaced R-12.'],
 [/glove|rag|towel/i,'Nitrile gloves replaced latex in most shops because they hold up much better to diesel and brake cleaner.'],
 [/brake cleaner/i,'Brake cleaner evaporates fast and leaves no residue, which is why techs use it on almost everything.'],
 [/penetrating|anti-seize|thread locker/i,'Rust can weld a bolt in place. Penetrating oil creeps into the threads to break that bond.'],
 [/zip tie|tape|loom|heat shrink|connector|solder|wire/i,'Corrosion in wiring is one of the most common causes of electrical problems on trucks, especially in salt states.'],
 [/socket|wrench set|torque wrench/i,'Lug nuts on a typical heavy truck are torqued to around 450 to 500 foot-pounds.'],
 [/impact wrench/i,'A 1-inch drive impact wrench can put out well over 1,500 foot-pounds to break loose rusted wheel nuts.'],
 [/jack|stand/i,'Never work under a truck held up only by a jack. Jack stands rated for the load are the rule in every shop.'],
 [/scan tool|diagnostic/i,'Heavy trucks talk over the J1939 network, and a scan tool reads fault codes from every module on it.'],
 [/multimeter/i,'A truck electrical system runs at 12 volts, but four batteries in parallel can push over 3,000 cold-cranking amps.'],
 [/compressor/i,'A truck air compressor keeps the tanks around 120 psi, and the governor cuts it out when they are full.'],
 [/triangle|flare/i,'Federal rules say a stopped truck needs three warning triangles set out within 10 minutes.'],
 [/fire extinguisher/i,'Commercial trucks are required to carry a fire extinguisher, usually at least a 5 B:C rating.'],
 [/conspicuity/i,'The red-and-white reflective tape on trailers has been required since the 1990s and has prevented many rear-end crashes at night.'],
 [/strap|binder|chain|load lock|cargo bar|e-track/i,'Cargo rules say the total working load limit of your tie-downs has to be at least half the weight of the load.'],
 [/chock/i,'Wheel chocks keep a parked trailer from rolling when it is uncoupled at a dock.'],
 [/eld/i,'Electronic logging devices have been required on most U.S. trucks since 2017 to track hours of service.'],
 [/tire chain/i,'Some mountain passes require trucks to carry chains in winter, even on dry days.'],
 [/headlamp|headlight/i,'LED headlights draw far less power and can last the life of the truck.'],
 [/marker|clearance|cab marker/i,'The three amber lights on a truck cab roof mark it as a vehicle over 80 inches wide.'],
 [/battery/i,'Most heavy trucks carry three or four Group 31 batteries wired together to crank a big diesel.'],
 [/alternator/i,'A heavy-duty alternator can put out 160 to 320 amps to keep up with lights, electronics and sleeper loads.'],
 [/starter/i,'A heavy-truck starter can draw over 1,000 amps while cranking a cold engine.'],
 [/7-way|trailer cord|trailer harness/i,'The 7-way plug carries trailer lights, brakes signals and power. The green pin is usually the right turn signal.'],
 [/abs/i,'ABS has been required on new air-braked tractors since 1997 and on trailers since 1998.'],
 [/backup alarm/i,'Backup alarms beep at around 97 to 112 decibels so people can hear them over a noisy job site.'],
 [/glow plug/i,'Glow plugs heat the cylinders so a diesel can start in the cold, since diesels have no spark plugs.'],
 [/inverter/i,'Drivers use inverters to run microwaves, coffee makers and TVs off the truck batteries.'],
 [/dash camera|backup camera|blind spot/i,'Camera systems help with blind spots that can hide a whole car beside a tractor-trailer.'],
 [/tire pressure|inflator/i,'Underinflated tires are a leading cause of blowouts and cost fuel, so many fleets use tire pressure monitors.'],
 [/control module|instrument cluster/i,'A modern truck can have more than a dozen computer modules talking to each other.'],
 [/brake shoe|brake lining|brake drum/i,'Drum brakes on a loaded truck can reach several hundred degrees on a long downhill grade.'],
 [/rotor|disc brake|caliper/i,'Air disc brakes stop shorter and fade less than drums, and they are showing up on more new trucks every year.'],
 [/spring brake chamber/i,'Spring brakes use a huge spring to hold the truck. Air pressure is what holds them off, so losing air applies them.'],
 [/slack adjuster/i,'Automatic slack adjusters have been required since 1994. They keep the brakes in adjustment as linings wear.'],
 [/air dryer/i,'An air dryer pulls moisture out of compressed air so water does not freeze in the brake lines.'],
 [/valve/i,'An air brake system relies on a network of valves to send air to the right chambers in a fraction of a second.'],
 [/glad hand/i,'Glad hands get their name from looking like two hands shaking when they are coupled.'],
 [/s-cam|cam bushing/i,'In drum brakes, an S-shaped cam rotates to push the shoes against the drum.'],
 [/air tank|drain valve/i,'Air tanks should be drained daily, or water and oil build up and can freeze in winter.'],
 [/wiper/i,'Heavy-truck windshields are big enough that wiper blades are often 22 inches or longer.'],
 [/mirror/i,'Truck mirrors are heated on many models so ice and fog clear without the driver getting out.'],
 [/air ride seat|seat/i,'Air ride seats float on an air bag to soak up bumps over a long day on the road.'],
 [/cb/i,'CB radio channel 19 has long been the trucker channel for road and traffic talk.'],
 [/bunk heater|apu|auxiliary power/i,'Bunk heaters and APUs let drivers stay warm overnight without idling the main engine.'],
 [/windshield/i,'Many truck windshields are two-piece, so only one side has to be replaced after a rock chip.'],
 [/sleeper/i,'Big sleepers can be over 70 inches long with room for a bunk, fridge, microwave and storage.'],
 [/belt/i,'A serpentine belt drives the alternator, water pump, A/C and more. If it breaks, the truck is not going far.'],
 [/radiator|hose|thermostat|water pump|fan|coolant tank|cap|charge air/i,'Cooling problems are one of the top reasons heavy trucks break down on the road.'],
 [/wheel seal|hub|bearing/i,'Wheel-end failures can cause a wheel to come off, so seals and bearings get checked at every inspection.'],
 [/lug nut|stud/i,'Wheel nut indicators, the little arrows on lug nuts, show at a glance if a nut has started to loosen.'],
 [/mud flap/i,'Many states require mud flaps behind the rear wheels to keep rocks and spray off the cars behind.'],
 [/wheel/i,'Aluminum wheels can save over 20 pounds each compared with steel, which adds up to more cargo.'],
 [/kingpin|tie rod|drag link|pitman|steering/i,'Front-end parts wear slowly, so play in the steering often shows up as uneven tire wear first.'],
 [/shock|air spring|leaf spring|torque rod|u-bolt|equalizer|suspension|bushing|height control/i,'Air suspensions keep a smooth ride whether the trailer is empty or loaded to 80,000 pounds.'],
 [/fifth wheel/i,'The fifth wheel is the coupling plate on the tractor. Its name comes from horse-drawn carriages.'],
 [/landing gear/i,'Landing gear legs hold up the front of a parked trailer, and they are cranked down by hand.'],
 [/trailer|roll-up|bulkhead|icc bumper|side skirt/i,'A 53-foot trailer is the most common size in the U.S., with room for 26 standard pallets.'],
 [/tow|winch|snatch block|wheel lift|wrecker|rollback|dollies|hook/i,'Heavy wreckers can lift and tow a fully loaded tractor-trailer.'],
 [/hydraulic|pto|wet kit|cylinder seal|quick coupler|diverter/i,'A PTO takes power from the transmission to run things like dump bodies, cranes and pumps.'],
 [/fuel tank|fuel cap|fuel tank strap|sending unit/i,'Two 150-gallon tanks give many tractors a range of well over 1,500 miles.'],
 [/injector/i,'A diesel injector can fire several times per combustion stroke to make the engine quieter and cleaner.'],
 [/fuel/i,'Diesel fuel lubricates the fuel system itself, which is why low-sulfur fuel needed added lubricity.'],
 [/turbo|vgt/i,'A turbocharger can spin over 100,000 rpm, driven by exhaust gas that would otherwise go to waste.'],
 [/egr/i,'EGR sends some exhaust back into the engine to cool combustion and cut NOx.'],
 [/gasket/i,'A head gasket has to seal combustion pressure, coolant and oil all at the same time.'],
 [/sensor/i,'A heavy truck can have dozens of sensors feeding the engine computer every second.'],
 [/piston|liner|rod|bearing set|crank|cam|valve spring|rocker|cylinder head|flywheel|damper/i,'Heavy diesels are built to run a million miles or more before a major overhaul.'],
 [/engine brake/i,'An engine brake, often called a Jake brake, turns the engine into an air compressor to slow the truck.'],
 [/clutch/i,'Heavy-truck clutches often have two discs to handle the torque of a big diesel.'],
 [/u-joint|driveshaft|yoke|center support/i,'A driveline that is out of phase can shake the whole truck, so U-joints are set up carefully.'],
 [/transmission|shift|synchron|mainshaft|input shaft|range cylinder/i,'Many truck manual transmissions have 10, 13 or 18 speeds, though automated manuals are now the norm.'],
 [/differential|axle/i,'A tandem drive axle has an inter-axle differential so both axles can turn at slightly different speeds.'],
 [/dpf/i,'A diesel particulate filter traps soot and burns it off in a process called regeneration.'],
 [/doc/i,'A diesel oxidation catalyst helps heat up the exhaust so the DPF can burn off soot.'],
 [/scr|nox/i,'SCR uses DEF to turn NOx into nitrogen and water vapor, cutting NOx by around 90 percent.'],
 [/kit/i,'Kits bundle every part a job needs, so the truck is not stuck in the bay waiting on one missing piece.'],
 [/bumper|hood|fender|fairing|door|tool box|deck plate|sleeper extender/i,'Fairings and skirts can improve a tractor-trailer\'s fuel economy by several percent at highway speed.'],
 [/chrome|stack|visor|light bar|horn|grille|ornament/i,'Chrome and lights are a big part of truck culture, and show trucks can have hundreds of extra lights.'],
 [/muffler|exhaust/i,'Exhaust stacks route hot gas up and away from the cab and anyone standing near the truck.'],
 [/retread/i,'Retreading lets a tire casing be reused several times, and most truck tires on the road have been retreaded.'],
 [/tire/i,'A steer tire on a heavy truck carries more than 6,000 pounds, and a blowout up front is the most dangerous kind.']];
const LINE_FACT={f:'Filters and fluids are the most sold parts at almost every truck parts counter.',s:'Shop supplies get used up on every job, so they never stop selling.',to:'A well-equipped heavy-truck tech can own over $50,000 in tools.',
 sf:'DOT roadside inspections check lights, brakes, tires and paperwork.',l:'Lighting problems are among the most common roadside inspection violations.',el:'Trucks today carry more computing power than early spacecraft.',
 b:'Air brakes were invented by George Westinghouse in the 1860s, first for trains.',c:'For many drivers, the cab is a home away from home for weeks at a time.',k:'A heavy diesel makes enough heat to warm several houses.',
 w:'A tractor-trailer has 18 wheels, which is where the name "18-wheeler" comes from.',tr:'There are several trailers on the road for every tractor in the U.S.',tw:'Heavy towing operators train for years to recover overturned trucks safely.',
 hy:'Hydraulics let a small pump lift many tons by pushing fluid that can\'t be squeezed.',fu:'A heavy truck can burn over 20,000 gallons of diesel in a year.',e:'Heavy-duty diesel engines commonly make 1,650 to 2,050 foot-pounds of torque.',
 d:'The drivetrain carries all that torque from the engine to the drive tires.',a:'Today\'s diesels emit a tiny fraction of the soot and NOx of trucks from the 1990s.',kt:'Kits save techs trips to the parts counter in the middle of a job.',
 bd:'Aerodynamic bodywork became a big focus as fuel prices climbed.',x:'The look of a big rig is a matter of pride for many owner-operators.',t:'A set of new tires for a tractor-trailer can cost thousands of dollars.',
 md:'Medium-duty trucks do much of the local delivery work in towns and cities.',vo:'Vocational trucks are built for one job, like dumping, mixing or plowing.',bu:'School buses are among the safest vehicles on the road.',
 ag:'Farm and construction equipment often runs the same diesel engines as trucks.',rv:'Big diesel motorhomes, called diesel pushers, put the engine in the back.',rf:'Refrigerated trailers can hold temperatures well below zero for frozen loads.',
 h:'An in-frame overhaul rebuilds an engine while it stays in the truck.',ut:'Used trucks are how many owner-operators get started.',nt:'A new Class 8 tractor can cost well over $150,000.',ev:'Electric trucks use regenerative braking to put energy back into the batteries.'};
function triviaFor(b){const n=BASE_NAME[b]||'',hit=TRIVIA.find(([re])=>re.test(n));if(hit)return hit[1];const l=BASE_STEPS[b]&&BASE_STEPS[b][0].line;return LINE_FACT[l]||''}

/* ---------- career uniform: your character dresses up as you get promoted ---------- */
function uniform(){const r=rankIdx();
  if(r<2)return {body:'#c8371d',hat:'#1b1d20'};if(r<4)return {body:'#1565c0',hat:'#0d47a1'};
  if(r<6)return {body:'#eceff1',hat:'#4e342e',tie:'#1565c0'};if(r<9)return {body:'#455a64',hat:'#3e2723',tie:'#c62828'};
  if(r<12)return {body:'#1a237e',hat:'#3e2723',tie:'#f4b400'};return {body:'#111111',hat:'#9e9e9e',tie:'#d4af37'}}

/* ---------- regulars who stop by and talk ---------- */
const REGS=[
 {n:'Big Mike',who:'runs a towing outfit',body:'#37474f',hat:'#ff6f00',lines:['Got three wrecks on the hook this week. Keep that shelf full.','My winch line snapped again. Story of my life.','You ever tow a cement mixer? Don\'t.']},
 {n:'Dolores',who:'manages a delivery fleet',body:'#6a1b9a',hat:'#4a148c',lines:['I\'ve got 40 trucks and every one of them wants filters today.','My drivers say you\'re the only counter that picks up the phone.','Put it on the fleet account, hon.']},
 {n:'Ray',who:'owner-operator',body:'#795548',hat:'#212121',lines:['Just did 3,000 miles in five days. Coffee first, then parts.','My truck\'s older than you and runs better than most.','Fuel prices are robbing me blind.']},
 {n:'Gus',who:'old-timer mechanic',body:'#5d4037',hat:'#9e9e9e',lines:['Back in my day we fixed it with a hammer and a prayer.','Kids today plug a laptop into a truck. Unbelievable.','I\'ve been coming to this counter since before it had a computer.']},
 {n:'Tammy',who:'dispatcher',body:'#00838f',hat:'#004d40',lines:['I need a truck back on the road by 3. No pressure.','Every driver I have is calling me at once.','Tell me you\'ve got it in stock. Please.']},
 {n:'Hank',who:'farmer',body:'#2e7d32',hat:'#f9a825',lines:['Harvest is coming and the grain truck is acting up.','Rain\'s holding off, so I\'m in a hurry.','Same part as last year. You know the one.']},
 {n:'Priya',who:'fleet maintenance manager',body:'#283593',hat:'#1a237e',lines:['I track every part by the mile. Don\'t sell me junk.','Our PM schedule runs like clockwork, mostly.','Downtime costs me more than any part ever will.']},
 {n:'Earl',who:'runs the school bus garage',body:'#f9a825',hat:'#3e2723',lines:['Fifty buses and a summer to fix them all.','If a bus doesn\'t start, 60 kids are late. No pressure.','The kids broke another window latch.']},
 {n:'Rosa',who:'owns a dump truck outfit',body:'#bf360c',hat:'#212121',lines:['Gravel season is the best season.','My trucks eat tires like candy.','Hydraulic hose blew on the job site. Again.']},
 {n:'Walt',who:'retired, drives a motorhome',body:'#90a4ae',hat:'#eceff1',lines:['The wife and I are heading to Arizona for the winter.','This motorhome has a diesel in the back. Loud but reliable.','I don\'t need anything. Just came to chat.']}];
function regLine(r){const opts=[...r.lines,
  `Finally got ${curPart()}s in, huh? About time.`,`${curBrand()}? My cousin swears by those.`,`Heard you made ${rankOf(S.st.totalL).toLowerCase()}. Don't forget us little guys.`,
  `Where's ${dogName()}? I brought a treat.`,`Nobody beats ${storeName()} on ${curPart()}s.`,
  ...({snow:['This snow is killing my schedule.','Plows are out. Business is booming.'],rain:['Wipers are going to sell out in this rain.','Rain all day. Perfect parts counter weather.'],
     cloud:['Gray out there today.'],clear:['Nice day to be on the road.']}[weatherToday()]),
  ...({xmas:['Merry Christmas. Got any stocking stuffers for a trucker?'],thanks:['Smoking a turkey this year. Need a new thermometer, ha.'],fall:['Pumpkin spice everything. Even the coffee here.'],
     july:['Happy Fourth! Don\'t set the shop on fire.'],newyear:['Happy New Year. Same truck, new problems.'],valentine:['Bought my wife a new air freshener for the truck. Romantic, right?'],shamrock:['I\'m wearing green, don\'t pinch me.']}[seasonToday()]||[])];
  return pick(opts)}
let regIn=70+Math.random()*60,regNow=null;
function regVisit(){const r=pick(REGS),line=regLine(r);regNow={r,line};if(!(S.ui.anim&&!matchMedia('(prefers-reduced-motion: reduce)').matches))note(`${r.n}: "${line}"`)}

/* ---------- seasons: decorations drawn into the store picture ---------- */
function drawSeason(cx,W,H,floorY,ph,x0,mv){const s=seasonToday();if(!s)return;const y0=4;
  if(s==='xmas'){cx.strokeStyle='#2e7d32';cx.lineWidth=1.5;cx.beginPath();for(let x=x0;x<=W;x+=4)cx.lineTo(x,y0+6+Math.sin(x*.12)*3);cx.stroke();
    const C=['#ff5252','#ffd740','#69f0ae','#40c4ff'];for(let i=0,x=x0+6;x<W;x+=14,i++){const on=mv?((ph*2+i)|0)%4!==0:true;cx.fillStyle=on?C[i%4]:'#555';cx.beginPath();cx.arc(x,y0+9+Math.sin(x*.12)*3,2.2,0,7);cx.fill()}
    const wx=W-24,wy=floorY-104;if(wy>20){cx.strokeStyle='#1b5e20';cx.lineWidth=4;cx.beginPath();cx.arc(wx,wy,8,0,7);cx.stroke();cx.fillStyle='#d32f2f';cx.fillRect(wx-3,wy+6,6,4)}}
  else if(s==='newyear'){cx.fillStyle='#1a237e';cx.fillRect(x0+10,y0,Math.min(150,W-x0-20),14);cx.fillStyle='#ffd740';cx.font='700 10px "Barlow Condensed",sans-serif';cx.textAlign='center';cx.fillText('HAPPY NEW YEAR',x0+10+Math.min(150,W-x0-20)/2,y0+11);
    if(mv)for(let i=0;i<10;i++){cx.fillStyle=['#ff5252','#ffd740','#40c4ff','#69f0ae'][i%4];cx.fillRect(x0+((i*53+ph*20)%(W-x0)),(i*37+ph*30)%floorY,2,3)}}
  else if(s==='july'||s==='valentine'||s==='shamrock'||s==='thanks'){
    const C={july:['#d32f2f','#ffffff','#1565c0'],valentine:['#e91e63','#f8bbd0','#d81b60'],shamrock:['#2e7d32','#66bb6a','#1b5e20'],thanks:['#e65100','#f9a825','#8d6e63','#bf360c']}[s];
    cx.strokeStyle='#5d4037';cx.lineWidth=1;cx.beginPath();cx.moveTo(x0,y0+2);cx.lineTo(W,y0+2);cx.stroke();
    for(let i=0,x=x0+2;x<W-8;x+=12,i++){cx.fillStyle=C[i%C.length];
      if(s==='thanks'){cx.beginPath();cx.ellipse(x+5,y0+8,4,6,(i%2?.5:-.5),0,7);cx.fill()}
      else if(s==='valentine'){cx.beginPath();cx.arc(x+3,y0+6,2.5,0,7);cx.arc(x+7,y0+6,2.5,0,7);cx.fill();cx.beginPath();cx.moveTo(x+.5,y0+7);cx.lineTo(x+5,y0+12);cx.lineTo(x+9.5,y0+7);cx.fill()}
      else if(s==='shamrock'){for(const [a,b] of [[3,5],[7,5],[5,2]]){cx.beginPath();cx.arc(x+a,y0+b+2,2.4,0,7);cx.fill()}}
      else{cx.beginPath();cx.moveTo(x,y0+2);cx.lineTo(x+10,y0+2);cx.lineTo(x+5,y0+11);cx.fill()}}}
  else if(s==='fall'){for(let i=0;i<3;i++){const px=x0+8+i*16,py=H-8;cx.fillStyle='#ef6c00';cx.beginPath();cx.ellipse(px,py,7-i,5-i*.5,0,0,7);cx.fill();cx.fillStyle='#33691e';cx.fillRect(px-1,py-7+i*.5,2,3)}
    cx.fillStyle='#bf360c';for(let i=0,x=x0+2;x<W-8;x+=16,i++){cx.beginPath();cx.ellipse(x+5,y0+6,4,6,(i%2?.6:-.6),0,7);cx.fill()}}}

/* ---------- shop radio: a soft generated loop, only while the game is open ---------- */
const RADIO={on:false,next:0,step:0,bar:0,prog:0,timer:null,gain:null};
const PROGS=[[[0,4,7,11],[9,12,16,19],[5,9,12,16],[7,11,14,17]],[[2,5,9,12],[7,11,14,17],[0,4,7,11],[0,4,7,11]],[[9,12,16,19],[5,9,12,16],[0,4,7,11],[7,11,14,17]],[[5,9,12,16],[4,7,11,14],[2,5,9,12],[7,11,14,17]]];
const midi=n=>440*2**((n-69)/12);
function radioTick(){const a=ac();if(!a||!RADIO.on||document.hidden)return;const spb=60/78/2;
  while(RADIO.next<a.currentTime+.4){const t=RADIO.next,s=RADIO.step%16,ch=PROGS[RADIO.prog][RADIO.bar%4],root=48;
    if(s===0){for(const n of ch)rTone(a,midi(root+12+n),t,spb*15,'triangle',.018);rTone(a,midi(root-12+ch[0]),t,spb*7,'sine',.06)}
    if(s===8)rTone(a,midi(root-12+ch[0]+(Math.random()<.5?7:0)),t,spb*7,'sine',.05);
    if(s%4===0)rKick(a,t);if(s%2===1)rHat(a,t,.012);if(s===4||s===12)rHat(a,t,.03,true);
    if(Math.random()<.22&&s%2===0){const n=ch[(Math.random()*4)|0]+24+(Math.random()<.3?12:0);rTone(a,midi(root+n),t,spb*2,'sine',.022)}
    RADIO.next+=spb;RADIO.step++;if(RADIO.step%16===0){RADIO.bar++;if(RADIO.bar%16===0)RADIO.prog=(RADIO.prog+1+((Math.random()*(PROGS.length-1))|0))%PROGS.length}}}
function rOut(a){if(!RADIO.gain){RADIO.gain=a.createGain();RADIO.gain.gain.value=.8;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=2600;RADIO.gain.connect(f).connect(a.destination)}return RADIO.gain}
function rTone(a,f,t,d,type,vol){const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(rOut(a));o.start(t);o.stop(t+d+.05)}
function rKick(a,t){const o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(40,t+.15);g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.0001,t+.25);o.connect(g).connect(rOut(a));o.start(t);o.stop(t+.3)}
function rHat(a,t,vol,snare){const d=snare?.12:.03,n=Math.floor(a.sampleRate*d),buf=a.createBuffer(1,n,a.sampleRate),c=buf.getChannelData(0);for(let i=0;i<n;i++)c[i]=(Math.random()*2-1)*(1-i/n)**2;
  const src=a.createBufferSource(),g=a.createGain(),f=a.createBiquadFilter();f.type=snare?'bandpass':'highpass';f.frequency.value=snare?1800:7000;src.buffer=buf;g.gain.value=vol;src.connect(f).connect(g).connect(rOut(a));src.start(t)}
function radioSet(on){RADIO.on=on;if(on){const a=ac();if(!a)return;RADIO.next=a.currentTime+.1;if(!RADIO.timer)RADIO.timer=setInterval(radioTick,100)}else if(RADIO.timer){clearInterval(RADIO.timer);RADIO.timer=null}}

/* ---------- news ticker ---------- */
function headline(){const p=curPart(),br=curBrand(),tb=topBrand(),st=storeName(),dg=dogName(),rk=rankOf(S.st.totalL).toLowerCase(),w=weatherToday();
  const H=[`Local ${rk} spotted restocking ${p}s at record speed`,`${br} says demand for ${p}s is "through the roof"`,`${tb} reports its best quarter ever, thanks mostly to one parts counter`,
   `${dg}, the ${st} shop dog, named employee of the month again`,`Study finds 9 out of 10 truckers want their parts "yesterday"`,`Man asks for blinker fluid; counter staff remain calm`,
   `Fleet manager "just looking," buys $40,000 in filters`,`Coffee pot at ${st} running on its third refill before 7 a.m.`,`Driver swears the noise "only happens when the mechanic isn't around"`,
   `Experts agree: if it's not leaking, it's probably out of oil`,`Owner-operator celebrates a million miles; truck reportedly unimpressed`,`Parts catalog now thicker than most phone books ever were`,
   `Local tech finds 10mm socket after six-year search`,`Survey: "It was making a noise" remains the most common problem description`,`Grease monkey union demands better hand cleaner`,
   `Dispatcher promises load "should be ready by now"`,`Area truck stop runs out of beef jerky; drivers in mourning`,`Breaking: someone actually read the owner's manual`,
   `Tire prices up, tread depth down, everyone confused`,`Diesel tech's hands declared permanently black`,`${st} customers report "short wait, long story"`,
   `Weather service: ${({snow:'snow means chains, chains mean sales',rain:'rain means wiper season is here',cloud:'gray skies, no excuse to skip the PM',clear:'clear roads and plenty of trucks out'})[w]}`,
   `Mechanic tightens bolt "just one more turn"; bolt disagrees`,`Local man insists his 1987 cabover "just needs a little work"`,`New study: trucks know when you're about to go on vacation`,
   `Parts counter phone rings 400 times; staff answer 399`,`Truck washes up spotless, immediately drives through mud`,`Owner-operator names truck "Betsy," refuses to explain`,
   `${p}s now officially the hottest item in the county`,`Industry analysts baffled by how one store sells so many ${p}s`];
  const s=seasonToday();if(s)H.push(({xmas:'Santa reportedly upgrading the sleigh to air disc brakes',thanks:'Truckers give thanks for open roads and hot coffee',fall:'Leaf-peepers jam scenic routes; drivers less than thrilled',
   july:'Fireworks stands report record sales to truck drivers',newyear:'Resolution season: drivers vow to finally fix that air leak',valentine:'Local trucker buys his rig a new air freshener for Valentine\'s Day',shamrock:'Green trucks get extra luck this week, experts claim'})[s]);
  return pick(H)}
function nextHeadline(){const el=$('tickTxt');if(el)el.textContent=headline()}

/* ---------- More tab cards ---------- */
function renderFun(){if(!$('spotSum'))return;const got=Object.keys(S.fun.spot).length;
  $('spotSum').innerHTML=`<b class="num">${got}</b> of ${TRUCKS.length} trucks spotted`;$('spotM').style.width=got/TRUCKS.length*100+'%';
  setHTML('spotList',TRUCKS.map((t,i)=>{const n=S.fun.spot[i];return `<div class="spot ${n?'':'no'}"><i style="background:${n?t[2]:'transparent'}"></i><b>${n?esc(t[0]):'???'}</b><small>${RAR[t[1]]}${n>1?` · seen ${fmt(n)}×`:''}</small></div>`}).join(''));
  const pl=PLAQ.filter(p=>S.fun.pl[p[0]]).sort((a,b)=>S.fun.pl[b[0]]-S.fun.pl[a[0]]);
  $('plaqSum').innerHTML=`<b class="num">${pl.length}</b> of ${PLAQ.length} plaques on the wall`;$('plaqM').style.width=pl.length/PLAQ.length*100+'%';
  setHTML('plaqList',pl.length?pl.map(([id,n])=>`<div class="plaq"><b>${esc(n)}</b><small>${new Date(S.fun.pl[id]).toLocaleDateString()}</small></div>`).join(''):'<div class="empty">Your first plaque comes at 100 units sold.</div>');
  const ae=document.activeElement;if(ae!==$('fName'))$('fName').value=S.fun.name||'';if(ae!==$('fDog'))$('fDog').value=S.fun.dog||'';$('fName').placeholder=STORE;
  setHTML('fPaint',PAINTS.map(c=>`<button class="sw ${paint()===c?'on':''}" data-paint="${c}" style="background:${c}" aria-label="Paint color"></button>`).join(''));
  $('sRadio').checked=!!S.ui.radio}

/* ---------- wiring ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('[data-paint]');if(b){S.fun.paint=b.dataset.paint;save();renderFun()}});
document.addEventListener('input',e=>{const t=e.target;if(t.id==='fName'){S.fun.name=t.value.slice(0,28).trim();save()}if(t.id==='fDog'){S.fun.dog=t.value.slice(0,16).trim();save()}});
document.addEventListener('change',e=>{if(e.target.id==='sRadio'){S.ui.radio=e.target.checked;radioSet(S.ui.radio);save()}},true);
/* audio can only start after a tap, so the radio waits for the first one */
document.addEventListener('pointerdown',()=>{if(S.ui.radio&&!RADIO.on)radioSet(true)},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&RADIO.on){const a=ac();if(a)RADIO.next=a.currentTime+.1}});
checkPlaques(true);
document.body.classList.toggle('noanim',!S.ui.anim);
let funT=0;setInterval(()=>{document.body.classList.toggle('noanim',!S.ui.anim);if(document.hidden)return;funT++;
  if((spotIn-=1)<=0){spotTruck();spotIn=60+Math.random()*120}
  if((regIn-=1)<=0){regVisit();regIn=90+Math.random()*120}
  if(funT%5===0)checkPlaques(false);
  if(funT%2===0&&typeof tab!=='undefined'&&tab==='more')renderFun()},1000);
{const el=$('tickTxt');if(el){nextHeadline();el.addEventListener('animationiteration',nextHeadline);setInterval(()=>{if(!S.ui.anim)nextHeadline()},9000)}}

/* ---------- photo album: the game takes a picture of your store at each milestone ---------- */
const ALBUM_KEY='parts-counter-album';
const albumGet=()=>{try{return JSON.parse(localStorage.getItem(ALBUM_KEY)||'[]')}catch(e){return []}};
function snap(caption){try{const src=$('scene');if(!src||!src.width)return;const w=360,h=Math.round(w*src.height/src.width),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(src,0,0,w,h);
  const a=albumGet();a.push({t:Date.now(),c:caption,img:c.toDataURL('image/jpeg',.72)});while(a.length>40)a.splice(1,1);localStorage.setItem(ALBUM_KEY,JSON.stringify(a))}catch(e){}}
/* take the first photo on day one, then one at each unlock and plaque */
setTimeout(()=>{if(!albumGet().length)snap('Opening day at '+storeName())},4000);
if(typeof celebrate==='function'){const _cel=celebrate;celebrate=function(...a){_cel.apply(this,a);setTimeout(()=>snap('Started carrying '+lc(BASE_NAME[a[0]&&a[0].base]||'a new part')),1200)}}

/* ---------- postcards: finishing a department mails you a little piece of the dealership's story ---------- */
const POST_T=[
 (d,i)=>`Fremont, ${1971+i*2}. When we opened, ${d} was one dusty shelf by the door. Now it has its own aisle, and the regulars know it by heart.`,
 (d)=>`Dear ${storeName()}, my truck broke down two states away and the only shop with the part was yours. Thanks for keeping ${d} stocked. — A grateful driver`,
 (d)=>`Overheard at the counter: "If ${storeName()} doesn't have it, it doesn't exist." ${dogName()} wagged in agreement. ${d} is officially complete.`,
 (d,i)=>`The old parts manager kept a handwritten ${d} catalog in a coffee can. We found it in ${1980+i} and framed it above the register.`,
 (d)=>`Every brand, every fitment, every part in ${d}. The sales reps took a group photo in the aisle. Somebody's thumb is in it.`,
 (d)=>`A fleet manager drove four hours just to see the ${d} wall in person. She bought one part and took twelve pictures.`];
function postcardFor(id){const i=LINES.findIndex(l=>l.id===id),l=LINES[i];return {l,txt:POST_T[i%POST_T.length](l.n,i)}}
function showPostcard(id){const {l,txt}=postcardFor(id);let el=$('postcard');if(!el){el=document.createElement('div');el.id='postcard';document.body.appendChild(el)}
  el.innerHTML=`<div class="pc" style="--lc:${l.c}"><div class="pcart">${deptArt(l.c,l.id.charCodeAt(0))}<span class="stampbox">${esc(l.n.split(' ')[0])}</span></div><h3>${esc(l.n)}</h3><p>${esc(txt)}</p><button class="btn pri">Keep it</button></div>`;
  el.hidden=false;el.querySelector('button').onclick=()=>{el.hidden=true}}
{const _cp=checkPlaques;checkPlaques=function(quiet){const before=new Set(Object.keys(S.fun.pl));_cp(quiet);if(quiet)return;for(const id of Object.keys(S.fun.pl))if(!before.has(id)){snap('New plaque: '+((PLAQ.find(p=>p[0]===id)||[])[1]||'milestone'));if(id[0]==='d'&&LINES.some(l=>'d'+l.id===id))setTimeout(()=>showPostcard(id.slice(1)),800)}}}
function renderAlbum(){if(!$('albumList'))return;const a=albumGet();$('albumSum').textContent=a.length?`${a.length} photo${a.length>1?'s':''} of your store`:'Your first photo is taken a few seconds after you start playing.';
  const sig=a.length+':'+(a.length?a[a.length-1].t:0);if($('albumList').dataset.sig===sig)return;$('albumList').dataset.sig=sig;
  $('albumList').innerHTML=a.slice().reverse().map((p,i)=>`<figure class="ph" data-ph="${a.length-1-i}"><img src="${p.img}" alt="${esc(p.c)}"><figcaption>${esc(p.c)}<small>${new Date(p.t).toLocaleDateString()}</small></figcaption></figure>`).join('');
  const cards=LINES.filter(l=>S.fun.pl['d'+l.id]);$('postSum').textContent=cards.length?`${cards.length} of ${LINES.length} postcards`:'Finish every part in a department to get its postcard.';
  $('postList').innerHTML=cards.map(l=>`<button class="pcmini" data-post="${l.id}" style="--lc:${l.c}">${deptArt(l.c,l.id.charCodeAt(0))}<b>${esc(l.n)}</b></button>`).join('')}
document.addEventListener('click',e=>{const p=e.target.closest('[data-post]');if(p){showPostcard(p.dataset.post);return}
  const f=e.target.closest('[data-ph]');if(f){const a=albumGet()[+f.dataset.ph];if(!a)return;let el=$('postcard');if(!el){el=document.createElement('div');el.id='postcard';document.body.appendChild(el)}
    el.innerHTML=`<div class="pc photo"><img src="${a.img}" alt=""><p>${esc(a.c)} · ${new Date(a.t).toLocaleDateString()}</p><button class="btn pri">Close</button></div>`;el.hidden=false;el.querySelector('button').onclick=()=>{el.hidden=true}}});
setInterval(()=>{if(!document.hidden&&typeof tab!=='undefined'&&tab==='more')renderAlbum()},1500);

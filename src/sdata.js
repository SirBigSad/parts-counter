/* ===== Parts Counter: the service side =====
   A shop next to the parts counter. Jobs climb like parts do: each job runs through
   service levels, and each level through the trucks or engines it applies to.
   Own 10 of a job step to unlock the next; finish a job with 25 of its last step. */

const SV_LV={wi:['Walk-in','V'],ap:['Appointment','O'],mo:['Mobile','O'],rc:['Road call','O'],wa:['Warranty','P'],ex:['Extended plan','P'],fc:['Fleet contract','P']};
const SV_LINES=[
 ['pm','Preventive maintenance','#2f6fb0','wi ap fc'],['in','Inspections','#6d7a86','wi ap fc'],['ti','Tires & wheels','#37474f','wi ap fc'],
 ['br','Brakes','#c62828','wi ap fc'],['el','Electrical','#c79100','wi ap fc'],['co','Cooling & A/C','#00897b','wi ap fc'],
 ['dg','Diagnostics','#3949ab','ap wa fc'],['su','Suspension & steering','#546e7a','wi ap fc'],['tr','Trailer service','#8d6e63','wi ap fc'],
 ['rd','Road service','#f9a825','rc mo fc'],['up','Upfits & installs','#78909c','wi ap fc'],['af','Aftertreatment','#43a047','ap wa fc'],
 ['dt','Drivetrain','#5e35b1','ap wa fc'],['en','Engine repair','#d84315','ap wa fc'],['bd','Body & collision','#607d8b','wi ap fc'],
 ['md','Medium duty service','#7cb342','wi ap fc'],['fl','Fleet programs','#455a64','ap fc ex'],['hv','Heavy repair','#ad1457','ap wa ex fc'],
 ['vb2','Bus, vocational & equipment','#fb8c00','wi ap fc'],['ev','Electric truck service','#1e88e5','ap wa ex fc']].map(([id,n,c,lv],i)=>({id,n,c,lv:lv.split(' '),i}));
const SLI={};SV_LINES.forEach(l=>SLI[l.id]=l);
const SV_JOBS=[
 ['oil','Oil change','pm','ENG'],['lube','Chassis lube','pm','MOD'],['ffs','Fuel filter service','pm','ENG'],['afs','Air filter service','pm','MOD'],['cfl','Coolant flush','pm','ENG'],
 ['tfs','Transmission fluid service','pm','TRN'],['dfs','Differential fluid service','pm','MOD'],['pma','PM-A service','pm','MOD'],['pmb','PM-B service','pm','MOD'],['pmc','PM-C service','pm','MOD'],
 ['dot','DOT annual inspection','in','MOD'],['brki','Brake inspection','in','MOD'],['tdot','Trailer DOT inspection','in',0],['rfi','Reefer inspection','in',0],['emis','Emissions test','in','ENG'],
 ['ppi','Pre-purchase inspection','in','MOD'],['tank','Tank inspection','in',0],
 ['tmb','Tire mount and balance','ti','TIRE'],['flat','Flat repair','ti','TIRE'],['trot','Tire rotation','ti','MOD'],['aln','Alignment','ti','MOD'],['tral','Trailer alignment','ti',0],
 ['wsr','Wheel seal replacement','ti','MOD'],['hubs','Hub service','ti','MOD'],['rim','Wheel replacement','ti',0],
 ['badj','Brake adjustment','br','MOD'],['bshoe','Brake shoe replacement','br','MOD'],['bdrum','Brake drum replacement','br','MOD'],['disc','Disc brake service','br','MOD'],
 ['air','Air leak repair','br','MOD'],['dry','Air dryer service','br','MOD'],['cham','Brake chamber replacement','br','MOD'],['comp','Air compressor replacement','br','ENG'],
 ['batt','Battery replacement','el','MOD'],['chg','Charging system test','el','ENG'],['str','Starter replacement','el','ENG'],['alt','Alternator replacement','el','ENG'],
 ['lite','Lighting repair','el','MOD'],['wire','Wiring repair','el','MOD'],['tlr','Trailer light repair','el',0],
 ['therm','Thermostat replacement','co','ENG'],['wp','Water pump replacement','co','ENG'],['rad','Radiator replacement','co','MOD'],['fan','Fan clutch replacement','co','ENG'],
 ['acr','A/C recharge','co','MOD'],['acc','A/C compressor replacement','co','MOD'],['hcr','Heater core replacement','co','MOD'],
 ['cel','Check engine diagnosis','dg','ENG'],['eldg','Electrical diagnosis','dg','MOD'],['absd','ABS diagnosis','dg','MOD'],['atd','Aftertreatment diagnosis','dg','ENG'],
 ['trd','Transmission diagnosis','dg','TRN'],['swu','Software update','dg','ENG'],['ecm','ECM programming','dg','ENG'],
 ['shk','Shock replacement','su','MOD'],['asp','Air spring replacement','su','MOD'],['kp','Kingpin job','su','MOD'],['trod','Tie rod replacement','su','MOD'],
 ['sg','Steering gear replacement','su','MOD'],['leaf','Leaf spring replacement','su','MOD'],['fw','Fifth wheel service','su',0],['trq','Torque rod replacement','su','MOD'],
 ['tpm','Trailer PM','tr',0],['tshop','Trailer shop rebuild','tr',0],['tbj','Trailer brake job','tr',0],['tdr','Trailer door repair','tr',0],['tfl','Trailer floor repair','tr',0],['tlg','Landing gear replacement','tr',0],
 ['tsus','Trailer suspension rebuild','tr',0],['troof','Trailer roof repair','tr',0],['rfs','Reefer unit service','tr',0],
 ['jump','Jump start','rd',0],['trc','Tire road call','rd',0],['fuel','Fuel delivery','rd',0],['lock','Lockout service','rd',0],['ltow','Light-duty tow','rd',0],
 ['msc','Mobile service call','rd','MOD'],['htow','Heavy tow','rd',0],['wout','Winch-out','rd',0],['roll','Rollover recovery','rd',0],
 ['lbi','Light bar install','up',0],['bhi','Bunk heater install','up','MOD'],['apui','APU install','up','MOD'],['cami','Camera system install','up','MOD'],['eldi','ELD install','up','MOD'],
 ['lgi','Liftgate install','up',0],['wki','Wet kit install','up','MOD'],['ptoi','PTO install','up','TRN'],['chr','Chrome package install','up','MOD'],
 ['regen','Forced regen','af','ENG'],['dpfc','DPF cleaning','af','ENG'],['noxr','NOx sensor replacement','af','ENG'],['defp','DEF pump replacement','af','ENG'],['egrc','EGR valve cleaning','af','ENG'],
 ['docr','DOC replacement','af','ENG'],['dpfr','DPF replacement','af','ENG'],['scrr','SCR replacement','af','ENG'],
 ['cadj','Clutch adjustment','dt','TRN'],['ujr','U-joint replacement','dt','MOD'],['slr','Shift linkage repair','dt','TRN'],['clu','Clutch replacement','dt','TRN'],
 ['dsr','Driveshaft replacement','dt','MOD'],['trr','Transmission R&R','dt','TRN'],['drb','Differential rebuild','dt','MOD'],
 ['ovh','Overhead adjustment','en','ENG'],['leak','Oil leak repair','en','ENG'],['fs','Front seal replacement','en','ENG'],['inj','Injector replacement','en','ENG'],['oc','Oil cooler replacement','en','ENG'],
 ['turbo','Turbo replacement','en','ENG'],['egr','EGR cooler replacement','en','ENG'],['ebr','Engine brake repair','en','ENG'],['rms','Rear main seal replacement','en','ENG'],['hg','Head gasket job','en','ENG'],
 ['touch','Paint touch-up','bd','MOD'],['mir','Mirror replacement','bd','MOD'],['ws','Windshield replacement','bd','MOD'],['fen','Fender repair','bd','MOD'],['door','Door repair','bd','MOD'],
 ['bmp','Bumper replacement','bd','MOD'],['hood','Hood replacement','bd','MOD'],['coll','Collision repair','bd','MOD'],['paint','Full repaint','bd','MOD'],
 ['mdo','Medium duty oil change','md','MD'],['mdp','Medium duty PM','md','MD'],['mdb','Medium duty brake job','md','MD'],['mda','Medium duty A/C service','md','MD'],
 ['lgr','Liftgate repair','md',0],['boxr','Box body repair','md',0],
 ['yard','Fleet yard day','fl',0],['muni','Municipal fleet service','fl',0],['rent','Rental fleet service','fl','MOD'],['fpm','Fleet PM contract','fl','MOD'],['rec','Recall campaign','fl','ENG'],
 ['warr','Extended warranty work','fl','ENG'],['lease','Full-service lease maintenance','fl','MOD'],['natl','National account service','fl',0],
 ['rer','Rear end rebuild','hv',0],['trb','Transmission rebuild','hv','TRN'],['frame','Frame straightening','hv','MOD'],['cab','Cab replacement','hv','MOD'],
 ['inf','In-frame overhaul','hv','ENG'],['oof','Out-of-frame overhaul','hv','ENG'],['eswap','Engine swap','hv','ENG'],['glider','Glider kit build','hv','MOD'],
 ['bpm','Bus PM','vb2','BUS'],['wlsv','Wheelchair lift service','vb2','BUS'],['bdr','Bus door repair','vb2','BUS'],['vocr','Body hydraulics repair','vb2','VOC'],
 ['ptor','PTO pump replacement','vb2','VOC'],['eqh','Equipment hydraulic repair','vb2','AG'],['uc','Undercarriage job','vb2','AG'],['rvs','RV service','vb2','RV'],['rvsl','Slide-out repair','vb2','RV'],
 ['hvi','High-voltage inspection','ev','EV'],['bhc','Battery health check','ev','EV'],['chgi','Depot charger install','ev',0],['invr','Inverter replacement','ev','EV'],
 ['motr','Traction motor replacement','ev','EV'],['eaxr','E-axle replacement','ev','EV'],['bpr','Battery pack replacement','ev','EV']];
const JOB_NAME={},JOB_LINE={};SV_JOBS.forEach(([id,n,l])=>{JOB_NAME[id]=n;JOB_LINE[id]=l});

/* ---------- the service ladder ---------- */
const SVL=[],SVI={};
for(const l of SV_LINES)for(const [jid,jn,line,fit] of SV_JOBS){if(line!==l.id)continue;const fits=fit?FIT[fit]:[[null,null]];
  for(const lv of l.lv)for(const [fk,fn] of fits){const s={id:`v.${jid}${fk?'.'+fk:''}.${lv}`,job:jid,line,lv,t:SV_LV[lv][1],fit:fn||'',k:SVL.length};SVL.push(s);SVI[s.id]=s}}
for(let k=0;k<SVL.length;k++){const s=SVL[k];s.first=k===0||SVL[k-1].job!==s.job;s.last=k===SVL.length-1||SVL[k+1].job!==s.job}
const NSV=SVL.length,SV_JOBS_N=SV_JOBS.length;
const svNeed=s=>s.last?BASE_NEED:NEED;
const svName=s=>`${SV_LV[s.lv][0]} ${lc(JOB_NAME[s.job])}${s.fit?', '+s.fit:''}`;

/* where the shop opens: once part 5 is on the shelves */
const SV_OPEN_K=40;/* about four hours in, partway through oil filters */
const SV_OPEN_L=incAt(SV_OPEN_K)-1.6+lg(7200);/* a couple of hours of what you'll be earning then */
/* each job step is pinned to a point further up the parts list and priced well above it */
const SV_OFF=1,SV_MINC=NEED*lg(1.32)+lg(1.15);
{let prev=-1;SVL[0].lam=LADDER[SV_OPEN_K].lam+SV_OFF;for(const s of SVL){s.kp=Math.round(SV_OPEN_K+s.k*(NS-1-SV_OPEN_K)/(NSV-1));const p=LADDER[s.kp];
  s.lam=Math.max(p.lam+SV_OFF,prev+SV_MINC);prev=s.lam;const x=s.lam-SVL[0].lam;s.u=.25*10**(.07*x/(1+x/3000));
  /* a job costs about 10 times a part at the same point and pays the same per copy, so it pays back far slower */
  s.pay=p.pay*.5;s.incL=s.lam-lg(s.pay)}
 for(const s of SVL){const n=SVL[s.k+1];s.g=n?Math.max(1.32,10**((n.lam-s.lam)/(svNeed(s)+.5))):SVL[s.k-1].g}}
/* once the shop exists, every new part needs the shop to keep up: you can't sell what nobody installs.
   The shop must have unlocked the last job step priced at or below the new part's price. */
const SV_GAP=.7,SV_GATE={};{let j=0;for(const s of LADDER){if(!s.first||s.k<=SV_OPEN_K)continue;while(j<NSV-1&&SVL[j+1].lam<=s.lam-SV_GAP)j++;SV_GATE[s.k]=j}}
/* -1 when a parts step has no shop requirement, otherwise the job step the shop must have unlocked */
const gateOf=s=>SV_GATE[s.k]===undefined?-1:SV_GATE[s.k];

/* ---------- the shop: five sections, built like the store aisles ---------- */
const PER_TRUCK=4;
const SHOP_SPEC={
 vb:{n:'Service bays',unit:'job slots',base:20,a0:4,off:4.5,N:900,items:[
  ['Outdoor work pad',['Gravel','Paved','Covered']],['Service bay',['Single','Drive-through','Heated']],['Truck lift',['Rotary','Stertil-Koni','Mohawk']],
  ['Lube pit',['Single','Double','Express']],['Tire bay',['Single','Double','Express']],['Alignment bay',['Standard','Wide','Drive-on']],['Wash bay',['Manual','Brush','Touchless']],
  ['Trailer bay',['Single','Double','Pull-through']],['Trailer shop',['Small','Large','Full']],['Paint booth',['Small','Truck-size','Downdraft']],['Body shop',['Small','Large','Full']],
  ['Heavy repair bay',['Single','Double','Crane-equipped']],['Shop building',['Steel','Insulated','Heated']],['Second shop',['Small','Large']],['Mobile service yard',['Small','Large']],
  ['Truck center',['Regional','Flagship']],['Service campus',['Starter','Full']],['Mega service center',['Single','Twin']],['National service network',['Regional','Coast-to-coast']]]},
 vt:{n:'Technicians',unit:'labor hrs/s',base:2,a0:.5,off:6.5,N:240,items:[
  ['Shop helper',['Weekend','Evening','Day']],['Apprentice technician',['First-year','Second-year','Third-year']],['Lube technician',['Part-time','Full-time','Lead']],
  ['Tire technician',['Part-time','Full-time','Lead']],['Trailer technician',['Part-time','Full-time','Lead']],['Brake technician',['Junior','Certified','Senior']],
  ['Diesel technician',['Level 1','Level 2','Level 3']],['Electrical specialist',['Junior','Senior','Master']],['A/C technician',['Certified','Senior','Lead']],
  ['Mobile technician',['One-truck','Two-truck','Fleet']],['Mobile service truck',['=One mobile service truck','=Three mobile service trucks','=Mobile service fleet']],['Body technician',['Junior','Senior','Master']],['Night shift',['Small','Full','Double']],
  ['Master technician',['Certified','Senior','Shop-leading']],['Shop foreman',['Day','Night','Lead']],['Technician school partnership',['Local','State','National']],
  ['Service team',['Regional','National']],['Technician network',['Regional','National','Continental']]]},
 vw:{n:'Service writers',unit:'labor hrs/s',base:2,a0:.5,off:6.5,N:240,items:[
  ['Service counter',['Small','Busy','Full']],['Repair order forms',['Paper','Carbon copy','Digital']],['Service writer',['Trainee','Experienced','Senior']],
  ['Shop management system',['Fullbay','Karmak','Decisiv']],['Estimate software',['Basic','Pro','Fleet']],['Service advisor',['Junior','Senior','Lead']],
  ['Warranty clerk',['Part-time','Full-time','Lead']],['Shop parts runner',['Part-time','Full-time','Lead']],['Appointment desk',['One-line','Four-line','Call-ahead']],
  ['Fleet coordinator',['Local','Regional','National']],['Service manager',['New','Experienced','Veteran']],['Dispatch board',['Whiteboard','Digital','Live-map']],
  ['Service operations center',['Regional','National','Continental']]]},
 vc:{n:'Service customers',unit:'trucks/s',base:.3,a0:.1,off:6.5,N:240,items:[
  ['Free inspection sign',['Paper','Vinyl','Lit']],['Shop flyers',['Truck stop','Fuel island','Truck wash']],['Service coupon',['Oil change','Brake','PM']],
  ['Driver lounge',['=Coffee pot in the lounge','=Driver showers','=Full driver lounge']],['Service website',['Basic','Booking','Fleet']],
  ['Online reviews',['=A few good reviews','=Hundreds of good reviews','=Top-rated shop']],['Loaner truck',['=Loaner day cab','=Loaner sleeper','=Loaner fleet']],
  ['Shuttle service',['Local','Hotel','Citywide']],['Fleet service rep',['Part-time','Full-time','Senior']],['Fleet PM program',['Starter','Growing','Major']],
  ['Authorized service center',['=Cummins authorized service','=PACCAR authorized service','=Allison authorized service','=Eaton authorized service']],
  ['Roadside assistance program',['Local','Regional','National']],['24-hour service',['Weekend','Weeknight','Around-the-clock']],['National service contract',['Regional','National','Coast-to-coast']]]},
 ve:{n:'Tools & equipment',unit:'labor hrs/s',base:2,a0:.5,off:6.5,N:240,items:[
  ['Hand tools',['Basic','Pro','Master']],['Impact gun',['Milwaukee','DeWalt','Ingersoll Rand']],['Creeper',['Basic','Padded','Rolling-seat']],
  ['Oil drain cart',['Lincoln Industrial','Graco','Balcrank']],['Floor jack',['Basic','Air','Long-reach']],['Tire machine',['Coats','Hunter','Hofmann']],
  ['Wheel balancer',['Coats','Hunter','Hofmann']],['Diagnostic laptop',['Basic','Dealer','Multi-brand']],['Brake lathe',['Ammco','Hunter','Ranger']],
  ['A/C machine',['Robinair','Mahle','Snap-on']],['Alignment system',['Hunter','Bee Line','Josam']],['Parts washer',['Small','Heated','Aqueous']],
  ['DPF cleaning machine',['FSX','Donaldson']],['Engine stand',['Light','Heavy','Rotating']],['Chassis dyno',['Single-axle','Tandem','Full']],
  ['Overhead crane',['Gantry','Bridge','Double-bridge']],['Fluid management system',['Basic','Metered','Automated']],['Robotic lube line',['Pilot','Full']],
  ['Predictive maintenance system',['Pilot','Fleet','Network']]]}};
const SNEEDU=k=>Math.max(3,(13*k+5)*SVL[k].u),SNEEDF=k=>20+13*k;
const SCUMU=[],SCUMF=[];{let u=0,f=0;for(const s of SVL){u+=svNeed(s)*s.u;f+=svNeed(s);SCUMU.push(u);SCUMF.push(f)}}
const SHOP=buildAisles(SHOP_SPEC,SVL,(g,k)=>g==='vb'?SNEEDF(k):g==='vc'?SNEEDU(k)/PER_TRUCK:SNEEDU(k),'vb',(g,k)=>g==='vb'?SCUMF[k]*2:g==='vc'?2*SCUMU[k]/PER_TRUCK:2*SCUMU[k],k=>incAt(SVL[k].kp));
for(let j=1;j<SHOP.vb.length;j++)SHOP.vb[j].amt=Math.max(SHOP.vb[j].amt,SHOP.vb[j-1].amt+1);

/* ---------- service goals and logbook ---------- */
A.push({id:'svopen',n:'Open the service shop',ok:()=>S.sv.open});
SV_JOBS.forEach(([jid,jn])=>{const last=SVL.filter(s=>s.job===jid).pop();A.push({id:'sv'+jid,n:`Master the ${lc(jn)}`,ok:()=>L(S.sv.f,last.id)>=BASE_NEED})});
SV_LINES.forEach(l=>A.push({id:'svl'+l.id,n:`Offer every ${lc(l.n)} job`,ok:()=>{const last=SVL.filter(s=>s.line===l.id).pop();return S.sv.top>last.k}}));
for(const g of Object.keys(SHOP))[5,15,30,60,100,200].forEach(j=>{const st=SHOP[g][j];if(st)A.push({id:'shop'+g+j,n:`Own one: ${st.n}`,ok:()=>L(S.sv.b,st.id)>0})});
LOG.push(['sv0',()=>S.sv.open,'Opened the service shop out back. Two bays, one lift, and a coffee pot that already smells burnt.'],
 ...SV_LINES.slice(1).map(l=>['svline_'+l.id,()=>S.sv.open&&S.sv.top>=SVL.findIndex(s=>s.line===l.id),`The shop started taking ${lc(l.n)} work.`]));

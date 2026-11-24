/* ===== Parts Counter: data =====
   To add content later: append to BR, LINES or PARTS. Never rename an existing id; saves key on them. */
const U3=['K','M','B','T','Qa','Qi','Sx','Sp','Oc','No','Dc','Ud','Dd','Td','Qad','Qid','Sxd','Spd','Ocd','Nod','Vg'];
let SCI=false;
function fmt(n){if(n===undefined||n===null||isNaN(n))return'0';if(!isFinite(n))return'∞';const a=Math.abs(n);
  if(a<1000)return a<10&&a%1>.05?n.toFixed(1):Math.floor(n).toLocaleString('en-US');
  const i=Math.floor(Math.log10(a)/3);if(SCI||i>U3.length)return n.toExponential(2).replace('+','');
  const v=n/10**(3*i);return (Math.abs(v)>=100?v.toFixed(0):Math.abs(v)>=10?v.toFixed(1):v.toFixed(2))+U3[i-1]}
const fmtL=L=>{if(!isFinite(L))return L>0?'∞':'0';if(L<15)return fmt(10**L);const i=Math.floor(L/3);if(!SCI&&i<=U3.length){const v=10**(L-3*i);return (v>=100?v.toFixed(0):v>=10?v.toFixed(1):v.toFixed(2))+U3[i-1]}
  const e=Math.floor(L);return (10**(L-e)).toFixed(2)+'e'+fmt(e)};
const moneyL=L=>L<2?money(10**L):'$'+fmtL(L);
const money=n=>(n<0?'-$':'$')+(Math.abs(n)<100&&Math.abs(n)%1?Math.abs(n).toFixed(2):fmt(Math.abs(n)));
const cents=n=>'$'+(n<1e5?n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):fmt(n));
function fmtT(s){if(!isFinite(s))return'a long time';s=Math.max(0,Math.ceil(s));const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60),x=s%60;
  return d>=365?`${fmt(d/365)}y`:d?`${d}d ${h}h`:h?`${h}h ${m}m`:m?`${m}m ${x}s`:`${x}s`}
const STORE='Fremont Truck & Parts';
const sumv=o=>Object.values(o||{}).reduce((a,b)=>a+b,0);
const lc=s=>{const w=s.split(/[ ,]/)[0];return /[A-Z].*[A-Z0-9/]|^[A-Z0-9]+$/.test(w)&&w.length>1?s:s.charAt(0).toLowerCase()+s.slice(1)};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'');

/* ---------- brands: id: [name, tier]  (V value, O OE, P premium) ---------- */
const BR={
 /* more brands so every part has a longer climb */
 mann:['MANN-FILTER','O'],hast:['Hastings','V'],napa:['NAPA Gold','O'],champ:['Champion Labs','V'],puro:['Purolator','O'],catp:['Cat','P'],
 perm:['Permatex','O'],lps:['LPS','O'],mech:['Mechanix Wear','O'],scott:['Scott Shop Towels','V'],gor:['Gorilla','O'],
 crafts:['Craftsman','V'],tek:['Tekton','V'],proto:['Proto','P'],klein:['Klein Tools','O'],fluke:['Fluke','P'],
 ansell:['Ansell','O'],ergo:['Ergodyne','V'],msa:['MSA','P'],cort:['Cortina','V'],bdog:['Bulldog','O'],
 hella:['HELLA','P'],whelen:['Whelen','P'],ecco:['ECCO','O'],maxx:['Maxxima','V'],litf:['Littelfuse','O'],buss:['Bussmann','O'],
 pion:['Pioneer','O'],kenw:['Kenwood','O'],lytx:['Lytx','P'],omni:['Omnitracs','P'],pilot:['Pilot Electronics','V'],
 sealco:['Sealco','O'],tect:['Tectran','V'],trw:['TRW','O'],velv:['Velvac','O'],
 seatsi:['Seats Inc','O'],natl:['National Seating','P'],cover:['Covercraft','O'],
 gyb:['Goodyear Belts','O'],mahle:['MAHLE','P'],modine:['Modine','O'],behr:['Behr','O'],nrf:['NRF','V'],
 hend:['Hendrickson','P'],dayt:['Dayton Parts','V'],cr:['Chicago Rawhide','O'],nseal:['National Seals','V'],
 hutch:['Hutchens','O'],saf:['SAF-Holland','P'],whit:['Whiting','O'],todco:['Todco','V'],
 warn:['WARN','P'],ramsey:['Ramsey','O'],ba:['B/A Products','O'],mytee:['Mytee','V'],
 permco:['Permco','O'],prince:['Prince','V'],bez:['Bezares','O'],
 davco:['Davco','O'],airdog:['AirDog','P'],fass:['FASS','P'],carter:['Carter','V'],
 imb:['Interstate-McBee','V'],felp:['Fel-Pro','O'],vrz:['Victor Reinz','O'],ks:['KS Kolbenschmidt','P'],
 wam:['World American','V'],valeo:['Valeo','O'],luk:['LuK','P'],
 rw:['Road Warrior','V'],tenn:['Tenneco','O'],faur:['Faurecia','P'],ape:['AP Emissions','V'],
 retrac:['Retrac','V'],hoge:['Hogebuilt','P'],eagle:['Eagle Fenders','O'],rwk:['RoadWorks','O'],vchr:['Valley Chrome','O'],
 yoko:['Yokohama','O'],hank:['Hankook','O'],sumi:['Sumitomo','O'],bfg:['BFGoodrich','O'],sail:['Sailun','V'],ling:['Linglong','V'],
 mcraft:['Motorcraft','O'],acd:['ACDelco','O'],aisin:['Aisin','O'],
 sanden:['Sanden','O'],rdot:['Red Dot','P'],berg:['Bergstrom','P'],
 wstar:['Western Star','O'],
 accel:['Accelera','P'],siem:['Siemens','P'],heliox:['Heliox','O'],hyl:['Hyliion','O'],
 /* remanufactured lines for big parts */
 trpr:['TRP Reman','V'],recon:['Cummins ReCon','O'],ddr:['Detroit Reman','O'],eatr:['Eaton Reman','O'],drr:['Delco Remy Reman','O'],
 /* new departments */
 bbird:['Blue Bird','O'],ricon:['Ricon','P'],braun:['BraunAbility','P'],tair:['Trans/Air','O'],vapor:['Vapor','O'],hanov:['Hanover Displays','O'],
 deere:['John Deere','O'],casei:['Case IH','O'],esco:['ESCO','P'],hens:['Hensley','O'],berco:['Berco','O'],itr:['ITR','V'],titan:['Titan','O'],
 dom:['Dometic','P'],lipp:['Lippert','O'],shur:['SHURflo','O'],norc:['Norcold','O'],onan:['Onan','P'],camco:['Camco','V'],carefree:['Carefree','O'],bborn:['Battle Born','P'],
 heil:['Heil','P'],mcn:['McNeilus','P'],hale:['Hale','P'],water:['Waterous','O'],cryst:['Crysteel','O'],civ:['Civacon','O'],fisher:['Fisher','O'],buyers:['Buyers Products','V'],trp:['TRP','V'],pp:['PACCAR Parts','O'],wix:['Wix','V'],bald:['Baldwin','O'],flg:['Fleetguard','O'],don:['Donaldson','P'],lub:['Luber-finer','V'],
 rot:['Shell Rotella','P'],delo:['Chevron Delo','O'],delv:['Mobil Delvac','P'],val:['Valvoline','O'],ow:['Old World','V'],peak:['Peak','O'],bdef:['BlueDEF','O'],
 pres:['Prestone','O'],lucas:['Lucas Oil','O'],grote:['Grote','O'],tl:['Truck-Lite','P'],opt:['Optronics','V'],pet:['Peterson','V'],phil:['Phillips Industries','O'],
 inter:['Interstate','O'],optima:['Optima','P'],deka:['Deka','V'],exide:['Exide','V'],dr:['Delco Remy','P'],prest:['Prestolite','O'],ln:['Leece-Neville','O'],
 bend:['Bendix','P'],hald:['Haldex','O'],mer:['Meritor','O'],wab:['WABCO','P'],webb:['Webb','V'],gun:['Gunite','O'],mgm:['MGM Brakes','V'],trico:['Trico','O'],bosch:['Bosch','P'],
 rainx:['Rain-X','V'],bos:['Bostrom','P'],lt:['Little Trees','O'],fire:['Firestik','P'],wil:['Wilson','O'],gates:['Gates','P'],dayco:['Dayco','O'],cont:['Continental','O'],
 horton:['Horton','P'],kysor:['Kysor','O'],stemco:['Stemco','P'],skf:['SKF','O'],timken:['Timken','P'],conmet:['ConMet','O'],cum:['Cummins','P'],dd:['Detroit','P'],
 holset:['Holset','P'],bw:['BorgWarner','O'],garrett:['Garrett','O'],delphi:['Delphi','O'],fpd:['FP Diesel','V'],pai:['PAI Industries','V'],eaton:['Eaton','P'],
 spicer:['Spicer','O'],allison:['Allison','P'],dana:['Dana','O'],dinex:['Dinex','V'],trux:['Trux Accessories','O'],up:['United Pacific','V'],gg:['Grand General','V'],
 hadley:['Hadley','P'],mich:['Michelin','P'],bs:['Bridgestone','P'],gy:['Goodyear','O'],toyo:['Toyo','O'],dc:['Double Coin','V'],
 m3:['3M','O'],loc:['Loctite','O'],wd40:['WD-40','O'],crc:['CRC','V'],gojo:['GOJO','O'],kidde:['Kidde','O'],amerex:['Amerex','P'],kine:['Kinedyne','O'],
 cobra:['Cobra','O'],uniden:['Uniden','O'],espar:['Espar','P'],webasto:['Webasto','P'],accu:['Accuride','O'],alcoa:['Alcoa','P'],monroe:['Monroe','O'],gabriel:['Gabriel','V'],
 fstone:['Firestone','P'],jost:['JOST','O'],holland:['Holland','P'],parker:['Parker','P'],muncie:['Muncie','O'],chelsea:['Chelsea','P'],jake:['Jacobs','P'],
 thermo:['Thermo King','P'],snap:['Snap-on','P'],mac:['Mac Tools','O'],milw:['Milwaukee','O'],dew:['DeWalt','O'],ir:['Ingersoll Rand','P'],linc:['Lincoln Industrial','O'],gw:['GearWrench','V'],otc:['OTC','O'],
 garmin:['Garmin','O'],rand:['Rand McNally','V'],sams:['Samsara','P'],motive:['Motive','O'],rvs:['Rear View Safety','V'],brig:['Brigade','P'],racor:['Racor','P'],stan:['Stanadyne','O'],dorman:['Dorman','V'],min:['Minimizer','P'],
 jerr:['Jerr-Dan','P'],miller:['Miller Industries','P'],zips:["Zip's",'O'],peer:['Peerless','O'],isuzu:['Isuzu','O'],hino:['Hino','O'],util:['Utility','O'],gdane:['Great Dane','P'],wab2:['Wabash','O'],abb:['ABB','P'],cp:['ChargePoint','O'],carrier:['Carrier Transicold','P'],denso:['Denso','O'],kw:['Kenworth','P'],pb:['Peterbilt','P'],fl:['Freightliner','O'],volvo:['Volvo','O'],intl:['International','V'],mack:['Mack','O']};
const TIER={V:{n:'Value',pf:.75,mg:.22,ag:.3},O:{n:'OE',pf:1,mg:.3,ag:.6},P:{n:'Premium',pf:1.35,mg:.4,ag:1.2}};

/* ---------- parts lines ---------- */
const LINES=[
 ['f','Filters & fluids','#2f6fb0',0,'trp wix bald flg don'],['s','Shop supplies','#6d7a86',0,'trp m3 crc'],['to','Tools & shop equipment','#455a64',0,'gw mac snap'],['sf','Safety & DOT','#e65100',0,'trp grote gg'],['l','Lighting & electrical','#c79100',0,'trp grote tl opt pet'],['el','Electronics','#3949ab',0,'trp garmin cobra'],['b','Brakes & air','#c62828',0,'trp bend hald mer wab'],['c','Cab & interior','#6d4c41',0,'trp pp'],['k','Belts & cooling','#00897b',0,'trp gates dayco cont'],['w','Wheel end & suspension','#546e7a',0,'trp stemco skf timken conmet'],['tr','Trailer parts','#8d6e63',0,'trp grote phil'],['tw','Towing & recovery','#f9a825',0,'trp zips peer'],['hy','Hydraulics & PTO','#0277bd',0,'trp parker muncie'],['fu','Fuel system','#ef6c00',0,'trp racor bosch'],['e','Engine','#d84315',0,'pp cum dd fpd pai'],['d','Drivetrain','#5e35b1',0,'trp eaton spicer mer dana'],['a','Aftertreatment','#43a047',0,'trp pp don flg dinex'],['kt','Kits & bundles','#8e24aa',0,'trp pp bend mer eaton gates'],['bd','Body & sheet metal','#607d8b',0,'trp pp dorman'],['x','Chrome & accessories','#78909c',0,'trp trux up gg'],['t','Tires','#37474f',0,'mich bs gy cont toyo dc'],['md','Medium duty','#7cb342',0,'trp wix bald'],['vo','Vocational trucks','#fb8c00',0,'trp parker muncie heil mcn buyers'],['bu','Bus & coach','#fdd835',0,'trp bbird ricon braun tair vapor'],['ag','Ag & construction','#9e9d24',0,'trp catp deere casei esco hens'],['rv','RV & motorhome','#26a69a',0,'trp dom lipp shur norc camco'],['rf','Reefer & HVAC','#00838f',0,'trp thermo carrier'],['h','Heavy rebuild','#ad1457',0,'cum dd eaton mer pai fpd'],['ut','Used trucks & trailers','#4e342e',0,'kw pb fl volvo intl mack'],['nt','New trucks & trailers','#b71c1c',0,'kw pb'],['ev','Electric trucks','#1e88e5',0,'pp cum dana']].map(([id,n,c,cost,brands],i)=>({id,n,c,cost,brands,i}));
const LI={};LINES.forEach(l=>LI[l.id]=l);

/* ---------- fitments (parts are sold per application, like a real counter) ---------- */
const FIT={
 ENG:[['x15','Cummins X15'],['mx13','PACCAR MX-13'],['dd15','Detroit DD15'],['isx','Cummins ISX15'],['x12','Cummins X12'],['mx11','PACCAR MX-11'],['dd13','Detroit DD13'],['l9','Cummins L9'],['b67','Cummins B6.7'],['x10','Cummins X10'],['isl','Cummins ISL9'],['dd16','Detroit DD16'],['d13','Volvo D13'],['mp8','Mack MP8'],['a26','Navistar A26'],['isb','Cummins ISB6.7']],
 MOD:[['t680','Kenworth T680'],['t880','Kenworth T880'],['w900','Kenworth W900'],['w990','Kenworth W990'],['t800','Kenworth T800'],['p579','Peterbilt 579'],['p389','Peterbilt 389'],['p567','Peterbilt 567'],['p589','Peterbilt 589'],['t480','Kenworth T480'],['vnl','Volvo VNL'],['anth','Mack Anthem'],['lt','International LT'],['ws49','Western Star 49X']],
 TRN:[['f10','Eaton Fuller 10-speed'],['f13','Eaton Fuller 13-speed'],['f18','Eaton Fuller 18-speed'],['end','Eaton Endurant'],['a3k','Allison 3000'],['a4k','Allison 4000'],['tx12','PACCAR TX-12'],['f9','Eaton Fuller 9-speed'],['a25','Allison 2500']],
 TIRE:[['2957522','295/75R22.5'],['112245','11R22.5'],['112445','11R24.5'],['2857524','285/75R24.5'],['4455022','445/50R22.5'],['2758022','275/80R22.5'],['2257019','225/70R19.5'],['2457019','245/70R19.5']],
 DRUM:[['165x7','16.5 x 7'],['165x8','16.5 x 8.625'],['15x4','15 x 4']],
 POS:[['st','steer axle'],['dr','drive axle'],['tr','trailer axle']],
 WIPE:[['22','22 in'],['24','24 in'],['26','26 in']],
 MD:[['t280','Kenworth T280'],['p537','Peterbilt 537'],['npr','Isuzu NPR'],['h195','Hino 195'],['m2','Freightliner M2 106']],
 EV:[['t680e','Kenworth T680E'],['p579ev','Peterbilt 579EV'],['ecas','Freightliner eCascadia'],['vnre','Volvo VNR Electric']],
 BUS:[['bb','Blue Bird Vision'],['ic','IC Bus CE'],['thom','Thomas Saf-T-Liner C2'],['gil','Gillig Low Floor'],['nf','New Flyer Xcelsior']],
 VOC:[['dump','dump trucks'],['mix','mixers'],['ref','refuse trucks'],['tank','tankers'],['fire','fire trucks']],
 AG:[['cat','Cat'],['jd','John Deere'],['case','Case'],['kom','Komatsu'],['vce','Volvo CE']],
 RV:[['ca','Class A'],['cc','Class C'],['fw','fifth wheel'],['tt','travel trailer']],
 UJ:[['1710','1710 series'],['1760','1760 series'],['1810','1810 series']]};

/* ---------- base parts: id, name, line, price, popularity, fitment set, brand override ---------- */
const BASE=[
 ['oilf','Oil filter','f',14,10,'ENG'],['fuelf','Fuel filter','f',21,8,'ENG'],['fws','Fuel water separator','f',38,6,'ENG'],['airf','Air filter','f',65,5,'MOD'],
 ['cabf','Cabin air filter','f',19,3,'MOD','trp wix bald flg'],['coolf','Coolant filter','f',18,4,'ENG','trp wix bald flg don'],['deff','DEF filter','f',32,3,'ENG','trp flg don bald'],
 ['hydf','Hydraulic filter','f',45,2,0,'trp wix bald don'],['ccv','Crankcase vent filter','f',55,2,'ENG','trp flg don'],
 ['oil','15W-40 oil, 1 gal','f',24,9,0,'trp rot delo delv val'],['oil5','15W-40 oil, 5 gal pail','f',98,5,0,'rot delo delv val'],['oil55','15W-40 oil, 55 gal drum','f',980,1,0,'rot delo delv'],
 ['oil1030','10W-30 oil, 1 gal','f',26,5,0,'rot delo delv val'],['oilsyn','5W-40 synthetic, 1 gal','f',38,3,0,'rot delv val'],['cool','Coolant ELC, 1 gal','f',20,6,0,'ow peak flg pres'],
 ['coolpm','Coolant 50/50 premix','f',15,5,0,'ow peak pres'],['def','DEF, 2.5 gal','f',16,9,0,'trp bdef peak flg'],['def55','DEF, 55 gal drum','f',220,2,0,'bdef peak flg'],
 ['wash','Washer fluid','f',5,6,0,'trp pres peak rainx'],['grs','Grease tube','f',8,5,0,'trp lucas delo'],['goil','Gear oil 75W-90, 1 gal','f',40,4,0,'trp delo delv lucas'],
 ['atf','Transmission fluid, 1 gal','f',35,3,0,'trp delv val'],['fadd','Diesel fuel additive','f',18,4,0,'lucas pres trp'],
 ['glove','Nitrile gloves, box','s',14,8,0,'trp m3'],['rag','Shop rags, box','s',25,5,0,'trp'],['brkc','Brake cleaner','s',6,8,0,'trp crc m3'],['pen','Penetrating oil','s',8,6,0,'wd40 crc lucas'],
 ['tloc','Thread locker','s',9,4,0,'loc m3'],['zip','Zip ties, bag','s',7,6,0,'trp gg'],['etape','Electrical tape','s',4,6,0,'m3 trp'],['hsk','Heat shrink kit','s',18,3,0,'m3 trp'],
 ['absb','Oil absorbent, bag','s',15,4,0,'trp'],['handc','Hand cleaner','s',12,5,0,'gojo trp'],['nba','Nut and bolt assortment','s',35,2,0,'trp'],['silic','RTV silicone','s',11,4,0,'loc m3 crc'],
 ['contc','Contact cleaner','s',9,4,0,'crc wd40'],['bulbs','Bulb assortment','s',22,3,0,'trp grote'],
 ['tri','Warning triangle kit','sf',35,4,0,'trp grote gg'],['ext','Fire extinguisher','sf',45,4,0,'trp kidde amerex'],['cone','Safety cone','sf',18,3,0,'trp gg'],['vest','Safety vest','sf',9,4,0,'trp gg'],
 ['ctape','Conspicuity tape, roll','sf',60,4,0,'m3 trp'],['strap','Ratchet strap','sf',22,6,0,'trp kine'],['chain','Binder chain','sf',45,3,0,'trp kine'],['lbind','Load binder','sf',55,3,0,'trp kine'],
 ['chock','Wheel chock','sf',25,3,0,'trp gg'],['eldc','ELD cable','sf',30,3,0,'trp'],['fak','First aid kit','sf',28,3,0,'trp m3'],['tchain','Tire chains, pair','sf',380,1,0,'trp kine'],
 ['head','Headlamp assembly','l',380,2,'MOD','trp pp grote tl'],['hbulb','Headlight bulb','l',13,7,0,'trp grote tl opt'],['mark','Marker light, amber','l',11,8],['markr','Marker light, red','l',11,7],
 ['clear','Clearance light','l',14,5],['tail','Stop/turn/tail light','l',42,5],['strobe','Strobe light','l',75,2,0,'grote tl gg'],['workl','Work light','l',65,3],
 ['batt','Battery, Group 31 flooded','l',165,4,0,'trp inter deka exide'],['battagm','Battery, Group 31 AGM','l',285,3,0,'optima deka inter'],
 ['alt','Alternator','l',390,2,'ENG','trp dr prest ln'],['strt','Starter','l',420,2,'ENG','trp dr prest'],['bcab','Battery cable','l',28,3,0,'trp phil grote'],
 ['cord','7-way trailer cord','l',58,4,0,'trp phil grote'],['absc','ABS power cord','l',65,2,0,'phil grote'],['tog','Toggle switch','l',13,2],['relay','Relay','l',12,4],
 ['fuse','Blade fuse assortment','l',15,4,0,'trp grote'],['harn','Trailer harness','l',140,2,0,'trp grote tl phil'],['sock','7-way socket','l',22,4,0,'phil grote trp'],
 ['shoe','Brake shoe kit','b',125,6,'DRUM','trp mer bend hald'],['drum','Brake drum','b',195,3,'DRUM','trp webb gun conmet'],['rotor','Disc brake rotor','b',260,2,'POS','trp bend mer'],
 ['pads','Disc brake pads','b',160,3,'POS','trp bend mer'],['ch3030','Spring brake chamber 30/30','b',82,5,0,'trp bend hald mgm'],['ch3036','Spring brake chamber 30/36','b',95,3,0,'trp bend hald mgm'],
 ['ch24','Service chamber 24','b',45,4,0,'trp bend hald mgm'],['slack','Automatic slack adjuster','b',98,4,0,'trp bend hald mer'],['dryc','Air dryer cartridge','b',88,5,0,'trp bend hald wab'],
 ['dryer','Air dryer assembly','b',620,1,0,'bend hald wab'],['relv','Relay valve','b',85,3],['qrv','Quick release valve','b',35,3],['tpv','Tractor protection valve','b',120,2],
 ['ppv','Park control valve','b',110,2],['tread','Brake treadle valve','b',260,1],['comp','Air compressor','b',1100,.7,'ENG','bend hald wab pp'],['gov','Air governor','b',45,3],
 ['glad','Glad hands, pair','b',24,5,0,'trp phil hald'],['ahose','Air hose coil','b',65,4,0,'trp phil'],['aline','Air brake line, 100 ft','b',85,3,0,'trp phil'],['fit','Air fittings, bag','b',20,5,0,'trp phil'],
 ['wipe','Wiper blade','c',18,6,'WIPE','trp trico bosch rainx'],['mirr','Mirror glass','c',48,3,'MOD'],['mirra','Mirror assembly','c',320,1,'MOD'],['dhand','Door handle','c',58,2,'MOD'],
 ['seat','Seat cushion','c',160,1,0,'trp pp bos'],['seata','Air ride seat','c',950,.5,0,'bos trp'],['mat','Floor mat set','c',75,2,'MOD'],['visr','Sun visor','c',54,1,'MOD'],
 ['fresh','Air freshener','c',2,8,0,'trp lt'],['ant','CB antenna','c',49,2,0,'trp fire wil'],['cb','CB radio','c',140,2,0,'cobra uniden'],['blow','HVAC blower motor','c',180,1,'MOD'],
 ['bunk','Bunk heater','c',1300,.4,0,'espar webasto'],['strut','Hood strut','c',45,2,'MOD'],['gauge','Dash gauge','c',95,1],['mattr','Sleeper mattress','c',450,.6],
 ['belt','Serpentine belt','k',52,6,'ENG'],['uhose','Upper radiator hose','k',42,5,'ENG'],['lhose','Lower radiator hose','k',45,4,'ENG'],['therm','Thermostat','k',48,4,'ENG','trp pp gates'],
 ['wpump','Water pump','k',290,2,'ENG','trp pp cum fpd'],['fclu','Fan clutch','k',460,1,'ENG','trp horton kysor'],['fanb','Fan blade','k',380,1,0,'trp horton kysor'],
 ['rad','Radiator','k',1550,.6,'MOD','trp pp kysor'],['cac','Charge air cooler','k',1350,.5,'MOD','trp pp kysor'],['tens','Belt tensioner','k',120,3,'ENG','trp gates dayco'],['ctank','Coolant tank','k',140,1,'MOD','trp pp'],
 ['wseal','Wheel seal','w',35,6,'POS','trp stemco skf'],['hub','Hub bearing kit','w',165,3,'POS'],['hubass','Hub assembly','w',520,1,'POS','conmet trp'],['lug','Lug nuts, box of 10','w',30,4,0,'trp pp'],
 ['stud','Wheel studs, box','w',45,3,'POS','trp pp'],['hcap','Hub cap','w',40,2,'POS','trp up'],['flap','Mud flaps 24x30, pair','w',58,4,0,'trp pp gg'],['flap36','Mud flaps 24x36, pair','w',68,3,0,'trp pp gg'],
 ['aseal','Axle seal','w',48,3,0,'trp stemco skf'],['whl','Steel wheel 22.5 x 8.25','w',180,2,0,'accu alcoa trp'],['whla','Aluminum wheel 22.5 x 8.25','w',420,2,0,'alcoa accu'],
 ['kp','Kingpin kit','w',260,1,0,'trp pp dana'],['tie','Tie rod end','w',110,2,0,'trp pp dana'],['shock','Shock absorber','w',95,4,0,'trp monroe gabriel'],['aspr','Air spring','w',140,3,0,'trp fstone gy'],
 ['tdseal','Trailer door seal','tr',140,2,0,'trp'],['hinge','Door hinge','tr',45,3,0,'trp'],['lrod','Door lock rod','tr',85,2,0,'trp'],['lgear','Landing gear','tr',780,.6,0,'jost holland trp'],
 ['fifth','Fifth wheel','tr',1900,.4,0,'jost holland'],['fwk','Fifth wheel rebuild kit','tr',260,1,0,'jost holland'],['tkp','Trailer kingpin','tr',120,1,0,'holland jost trp'],
 ['tlk','Trailer light kit','tr',110,2,0,'grote tl trp'],['tbk','Trailer brake kit','tr',210,2,0,'mer hald bend trp'],['tsbv','Trailer spring brake valve','tr',140,1,0,'hald bend'],
 ['tfloor','Trailer floor board','tr',95,1,0,'trp'],['skirt','Side skirt panel','tr',320,.6,0,'trp'],['tsusp','Trailer air suspension kit','tr',1800,.3,0,'holland hald trp'],
 ['hhose','Hydraulic hose, 1/2 in','hy',45,5,0,'parker gates trp'],['hfit','Hydraulic fitting','hy',12,6,0,'parker trp'],['pto','PTO assembly','hy',1400,.5,'TRN','muncie chelsea'],
 ['hpump','Hydraulic pump','hy',980,.6,0,'muncie chelsea parker'],['hcyl','Hydraulic cylinder','hy',640,.6,0,'parker trp'],['hval','Control valve','hy',420,.7,0,'parker trp'],
 ['htank','Hydraulic tank','hy',380,.6,0,'trp muncie'],['wetk','Wet kit','hy',2800,.3,0,'muncie chelsea'],
 ['inj','Fuel injector','e',720,2,'ENG','bosch delphi cum dd fpd'],['turbo','Turbocharger','e',2600,.8,'ENG','pp holset bw garrett'],['opump','Oil pump','e',540,.7,'ENG'],
 ['ugask','Upper gasket set','e',260,1.5,'ENG'],['lgask','Lower gasket set','e',240,1.2,'ENG'],['hbolt','Head bolt kit','e',170,1,'ENG'],['egrc','EGR cooler','e',1650,.6,'ENG','pp cum dd bw'],
 ['fpump','Fuel pump','e',1400,.6,'ENG','bosch cum dd pp'],['cks','Crankshaft sensor','e',85,3,'ENG','pp cum dd bosch'],['cms','Camshaft sensor','e',80,2,'ENG','pp cum dd bosch'],
 ['ops','Oil pressure sensor','e',70,2,'ENG','pp cum dd bosch'],['cts','Coolant temp sensor','e',55,2,'ENG','pp cum dd bosch'],['vgt','VGT actuator','e',980,.6,'ENG','holset pp bw'],
 ['oilc','Oil cooler','e',720,.6,'ENG'],['vcg','Valve cover gasket','e',95,2,'ENG'],['ebrk','Engine brake housing','e',1900,.3,'ENG','jake pp'],
 ['clutch','Clutch kit','d',1600,.8,'TRN','trp eaton spicer'],['uj','U-joint','d',70,4,'UJ','trp spicer dana mer'],['dsh','Driveshaft','d',1150,.5,0,'trp spicer dana'],['yoke','End yoke','d',140,2,0,'spicer dana mer'],
 ['cbrk','Clutch brake','d',45,3,0,'eaton trp'],['relb','Release bearing','d',140,2,0,'eaton spicer trp'],['knob','Shift knob','d',60,2,0,'trp eaton'],['tfil','Transmission filter','d',58,3,'TRN','trp allison bald'],
 ['synch','Synchronizer kit','d',640,.6,'TRN','eaton trp'],['csb','Center support bearing','d',110,2,0,'spicer dana trp'],['diff','Differential carrier','d',3200,.3,0,'mer eaton dana'],
 ['rtrn','Reman transmission','d',6800,.2,'TRN','eaton allison pp'],
 ['dpf','DPF','a',3100,.6,'ENG'],['doc','DOC','a',2450,.4,'ENG'],['scr','SCR catalyst','a',3800,.3,'ENG','pp cum dd dinex'],['noxi','NOx sensor, inlet','a',460,2,'ENG','pp bosch cum dd'],
 ['noxo','NOx sensor, outlet','a',460,2,'ENG','pp bosch cum dd'],['defp','DEF pump','a',1250,.7,'ENG','pp bosch cum'],['defh','DEF heater','a',320,1,0,'pp bosch'],['defi','DEF injector','a',520,1,'ENG','pp bosch cum'],
 ['egr','EGR valve','a',980,.8,'ENG','pp cum dd bw'],['dpfg','DPF gasket and clamp kit','a',85,3,0,'trp don dinex'],['dps','Differential pressure sensor','a',140,2,'ENG','pp bosch'],
 ['bump','Chrome bumper','x',1700,.4,'MOD'],['stk5','Exhaust stack, 5 in','x',460,.6],['stk7','Exhaust stack, 7 in','x',620,.5],['cvis','Chrome visor','x',1100,.4,'MOD'],
 ['horn','Air horn','x',230,1.5,0,'trp hadley gg'],['lbar','LED light bar','x',310,1.5,0,'grote tl gg'],['lcov','Lug nut covers, set','x',80,2],['acc','Air cleaner cover','x',380,.6,'MOD'],
 ['grill','Grille','x',1450,.3,'MOD','pp trux'],['fend','Half fenders, pair','x',520,.6],['deck','Deck plate','x',420,.6],['mfw','Chrome mud flap weights','x',90,2],
 ['steer','Steer tire','t',620,1.5,'TIRE'],['drive','Drive tire','t',660,2,'TIRE'],['trl','Trailer tire','t',500,2,'TIRE'],['retread','Retread drive tire','t',330,2,'TIRE','bs gy mich'],['vstem','Valve stem kit','t',14,4,0,'trp gy'],
 ['rbelt','Reefer belt','rf',45,3,0,'thermo carrier trp'],['rfilt','Reefer air filter','rf',35,3,0,'thermo carrier trp'],['rcomp','Reefer compressor','rf',2800,.4,0,'thermo carrier'],
 ['rfan','Reefer fan motor','rf',380,1,0,'thermo carrier'],['rctl','Reefer controller','rf',1600,.4,0,'thermo carrier'],['acomp','A/C compressor','rf',650,.8,'MOD','trp pp denso'],
 ['acnd','A/C condenser','rf',420,.7,'MOD','trp pp denso'],['rdry','A/C receiver drier','rf',65,2,0,'trp denso'],
 ['erk','Engine overhaul kit','h',10500,.15,'ENG','cum dd pp pai fpd'],['reman','Reman engine','h',22000,.08,'ENG','cum dd pp'],['trk','Transmission rebuild kit','h',4800,.2,'TRN','eaton allison pai'],
 ['rerk','Rear end rebuild kit','h',3800,.2,0,'mer eaton dana pai'],['injs','Injector set','h',4200,.2,'ENG','bosch delphi cum dd fpd'],['cylk','Cylinder kit','h',3200,.2,'ENG','cum dd pai fpd'],['crank','Crankshaft','h',3800,.1,'ENG','cum dd pp'],
 ['udc','Used day cab tractor','ut',65000,.06,0],['uslp','Used sleeper tractor','ut',85000,.05,0],['udump','Used dump truck','ut',90000,.03,0],['ubox','Used box truck','ut',45000,.05,0],['uhvy','Used heavy hauler','ut',120000,.02,0],
 ['ndc','New day cab tractor','nt',180000,.04,0],['nslp','New sleeper tractor','nt',215000,.04,0],['nvoc','New vocational truck','nt',230000,.03,0],['nmed','New medium duty truck','nt',120000,.04,0],['nlh','New long-hood tractor','nt',260000,.02,0],
 ['psf','Power steering filter','f',28,3,0,'trp wix bald'],
 ['fog','Fog light','l',85,2,'MOD','trp grote tl'],['turn','Turn signal assembly','l',95,2,'MOD','trp pp grote'],
 ['abss','ABS wheel speed sensor','b',45,4,0,'trp bend wab'],['absv','ABS modulator valve','b',180,2,0,'bend wab hald'],['bhose','Brake hose','b',22,5,0,'trp phil'],
 ['scam','S-cam kit','b',140,2,'DRUM','trp mer'],['cbk','Cam bushing kit','b',45,3,'DRUM','trp mer'],['lining','Brake lining kit','b',95,3,'DRUM','trp mer bend'],
 ['dseal','Door seal','c',85,2,'MOD','trp pp'],['wreg','Window regulator','c',160,1,'MOD','trp pp'],['wshield','Windshield','c',650,.6,'MOD','trp pp'],
 ['hcore','Heater core','c',240,1,'MOD','trp pp'],['cabag','Cab air spring','c',110,2,'MOD','trp fstone'],
 ['ihose','Intake hose','k',65,3,'MOD','trp gates cont'],['those','Turbo hose','k',85,3,'ENG','trp gates cont'],['acbelt','A/C belt','k',38,3,'ENG'],
 ['sgear','Steering gear','w',1200,.4,'MOD','trp pp'],['drag','Drag link','w',180,1,'MOD','trp pp dana'],['leaf','Leaf spring','w',320,1,'MOD','trp pp'],
 ['trod','Torque rod','w',140,2,0,'trp pp'],['ubolt','U-bolt kit','w',45,3,0,'trp pp'],
 ['opg','Oil pan gasket','e',85,2,'ENG'],['emg','Exhaust manifold gasket','e',65,2,'ENG'],['egrg','EGR gasket kit','e',75,2,'ENG'],['fline','Fuel line kit','e',120,2,'ENG'],
 ['icup','Injector cup kit','e',140,1,'ENG'],['wpipe','Water pipe kit','e',110,1,'ENG'],
 ['tmount','Transmission mount','d',140,1,'TRN','trp eaton'],['shiftc','Shift cable','d',180,1,'TRN','trp eaton allison'],
 ['dpfs','DPF temperature sensor','a',120,2,'ENG','pp bosch cum dd'],
 ['muff','Muffler','x',380,1,'MOD','trp pp'],['epipe','Exhaust pipe','x',220,1,'MOD','trp pp'],['eclamp','Exhaust clamp','x',28,4,0,'trp pp'],
 ['turbok','Turbo rebuild kit','h',900,.4,'ENG','holset bw pai'],
 ['bypf','Bypass oil filter','f',24,4,'ENG'],['prf','Primary fuel filter','f',26,4,'ENG'],['oilfk','Oil change kit','f',120,3,'ENG'],['dexf','Air intake prefilter','f',38,2,'MOD'],
 ['brkfl','DOT 3 brake fluid','f',9,3,0,'trp pres val'],['psfl','Power steering fluid','f',9,3,0,'trp pres val lucas'],['defg','DEF, 1 gal','f',8,5,0,'trp bdef peak'],['ac134','R-134a refrigerant','f',22,3,0,'trp m3'],
 ['hydo','Hydraulic oil AW46, 5 gal','f',85,3,0,'trp delo delv'],['grsp','Grease, 35 lb pail','f',110,2,0,'lucas delo trp'],['oil25','15W-40 oil, 2.5 gal','f',55,4,0,'rot delo delv val'],['sae50','SAE 50 transmission oil, 5 gal','f',120,2,0,'delo delv'],
 ['shrink','Shrink wrap roll','s',30,2,0,'trp m3'],['cpins','Cotter pin assortment','s',16,3,0,'trp'],['hclamp','Hose clamp assortment','s',28,4,0,'trp gates'],['wconn','Wire connector kit','s',24,4,0,'trp grote phil'],
 ['dgr','Dielectric grease','s',8,4,0,'trp m3 lucas'],['pwsol','Parts washer solvent, 5 gal','s',65,2,0,'crc trp'],['shopt','Shop towels, roll','s',18,5,0,'trp m3'],['dtape','Duct tape','s',9,5,0,'m3 trp'],
 ['solder','Solder seal connectors','s',22,3,0,'trp m3'],['anti','Anti-seize','s',14,3,0,'loc crc'],['pwire','Primary wire, 100 ft','s',38,3,0,'trp grote phil'],['sloom','Split loom, 100 ft','s',26,2,0,'trp phil'],
 ['tsock','Socket set','to',180,3,0,'gw mac snap'],['wrs','Wrench set','to',220,3,0,'gw mac snap'],['iwr','Impact wrench, 1/2 in','to',380,2,0,'milw dew ir snap'],['iwr1','Impact wrench, 1 in','to',650,1,0,'ir milw snap'],
 ['tqw','Torque wrench','to',260,2,0,'gw mac snap'],['ggun','Grease gun','to',65,4,0,'linc milw trp'],['bjack','Bottle jack, 20 ton','to',140,2,0,'otc trp'],['fjack','Floor jack','to',420,1,0,'otc snap'],
 ['jst','Jack stands, pair','to',160,2,0,'otc trp'],['scan','Diagnostic scan tool','to',2400,.4,0,'snap otc mac'],['mmeter','Multimeter','to',120,2,0,'milw snap'],['tgauge','Tire inflator gauge','to',45,4,0,'trp milw'],
 ['bchg','Battery charger','to',280,2,0,'trp milw dew'],['jumps','Jump starter','to',320,2,0,'trp milw dew'],['acmach','A/C recovery machine','to',4200,.2,0,'snap otc'],['tchgr','Tire changer','to',6800,.1,0,'snap'],
 ['ltest','Trailer light tester','to',65,2,0,'trp phil'],['dolly','Brake drum dolly','to',380,.5,0,'otc'],['pwash','Pressure washer','to',900,.5,0,'dew milw'],['scomp','Shop air compressor','to',1800,.3,0,'ir dew'],
 ['tchest','Rolling tool chest','to',1600,.3,0,'snap mac gw'],['slight','Shop light','to',55,3,0,'milw dew'],['wstand','Work stand','to',140,1,0,'trp otc'],['spress','Shop press, 20 ton','to',780,.3,0,'otc'],
 ['hhat','Hard hat','sf',22,3,0,'trp gg'],['sglass','Safety glasses','sf',8,5,0,'trp m3'],['eplug','Ear plugs, box','sf',18,3,0,'m3 trp'],['flare','Emergency flares','sf',30,2,0,'trp gg'],
 ['tarp','Tarp, 20 x 20','sf',95,3,0,'trp kine'],['edgep','Edge protectors, 10 pack','sf',35,3,0,'trp kine'],['cbar','Cargo bar','sf',55,3,0,'trp kine'],['etrack','E-track rail','sf',40,3,0,'kine trp'],
 ['lock','Load lock','sf',45,2,0,'kine trp'],['wstrap','Winch strap','sf',28,4,0,'kine trp'],['spill','Spill kit','sf',140,1,0,'trp m3'],['blank','Moving blankets, 12 pack','sf',120,2,0,'trp'],
 ['ledhl','LED headlight conversion','l',260,2,'MOD','grote tl trp'],['battd','Battery, Group 31 deep cycle','l',230,2,0,'inter deka optima'],['bdisc','Battery disconnect switch','l',45,3,0,'trp phil grote'],
 ['cbrkr','Circuit breaker','l',18,3,0,'trp grote'],['dlite','Dome light','l',35,2,0,'grote tl trp'],['lplate','License plate light','l',14,3,0,'grote tl trp'],['bkup','Backup alarm','l',38,3,0,'trp gg grote'],
 ['lcab','Cab marker light set','l',85,2,'MOD','grote tl trp'],['jbox','Junction box','l',120,1,0,'phil grote'],['vreg','Voltage regulator','l',90,1,'ENG','trp dr ln'],['gplug','Glow plug','l',28,2,'ENG','bosch trp'],
 ['inv','Power inverter','l',180,2,0,'trp cobra'],
 ['gps','Truck GPS','el',300,2,0,'garmin rand'],['dcam','Dash camera','el',220,2,0,'garmin rvs brig'],['bcam','Backup camera system','el',340,2,0,'rvs brig'],['eld','ELD unit','el',250,3,0,'sams motive'],
 ['tpms','Tire pressure monitor','el',420,1,0,'trp'],['bsd','Blind spot sensor kit','el',780,.6,0,'brig rvs'],['tablet','Rugged tablet','el',600,.8,0,'sams motive garmin'],['track','Trailer tracker','el',180,2,0,'sams motive'],
 ['usbc','USB charger','el',18,6,0,'trp cobra'],['btset','Bluetooth headset','el',90,3,0,'cobra uniden'],['srad','Satellite radio kit','el',140,1,0,'cobra trp'],['ecm','Engine control module','el',1900,.3,'ENG','pp cum dd'],
 ['ccm','Cab control module','el',780,.4,'MOD','pp'],['clust','Instrument cluster','el',1100,.3,'MOD','pp trp'],['vss','Vehicle speed sensor','el',60,3,'TRN','pp trp eaton'],
 ['govk','Compressor governor kit','b',60,2,'ENG','bend hald'],['sbv','Spring brake valve','b',130,2,0,'bend hald'],['flex','Air brake flex line','b',30,4,0,'trp phil'],['atank','Air tank','b',240,1,0,'trp bend'],
 ['dval','Drain valve','b',35,3,0,'trp bend hald'],['ppvl','Pressure protection valve','b',40,2,0,'trp bend hald'],['calip','Disc brake caliper','b',520,1,'POS','bend mer trp'],['bhk','Brake hardware kit','b',38,4,'DRUM','trp mer bend'],
 ['rspr','Brake return spring kit','b',22,4,'DRUM','trp mer'],['purge','Air dryer purge valve','b',75,2,0,'bend hald wab'],
 ['sboot','Shift boot','c',38,2,'MOD','trp pp'],['cstep','Cab step','c',140,2,'MOD','trp pp'],['grab','Grab handle','c',45,3,'MOD','trp pp'],['wmot','Window motor','c',140,1,'MOD','trp pp'],
 ['dlock','Door lock actuator','c',90,2,'MOD','trp pp'],['fridge','Sleeper refrigerator','c',650,.4,0,'trp'],['curt','Sleeper curtain','c',180,1,'MOD','pp'],['scov','Seat cover','c',90,2,0,'trp bos'],
 ['sbelt','Seat belt assembly','c',120,2,'MOD','trp pp'],['carpet','Cab carpet kit','c',260,.6,'MOD','pp trp'],['apu','Auxiliary power unit','c',9500,.1,0,'thermo carrier'],
 ['shroud','Fan shroud','k',220,1,'MOD','trp pp'],['rcap','Radiator cap','k',18,4,0,'trp gates'],['hhk','Heater hose kit','k',75,3,'MOD','trp gates cont'],['idler','Idler pulley','k',60,3,'ENG','trp gates dayco'],
 ['ovfh','Coolant overflow hose','k',25,3,0,'trp gates'],['cacb','Charge air cooler boot','k',55,3,'ENG','trp gates cont'],['fbelt','Fan belt','k',45,3,'ENG','trp gates dayco cont'],['fhub','Fan drive hub','k',380,1,'ENG','horton kysor trp'],
 ['snut','Spindle nut kit','w',35,4,'POS','trp stemco'],['ashaft','Axle shaft','w',420,1,0,'mer dana trp'],['eqb','Equalizer beam','w',380,.6,0,'trp holland'],['hcg','Hub cap gasket','w',8,4,0,'trp stemco'],
 ['hocap','Hub oil cap','w',22,4,0,'stemco trp'],['sdamp','Steering damper','w',140,1,'MOD','trp monroe'],['pitman','Pitman arm','w',220,1,'MOD','trp pp'],['sbush','Spring bushing kit','w',60,3,'MOD','trp pp'],
 ['cshock','Cab shock','w',75,2,'MOD','trp monroe gabriel'],['wsk','Wheel bearing and seal kit','w',55,3,'POS','skf timken'],['hcv','Height control valve','w',90,3,0,'trp hald'],
 ['tdh','Trailer door handle','tr',60,2,0,'trp'],['rollup','Roll-up door','tr',1400,.3,0,'trp'],['icc','ICC bumper','tr',380,.5,0,'trp'],['xmem','Trailer crossmember','tr',140,1,0,'trp'],
 ['slpin','Trailer slider pin kit','tr',75,2,0,'trp holland'],['ttail','Trailer tail light','tr',38,4,0,'grote tl'],['troof','Trailer roof patch kit','tr',65,2,0,'trp'],['tabs','Trailer ABS kit','tr',420,.6,0,'bend wab hald'],
 ['tlens','Trailer lens kit','tr',30,3,0,'grote tl'],['bulkh','Bulkhead','tr',520,.3,0,'trp'],
 ['tchn','Tow chain','tw',95,3,0,'peer trp'],['tstrp','Tow strap','tw',65,4,0,'trp zips'],['snatch','Snatch block','tw',180,2,0,'zips miller'],['wcab','Winch cable','tw',140,2,0,'jerr miller zips'],
 ['tlbar','Tow light bar','tw',260,2,0,'zips trp'],['wlift','Wheel lift','tw',3800,.2,0,'jerr miller'],['wdol','Wheel dollies','tw',1200,.3,0,'zips'],['tbar','Tow bar','tw',650,.5,0,'zips trp'],
 ['winch','Winch','tw',2600,.3,0,'miller jerr'],['ghook','Grab hook kit','tw',75,3,0,'peer trp'],['schain','Safety chain set','tw',110,2,0,'peer zips'],['tair','Tow air supply kit','tw',220,1,0,'zips trp'],
 ['rback','Rollback bed','tw',38000,.03,0,'jerr miller'],['wbody','Wrecker body','tw',65000,.02,0,'jerr miller'],
 ['hreel','Hose reel','hy',380,.6,0,'trp parker'],['hrf','Hydraulic return filter','hy',55,3,0,'parker don trp'],['hcool','Hydraulic oil cooler','hy',620,.4,0,'parker trp'],['pshaft','PTO shaft','hy',280,1,0,'muncie chelsea'],
 ['psw','PTO switch','hy',85,2,0,'muncie chelsea trp'],['dvlv','Diverter valve','hy',340,.6,0,'parker trp'],['hseal','Cylinder seal kit','hy',60,3,0,'parker trp'],['hqc','Quick coupler','hy',35,4,0,'parker trp'],
 ['fcap','Fuel cap','fu',25,5,0,'trp pp'],['fstrap','Fuel tank strap','fu',75,3,'MOD','trp pp'],['fsend','Fuel sending unit','fu',140,2,'MOD','trp pp'],['wifs','Water in fuel sensor','fu',60,3,'ENG','racor trp'],
 ['fprim','Fuel primer pump','fu',90,2,'ENG','racor stan trp'],['frv','Fuel return valve','fu',85,2,'ENG','bosch trp'],['fpres','Fuel pressure sensor','fu',110,2,'ENG','bosch pp trp'],['fhtr','Fuel heater','fu',220,1,'ENG','racor don trp'],
 ['fxv','Fuel crossover valve','fu',140,1,0,'trp pp'],['racor','Fuel filter housing','fu',380,1,0,'racor'],['xfer','Fuel transfer pump','fu',420,.6,0,'trp'],['frail','Fuel rail','fu',680,.5,'ENG','bosch delphi'],
 ['ftank','Fuel tank, 100 gal','fu',1100,.5,'MOD','trp pp'],['hpp','High-pressure fuel pump','fu',2800,.3,'ENG','bosch delphi stan'],
 ['tcg','Timing cover gasket','e',65,2,'ENG'],['imap','Intake manifold pressure sensor','e',85,2,'ENG','pp bosch cum dd'],['lifter','Cam follower','e',140,1,'ENG'],['vspr','Valve spring kit','e',190,.8,'ENG'],
 ['rocker','Rocker arm','e',260,1,'ENG'],['liner','Cylinder liner','e',320,.6,'ENG'],['rodb','Rod bearing set','e',320,.6,'ENG'],['mainb','Main bearing set','e',380,.6,'ENG'],
 ['piston','Piston','e',480,.6,'ENG'],['conrod','Connecting rod','e',540,.4,'ENG'],['damp','Vibration damper','e',780,.4,'ENG'],['fwh','Flywheel','e',980,.3,'ENG'],
 ['fwhh','Flywheel housing','e',1400,.2,'ENG'],['ehead','Cylinder head','e',3600,.2,'ENG','cum dd pp pai fpd'],
 ['ashs','Axle shaft seal','d',38,3,0,'stemco skf trp'],['slave','Clutch slave cylinder','d',140,1,'TRN','trp eaton'],['sfork','Shift fork','d',180,.6,'TRN','eaton trp'],['rcyl','Range cylinder kit','d',220,.6,'TRN','eaton trp'],
 ['tcool','Transmission cooler','d',520,.4,'TRN','trp eaton allison'],['ishaft','Input shaft','d',780,.3,'TRN','eaton pai'],['ipd','Inter-axle differential kit','d',980,.3,0,'mer eaton dana'],['mshaft','Mainshaft','d',1400,.2,'TRN','eaton pai'],
 ['vclamp','Exhaust V-band clamp','a',45,4,0,'trp don dinex'],['dhrel','DEF heater relay','a',45,2,0,'pp bosch'],['defl','DEF line','a',120,2,'ENG','pp bosch'],['scrt','SCR temperature sensor','a',140,2,'ENG','pp bosch cum dd'],
 ['dpfc','DPF cleaning exchange','a',450,1,'ENG','don dinex pp'],['deft','DEF tank','a',780,.4,'MOD','pp trp'],['acm','Aftertreatment control module','a',1600,.3,'ENG','pp cum dd'],
 ['bbrk','Bumper bracket','bd',140,1,'MOD','pp trp'],['hhng','Hood hinge','bd',120,1,'MOD','pp trp dorman'],['bbox','Battery box cover','bd',160,1,'MOD','pp trp'],['tbox','Frame tool box','bd',380,1,0,'trp dorman'],
 ['qfen','Poly quarter fenders, pair','bd',260,1,0,'min trp'],['sext','Sleeper extender','bd',580,.3,'MOD','pp trp'],['sbump','Steel bumper','bd',620,.5,'MOD','pp trp'],['fndr','Fender','bd',780,.4,'MOD','pp trp min'],
 ['chf','Chassis fairing','bd',900,.3,'MOD','pp trp'],['rfair','Roof fairing','bd',1600,.2,'MOD','pp trp'],['cdoor','Cab door','bd',2600,.2,'MOD','pp'],['hood','Hood','bd',4200,.2,'MOD','pp trp'],
 ['vlite','Visor light','x',30,3,0,'grote tl up'],['slite','Stack light','x',45,2,0,'up gg'],['orn','Hood ornament','x',90,2,0,'up gg'],['mcov','Chrome mirror cover','x',120,1,'MOD','up trux'],
 ['hsh','Exhaust heat shield','x',140,1,0,'up trux trp'],['gtrim','Chrome grille trim','x',240,.6,'MOD','up trux'],['tcov','Chrome tank cover','x',380,.5,0,'up trux'],['rlbar','Rear light bar','x',540,.5,0,'up trux'],
 ['tbead','Tire balancing beads','t',30,3,0,'trp'],['trk2','Tire repair kit','t',45,3,0,'trp gy'],['spc','Spare tire carrier','t',220,1,0,'trp'],['msteer','Mixed service steer tire','t',650,1,'TIRE'],
 ['offr','On/off-road drive tire','t',720,.6,'TIRE','mich bs gy toyo'],['wide','Wide-base drive tire','t',780,1,0,'mich bs gy cont'],
 ['mdof','Medium duty oil filter','md',12,6,'MD','trp wix flg isuzu hino'],['mdff','Medium duty fuel filter','md',18,5,'MD','trp wix bald isuzu hino'],['mdaf','Medium duty air filter','md',45,4,'MD','trp wix don hino'],
 ['mdshk','Medium duty shock','md',70,3,'MD','trp monroe gabriel'],['mdbp','Medium duty brake pads','md',90,3,'MD','trp bend isuzu'],['mdrot','Medium duty brake rotor','md',140,2,'MD','trp bend'],
 ['mdwp','Medium duty water pump','md',180,1,'MD','trp gates hino'],['mdhl','Medium duty headlight','md',220,2,'MD','trp grote isuzu'],['mdst','Medium duty starter','md',300,1,'MD','trp dr prest'],
 ['mdalt','Medium duty alternator','md',320,1,'MD','trp dr prest'],['mdlm','Liftgate motor','md',420,.5,0,'trp'],['mdrad','Medium duty radiator','md',780,.4,'MD','trp kysor'],
 ['mdrd','Box truck roll-up door','md',1600,.2,0,'trp'],['mdlg','Liftgate','md',3800,.1,0,'trp'],
 ['rsens','Reefer temperature sensor','rf',65,2,0,'thermo carrier'],['achose','A/C hose','rf',85,2,'MOD','trp pp denso'],['acexp','A/C expansion valve','rf',75,2,'MOD','trp denso'],['rdg','Reefer door gasket','rf',120,1,0,'thermo carrier trp'],
 ['rbat','Reefer battery','rf',180,1,0,'thermo carrier inter'],['acclu','A/C clutch','rf',260,1,'MOD','trp denso'],['ralt','Reefer alternator','rf',420,.6,0,'thermo carrier'],['revap','Reefer evaporator coil','rf',1400,.3,0,'thermo carrier'],
 ['bunkac','Sleeper A/C unit','rf',3600,.2,0,'thermo carrier'],
 ['trem','Reman turbocharger','h',1900,.3,'ENG','holset bw garrett'],['crem','Reman crankshaft','h',3200,.1,'ENG','cum dd pai'],['dfrem','Reman differential','h',4200,.1,0,'mer eaton dana'],
 ['hdrem','Reman cylinder head','h',4800,.15,'ENG','cum dd pp'],['inframe','In-frame overhaul kit','h',14000,.1,'ENG','cum dd pai fpd'],['outf','Out-of-frame overhaul kit','h',16000,.08,'ENG','cum dd pai'],
 ['uvan','Used dry van trailer','ut',22000,.05,0,'util gdane wab2'],['uflat','Used flatbed trailer','ut',28000,.04,0,'util gdane wab2'],['ureef','Used reefer trailer','ut',45000,.04,0,'util gdane wab2'],
 ['utow','Used tow truck','ut',75000,.02,0,'kw pb intl'],['umix','Used mixer truck','ut',95000,.02,0,'kw pb mack'],['ugar','Used refuse truck','ut',110000,.02,0,'mack pb intl'],
 ['nvan','New dry van trailer','nt',48000,.04,0,'util gdane wab2'],['nflat','New flatbed trailer','nt',55000,.03,0,'util gdane wab2'],['nreef','New reefer trailer','nt',85000,.03,0,'util gdane wab2'],
 ['ndump','New dump truck','nt',240000,.02,0,'kw pb mack'],['nmix','New mixer truck','nt',260000,.02,0,'kw pb mack'],['ntow','New heavy wrecker','nt',420000,.01,0,'kw pb'],
 ['evcab','High-voltage cable','ev',680,.4,'EV','pp eaton'],['evcp','Battery coolant pump','ev',540,.4,'EV','pp bosch'],['evdc','DC-DC converter','ev',2600,.2,'EV','eaton pp'],['evobc','Onboard charger','ev',4800,.1,'EV','pp eaton'],
 ['evinv','Traction inverter','ev',9000,.08,'EV','dana eaton cum'],['evmot','Traction motor','ev',18000,.05,'EV','dana mer allison'],['evaxle','Electric axle','ev',38000,.04,'EV','dana mer allison'],
 ['evbat','Battery pack','ev',42000,.05,'EV','pp cum'],['evchg','Depot charger, 150 kW','ev',65000,.03,0,'abb cp'],['evchg2','Depot charger, 350 kW','ev',140000,.02,0,'abb cp'],
 ['nevbox','New electric box truck','ev',260000,.02,0,'kw pb'],['nev','New electric tractor','ev',420000,.02,0,'kw pb'],
 ['pmk','PM kit','kt',140,3,'ENG','trp pp flg don'],['brkk','Brake job kit','kt',260,3,'MOD','trp bend mer'],['whk','Wheel-end kit','kt',220,2,'POS','trp stemco skf timken'],
 ['clk','Clutch kit','kt',1200,.6,'TRN','eaton valeo luk trp'],['clnk','Cooling system kit','kt',680,.6,'MOD','trp gates mahle'],['ltk','Lighting upgrade kit','kt',380,1,'MOD','grote tl trp'],
 ['airk2','Air system rebuild kit','kt',520,.8,'MOD','bend hald wab trp'],['egrk','EGR service kit','kt',980,.5,'ENG','pp cum dd trp'],['ovk','Overhaul gasket kit','kt',1400,.4,'ENG','felp vrz cum dd pai'],
 ['ptop','PTO pump','vo',1600,.5,'VOC','muncie chelsea parker permco'],['tvalve','Tank valve','vo',420,1,'VOC','civ trp buyers'],['pcyl','Packer cylinder','vo',2400,.3,'VOC','heil mcn parker'],
 ['fpseal','Fire pump seal kit','vo',380,.8,'VOC','hale water trp'],['hoist','Dump hoist cylinder','vo',3800,.2,'VOC','cryst parker buyers'],['drumroll','Mixer drum roller','vo',620,.6,'VOC','mcn trp'],
 ['vapor2','Tanker vapor valve','vo',340,1,'VOC','civ trp'],['plow','Plow mount kit','vo',1800,.3,'VOC','fisher buyers'],['broom','Sweeper broom','vo',280,1,'VOC','trp buyers'],
 ['bdoor','Bus door motor','bu',680,.6,'BUS','vapor bbird trp'],['wclift','Wheelchair lift','bu',6800,.1,'BUS','ricon braun'],['dsign','Destination sign','bu',2400,.2,'BUS','hanov trp'],
 ['bseat','Bus seat','bu',420,1,'BUS','bbird trp natl'],['bhvac','Rooftop HVAC unit','bu',9800,.08,'BUS','tair carrier thermo'],['tbrk','Transit brake kit','bu',520,.8,'BUS','bend mer trp'],
 ['sarm','Stop arm','bu',380,.8,'BUS','bbird trp'],['cgate','Crossing gate','bu',260,1,'BUS','bbird trp'],
 ['aghose','Equipment hydraulic hose','ag',85,3,'AG','parker gates trp'],['troll','Track roller','ag',520,.8,'AG','berco itr catp'],['bteeth','Bucket teeth','ag',38,4,'AG','esco hens catp'],
 ['cedge','Cutting edge','ag',260,1,'AG','esco catp trp'],['lpin','Loader pin and bushing','ag',140,2,'AG','catp itr trp'],['fdseal','Final drive seal','ag',220,1,'AG','catp deere trp'],
 ['gtire','Grain cart tire','ag',1400,.3,'AG','titan fstone mich'],['cbelt','Combine belt','ag',180,1,'AG','gates deere casei'],
 ['rvwp','RV water pump','rv',110,2,'RV','shur dom camco'],['awn','RV awning','rv',980,.4,'RV','carefree dom lipp'],['ljack','Leveling jack','rv',420,.8,'RV','lipp trp'],
 ['genf','Generator filter','rv',18,4,'RV','onan trp'],['slm','Slide-out motor','rv',260,1,'RV','lipp trp'],['rvfr','RV refrigerator','rv',1800,.2,'RV','norc dom'],
 ['htsen','Holding tank sensor','rv',45,3,'RV','camco trp'],['rvbat','RV lithium battery','rv',900,.4,'RV','bborn trp'],
 ['mdwiper','Medium duty wiper blade','md',18,5,'MD','trico bosch trp'],['tdisc','Trailer disc brake pad','tr',85,2,0,'bend hald trp saf'],['tsus2','Trailer suspension kit','tr',780,.4,0,'hend saf trp'],
 ['towhit','Tow hitch','tw',320,1,0,'ba trp'],['ltb2','Amber light bar','x',420,1,0,'whelen ecco trp'],['fogl','Fog light','l',85,2,'MOD','hella grote trp']];


/* ---------- build the catalog ---------- */
const hash=s=>{let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h/4294967295};

/* every part climbs through 6 to 8 brands: parts with only a few get more from their department's pool,
   and big rebuildable parts also come in remanufactured lines */
const BRAND_POOL={f:'lub mann hast napa champ puro catp',s:'perm lps mech scott gor wd40 gojo loc',to:'crafts tek proto klein fluke milw dew',sf:'ansell ergo msa cort bdog kidde amerex',
 l:'hella whelen ecco maxx litf buss opt pet',el:'pion kenw lytx omni pilot garmin rand',b:'sealco tect trw velv hald mer wab',c:'velv seatsi natl cover dorman hadley bos',
 k:'gyb mahle modine behr nrf gates dayco',w:'hend dayt cr nseal stemco skf conmet',tr:'hutch saf whit todco phil grote',tw:'warn ramsey ba mytee peer zips',hy:'permco prince bez parker muncie chelsea',
 fu:'davco airdog fass carter racor stan bosch',e:'imb felp vrz ks mahle fpd pai',d:'wam valeo luk eaton spicer mer',a:'rw tenn faur ape don dinex',kt:'pp bend mer eaton gates mahle',
 bd:'retrac hoge eagle rwk dorman min',x:'rwk vchr hoge trux up gg',t:'yoko hank sumi bfg sail ling mich',md:'mcraft acd aisin isuzu hino wix',vo:'parker muncie chelsea heil mcn buyers',
 bu:'bbird ricon braun tair vapor hanov',ag:'catp deere casei esco hens berco itr',rv:'dom lipp shur norc camco onan',rf:'sanden rdot berg denso thermo carrier',h:'recon ddr eatr cum dd pai',
 ut:'kw pb fl volvo intl mack wstar',nt:'kw pb fl volvo mack wstar',ev:'accel siem heliox hyl cum dana'};
const REMAN=/starter|alternator|turbo|injector|transmission|control module|compressor|water pump|clutch|cylinder head|crankshaft|differential/i;
for(const b of BASE){const line=b[2],have=(b[6]||LI[line].brands).split(' ').filter(x=>BR[x]);
  let h=0;for(const ch of b[0])h=(h*31+ch.charCodeAt(0))%97;const want=Math.max(have.length,6+h%3);
  const add=(BRAND_POOL[line]||'').split(' ').filter(x=>BR[x]&&!have.includes(x));
  if(REMAN.test(b[1]))add.unshift(...['trpr','recon','ddr','eatr','drr'].filter(x=>!have.includes(x)).slice(0,2));
  while(have.length<want&&add.length)have.push(add.shift());b[6]=have.join(' ')}
const BRANDS=Object.entries(BR).map(([id,[n,t]])=>({id,n,t}));const BI={};BRANDS.forEach(b=>BI[b.id]=b);
const TORD={V:0,O:1,P:2};
const PARTS=[],PI={};
BASE.map((b,i)=>[b,i]).sort((x,y)=>LI[x[0][2]].i-LI[y[0][2]].i||x[1]-y[1]).forEach(([[bid,n,line,mkt,w,fit,br]])=>{
  const vs=(fit?FIT[fit]:[[null,null]]).map(([vk,vn])=>{const id=vk?bid+'-'+vk:bid;return {id,base:bid,n:vn?`${n}, ${vn}`:n,short:n,fit:vn||'',line,mkt:vk?Math.round(mkt*(.85+.3*hash(id))*100)/100:mkt,
    brands:(br||LI[line].brands).split(' ').filter(x=>BI[x])}});
  vs.sort((a,b)=>a.mkt-b.mkt).forEach(p=>{PARTS.push(p);PI[p.id]=p})});
const BASES=[];for(const p of PARTS)if(!BASES.includes(p.base))BASES.push(p.base);
const BASE_NAME={};for(const p of PARTS)BASE_NAME[p.base]=p.short;

/* ---------- the ladder: every product in order, cheapest to best ----------
   Within a part: house brand TRP first, then value, OE and premium brands; each brand runs through its fitments.
   Owning NEED facings of a step unlocks the next one. Finishing a part takes BASE_NEED of its last step. */
const NEED=10,BASE_NEED=25;
const LADDER=[],SI={};
for(const base of BASES){const ps=PARTS.filter(p=>p.base===base),brands=[...new Set(ps.flatMap(p=>p.brands))]
    .sort((a,b)=>(a==='trp'?-1:b==='trp'?1:0)||TORD[BI[a].t]-TORD[BI[b].t]||BI[a].n.localeCompare(BI[b].n));
  for(const b of brands)for(const p of ps)if(p.brands.includes(b)){const t=TIER[BI[b].t];
    const s={id:p.id+'.'+b,p:p.id,b,base,line:p.line,t:BI[b].t,price:Math.round(p.mkt*t.pf*100)/100};s.k=LADDER.length;LADDER.push(s);SI[s.id]=s}}
for(let k=0;k<LADDER.length;k++){const s=LADDER[k];s.first=k===0||LADDER[k-1].base!==s.base;s.last=k===LADDER.length-1||LADDER[k+1].base!==s.base}
/* economy (all in log10 so prices can climb past 1e308):
   each product starts above what the one before it costs once you've stocked enough to unlock it */
const lg=Math.log10,G=1.2,LG=lg(G);
/* the next product's first copy costs JUMP times the last copy you bought of the one before it.
   Pay is scaled down by the same amount so each step still takes the same time. */
const JUMP=2.5;
const needOf=s=>s.last?BASE_NEED:NEED;
let lam=1;for(const s of LADDER){if(s.k>0){const p=LADDER[s.k-1];lam+=needOf(p)*LG+lg(JUMP)}s.lam=lam;s.pay=27.54/(JUMP/1.12)*10**(2.35*s.k/LADDER.length)*(1+2*Math.max(0,1-s.k/900));/* the early game pays back three times slower, easing off by about part 15 */s.incL=lam-lg(s.pay);s.u=.25*10**(.07*(lam-1)/(1+(lam-1)/3000));s.g=G}
const NB=BASES.length,NS=LADDER.length;
const skuName=s=>`${BI[s.b].n} ${lc(PI[s.p].n)}`;

/* ---------- the store: four ladders, built like the parts list ----------
   Each aisle is a list of items, each item comes in a few makes or sizes.
   Own 10 of a step to unlock the next one. Every step is priced close to what a product costs
   at the point on the parts ladder where the store will need it. */
const AISLE_SPEC={
 ck:{n:'Checkout',unit:'units/s',base:2,a0:.375,off:3.1,x:8,N:300,items:[
  ['Counter bell',['Brass','Chrome','Desk']],['Cash drawer',['APG','MMF','Star Micronics']],['Cash register',['Casio','Sharp','Royal']],
  ['Card reader',['Square','Clover','Verifone','Ingenico']],['Barcode scanner',['Honeywell','Zebra','Datalogic']],['Receipt printer',['Epson','Star Micronics','Bixolon']],
  ['Label printer',['Zebra','Brother','DYMO']],['Counter mat',['Rubber','Anti-fatigue','Gel']],['Parts catalog',['=Paper parts catalog','=Catalog binder set','=Catalog library']],
  ['Part-time counter clerk',['Weekend','Evening','Morning']],['Counter stool',['Shop','Padded','Ergonomic']],['POS terminal',['Square','Clover','NCR','Lightspeed','Epicor']],
  ['Parts catalog terminal',['Single-screen','Dual-screen','Counter-wide']],['Full-time counter clerk',['Trainee','Experienced','Senior']],['Checkout lane',['Second','Third','Fourth']],
  ['Express counter',['One-lane','Two-lane','Four-lane']],['Counter salesperson',['Junior','Seasoned','Top-selling']],['Core return desk',['Small','Busy','Full-service']],
  ['Warranty desk',['Part-time','Full-time','Dedicated']],['Phone order desk',['One-line','Four-line','Twelve-line']],['Headset system',['Wired','Wireless','Multi-line']],
  ['Will-call window',['Walk-up','Drive-up','24-hour']],['Parts counter remodel',['=Fresh paint on the counter','=New counters','=Full counter remodel']],['Night drop box',['Small','Large','Secure']],['Online order desk',['Part-time','Full-time','Around-the-clock']],
  ['Parts runner',['Part-time','Full-time','Lead']],['Runner truck',['=Ford F-150 runner truck','=Ram 1500 runner truck','=Chevrolet Silverado runner truck']],
  ['Delivery van',['Ford Transit','Ram ProMaster','Mercedes-Benz Sprinter']],['Delivery route',['Local','County','Two-county']],['Box truck',['Isuzu NPR','Hino 195','Kenworth T280']],
  ['Dispatcher',['Part-time','Full-time','Lead']],['Pick-up lockers',['=Bank of 12 pick-up lockers','=Bank of 48 pick-up lockers','=Wall of 200 pick-up lockers']],
  ['Self-serve kiosk',['Lobby','Drive-through','Outdoor 24-hour']],['Mobile ordering app',['Basic','Catalog','Fleet']],['Fleet ordering portal',['Local','Regional','National']],
  ['Inside sales team',['Small','Mid-size','Large']],['Satellite counter',['Truck stop','Fleet yard','Port']],['Order hub',['City','State','Regional']],
  ['Call center',['Day-shift','Two-shift','Around-the-clock']],['Shuttle fleet',['Small','Medium','Large']],['Automated order system',['Pilot','Full','Next-generation']],
  ['Same-day delivery network',['Metro','State','Regional']],['Parts network',['Regional','National','Continental']],['Overnight air freight',['Regional','National','International']],
  ['Global order platform',['Pilot','Full','Worldwide']]]},
 sk:{n:'Stocking',unit:'units/s',base:2,a0:.5,off:3.1,x:8,N:300,items:[
  ['Box cutter',['Basic','Safety','Auto-retract']],['Step stool',['Plastic','Steel','Rolling']],['Hand truck',['Harper','Magliner','Wesco']],['Stock cart',['Rubbermaid','Uline','Akro-Mils']],
  ['Price gun',['Single-line','Two-line','Thermal']],['Part-time stock crew',['Weekend','Evening','Overnight']],['Rolling ladder',['Cotterman','Louisville','Werner']],
  ['Shelf labels',['Paper','Magnetic','Electronic']],['Inventory scanner',['Zebra','Honeywell','Datalogic']],['Pallet jack',['Crown','Raymond','Toyota']],
  ['Full-time stock crew',['Trainee','Experienced','Senior']],['Stockroom manager',['New','Experienced','Veteran']],['Walkie stacker',['Crown','Raymond','Big Joe']],
  ['Forklift',['Toyota','Hyster','Yale','Crown']],['Receiving dock',['One-door','Three-door','Six-door']],['Receiving clerk',['Part-time','Full-time','Lead']],
  ['Cycle count team',['Small','Night','Full']],['Order picker',['Crown','Raymond','Hyster']],['Reach truck',['Crown','Raymond','Yale']],['Pallet wrapper',['Manual','Semi-automatic','Automatic']],
  ['Dock leveler',['Mechanical','Hydraulic','Air-powered']],['Warehouse management system',['Basic','Pro','Enterprise']],['Pick-to-light system',['One-aisle','Half-store','Full-store']],
  ['Conveyor',['Gravity','Belt','Sortation']],['Carousel',['Horizontal','Vertical','Robotic']],['Vertical lift module',['Single','Twin','Quad']],
  ['Warehouse robots',['Starter fleet of','Fleet of','Swarm of']],['Sortation system',['Small','Mid-size','Large']],['Automated storage system',['Shuttle','Crane','Cube']],
  ['Cross-dock',['Small','Regional','National']],['Distribution center',['Local','Regional','National']],['Truck fleet',['Small','Mid-size','Large']],
  ['Rail spur',['Short','Long','Double-track']],['Freight network',['Regional','National','Continental']],['Automated port',['River','Lake','Ocean']],
  ['Global logistics network',['Pilot','Full','Worldwide']]]},
 cu:{n:'Customers',unit:'customers/s',base:.4,a0:.125,off:3.3,x:8,N:300,items:[
  ['Business cards',['Plain','Two-sided','Embossed']],['Flyers',['Truck stop','Feed store','Fuel island']],['Window sign',['Paper','Vinyl','Neon']],
  ['Free coffee',['=Free coffee pot','=Coffee bar','=Espresso machine']],['Newspaper ad',['Classified','Quarter-page','Full-page']],['Phone book ad',['Line','Box','Full-page']],
  ['Radio spot',['Farm report','Morning drive','Ballgame']],['Yard sign',['Small','Lit','Digital']],['Parts website',['Basic','Catalog','Ordering']],
  ['Search ads',['=Google Ads campaign','=Microsoft Ads campaign']],['Social media',['=Facebook page','=Instagram account','=YouTube channel','=TikTok account']],
  ['Email newsletter',['Monthly','Weekly','Daily']],['Store merch',['=Branded hats','=Branded shirts','=Branded jackets']],['Billboard',['Highway','Interstate','Digital']],
  ['Outside sales rep',['Part-time','Full-time','Senior']],['Customer appreciation day',['Spring','Summer','Fall']],['Fleet account manager',['Local','Regional','National']],
  ['Trade show booth',['County fair','State show','Mid-America Trucking Show']],['Sponsorship',['Little league','Truck pull','Racing']],['Regional TV ad',['Late-night','Prime-time','Big-game']],
  ['Loyalty program',['Punch card','Points','Fleet rewards']],['Podcast ad',['Trucking','Business','National']],['Streaming ad',['Regional','National','Prime-time']],
  ['National fleet program',['Starter','Growing','Major']],['Truck stop chain deal',['Regional','National','Coast-to-coast']],['Tire shop next door',['Small','Full','Commercial']],['Truck wash',['Self-serve','Automatic','Full-service']],['Spokesperson',['Local','Regional','National']],
  ['Nationwide campaign',['Spring','Year-round','Coast-to-coast']],['Household name',['Known','Famous','Legendary']],
  ['International campaign',['=Canada campaign','=Mexico campaign','=Worldwide campaign']]]},
 sh:{n:'Shelf space',unit:'facings',base:40,a0:5,off:3.3,x:8,N:720,items:[
  ['Pegboard',['Small','Large','Wall']],['Slatwall',['4-foot','8-foot','16-foot']],['Wire shelving',['Edsal','Tennsco','Lyon']],['Bin shelving',['Akro-Mils','Lyon','Penco']],
  ['Steel shelving',['Lyon','Tennsco','Penco','Republic']],['Gondola',['Lozier','Madix']],['Endcap display',['Single','Double','Lit']],['Spinner rack',['Small','Tall','Double']],
  ['Drawer cabinet',['Lista','Stanley Vidmar','Lyon']],['Cantilever rack',['Light','Medium','Heavy']],['Tire rack',['Wall','Stacking','Mobile']],['Filter wall',['Small','Medium','Full']],['Battery rack',['Two-tier','Four-tier','Rolling']],['Hose reel rack',['Single','Double','Wall']],['Drum rack',['Two-drum','Four-drum','Bulk']],
  ['Bulk fluid tank',['=Bulk oil tank','=Bulk coolant tank','=Bulk DEF tank']],
  ['Pallet racking',['Frazier','Interlake Mecalux','Unarco']],['Drive-in racking',['Small','Medium','Large']],['Tall racking',['16-foot','20-foot','24-foot']],['High-bay racking',['30-foot','40-foot','60-foot']],['Yard storage',['Fenced','Paved','Covered']],
  ['Mezzanine',['Small','Half-store','Full-store']],['Second floor',['=Second-floor storage','=Second-floor showroom','=Full second floor']],['Storage container',['20-foot','40-foot','High-cube']],['Pole barn',['Small','Large','Heated']],
  ['Warehouse annex',['Small','Large']],['New wing',['East','West','North']],['Second building',['Small','Large']],['Off-site warehouse',['Small','Large','Twin']],
  ['Parts campus',['Starter','Full']],['Mega warehouse',['Single-floor','Multi-floor']],['Regional depot',['North','South','West']],
  ['National depot',['Central','Coastal','Mountain']],['Parts city',['Planned','Full','Mega']]]}};
const ROMAN=['','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];
const genTag=n=>n<=20?ROMAN[n-1]:'No. '+n;
const PER_CUST=3,UNLOCK_N=10;
/* what each aisle has to keep up with at a point on the parts ladder */
const NEEDU=k=>Math.max(3,(13*k+5)*LADDER[k].u),NEEDF=k=>40+13*k;
const STEP={};
/* builds a set of capacity ladders (store aisles or shop sections) along a product ladder.
   needAt(g,k) is what group g has to keep up with at product step k; slot groups are spaced evenly. */
const MAXC=25;/* a step holds at most this many copies: past that, move up to the next item */
/* realAt(g,k): what group g really has to handle at product step k, given about 10 of each product */
/* priceAt(k): what one copy should cost if it unlocks at product step k (c.off is then roughly log10 of seconds of income) */
function buildAisles(SPEC,LAD,needAt,slot,realAt,priceAt,taper=1,bump=0){const OUT={},NL=LAD.length;
 for(const [g,c] of Object.entries(SPEC)){
  /* names: the listed items, then later generations of the last ten items */
  const names=[];c.items.forEach(([it,vs],i)=>vs.forEach(v=>names.push({it:i,item:it,n:v[0]==='='?v.slice(1):`${v} ${lc(it)}`})));
  const tail=c.items.slice(-10);let gen=2,ii=c.items.length;
  while(names.length<c.N){for(const [it,vs] of tail){const tag=genTag(gen);for(const v of vs)names.push({it:ii,item:`${it} ${tag}`,n:`${v[0]==='='?v.slice(1):v+' '+lc(it)} ${tag}`});ii++}gen++}
  names.length=Math.max(c.N,c.items.reduce((a,x)=>a+x[1].length,0));
  const isSlot=g===slot;
  /* need curve (never falls) */
  const need=[];let mx=0;for(let k=0;k<NL;k++){mx=Math.max(mx,needAt(g,k));need.push(mx)}
  const n0=Math.log10(need[0]),n1=Math.log10(need[NL-1]),M=names.length,out=[];let cap=c.base,k=0,prevL=-1,prevA=0;
  const ks=[];for(let j=0;j<M;j++){if(isSlot)k=Math.round(j*(NL-1)/(M-1));else{const f=j/(M-1);while(k<NL-1&&.5*(Math.log10(need[k])-n0)/(n1-n0)+.5*k/(NL-1)<f-1e-9)k++}ks.push(k)}
  let kb=0;
  for(let j=0;j<M;j++){k=ks[j];
    /* when this step is actually needed: the first point where what you sell outgrows what you already have */
    while(kb<NL-1&&realAt(g,kb)<cap*.95)kb++;
    /* a full step (25 copies) carries you about halfway to where the next step opens */
    const tgt=.9*Math.sqrt(need[k]*need[ks[Math.min(j+1,M-1)]]);
    let a=j===0?c.a0:Math.max(prevA*(isSlot?1:1.08),(tgt-cap)/MAXC);if(isSlot)a=Math.ceil(a);
    /* priced near what a product costs at the point this step is needed; each extra copy climbs gently, like parts do */
    /* priced as a few seconds of the income you'd expect when the step unlocks */
    const at=j?kb:0;let baseL=priceAt(at)+c.off*Math.min(1,at/taper)+bump*Math.min(1,at/5)*Math.max(0,1-at/120)+lg(c.x||1);if(j>0)baseL=Math.max(baseL,prevL+lg(1.3));
    const s={id:g+j,g,j,it:names[j].it,item:names[j].item,n:names[j].n,at:k,kb:at,amt:a,baseL,g2:isSlot?1.08:1.08};
    out.push(s);STEP[s.id]=s;cap+=MAXC*a;prevL=baseL;prevA=a}
  OUT[g]=out}
 return OUT}
/* expected earnings per second (log10) while working on product step k, calibrated against play */
const incAt=k=>{const s=LADDER[k];return s.lam-lg(s.pay)+1};
const CUMU=[],CUMF=[];{let u=0,f=0;for(const s of LADDER){u+=needOf(s)*s.u;f+=needOf(s);CUMU.push(u);CUMF.push(f)}}
const AISLE=buildAisles(AISLE_SPEC,LADDER,(g,k)=>g==='sh'?NEEDF(k):g==='cu'?NEEDU(k)/PER_CUST:NEEDU(k),'sh',(g,k)=>g==='sh'?CUMF[k]*2:g==='cu'?2*CUMU[k]/PER_CUST:2*CUMU[k],k=>incAt(k),8);
/* every shelf item holds at least one facing more than the one before it */
for(const st of [AISLE.sh])for(let j=1;j<st.length;j++)st[j].amt=Math.max(st[j].amt,st[j-1].amt+1);


const RANKS=[[-99,'Counter salesperson'],[4,'Senior counter salesperson'],[6,'Parts specialist'],[9,'Lead parts specialist'],[14,'Assistant parts manager'],[22,'Parts manager'],
 [35,'Service and parts director'],[55,'General manager'],[85,'Regional parts manager'],[130,'Regional vice president'],[200,'Vice president of parts'],[300,'President'],[450,'Owner'],
 [650,'Chairman of the board'],[900,'Industry legend'],[1300,'Living legend'],[1800,'Parts counter royalty'],[2400,'The one everyone calls'],[3200,'Founder of a parts empire'],[4200,'Parts tycoon'],[5400,'The parts counter itself']];
const rankOf=L=>(RANKS.filter(r=>L>=r[0]).pop()||RANKS[0])[1];

/* ---------- logbook and goals ---------- */
const LOG=[
 ['l0',()=>true,'First day behind the counter at Fremont Truck & Parts. The coffee is bad and the phone never stops. You love it.'],
 ['l1',()=>S.st.incidents>=1,'First mess of the day handled. Nobody even noticed.'],
 ['l2',()=>S.st.shop>0,'Caught a shoplifter at the door. He was trying to walk out with a light bar.'],
 ...LINES.slice(1).map(l=>['line_'+l.id,()=>S.top>=LADDER.findIndex(s=>s.line===l.id),`The first ${lc(l.n)} arrived. Rearranged half the back room to make space.`]),
 ...RANKS.slice(1).map(([v,r],i)=>['rank'+i,()=>S.st.totalL>=v,`New title: ${r}.`]),
 ['end',()=>S.top>=NS-1,'The last product on the list is on your shelf. There is nothing in the catalog you don\'t carry.']];
const A=[];
BASES.forEach((b,i)=>{const last=LADDER.filter(s=>s.base===b).pop();A.push({id:'m'+b,n:`Master ${lc(BASE_NAME[b])}`,ok:()=>L(S.f,last.id)>=BASE_NEED,i:last.k})});
[3,6,9,12,15,20,30,50,75,100,150,200,300,500,750,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500].forEach(v=>A.push({id:'c'+v,n:`Earn ${moneyL(v)} in total`,ok:()=>S.st.totalL>=v}));
LINES.forEach(l=>A.push({id:'ln'+l.id,n:`Stock every ${lc(l.n)} product`,ok:()=>{const last=LADDER.filter(s=>s.line===l.id).pop();return S.top>last.k}}));
for(const g of Object.keys(AISLE))[5,15,30,60,100,150,200,300,500].forEach(j=>{const st=AISLE[g][j];if(st)A.push({id:'cap'+g+j,n:`Own one: ${st.n}`,ok:()=>L(S.b,st.id)>0})});
[100,1000,1e4,5e4,1e5].forEach(v=>A.push({id:'fac'+v,n:`Own ${fmt(v)} facings`,ok:()=>FAC>=v}));
[1,10,100,1000].forEach(v=>A.push({id:'ic'+v,n:`Handle ${fmt(v)} incident${v>1?'s':''}`,ok:()=>S.st.incidents>=v}));

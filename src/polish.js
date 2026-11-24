/* ===== Parts Counter Idle: look-and-feel touches. Nothing here changes the game itself. ===== */
/* gray buttons fill with color as your cash gets close to the price */
function fillPass(){for(const b of document.querySelectorAll('button[data-cl]')){if(b.offsetParent===null)continue;const f=b.disabled?Math.max(0,Math.min(1,10**(S.cashL-(+b.dataset.cl)))):1;b.style.setProperty('--f',(f*100).toFixed(1)+'%')}}
/* the income number gives a little pulse when it goes up */
let lastInc=null;function pulsePass(){const v=R.incL;if(lastInc!==null&&isFinite(v)&&v>lastInc+lg(1.004)){const el=$('cps');el.classList.remove('pulse');void el.offsetWidth;el.classList.add('pulse')}lastInc=v}
/* the header shrinks once you scroll down the list */
/* two thresholds so the header can't flip back and forth while its own height changes */
let mini=false;addEventListener('scroll',()=>{const y=scrollY;if(!mini&&y>160){mini=true;$('top').classList.add('mini')}else if(mini&&y<24){mini=false;$('top').classList.remove('mini')}},{passive:true});
/* tabs slide in from the side you tapped */
let lastTabI=TABS.findIndex(t=>t[0]===tab);
document.addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;const i=TABS.findIndex(t=>t[0]===b.dataset.tab),sec=$('t-'+b.dataset.tab);if(!sec||i===lastTabI)return;
  sec.style.setProperty('--tx',(i>lastTabI?14:-14)+'px');sec.classList.remove('tabin');void sec.offsetWidth;if(S.ui.anim)sec.classList.add('tabin');lastTabI=i});


/* the slim goal bar in the shrunken header */
function goalPass(){const g=window.GOAL;if(!g||!$('gbTxt'))return;if($('gbTxt').textContent!==g.txt)$('gbTxt').textContent=g.txt;$('gbM').style.width=Math.min(100,g.have/g.need*100)+'%'}
setInterval(()=>{if(document.hidden)return;fillPass();pulsePass();goalPass()},250);


const btn = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (btn && nav) btn.addEventListener('click', () => nav.classList.toggle('open'));

const search = document.querySelector('#site-search');
if (search) {
  const cards = [...document.querySelectorAll('[data-search]')];
  search.addEventListener('input', e => {
    const q = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
      card.style.display = card.dataset.search.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

(() => {
  const STORAGE_KEY='sinnersAchievementsV11',NAMES_KEY='sinnersTrueNamesV11',
        LIBRARY_KEY='sinnersAchievementLibraryDiscoveredV11',FRAME_KEY='sinnersWatcherFrameEnabledV11',
        PENDING_KEY='sinnersPendingAchievementToastsV11',ACTIVE_TOAST_KEY='sinnersActiveAchievementToastV11';

  const trueNames=['Lucifer','Belphegor','Asmodeus','Satan','Leviathan','Beelzebub','Mammon'];
  const definitions=[
    {id:'shazam-name',title:'A Name Worthy of a Hero',description:"Shazam isn't the only name associated with the legendary hero.",hint:'Sometimes the most obvious answer is worth trying.'},
    {id:'great-tree-village',title:'The Village the Map Forgot',description:"Somewhere in the world's forests is a village most people will never know exists.",hint:'One forest hides more than trees.'},
    {id:'kitsune-sight',title:'Eyes That See Too Much',group:'great-tree',description:'Some Kitsune perceive something most of the world cannot.',hint:'Pay attention to the Kitsune, their eyes, and what they are allowed to see.'},
    {id:'great-hunt',title:"The Village's Buried History",group:'great-tree',description:'The Great Tree Village closed itself away for a reason.',hint:'Once you find the village, read what it remembers.'},
    {id:'isle-arrival',title:'Do Not Approach',group:'isle',description:"Everyone seems to agree you shouldn't go there. Strange.",hint:'The western island is marked more clearly than its secrets are.'},
    {id:'god-tongue',title:'A Language for Gods',group:'isle',description:'Some words were never meant for mortal mouths.',hint:'On the Isle, not every mark is decoration.'},
    {id:'crystal-research',title:'What the Crystals Really Do',group:'isle',description:'Someone studied the crystals far more closely than the public archive suggests.',hint:'Look for research notes rather than creature records.'},
    {id:'blood-red-records',title:'The Red Experiments',group:'isle',description:'One crystal color produced a very different kind of research.',hint:'Follow the red.'},
    {id:'old-experiment-log',title:'The Earlier Experiments',group:'isle',description:"The records you found weren't the first experiments.",hint:'New research usually has old mistakes behind it.'},
    {id:'nogard-hidden-record',title:"A Legend's Hidden File",description:'One legendary figure has more written about them than the public record shows.',hint:"Look closely around Nogard's history. Not every record announces itself."},
    {id:'ruins-beneath-oro',title:'What Lies Beneath Oro',description:"The city standing there now isn't the first thing to occupy that ground.",hint:"Oro's past is easier to find when you stop looking only at Oro as it is now."},
    {id:'odins-children',title:"Odin's Children",description:'Odin left behind more than plans, victories, and a legacy.',hint:"Odin's story reaches beyond the obvious records about him."},
    {id:'overgod-hidden-record',title:"The Overgod's Hidden Record",description:'There is more recorded about the Overgod than the public archive is willing to show.',hint:"Etro is broadcasting more than entertainment."},
    {id:'greed-contract',title:"Greed's Fine Print",description:'Greed has an agreement waiting for anyone curious enough to find it.',hint:'Greed likes contracts. His page likes them too.'},
    {id:'seven-true-names',title:'The Names Behind the Sins',description:'Each of the Seven Sins has a name far more important than the one mortals usually call them.',hint:'Greed can give you a starting point. After that, pay attention to names.',progress:'true-names'},
    {id:'archive-pride',title:'Pride — The Man Before the God',group:'watchers',description:'A restricted history exists for Pride.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-sloth',title:'Sloth — Seventy-Five Years',group:'watchers',description:'A restricted history exists for Sloth.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-lust',title:'Lust — What She Heard Through the Wall',group:'watchers',description:'A restricted history exists for Lust.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-wrath',title:"Wrath — Justice Wasn't the First Lesson",group:'watchers',description:'A restricted history exists for Wrath.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-envy',title:'Envy — He Was Always Watching',group:'watchers',description:'A restricted history exists for Envy.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-gluttony',title:'Gluttony — Nothing Should Be Disposable',group:'watchers',description:'A restricted history exists for Gluttony.',hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-greed',title:'Greed — The Last One Out',group:'watchers',description:'A restricted history exists for Greed.',hint:'Knowing who a Sin truly is may open records normally kept closed.'}
  ];
  const ids=definitions.map(d=>d.id),byId=Object.fromEntries(definitions.map(d=>[d.id,d]));

  const parse=(s,k,f)=>{try{return JSON.parse(s.getItem(k))??f}catch(_){return f}};
  const getUnlocked=()=>{const v=parse(localStorage,STORAGE_KEY,[]);return Array.isArray(v)?v.filter(id=>ids.includes(id)):[]};
  const saveUnlocked=v=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...new Set(v)]))}catch(_){}};
  const getTrueNames=()=>{const v=parse(localStorage,NAMES_KEY,[]);return Array.isArray(v)?v.filter(n=>trueNames.includes(n)):[]};
  const saveTrueNames=v=>{try{localStorage.setItem(NAMES_KEY,JSON.stringify([...new Set(v)]))}catch(_){}};
  const isComplete=()=>{const u=new Set(getUnlocked());return ids.every(id=>u.has(id))};
  const count=()=>getUnlocked().length;
  function frameEnabled(){if(!isComplete())return false;try{const v=localStorage.getItem(FRAME_KEY);return v===null?true:v!=='false'}catch(_){return true}}
  function setFrameEnabled(v){try{localStorage.setItem(FRAME_KEY,v?'true':'false')}catch(_){}applyCompletionFrame();renderAchievementPage()}
  const libraryDiscovered=()=>{try{return localStorage.getItem(LIBRARY_KEY)==='1'}catch(_){return false}};
  function markLibraryDiscovered(){try{localStorage.setItem(LIBRARY_KEY,'1')}catch(_){}addFooterLibraryLink()}

  const queue=[];let busy=false,active=null;
  function host(){let h=document.getElementById('achievementToastHost');if(!h){h=document.createElement('div');h.id='achievementToastHost';h.className='achievement-toast-host';h.setAttribute('aria-live','polite');document.body.appendChild(h)}return h}
  function chime(){try{const a=new Audio('/achievement-chime.mp3');a.volume=.20;a.play().catch(()=>{})}catch(_){}}
  const serial=d=>({title:d.title||'',detail:d.detail||'',href:d.href||'',label:d.label||'',icon:d.icon||'',sound:false});
  function persist(){if(!active||active.suppress)return;const remaining=Math.max(0,active.deadline-Date.now());if(remaining<180)return;try{sessionStorage.setItem(ACTIVE_TOAST_KEY,JSON.stringify({data:serial(active.data),remaining}))}catch(_){}}
  window.addEventListener('pagehide',persist);
  function enqueue(data){queue.push(data);if(!busy)next()}
  function next(){
    if(!queue.length){busy=false;active=null;return}
    busy=true;const data=queue.shift(),h=host(),t=document.createElement(data.href?'a':'div');
    t.className='achievement-toast';if(data.href)t.href=data.href;
    t.innerHTML=`<span class="achievement-toast-icon">${data.icon||'✦'}</span><span class="achievement-toast-copy"><small>${data.label||'SECRET DISCOVERED'}</small><strong>${data.title}</strong>${data.detail?`<em>${data.detail}</em>`:''}</span><span class="achievement-toast-chevron">›</span>`;
    h.replaceChildren(t);requestAnimationFrame(()=>t.classList.add('show'));if(data.sound!==false)chime();
    const life=Math.max(900,data.duration||6500);active={data,deadline:Date.now()+life,suppress:false};const timer=setTimeout(close,life);
    function close(){clearTimeout(timer);try{sessionStorage.removeItem(ACTIVE_TOAST_KEY)}catch(_){}if(active&&active.data===data)active=null;t.classList.remove('show');setTimeout(()=>{t.remove();next()},360)}
    t.addEventListener('click',()=>{if(active)active.suppress=true;try{sessionStorage.removeItem(ACTIVE_TOAST_KEY)}catch(_){}if(!data.href)close()});
  }
  function defer(data){try{const p=parse(sessionStorage,PENDING_KEY,[]);p.push({...serial(data),sound:data.sound!==false});sessionStorage.setItem(PENDING_KEY,JSON.stringify(p))}catch(_){}}

  function reward(was){if(!was&&isComplete()){try{if(localStorage.getItem(FRAME_KEY)===null)localStorage.setItem(FRAME_KEY,'true')}catch(_){}applyCompletionFrame();enqueue({label:'ARCHIVE COMPLETE',title:"The Watcher's Frame",detail:'Nothing remains hidden from you.',href:'/achievements.html',icon:'✧',duration:7600,sound:true})}}
  function unlock(id,opt={}){
    const d=byId[id];if(!d)return false;const u=getUnlocked();if(u.includes(id))return false;const was=isComplete();u.push(id);saveUnlocked(u);
    const toast={title:opt.title||d.title,detail:opt.detail||d.description,href:opt.href||('/achievements.html#'+id),label:opt.label||'SECRET DISCOVERED',icon:opt.icon||'✦',sound:opt.sound!==false,duration:opt.duration};
    if(opt.deferToast)defer(toast);else enqueue(toast);updateArchiveStatus();renderAchievementPage();reward(was);return true;
  }
  function noteTrueName(name){
    if(!trueNames.includes(name))return false;const seen=getTrueNames();if(seen.includes(name))return false;seen.push(name);saveTrueNames(seen);
    if(seen.length<7)enqueue({label:'TRUE NAME RECOVERED',title:name,detail:`${seen.length} / 7 True Names recovered`,href:'/achievements.html#seven-true-names',icon:'✧',sound:seen.length===1});
    else unlock('seven-true-names',{label:'TRUE NAMES COMPLETE',title:'The Names Behind the Sins',detail:'7 / 7 True Names recovered',href:'/achievements.html#seven-true-names',icon:'✧',sound:true});
    renderAchievementPage();return true;
  }
  function discoverLibrary(show=true){const first=!libraryDiscovered();markLibraryDiscovered();if(first&&show)enqueue({label:'HIDDEN INDEX FOUND',title:'The Archive Is Watching',detail:'You found the record of records.',href:'/achievements.html',icon:'◈',sound:true});return first}
  function addFooterLibraryLink(){if(!libraryDiscovered())return;const f=document.querySelector('footer');if(!f||f.querySelector('.achievement-library-link'))return;const s=document.createElement('span');s.className='footer-achievement-sep';s.textContent=' · ';const a=document.createElement('a');a.className='achievement-library-link';a.href='/achievements.html';a.textContent='Archive Discoveries';f.append(s,a)}
  function updateArchiveStatus(){const n=document.getElementById('archiveStatusEasterEgg');if(!n)return;const complete=isComplete(),a=n.querySelector('[data-achievement-count]'),b=n.querySelector('[data-achievement-state]');if(a)a.textContent=String(count());if(b)b.textContent=complete?'COMPLETE':'INCOMPLETE';n.classList.toggle('complete',complete)}

  function activateCompletionEye(frame){
    window.__watcherCompletionEyeCleanup?.();
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const update=(x=window.innerWidth/2,y=window.innerHeight/2)=>{
      const nx=Math.max(-1,Math.min(1,(x/window.innerWidth-.5)*2));
      const ny=Math.max(-1,Math.min(1,(y/window.innerHeight-.5)*2));
      frame.style.setProperty('--watcher-eye-x',`${(nx*2.25).toFixed(2)}px`);
      frame.style.setProperty('--watcher-eye-y',`${(ny*1.45).toFixed(2)}px`);
      frame.style.setProperty('--watcher-pupil-x',`${(nx*1.18).toFixed(2)}px`);
      frame.style.setProperty('--watcher-pupil-y',`${(ny*0.78).toFixed(2)}px`);
    };
    update();
    if(reduced){
      window.__watcherCompletionEyeCleanup=()=>{};
      return;
    }
    let raf=0;
    const onMove=e=>{
      const {clientX,clientY}=e;
      cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>update(clientX,clientY));
    };
    const onBlur=()=>update();
    window.addEventListener('pointermove',onMove,{passive:true});
    window.addEventListener('blur',onBlur);
    window.__watcherCompletionEyeCleanup=()=>{
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove',onMove);
      window.removeEventListener('blur',onBlur);
    };
  }


  function activateCompletionEyeSigils(frame){
    const eye=frame.querySelector('.watcher-eye-mark');
    const crest=frame.querySelector('.watcher-frame-crest');
    if(!eye||!crest)return;

    const gods=[
      {name:'Pride',src:'/sigil-pride.png',color:'#d4d0ff'},
      {name:'Sloth',src:'/sigil-sloth.png',color:'#7d68d9'},
      {name:'Lust',src:'/sigil-lust.png',color:'#d83f78'},
      {name:'Wrath',src:'/sigil-wrath.png',color:'#ef7b13'},
      {name:'Envy',src:'/sigil-envy.png',color:'#5d8f45'},
      {name:'Gluttony',src:'/sigil-gluttony.png',color:'#8f2c1f'},
      {name:'Greed',src:'/sigil-greed.png',color:'#d6a625'},
      {name:'Patience',src:'/sigil-virtue-patience.png',color:'#75d8f1'},
      {name:'Diligence',src:'/sigil-virtue-diligence.png',color:'#d95a45'},
      {name:'Humility',src:'/sigil-virtue-humility.png',color:'#a7b9d6'},
      {name:'Chastity',src:'/sigil-virtue-chastity.png',color:'#e1e6f6'},
      {name:'Charity',src:'/sigil-virtue-charity.png',color:'#f0c46e'},
      {name:'Temperance',src:'/sigil-virtue-temperance.png',color:'#9b7ddf'},
      {name:'Kindness',src:'/sigil-virtue-kindness.png',color:'#f19db4'}
    ];

    // Preload every possible reveal so the first click does not spend the animation waiting on an image.
    gods.forEach(god=>{const image=new Image();image.src=god.src;});

    let sigil=eye.querySelector('.watcher-eye-sigil-image');
    if(!sigil){
      sigil=document.createElement('img');
      sigil.className='watcher-eye-sigil-image';
      sigil.alt='';
      sigil.setAttribute('aria-hidden','true');
      eye.appendChild(sigil);
    }

    let nameplate=crest.querySelector('.watcher-eye-god-name');
    if(!nameplate){
      nameplate=document.createElement('span');
      nameplate.className='watcher-eye-god-name';
      nameplate.setAttribute('aria-hidden','true');
      crest.appendChild(nameplate);
    }

    let last=-1;
    let bag=[];
    let timer=0;
    let revealToken=0;

    const refillBag=()=>{
      bag=gods.map((_,index)=>index);
      for(let i=bag.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        [bag[i],bag[j]]=[bag[j],bag[i]];
      }
      // Avoid the new cycle opening with the same god that ended the previous cycle.
      if(bag.length>1 && bag[0]===last){
        const swapIndex=1+Math.floor(Math.random()*(bag.length-1));
        [bag[0],bag[swapIndex]]=[bag[swapIndex],bag[0]];
      }
    };

    const drawGod=()=>{
      if(!bag.length)refillBag();
      const index=bag.shift();
      last=index;
      return gods[index];
    };

    eye.setAttribute('role','button');
    eye.setAttribute('tabindex','0');
    eye.setAttribute('aria-label','Watcher eye');

    const beginReveal=(god,token)=>{
      if(token!==revealToken)return;
      clearTimeout(timer);
      nameplate.textContent=god.name;
      nameplate.style.setProperty('--sigil-glow',god.color);
      frame.style.setProperty('--watcher-god-glow',god.color);
      frame.dataset.revealGod=god.name;
      frame.classList.remove('god-reveal');
      eye.classList.remove('sigil-reveal');
      void frame.offsetWidth;
      frame.classList.add('god-reveal');
      eye.classList.add('sigil-reveal');

      timer=setTimeout(()=>{
        if(token!==revealToken)return;
        frame.classList.remove('god-reveal');
        eye.classList.remove('sigil-reveal');
        delete frame.dataset.revealGod;
      },2400);
    };

    const reveal=()=>{
      const god=drawGod();
      const token=++revealToken;

      sigil.style.setProperty('--sigil-glow',god.color);
      sigil.onload=()=>beginReveal(god,token);
      sigil.onerror=()=>beginReveal(god,token); // name/color still reveal even if an asset ever fails.
      sigil.src=god.src;
      if(sigil.complete){
        requestAnimationFrame(()=>beginReveal(god,token));
      }
    };

    eye.addEventListener('click',reveal);
    eye.addEventListener('keydown',event=>{
      if(event.key==='Enter'||event.key===' '){
        event.preventDefault();
        reveal();
      }
    });
  }

  function applyCompletionFrame(){
    let f=document.getElementById('watcherCompletionFrame');const on=frameEnabled();document.documentElement.classList.toggle('watcher-frame-active',on);if(!on){window.__watcherCompletionEyeCleanup?.();f?.remove();return}if(f)return;
    f=document.createElement('div');f.id='watcherCompletionFrame';f.className='watcher-completion-frame';f.setAttribute('aria-hidden','true');
    f.style.setProperty('position','fixed','important');
    f.style.setProperty('inset','0','important');
    f.style.setProperty('z-index','2147483000','important');
    f.style.setProperty('pointer-events','none','important');
    f.innerHTML=`<span class="watcher-frame-aura"></span><span class="watcher-frame-rail wf-top"></span><span class="watcher-frame-rail wf-bottom"></span><span class="watcher-frame-rail wf-left"></span><span class="watcher-frame-rail wf-right"></span><span class="watcher-ornament wo-tl"><i></i><b>✣</b></span><span class="watcher-ornament wo-tr"><i></i><b>◊</b></span><span class="watcher-ornament wo-bl"><i></i><b>⟁</b></span><span class="watcher-ornament wo-br"><i></i><b>✣</b></span><span class="watcher-frame-crest"><i class="watcher-eye-mark"><span class="watcher-eye-shell" aria-hidden="true"></span><span class="watcher-eye-lid" aria-hidden="true"></span><b class="watcher-eye-iris" aria-hidden="true"><span class="watcher-eye-pupil"></span></b><span class="watcher-eye-line" aria-hidden="true"></span></i><em>THE ARCHIVE RECOGNIZES YOU</em></span><span class="watcher-lore-script watcher-lore-left">✣  ◊  ⟁  VII  ✧</span><span class="watcher-lore-script watcher-lore-right">✧  VII  ⟁  ◊  ✣</span><span class="watcher-side-title watcher-side-left">WATCHER</span><span class="watcher-side-title watcher-side-right">ARCHIVE</span><span class="watcher-sin-seals"><i style="--c:#e9e8ff"></i><i style="--c:#7b68d8"></i><i style="--c:#e14f91"></i><i style="--c:#e14535"></i><i style="--c:#35b7c8"></i><i style="--c:#8dbb45"></i><i style="--c:#d9a62e"></i></span>`;document.body.appendChild(f);activateCompletionEye(f);activateCompletionEyeSigils(f);
  }
  function renderAchievementPage(){
    const grid=document.getElementById('achievementLibraryGrid');if(!grid)return;const unlocked=new Set(getUnlocked()),names=getTrueNames();
    const card=(d,sub=false)=>{const done=unlocked.has(d.id),a=document.createElement('article');a.id=d.id;a.className=`achievement-card ${done?'unlocked':'locked'} ${sub?'sub-achievement':''}`;const p=d.progress==='true-names'?`<span class="achievement-progress-mini">${names.length} / 7 names</span>`:'';a.innerHTML=`<div class="achievement-state-icon">${done?'✓':'◇'}</div><div><div class="achievement-card-top"><h3>${d.title}</h3>${p}</div><p>${d.description}</p>${done?'<div class="achievement-found">DISCOVERED</div>':`<details><summary>Vague Hint</summary><p>${d.hint}</p></details>`}</div>`;return a};
    grid.replaceChildren();['shazam-name','great-tree-village'].forEach(id=>grid.appendChild(card(byId[id])));
    const group=(title,desc,list)=>{const s=document.createElement('section');s.className='achievement-group';const done=list.filter(id=>unlocked.has(id)).length;s.innerHTML=`<div class="achievement-group-head"><div><span class="achievement-group-kicker">GROUPED DISCOVERY</span><h2>${title}</h2><p>${desc}</p></div><strong>${done} / ${list.length}</strong></div>`;const sub=document.createElement('div');sub.className='achievement-subgrid';list.forEach(id=>sub.appendChild(card(byId[id],true)));s.appendChild(sub);grid.appendChild(s)};
    group('Behind the Great Tree','Finding the village is only the beginning.',['kitsune-sight','great-hunt']);
    group('Secrets of the Isle','The western island contains several separate discoveries.',['isle-arrival','god-tongue','crystal-research','blood-red-records','old-experiment-log']);
    ['nogard-hidden-record','ruins-beneath-oro','odins-children','overgod-hidden-record','greed-contract','seven-true-names'].forEach(id=>grid.appendChild(card(byId[id])));
    group('The Seven Before They Were Gods','Seven restricted histories. Seven names beneath the titles.',['archive-pride','archive-sloth','archive-lust','archive-wrath','archive-envy','archive-gluttony','archive-greed']);
    const n=unlocked.size,pct=Math.round(n/ids.length*100),t=document.querySelector('[data-achievement-total-count]'),f=document.querySelector('[data-achievement-found-count]'),p=document.querySelector('[data-achievement-percent]'),bar=document.querySelector('.achievement-progress-fill');if(t)t.textContent=ids.length;if(f)f.textContent=n;if(p)p.textContent=pct+'%';if(bar)bar.style.width=pct+'%';const r=document.getElementById('watcherFrameReward'),tog=document.getElementById('watcherFrameToggle');if(r)r.classList.toggle('unlocked',isComplete());if(tog){tog.disabled=!isComplete();tog.checked=frameEnabled()}
  }
  function resetProgress(){try{localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(NAMES_KEY);localStorage.removeItem(FRAME_KEY);localStorage.removeItem(LIBRARY_KEY);sessionStorage.removeItem(PENDING_KEY);sessionStorage.removeItem(ACTIVE_TOAST_KEY)}catch(_){}queue.length=0;active=null;document.documentElement.classList.remove('watcher-frame-active');document.getElementById('watcherCompletionFrame')?.remove();document.getElementById('achievementToastHost')?.replaceChildren();updateArchiveStatus();renderAchievementPage()}
  window.SinnersAchievements={definitions,unlock,noteTrueName,discoverLibrary,getUnlocked,getTrueNames,isComplete,count,frameEnabled,setFrameEnabled,resetProgress};

  try{const a=parse(sessionStorage,ACTIVE_TOAST_KEY,null);sessionStorage.removeItem(ACTIVE_TOAST_KEY);if(a?.data&&a.remaining>150)setTimeout(()=>enqueue({...a.data,sound:false,duration:Math.max(1400,a.remaining)}),160)}catch(_){}
  try{const p=parse(sessionStorage,PENDING_KEY,[]);sessionStorage.removeItem(PENDING_KEY);if(Array.isArray(p)&&p.length)setTimeout(()=>p.forEach(d=>enqueue(d)),420)}catch(_){}

  document.addEventListener('click',e=>{const t=e.target.closest('[data-achievement]');if(!t)return;unlock(t.dataset.achievement,{deferToast:t.hasAttribute('data-achievement-nav')})},true);
  document.addEventListener('DOMContentLoaded',()=>{
    updateArchiveStatus();applyCompletionFrame();addFooterLibraryLink();renderAchievementPage();
    const egg=document.getElementById('archiveStatusEasterEgg');if(egg){const open=()=>{const first=discoverLibrary(true);if(first)setTimeout(()=>location.href='/achievements.html',950);else location.href='/achievements.html'};egg.addEventListener('click',open);egg.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})}
    if(location.pathname.endsWith('/achievements.html')||location.pathname==='/achievements.html'){markLibraryDiscovered();renderAchievementPage();document.getElementById('achievementResetProgress')?.addEventListener('click',()=>{if(confirm('Reset all achievement progress on this browser? This cannot be undone.'))resetProgress()});const tog=document.getElementById('watcherFrameToggle');tog?.addEventListener('change',()=>setFrameEnabled(tog.checked));if(location.hash)setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),250)}
  });
})();

(() => {
  const versionText='Sinners World Archive — Version 1.1';
  const footer=document.querySelector('footer');
  if(footer)footer.textContent=versionText;
  else{const f=document.createElement('footer');f.textContent=versionText;document.body.appendChild(f)}
  setTimeout(()=>{try{if(localStorage.getItem('sinnersAchievementLibraryDiscoveredV11')==='1'){const f=document.querySelector('footer');if(f&&!f.querySelector('.achievement-library-link')){const s=document.createElement('span');s.className='footer-achievement-sep';s.textContent=' · ';const a=document.createElement('a');a.className='achievement-library-link';a.href='/achievements.html';a.textContent='Archive Discoveries';f.append(s,a)}}}catch(_){}},0);
})();

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

// ---------------------------------------------------------------------------
// V1.1 Hidden Discovery / Achievement system
// Progress is stored locally in the visitor's browser. No account is required.
// ---------------------------------------------------------------------------
(() => {
  const STORAGE_KEY = 'sinnersAchievementsV11';
  const NAMES_KEY = 'sinnersTrueNamesV11';
  const LIBRARY_KEY = 'sinnersAchievementLibraryDiscoveredV11';
  const FRAME_KEY = 'sinnersWatcherFrameEnabledV11';
  const PENDING_KEY = 'sinnersPendingAchievementToastsV11';

  const trueNames = ['Lucifer','Belphegor','Asmodeus','Satan','Leviathan','Beelzebub','Mammon'];
  const definitions = [
    {id:'shazam-name', title:'A Name Worthy of a Hero', group:'standalone', description:"Shazam isn't the only name associated with the legendary hero.", hint:'Sometimes the most obvious answer is worth trying.'},
    {id:'great-tree-village', title:'The Village the Map Forgot', group:'standalone', description:"Somewhere in the world's forests is a village most people will never know exists.", hint:'One forest hides more than trees.'},
    {id:'kitsune-sight', title:'Eyes That See Too Much', group:'great-tree', description:'Some Kitsune perceive something most of the world cannot.', hint:'Pay attention to the Kitsune, their eyes, and what they are allowed to see.'},
    {id:'great-hunt', title:"The Village's Buried History", group:'great-tree', description:'The Great Tree Village closed itself away for a reason.', hint:'Once you find the village, read what it remembers.'},
    {id:'isle-arrival', title:'Do Not Approach', group:'isle', description:"Everyone seems to agree you shouldn't go there. Strange.", hint:'The western island is marked more clearly than its secrets are.'},
    {id:'god-tongue', title:'A Language for Gods', group:'isle', description:'Some words were never meant for mortal mouths.', hint:'On the Isle, not every mark is decoration.'},
    {id:'crystal-research', title:'What the Crystals Really Do', group:'isle', description:'Someone studied the crystals far more closely than the public archive suggests.', hint:'Look for research notes rather than creature records.'},
    {id:'blood-red-records', title:'The Red Experiments', group:'isle', description:'One crystal color produced a very different kind of research.', hint:'Follow the red.'},
    {id:'old-experiment-log', title:'The Earlier Experiments', group:'isle', description:"The records you found weren't the first experiments.", hint:'New research usually has old mistakes behind it.'},
    {id:'nogard-hidden-record', title:"A Legend's Hidden File", group:'standalone', description:'One legendary figure has more written about them than the public record shows.', hint:"Look closely around Nogard's history. Not every record announces itself."},
    {id:'ruins-beneath-oro', title:'What Lies Beneath Oro', group:'standalone', description:"The city standing there now isn't the first thing to occupy that ground.", hint:"Oro's past is easier to find when you stop looking only at Oro as it is now."},
    {id:'odins-children', title:"Odin's Children", group:'standalone', description:'Odin left behind more than plans, victories, and a legacy.', hint:"Odin's story reaches beyond the obvious records about him."},
    {id:'overgod-hidden-record', title:"The Overgod's Hidden Record", group:'standalone', description:'There is more recorded about the Overgod than the public archive is willing to show.', hint:"Etro is broadcasting more than entertainment."},
    {id:'greed-contract', title:"Greed's Fine Print", group:'standalone', description:'Greed has an agreement waiting for anyone curious enough to find it.', hint:'Greed likes contracts. His page likes them too.'},
    {id:'seven-true-names', title:'The Names Behind the Sins', group:'standalone', description:'Each of the Seven Sins has a name far more important than the one mortals usually call them.', hint:'Greed can give you a starting point. After that, pay attention to names.', progress:'true-names'},
    {id:'archive-pride', title:'Pride — The Man Before the God', group:'watchers', description:'A restricted history exists for Pride.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-sloth', title:'Sloth — Seventy-Five Years', group:'watchers', description:'A restricted history exists for Sloth.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-lust', title:'Lust — What She Heard Through the Wall', group:'watchers', description:'A restricted history exists for Lust.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-wrath', title:"Wrath — Justice Wasn't the First Lesson", group:'watchers', description:'A restricted history exists for Wrath.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-envy', title:'Envy — He Was Always Watching', group:'watchers', description:'A restricted history exists for Envy.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-gluttony', title:'Gluttony — Nothing Should Be Disposable', group:'watchers', description:'A restricted history exists for Gluttony.', hint:'Knowing who a Sin truly is may open records normally kept closed.'},
    {id:'archive-greed', title:'Greed — The Last One Out', group:'watchers', description:'A restricted history exists for Greed.', hint:'Knowing who a Sin truly is may open records normally kept closed.'}
  ];
  const ids = definitions.map(d => d.id);
  const byId = Object.fromEntries(definitions.map(d => [d.id,d]));

  function safeParse(key, fallback){
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch (_) { return fallback; }
  }
  function getUnlocked(){
    const value=safeParse(STORAGE_KEY,[]);
    return Array.isArray(value) ? value.filter(id=>ids.includes(id)) : [];
  }
  function saveUnlocked(list){
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify([...new Set(list)]));}catch(_){}
  }
  function getTrueNames(){
    const value=safeParse(NAMES_KEY,[]);
    return Array.isArray(value) ? value.filter(n=>trueNames.includes(n)) : [];
  }
  function saveTrueNames(list){
    try{localStorage.setItem(NAMES_KEY,JSON.stringify([...new Set(list)]));}catch(_){}
  }
  function isComplete(){
    const unlocked=new Set(getUnlocked());
    return ids.every(id=>unlocked.has(id));
  }
  function count(){ return getUnlocked().length; }
  function frameEnabled(){
    if(!isComplete()) return false;
    try{
      const stored=localStorage.getItem(FRAME_KEY);
      return stored===null ? true : stored!=='false';
    }catch(_){ return true; }
  }
  function setFrameEnabled(enabled){
    try{localStorage.setItem(FRAME_KEY,enabled?'true':'false');}catch(_){}
    applyCompletionFrame();
    renderAchievementPage();
  }
  function libraryDiscovered(){
    try{return localStorage.getItem(LIBRARY_KEY)==='1';}catch(_){return false;}
  }
  function markLibraryDiscovered(){
    try{localStorage.setItem(LIBRARY_KEY,'1');}catch(_){}
    addFooterLibraryLink();
  }
  function queuePending(def){
    try{
      const pending=JSON.parse(sessionStorage.getItem(PENDING_KEY)||'[]');
      pending.push({type:'achievement',id:def.id});
      sessionStorage.setItem(PENDING_KEY,JSON.stringify(pending));
    }catch(_){}
  }

  const toastQueue=[];
  let toastBusy=false;
  function ensureToastHost(){
    let host=document.getElementById('achievementToastHost');
    if(!host){
      host=document.createElement('div');
      host.id='achievementToastHost';
      host.className='achievement-toast-host';
      host.setAttribute('aria-live','polite');
      document.body.appendChild(host);
    }
    return host;
  }
  function playChime(){
    try{
      const audio=new Audio('/achievement-chime.mp3');
      audio.volume=.32;
      audio.play().catch(()=>{});
    }catch(_){}
  }
  function enqueueToast(data){
    toastQueue.push(data);
    if(!toastBusy) showNextToast();
  }
  function showNextToast(){
    if(!toastQueue.length){toastBusy=false;return;}
    toastBusy=true;
    const data=toastQueue.shift();
    const host=ensureToastHost();
    const toast=document.createElement(data.href?'a':'div');
    toast.className='achievement-toast';
    if(data.href) toast.href=data.href;
    toast.innerHTML=`<span class="achievement-toast-icon">${data.icon||'✦'}</span><span class="achievement-toast-copy"><small>${data.label||'SECRET DISCOVERED'}</small><strong>${data.title}</strong>${data.detail?`<em>${data.detail}</em>`:''}</span><span class="achievement-toast-chevron">›</span>`;
    host.replaceChildren(toast);
    requestAnimationFrame(()=>toast.classList.add('show'));
    if(data.sound!==false) playChime();
    const lifespan=data.duration||6500;
    const timer=setTimeout(close,lifespan);
    function close(){
      clearTimeout(timer);
      toast.classList.remove('show');
      setTimeout(()=>{ if(toast.parentNode)toast.remove(); showNextToast(); },360);
    }
    toast.addEventListener('click',()=>{ if(!data.href) close(); });
  }

  function maybeCompletionReward(wasComplete){
    if(!wasComplete && isComplete()){
      try{ if(localStorage.getItem(FRAME_KEY)===null) localStorage.setItem(FRAME_KEY,'true'); }catch(_){}
      applyCompletionFrame();
      enqueueToast({label:'ARCHIVE COMPLETE',title:"The Watcher's Frame",detail:'Nothing remains hidden from you.',href:'/achievements.html',icon:'◉',duration:7600});
    }
  }

  function unlock(id, options={}){
    const def=byId[id];
    if(!def) return false;
    const unlocked=getUnlocked();
    if(unlocked.includes(id)) return false;
    const wasComplete=isComplete();
    unlocked.push(id); saveUnlocked(unlocked);
    if(options.deferToast) queuePending(def);
    else enqueueToast({title:def.title,detail:def.description,href:'/achievements.html#'+id});
    updateArchiveStatus();
    renderAchievementPage();
    maybeCompletionReward(wasComplete);
    return true;
  }

  function noteTrueName(name){
    if(!trueNames.includes(name)) return;
    const seen=getTrueNames();
    if(seen.includes(name)) return;
    seen.push(name); saveTrueNames(seen);
    if(seen.length<trueNames.length){
      enqueueToast({label:'TRUE NAME RECOVERED',title:name,detail:`${seen.length} / ${trueNames.length} names recorded`,href:'/achievements.html#seven-true-names',icon:'✧'});
    }else{
      unlock('seven-true-names');
    }
    renderAchievementPage();
  }

  function discoverLibrary(showToast=true){
    const first=!libraryDiscovered();
    markLibraryDiscovered();
    if(first && showToast){
      enqueueToast({label:'HIDDEN INDEX FOUND',title:'The Archive Is Watching',detail:'You found the record of records.',href:'/achievements.html',icon:'◉'});
    }
    return first;
  }

  function addFooterLibraryLink(){
    if(!libraryDiscovered()) return;
    const footer=document.querySelector('footer');
    if(!footer || footer.querySelector('.achievement-library-link')) return;
    const sep=document.createElement('span'); sep.className='footer-achievement-sep'; sep.textContent=' · ';
    const link=document.createElement('a'); link.className='achievement-library-link'; link.href='/achievements.html'; link.textContent='Archive Discoveries';
    footer.append(sep,link);
  }

  function updateArchiveStatus(){
    const node=document.getElementById('archiveStatusEasterEgg');
    if(!node) return;
    const n=count();
    const c=isComplete();
    const countNode=node.querySelector('[data-achievement-count]');
    const stateNode=node.querySelector('[data-achievement-state]');
    if(countNode) countNode.textContent=String(n);
    if(stateNode) stateNode.textContent=c?'COMPLETE':'INCOMPLETE';
    node.classList.toggle('complete',c);
  }

  function applyCompletionFrame(){
    let frame=document.getElementById('watcherCompletionFrame');
    const on=frameEnabled();
    document.documentElement.classList.toggle('watcher-frame-active',on);
    if(!on){ if(frame) frame.remove(); return; }
    if(frame) return;
    frame=document.createElement('div');
    frame.id='watcherCompletionFrame';
    frame.className='watcher-completion-frame';
    frame.setAttribute('aria-hidden','true');
    frame.innerHTML=`<span class="watcher-frame-eye">◉</span><span class="watcher-corner wc-tl"></span><span class="watcher-corner wc-tr"></span><span class="watcher-corner wc-bl"></span><span class="watcher-corner wc-br"></span><span class="watcher-sin-lights"><i style="--c:#e9e8ff"></i><i style="--c:#7b68d8"></i><i style="--c:#e14f91"></i><i style="--c:#e14535"></i><i style="--c:#35b7c8"></i><i style="--c:#8dbb45"></i><i style="--c:#d9a62e"></i></span>`;
    document.body.appendChild(frame);
  }

  function renderAchievementPage(){
    const grid=document.getElementById('achievementLibraryGrid');
    if(!grid) return;
    const unlocked=new Set(getUnlocked());
    const names=getTrueNames();
    const makeCard=(def,sub=false)=>{
      const done=unlocked.has(def.id);
      const card=document.createElement('article');
      card.id=def.id;
      card.className=`achievement-card ${done?'unlocked':'locked'} ${sub?'sub-achievement':''}`;
      const progress=def.progress==='true-names' ? `<span class="achievement-progress-mini">${names.length} / 7 names</span>` : '';
      card.innerHTML=`<div class="achievement-state-icon">${done?'✓':'◇'}</div><div><div class="achievement-card-top"><h3>${def.title}</h3>${progress}</div><p>${def.description}</p>${done?'<div class="achievement-found">DISCOVERED</div>':`<details><summary>Vague Hint</summary><p>${def.hint}</p></details>`}</div>`;
      return card;
    };
    grid.replaceChildren();
    const standaloneBefore=['shazam-name','great-tree-village'];
    standaloneBefore.forEach(id=>grid.appendChild(makeCard(byId[id])));

    const group=(title,desc,groupId,idsInGroup)=>{
      const section=document.createElement('section');
      section.className='achievement-group';
      const doneCount=idsInGroup.filter(id=>unlocked.has(id)).length;
      section.innerHTML=`<div class="achievement-group-head"><div><span class="achievement-group-kicker">GROUPED DISCOVERY</span><h2>${title}</h2><p>${desc}</p></div><strong>${doneCount} / ${idsInGroup.length}</strong></div>`;
      const sub=document.createElement('div'); sub.className='achievement-subgrid';
      idsInGroup.forEach(id=>sub.appendChild(makeCard(byId[id],true)));
      section.appendChild(sub); grid.appendChild(section);
    };
    group('Behind the Great Tree','Finding the village is only the beginning.',['great-tree'],['kitsune-sight','great-hunt']);
    group('Secrets of the Isle','The western island contains several separate discoveries.',['isle'],['isle-arrival','god-tongue','crystal-research','blood-red-records','old-experiment-log']);
    ['nogard-hidden-record','ruins-beneath-oro','odins-children','overgod-hidden-record','greed-contract','seven-true-names'].forEach(id=>grid.appendChild(makeCard(byId[id])));
    group('The Seven Before They Were Gods','Seven restricted histories. Seven names beneath the titles.',['watchers'],['archive-pride','archive-sloth','archive-lust','archive-wrath','archive-envy','archive-gluttony','archive-greed']);

    const total=document.querySelector('[data-achievement-total-count]');
    const found=document.querySelector('[data-achievement-found-count]');
    const pct=document.querySelector('[data-achievement-percent]');
    const bar=document.querySelector('.achievement-progress-fill');
    const n=unlocked.size; const percent=Math.round((n/ids.length)*100);
    if(total) total.textContent=String(ids.length);
    if(found) found.textContent=String(n);
    if(pct) pct.textContent=percent+'%';
    if(bar) bar.style.width=percent+'%';

    const reward=document.getElementById('watcherFrameReward');
    const toggle=document.getElementById('watcherFrameToggle');
    if(reward) reward.classList.toggle('unlocked',isComplete());
    if(toggle){ toggle.disabled=!isComplete(); toggle.checked=frameEnabled(); }
  }

  function completeAllForTesting(){
    saveUnlocked(ids);
    saveTrueNames(trueNames);
    try{localStorage.setItem(FRAME_KEY,'true');}catch(_){}
    markLibraryDiscovered();
    applyCompletionFrame(); updateArchiveStatus(); renderAchievementPage();
    enqueueToast({label:'TEST MODE',title:'All Discoveries Completed',detail:"The Watcher's Frame is now unlocked.",href:'/achievements.html',icon:'◉'});
  }
  function resetProgress(){
    try{
      localStorage.removeItem(STORAGE_KEY); localStorage.removeItem(NAMES_KEY); localStorage.removeItem(FRAME_KEY); localStorage.removeItem(LIBRARY_KEY);
      sessionStorage.removeItem(PENDING_KEY);
    }catch(_){}
    document.documentElement.classList.remove('watcher-frame-active');
    document.getElementById('watcherCompletionFrame')?.remove();
    updateArchiveStatus(); renderAchievementPage();
  }

  window.SinnersAchievements={definitions,unlock,noteTrueName,discoverLibrary,getUnlocked,getTrueNames,isComplete,count,frameEnabled,setFrameEnabled,completeAllForTesting,resetProgress};

  // Deferred unlocks show after the secret destination page loads, instead of flashing before navigation.
  try{
    const pending=JSON.parse(sessionStorage.getItem(PENDING_KEY)||'[]');
    sessionStorage.removeItem(PENDING_KEY);
    setTimeout(()=>pending.forEach(item=>{const def=byId[item.id]; if(def) enqueueToast({title:def.title,detail:def.description,href:'/achievements.html#'+def.id});}),450);
  }catch(_){}

  // Generic hooks for links/buttons whose click itself is the discovery event.
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-achievement]');
    if(!target) return;
    const id=target.dataset.achievement;
    const defer=target.hasAttribute('data-achievement-nav');
    unlock(id,{deferToast:defer});
  },true);

  document.addEventListener('DOMContentLoaded',()=>{
    updateArchiveStatus();
    applyCompletionFrame();
    addFooterLibraryLink();
    renderAchievementPage();

    const easter=document.getElementById('archiveStatusEasterEgg');
    if(easter){
      const open=()=>{
        const first=discoverLibrary(true);
        if(first) setTimeout(()=>{location.href='/achievements.html';},900);
        else location.href='/achievements.html';
      };
      easter.addEventListener('click',open);
      easter.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
    }
    if(location.pathname.endsWith('/achievements.html') || location.pathname==='/achievements.html'){
      markLibraryDiscovered();
      renderAchievementPage();
      const test=document.getElementById('achievementCompleteAllTest');
      const reset=document.getElementById('achievementResetProgress');
      const toggle=document.getElementById('watcherFrameToggle');
      test?.addEventListener('click',()=>{if(confirm('Testing only: mark every achievement complete?')) completeAllForTesting();});
      reset?.addEventListener('click',()=>{if(confirm('Reset all achievement progress on this browser? This cannot be undone.')) resetProgress();});
      toggle?.addEventListener('change',()=>setFrameEnabled(toggle.checked));
      if(location.hash){setTimeout(()=>document.querySelector(location.hash)?.scrollIntoView({behavior:'smooth',block:'center'}),250);}
    }
  });
})();

// Version marker — Sinners 1.1
(() => {
  const versionText = 'Sinners World Archive — Version 1.1';
  const footer = document.querySelector('footer');
  if (footer) footer.textContent = versionText;
  else {
    const versionFooter = document.createElement('footer');
    versionFooter.textContent = versionText;
    document.body.appendChild(versionFooter);
  }
  // The achievement system may have been initialized before the version marker rewrote the footer.
  setTimeout(()=>{
    try{
      if(localStorage.getItem('sinnersAchievementLibraryDiscoveredV11')==='1'){
        const f=document.querySelector('footer');
        if(f && !f.querySelector('.achievement-library-link')){
          const sep=document.createElement('span'); sep.className='footer-achievement-sep'; sep.textContent=' · ';
          const a=document.createElement('a'); a.className='achievement-library-link'; a.href='/achievements.html'; a.textContent='Archive Discoveries';
          f.append(sep,a);
        }
      }
    }catch(_){}
  },0);
})();

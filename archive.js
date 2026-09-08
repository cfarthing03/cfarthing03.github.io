(()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const buttons=[...document.querySelectorAll('[data-scroll-target]')];

  async function spillScrolls(button,section){
    document.querySelectorAll('.scroll-section').forEach(s=>{
      if(s!==section)s.classList.remove('active','revealed');
    });
    buttons.forEach(b=>{
      const on=b===button;
      b.classList.toggle('active',on);
      b.setAttribute('aria-expanded',on?'true':'false');
    });

    section.classList.add('active');
    section.classList.remove('revealed');
    await new Promise(requestAnimationFrame);
    const cards=[...section.querySelectorAll('.scroll-card')];
    cards.forEach(card=>card.style.transitionDelay='0s');
    const start=button.getBoundingClientRect();
    const count=Math.min(cards.length,12);
    const flights=[];

    for(let i=0;i<count;i++){
      const target=cards[i].getBoundingClientRect();
      const ghost=document.createElement('i');
      ghost.className='flying-scroll';
      document.body.appendChild(ghost);
      const sx=start.left+start.width/2-19+((i%5)-2)*9;
      const sy=start.top+25+(i%3)*6;
      ghost.style.left=sx+'px';ghost.style.top=sy+'px';
      const tx=target.left+target.width/2-sx-19;
      const ty=target.top+target.height/2-sy-43;
      const fan=((i/(Math.max(1,count-1)))-.5)*230;
      const lift=-120-Math.abs(fan)*.18-(i%3)*18;
      const anim=ghost.animate([
        {transform:`translate(0,0) rotate(${fan*.09}deg) scale(1)`,opacity:1},
        {offset:.45,transform:`translate(${fan}px,${lift}px) rotate(${fan*.18}deg) scale(1.05)`,opacity:1},
        {transform:`translate(${tx}px,${ty}px) rotate(0deg) scale(3.4,1.35)`,opacity:.08}
      ],{duration:760+i*20,easing:'cubic-bezier(.18,.72,.2,1)',fill:'forwards'});
      flights.push(anim.finished.catch(()=>{}).then(()=>ghost.remove()));
    }

    await sleep(560);
    section.classList.add('revealed');
    await sleep(80);
    section.scrollIntoView({behavior:'smooth',block:'start'});
    Promise.all(flights).catch(()=>{});
  }

  buttons.forEach(button=>button.addEventListener('click',()=>{
    const section=document.getElementById(button.dataset.scrollTarget);
    if(section)spillScrolls(button,section);
  }));

  document.querySelectorAll('.book').forEach(book=>{
    book.removeAttribute('tabindex');
    book.addEventListener('click',e=>{if(e.target.closest('a'))return;book.classList.toggle('open')});
    book.addEventListener('mouseenter',()=>book.classList.add('open'));
    book.addEventListener('mouseleave',()=>book.classList.remove('open'));
  });
})();
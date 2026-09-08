(()=>{
  const buttons = document.querySelectorAll('[data-scroll-target]');
  buttons.forEach(button=>button.addEventListener('click',()=>{
    const id = button.dataset.scrollTarget;
    buttons.forEach(b=>{
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-expanded', active ? 'true' : 'false');
    });
    document.querySelectorAll('.scroll-section').forEach(section=>{
      const active = section.id === id;
      section.classList.toggle('active', active);
      if(active){
        section.querySelectorAll('.scroll-card').forEach((card,index)=>{
          card.style.transitionDelay = `${Math.min(index, 9) * 0.05}s`;
        });
      }
    });
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  }));

  document.querySelectorAll('.book').forEach(book=>{
    book.addEventListener('click',e=>{
      if(e.target.closest('a')) return;
      book.classList.toggle('open');
    });
    book.addEventListener('mouseenter',()=>book.classList.add('open'));
    book.addEventListener('mouseleave',()=>book.classList.remove('open'));
    book.addEventListener('focusin',()=>book.classList.add('open'));
    book.addEventListener('focusout',e=>{
      if(!book.contains(e.relatedTarget)) book.classList.remove('open');
    });
  });
})();
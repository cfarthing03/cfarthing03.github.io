
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

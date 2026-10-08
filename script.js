
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

// Version marker — Sinners 1.0
(() => {
  const versionText = 'Sinners World Archive — Version 1.0';
  const footer = document.querySelector('footer');
  if (footer) {
    footer.textContent = versionText;
  } else {
    const versionFooter = document.createElement('footer');
    versionFooter.textContent = versionText;
    document.body.appendChild(versionFooter);
  }
})();

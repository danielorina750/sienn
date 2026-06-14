const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

const header = $('.site-header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 40));

const navToggle = $('.nav-toggle');
const nav = $('.main-nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
$$('.main-nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const glow = $('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`; glow.style.top = `${e.clientY}px`;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting || entry.target.dataset.done) return;
    entry.target.dataset.done = 'true';
    const end = Number(entry.target.dataset.count || 0);
    const duration = 1350;
    const start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1-p, 3);
      entry.target.textContent = Math.round(end * eased).toLocaleString();
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });
$$('[data-count]').forEach(el => counterObserver.observe(el));

// Sector bars
const sectorCounts = SIEN_PROJECTS.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {});
const sectorBars = $('#sectorBars');
const max = Math.max(...Object.values(sectorCounts));
Object.entries(sectorCounts).sort((a,b)=>b[1]-a[1]).forEach(([name, val]) => {
  const row = document.createElement('div'); row.className = 'bar-row';
  row.innerHTML = `<span>${name}</span><div class="bar-track"><div class="bar-fill" style="--w:${(val/max)*100}%"></div></div><strong>${val}</strong>`;
  sectorBars.appendChild(row);
});
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ $$('.bar-fill').forEach(f => f.style.width = f.style.getPropertyValue('--w')); } });
}, { threshold: .35 });
if(sectorBars) barObserver.observe(sectorBars);

// Filters and projects
const categories = ['All', ...new Set(SIEN_PROJECTS.map(p => p.category))];
const filterBar = $('#filterBar');
const projectGrid = $('#projectGrid');
let activeFilter = 'All';
function renderFilters(){
  filterBar.innerHTML = categories.map(cat => `<button class="${cat === activeFilter ? 'active' : ''}" data-filter="${cat}">${cat}</button>`).join('');
  $$('#filterBar button').forEach(btn => btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; renderFilters(); renderProjects(); }));
}
function renderProjects(){
  const list = activeFilter === 'All' ? SIEN_PROJECTS : SIEN_PROJECTS.filter(p => p.category === activeFilter);
  projectGrid.innerHTML = list.map((p, i) => `
    <article class="project-card reveal visible" data-slug="${p.slug}" style="transition-delay:${Math.min(i*35,240)}ms">
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      <div class="project-content">
        <div class="tag-row"><span>${p.status}</span><span>${p.location}</span><span>${p.category}</span></div>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
      </div>
    </article>`).join('');
  $$('.project-card').forEach(card => card.addEventListener('click', () => openProject(card.dataset.slug)));
}
renderFilters(); renderProjects();

const modal = $('#projectModal');
const modalBody = $('#modalBody');
function openProject(slug){
  const p = SIEN_PROJECTS.find(x => x.slug === slug); if(!p) return;
  modalBody.innerHTML = `
    <div class="modal-visual">
      <img src="${p.gallery[0]}" alt="${p.title}" id="modalMainImage" />
    </div>
    <div class="modal-copy">
      <div class="modal-meta"><span>${p.category}</span><span>${p.status}</span><span>${p.location}</span><span>${p.size}</span></div>
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <h3>Scope of work</h3>
      <p>${p.scope}</p>
      <ul class="highlight-list">${p.highlights.map(h => `<li>${h}</li>`).join('')}</ul>
      <div class="modal-gallery">${p.gallery.map((g,idx)=>`<img src="${g}" alt="${p.title} image ${idx+1}" class="${idx===0?'active':''}" />`).join('')}</div>
    </div>`;
  modal.showModal();
  const main = $('#modalMainImage');
  $$('.modal-gallery img', modalBody).forEach(img => img.addEventListener('click', () => {
    main.src = img.src; $$('.modal-gallery img', modalBody).forEach(i=>i.classList.remove('active')); img.classList.add('active');
  }));
}
$$('.modal-close').forEach(btn => btn.addEventListener('click', () => btn.closest('dialog').close()));
modal.addEventListener('click', e => { if(e.target === modal) modal.close(); });

const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
$$('.certificate').forEach(btn => btn.addEventListener('click', () => { lightboxImage.src = btn.dataset.cert; lightbox.showModal(); }));
lightbox.addEventListener('click', e => { if(e.target === lightbox) lightbox.close(); });

// Keyboard escape is handled by dialog; improve focus return not needed for static marketing site.

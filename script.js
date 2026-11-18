/* Євротерм-Тернопіль — спільна логіка сайту */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------- Тост ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- Шапка: тінь при скролі ---------- */
  const head = $('.head');
  const onScroll = () => head && head.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Мобільне меню ---------- */
  const burger = $('#burger-btn');
  const mnav = $('#mnav');
  function setMenu(open) {
    if (!burger || !mnav) return;
    burger.setAttribute('aria-expanded', String(open));
    mnav.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && mnav) {
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));
    window.addEventListener('resize', () => { if (window.innerWidth > 1300) setMenu(false); });
  }

  /* ---------- Випадаючий список телефонів ---------- */
  const telDrop = $('#tel-drop');
  const telBtn = $('#tel-drop-btn');
  if (telDrop && telBtn) {
    telBtn.addEventListener('click', e => {
      e.stopPropagation();
      const open = !telDrop.classList.contains('open');
      telDrop.classList.toggle('open', open);
      telBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', e => {
      if (!telDrop.contains(e.target)) { telDrop.classList.remove('open'); telBtn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') telDrop.classList.remove('open'); });
  }

  /* ---------- Заглушка для відсутніх зображень ---------- */
  $$('img').forEach(img => {
    const swap = () => {
      const ph = document.createElement('div');
      ph.className = 'img-ph';
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', img.alt || 'Фото');
      ph.textContent = img.alt || 'Фото';
      img.replaceWith(ph);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener('error', swap, { once: true });
  });

  /* ---------- Карусель портфоліо ---------- */
  const car = $('#trip-car');
  if (car) {
    $$('.car-b').forEach(b => b.addEventListener('click', () => {
      const card = car.firstElementChild;
      const step = card ? card.getBoundingClientRect().width + 18 : 300;
      car.scrollBy({ left: Number(b.dataset.dir) * step, behavior: 'smooth' });
    }));
  }

  /* ---------- Модальне вікно каталогу ---------- */
  const modal = $('#brand-modal');
  if (modal) {
    const BRANDS = {
      kotly_gas: ['Vaillant', 'Bosch', 'Protherm', 'Baxi', 'Ariston', 'Viessmann', 'Immergas'],
      vod_boil: ['Teplobak', 'Atlantic', 'Gorenje', 'Ariston'],
      tr_rehau: ['REHAU'],
      tp_trub: ['REHAU', 'KAN-therm'],
      op_prog: ['Salus', 'Computherm', 'Auraton', 'Vaillant'],
      en_stab: ['LogicPower', 'Luxeon', 'Елекс', 'Volter'],
      filt_osm: [], filt_sys: [], filt_kolb: [], filt_sil: ['PARLA']
    };
    const cat = $('#bm-cat'), title = $('#bm-title'), list = $('#bm-list'), wrapB = $('#bm-brands-wrap');
    let lastFocus = null;

    function openModal(catName, groupName, key) {
      if (cat && catName) cat.textContent = catName;
      if (title) title.textContent = groupName || catName || '';
      const brands = key ? (BRANDS[key] || []) : [];
      if (list) list.innerHTML = '';
      brands.forEach(b => { const s = document.createElement('span'); s.textContent = b; list.appendChild(s); });
      if (wrapB) wrapB.hidden = brands.length === 0;
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const close = $('#bm-close');
      if (close) close.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    $$('.sub-btn').forEach(btn => btn.addEventListener('click', () => {
      const card = btn.closest('.cat-c');
      const catName = card ? $('h3', card).textContent.trim() : '';
      const group = $('span', btn).textContent.trim();
      openModal(catName, group, btn.dataset.key);
    }));
    $$('.open-phones-btn').forEach(btn => btn.addEventListener('click', () => {
      const card = btn.closest('.cat-c');
      const catName = card ? $('h3', card).textContent.trim() : 'Каталог';
      openModal('Консультація менеджера', catName, null);
    }));
    $('#bm-close') && $('#bm-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
  }

  /* ---------- Поява блоків при скролі ---------- */
  const targets = $$('.srv-card, .steps > li, .adv-card, .dir-card, .cat-c, .rcard, .facts li, .pt, .pro-item, .calc-box, .prog-card, .safety-card');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    targets.forEach(t => { t.classList.add('reveal'); io.observe(t); });
  }
})();

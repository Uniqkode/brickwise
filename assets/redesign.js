(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.dataset.input = 'pointer';
  document.addEventListener('pointerdown', () => { document.documentElement.dataset.input = 'pointer'; }, {passive:true});
  document.addEventListener('keydown', () => { document.documentElement.dataset.input = 'keyboard'; });
  const menu = document.querySelector('.bw-menu');
  const navigation = document.getElementById('primary-navigation');
  const close = () => {
    if (!menu || !navigation) return;
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
  };
  navigation?.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.bw-header')) close();
  });
  window.matchMedia('(min-width:681px)').addEventListener('change', event => {
    if (event.matches) close();
  });

  function visitSection(id, event) {
    const target = document.getElementById(id);
    if (!target) return;
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
    target.scrollIntoView({behavior:motion.matches || event.detail === 0 ? 'instant' : 'smooth', block:'start'});
    if (event.detail === 0) { target.tabIndex = -1; target.focus({preventScroll:true}); }
  }
  document.querySelectorAll('[data-board-status]').forEach(button => button.addEventListener('click', event => {
    const filter = document.querySelector('[data-tool-filter]');
    if (!filter) return;
    const search = document.querySelector('[data-tool-search]');
    if (search) search.value = '';
    filter.value = button.dataset.boardStatus;
    filter.dispatchEvent(new Event('change', {bubbles:true}));
    visitSection('inspection-board', event);
  }));
  document.querySelectorAll('[data-desk-source]').forEach(link => link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.querySelector('[data-ai-workbench]')?.dispatchEvent(new CustomEvent('brickwise:open-source', {detail:link.dataset.deskSource}));
    visitSection('try-analysis', event);
  }));
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const target = document.getElementById(url.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    visitSection(url.hash.slice(1), event);
  });
  const reveal = [...document.querySelectorAll('.bw-home .bw-section-heading,.bw-home .bw-feature,.bw-home .bw-care-visual,.bw-home .bw-care-copy,.bw-home .bw-cta-inner')];
  if (!motion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible'); observer.unobserve(entry.target);
    }), {threshold:.12});
    reveal.forEach(element => {
      element.classList.add('bw-reveal'); element.style.transitionDelay = (element.matches('.bw-feature') ? [...element.parentElement.children].indexOf(element) * 50 : 0) + 'ms'; observer.observe(element);
    });
    motion.addEventListener('change', event => {
      if (event.matches) { observer.disconnect(); reveal.forEach(element => element.classList.add('is-visible')); }
    });
  }
})();

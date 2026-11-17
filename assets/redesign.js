(() => {
  const menu = document.querySelector('.bw-menu');
  const navigation = document.getElementById('primary-navigation');
  if (!menu || !navigation) return;
  const close = () => {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open menu');
  };
  navigation.addEventListener('click', event => {
    if (event.target.closest('a')) close();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.bw-header')) close();
  });
  window.matchMedia('(min-width:681px)').addEventListener('change', event => {
    if (event.matches) close();
  });
})();

(function () {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  function setOpenState(open) {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
  }

  toggle.addEventListener('click', () => {
    setOpenState(!menu.classList.contains('open'));
  });

  document.addEventListener('click', event => {
    if (!menu.classList.contains('open')) return;
    if (toggle.contains(event.target) || menu.contains(event.target)) return;
    setOpenState(false);
  });

  menu.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('.nav-tab') || target.matches('.mobile-menu-link')) {
      setOpenState(false);
    }
  });
})();

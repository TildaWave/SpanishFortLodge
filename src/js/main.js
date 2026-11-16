// Spanish Fort Lodge No. 916: site script (header menu, header shadow on scroll, footer year). No libraries needed.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.navbar-toggler');
  var menu = document.getElementById('site-nav');

  // Phone / tablet menu
  function setMenu(open) {
    if (!toggle || !menu) return;
    menu.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close the menu' : 'Open the menu');
    var icon = toggle.querySelector('.bi');
    if (icon) { icon.classList.toggle('bi-list', !open); icon.classList.toggle('bi-x-lg', open); }
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('show')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('show')) { setMenu(false); toggle.focus(); }
    });
  }

  // Header: a shadow and a smaller logo once the page is scrolled
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Footer year
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = year; });
})();

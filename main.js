(function () {
  // Current page filename (default to index.html at site root)
  var here = (location.pathname.split('/').pop() || 'index.html');
  if (here === '') here = 'index.html';

  // Mark the active nav link
  document.querySelectorAll('.navlink[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === here) link.classList.add('active');
  });

  var header = document.querySelector('header.nav');
  var nav = document.getElementById('navlinks');
  var burger = document.querySelector('.hamburger');
  var drop = document.getElementById('svcDrop');

  function openMenu() {
    if (nav) nav.classList.add('open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
  }
  function closeMenu() {
    if (nav) nav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (drop) drop.classList.remove('open');
  }
  function isMobile() { return window.innerWidth <= 760; }

  // Hamburger toggles the panel
  if (burger && nav) {
    burger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (nav.classList.contains('open')) closeMenu(); else openMenu();
    });
  }

  // Services parent: on mobile, tap toggles the submenu instead of navigating.
  // On desktop it stays a normal link (hover reveals the menu).
  if (drop) {
    var parent = drop.querySelector('.navlink');
    if (parent) {
      parent.addEventListener('click', function (e) {
        if (isMobile()) {
          e.preventDefault();
          e.stopPropagation();
          drop.classList.toggle('open');
        }
      });
    }
  }

  // Tapping a real destination (any link that isn't the Services parent) closes the panel
  document.querySelectorAll('#navlinks a[href]').forEach(function (a) {
    a.addEventListener('click', function () {
      var isServicesParent = drop && drop.contains(a) && a.classList.contains('navlink');
      if (isMobile() && !isServicesParent) closeMenu();
    });
  });

  // Close when tapping outside the header
  document.addEventListener('click', function (e) {
    if (nav && nav.classList.contains('open') && header && !header.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape Key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Reset menu state when returning to desktop width
  window.addEventListener('resize', function () {
    if (!isMobile()) closeMenu();
  });

  // On the Services page, scroll to and highlight a service when linked with a hash
  function flashHash() {
    var id = (location.hash || '').replace('#', '');
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.add('flash');
    setTimeout(function () { el.classList.remove('flash'); }, 1600);
  }

  if (here === 'services.html') {
    if (location.hash) setTimeout(flashHash, 120);
    window.addEventListener('hashchange', flashHash);
  }
})();

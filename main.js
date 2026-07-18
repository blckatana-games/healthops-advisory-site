(function () {
  // Current page filename (default to index.html at site root)
  var here = (location.pathname.split('/').pop() || 'index.html');
  if (here === '') here = 'index.html';

  // Mark the active nav link
  document.querySelectorAll('.navlink[data-page]').forEach(function (link) {
    if (link.getAttribute('data-page') === here) link.classList.add('active');
  });

  // Mobile hamburger menu
  var nav = document.getElementById('navlinks');
  var burger = document.querySelector('.hamburger');
  var drop = document.getElementById('svcDrop');

  function closeMenu() {
    if (nav) nav.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (drop) drop.classList.remove('open');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Services dropdown: on mobile, tapping the parent toggles the submenu
  // instead of navigating; on desktop it behaves as a normal link (hover reveals).
  if (drop) {
    var parent = drop.querySelector('.navlink');
    if (parent) {
      parent.addEventListener('click', function (e) {
        if (window.innerWidth <= 760) {
          e.preventDefault();
          drop.classList.toggle('open');
        }
      });
    }
  }

  // Close the mobile menu after any navigation tap
  document.querySelectorAll('#navlinks a[href]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 760 && !(drop && drop.contains(a) && a.classList.contains('navlink'))) {
        closeMenu();
      }
    });
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

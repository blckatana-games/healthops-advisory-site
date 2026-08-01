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

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Reset menu state when returning to desktop width
  window.addEventListener('resize', function () {
    if (!isMobile()) closeMenu();
  });

  // ---------------------------------------------------------------
  // CONTACT FORM — submits to Web3Forms via AJAX so the visitor
  // stays on the page and sees an inline confirmation.
  // The destination address is configured by the access_key in
  // contact.html, not here.
  // ---------------------------------------------------------------
  var form = document.getElementById('contactForm');
  if (form) {
    var note = document.getElementById('cfNote');
    var submitBtn = document.getElementById('cfSubmit');
    var REQUIRED = ['cfName', 'cfEmail', 'cfMsg'];

    function setNote(msg, kind) {
      if (!note) return;
      note.textContent = msg;
      note.className = 'form-note' + (kind ? ' ' + kind : '');
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    }

    REQUIRED.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('cfName').value.trim();
      var email = document.getElementById('cfEmail').value.trim();
      var msg = document.getElementById('cfMsg').value.trim();

      // Client-side validation
      var missing = [];
      if (!name) missing.push('cfName');
      if (!validEmail(email)) missing.push('cfEmail');
      if (!msg) missing.push('cfMsg');

      REQUIRED.forEach(function (id) {
        document.getElementById(id).classList.toggle('invalid', missing.indexOf(id) !== -1);
      });

      if (missing.length) {
        setNote('Please add your name, a valid email address, and a message.', 'err');
        document.getElementById(missing[0]).focus();
        return;
      }

      // Guard: access key not yet configured
      var keyField = form.querySelector('[name="access_key"]');
      if (!keyField || !keyField.value || keyField.value.indexOf('YOUR_ACCESS_KEY') === 0) {
        setNote('This form is not finished being set up yet. Please email us directly in the meantime.', 'err');
        return;
      }

      // Gather all named fields
      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });

      var original = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending...'; }
      setNote('Sending your message...', '');

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json().catch(function () { return {}; }); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            setNote('Thank you \u2014 your message has been sent. We will be in touch shortly.', 'ok');
          } else {
            setNote((data && data.message) ? data.message : 'Something went wrong. Please try again, or email us directly.', 'err');
          }
        })
        .catch(function () {
          setNote('We could not reach the mail service. Please check your connection, or email us directly.', 'err');
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
        });
    });
  }

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

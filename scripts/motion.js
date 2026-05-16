(function () {
  var ELEVATOR_IN = 'back.out(1.6)';
  var ELEVATOR_DUR = 0.8;
  var currentIndex = 0;
  var sections = [];
  var isAnimating = false;
  var animTimeout = null;

  function init() {
    setupBurger();
    setupToggle();
    setupReadMode();

    sections = Array.from(document.querySelectorAll('.elevator-viewport .section'));
    if (!sections.length) return;

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    setupElevator();
    setupIndicators();
    setupArrows();
    setupKeyboard();
    setupTouch();

    showSection(0, false);
  }

  /* ============================================
     BURGER MENU
     ============================================ */
  function setupBurger() {
    var burger = document.getElementById('burger');
    var panel = document.getElementById('nav-panel');
    var backdrop = document.getElementById('nav-backdrop');
    if (!burger || !panel) return;

    function toggleMenu() {
      var open = burger.classList.toggle('open');
      panel.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('open', open);
    }

    function closeMenu() {
      burger.classList.remove('open');
      panel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
    }

    burger.addEventListener('click', toggleMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    panel.querySelectorAll('.nav-panel__item').forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        goToSection(i);
      });
    });
  }

  /* ============================================
     ELEVATOR — frame fixe, contenu glisse
     ============================================ */
  function setupElevator() {
    sections.forEach(function (s, i) {
      if (i !== 0) {
        s.style.transform = 'translateY(100%)';
        s.style.opacity = '0';
        s.style.pointerEvents = 'none';
      } else {
        s.style.transform = 'translateY(0)';
        s.style.opacity = '1';
        s.style.pointerEvents = 'auto';
      }
    });

    var viewport = document.querySelector('.elevator-viewport');
    if (!viewport) return;

    var lastWheel = 0;
    viewport.addEventListener('wheel', function (e) {
      if (document.body.classList.contains('print-mode')) return;

      var now = Date.now();
      if (now - lastWheel < 800) return;

      var section = sections[currentIndex];
      var atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 10;
      var atTop = section.scrollTop <= 10;

      if (e.deltaY > 15 && atBottom) {
        lastWheel = now;
        goToSection(currentIndex + 1);
      } else if (e.deltaY < -15 && atTop) {
        lastWheel = now;
        goToSection(currentIndex - 1);
      }
    }, { passive: true });
  }

  function showSection(index, animate) {
    if (index < 0 || index >= sections.length) return;
    currentIndex = index;
    updateIndicators();
    updateArrows();
    updateNavPanel();

    sections.forEach(function (s, i) {
      if (i === index) {
        s.style.transform = 'translateY(0)';
        s.style.opacity = '1';
        s.style.pointerEvents = 'auto';
        s.scrollTop = 0;
      } else {
        s.style.transform = i < index ? 'translateY(-100%)' : 'translateY(100%)';
        s.style.opacity = '0';
        s.style.pointerEvents = 'none';
      }
    });
  }

  function goToSection(index) {
    if (index < 0 || index >= sections.length || index === currentIndex || isAnimating) return;
    if (document.body.classList.contains('print-mode')) return;

    var goingDown = index > currentIndex;
    var outgoing = sections[currentIndex];
    var incoming = sections[index];

    if (!window.gsap ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showSection(index, false);
      return;
    }

    isAnimating = true;

    if (animTimeout) clearTimeout(animTimeout);
    animTimeout = setTimeout(function () {
      isAnimating = false;
    }, 2000);

    incoming.style.pointerEvents = 'none';
    outgoing.style.pointerEvents = 'none';
    incoming.style.opacity = '1';
    incoming.scrollTop = 0;

    var tl = gsap.timeline({
      onComplete: function () {
        isAnimating = false;
        if (animTimeout) clearTimeout(animTimeout);
        currentIndex = index;

        gsap.set(incoming, { clearProps: 'all' });
        gsap.set(outgoing, { clearProps: 'all' });

        incoming.style.transform = 'translateY(0)';
        incoming.style.opacity = '1';
        incoming.style.pointerEvents = 'auto';

        outgoing.style.transform = goingDown ? 'translateY(-100%)' : 'translateY(100%)';
        outgoing.style.opacity = '0';
        outgoing.style.pointerEvents = 'none';

        updateIndicators();
        updateArrows();
        updateNavPanel();
      }
    });

    tl.to(outgoing, {
      yPercent: goingDown ? -100 : 100,
      opacity: 0,
      duration: ELEVATOR_DUR,
      ease: 'back.in(1.2)',
      overwrite: true
    }, 0);

    tl.fromTo(incoming,
      { yPercent: goingDown ? 100 : -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: ELEVATOR_DUR, ease: ELEVATOR_IN, overwrite: true },
      0
    );
  }

  /* ============================================
     INDICATEURS (dots)
     ============================================ */
  function setupIndicators() {
    var container = document.querySelector('.elevator-indicator');
    if (!container) return;

    sections.forEach(function (s, i) {
      var dot = document.createElement('button');
      dot.className = 'elevator-dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      dot.addEventListener('click', function () { goToSection(i); });
      container.appendChild(dot);
    });
  }

  function updateIndicators() {
    var dots = document.querySelectorAll('.elevator-dot');
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentIndex);
    });
  }

  /* ============================================
     FLÈCHES
     ============================================ */
  function setupArrows() {
    var up = document.getElementById('arrow-up');
    var down = document.getElementById('arrow-down');
    if (up) up.addEventListener('click', function () { goToSection(currentIndex - 1); });
    if (down) down.addEventListener('click', function () { goToSection(currentIndex + 1); });
  }

  function updateArrows() {
    var up = document.getElementById('arrow-up');
    var down = document.getElementById('arrow-down');
    if (up) up.disabled = currentIndex === 0;
    if (down) down.disabled = currentIndex === sections.length - 1;
  }

  /* ============================================
     CLAVIER
     ============================================ */
  function setupKeyboard() {
    document.addEventListener('keydown', function (e) {
      if (document.body.classList.contains('print-mode')) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        var section = sections[currentIndex];
        var atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 10;
        if (atBottom) { e.preventDefault(); goToSection(currentIndex + 1); }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        var section2 = sections[currentIndex];
        if (section2.scrollTop <= 10) { e.preventDefault(); goToSection(currentIndex - 1); }
      }
    });
  }

  /* ============================================
     TOUCH SWIPE
     ============================================ */
  function setupTouch() {
    var startY = 0;
    var viewport = document.querySelector('.elevator-viewport');
    if (!viewport) return;

    viewport.addEventListener('touchstart', function (e) {
      startY = e.touches[0].clientY;
    }, { passive: true });

    viewport.addEventListener('touchend', function (e) {
      if (document.body.classList.contains('print-mode')) return;

      var diff = startY - e.changedTouches[0].clientY;
      var section = sections[currentIndex];
      var atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 10;
      var atTop = section.scrollTop <= 10;

      if (diff > 60 && atBottom) goToSection(currentIndex + 1);
      else if (diff < -60 && atTop) goToSection(currentIndex - 1);
    }, { passive: true });
  }

  /* ============================================
     NAV PANEL sync
     ============================================ */
  function updateNavPanel() {
    var items = document.querySelectorAll('.nav-panel__item');
    items.forEach(function (item, i) {
      item.classList.toggle('active', i === currentIndex);
    });
  }

  /* ============================================
     TOGGLE NOMINAL / STRUCTUREL
     ============================================ */
  function setupToggle() {
    var toggleBtns = document.querySelectorAll('.toggle-btn[data-mode]');
    if (!toggleBtns.length) return;

    toggleBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.dataset.mode;
        document.body.dataset.mode = mode;
        toggleBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('[data-nominal][data-structurel]').forEach(function (el) {
          var value = el.dataset[mode];
          if (value) el.textContent = value;
        });
      });
    });
  }

  /* ============================================
     MODE LECTURE
     ============================================ */
  function setupReadMode() {
    var btn = document.getElementById('toggle-motion');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var entering = !document.body.classList.contains('print-mode');
      document.body.classList.toggle('print-mode');

      if (entering) {
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        btn.textContent = 'Mode animé';
      } else {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        showSection(currentIndex, false);
        btn.textContent = 'Mode lecture';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

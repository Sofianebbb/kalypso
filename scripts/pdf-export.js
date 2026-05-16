(function () {
  var btn = document.getElementById('export-pdf');
  if (!btn) return;

  btn.addEventListener('click', function () {
    if (btn.disabled) return;

    btn.textContent = 'Impression…';
    btn.disabled = true;

    // Préparer le mode print
    document.body.classList.add('print-mode');
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';

    var header = document.querySelector('.header');
    if (header) header.style.position = 'static';

    var frame = document.querySelector('.elevator-frame');
    if (frame) { frame.style.position = 'static'; frame.style.overflow = 'visible'; frame.style.height = 'auto'; frame.style.width = '100%'; }

    var viewport = document.querySelector('.elevator-viewport');
    if (viewport) { viewport.style.position = 'static'; viewport.style.overflow = 'visible'; viewport.style.height = 'auto'; viewport.style.width = '100%'; viewport.style.inset = 'auto'; viewport.style.top = 'auto'; }

    var sections = document.querySelectorAll('.elevator-viewport .section');
    sections.forEach(function (s) {
      s.style.position = 'static';
      s.style.transform = 'none';
      s.style.opacity = '1';
      s.style.pointerEvents = 'auto';
      s.style.overflow = 'visible';
      s.style.inset = 'auto';
      s.style.width = '100%';
      s.style.height = 'auto';
      s.style.willChange = 'auto';
    });

    var hide = document.querySelectorAll('.elevator-indicator, .elevator-arrows, .burger, .nav-panel, .nav-panel__backdrop');
    hide.forEach(function (el) { el.style.display = 'none'; });

    // Petit délai pour le reflow puis impression
    setTimeout(function () {
      window.print();
    }, 300);

    // Restaurer après impression
    function restore() {
      document.body.classList.remove('print-mode');
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';

      if (header) header.style.position = '';
      if (frame) { frame.style.position = ''; frame.style.overflow = ''; frame.style.height = ''; frame.style.width = ''; }
      if (viewport) { viewport.style.position = ''; viewport.style.overflow = ''; viewport.style.height = ''; viewport.style.width = ''; viewport.style.inset = ''; viewport.style.top = ''; }

      sections.forEach(function (s) {
        s.style.position = ''; s.style.overflow = ''; s.style.inset = '';
        s.style.width = ''; s.style.height = ''; s.style.willChange = '';
      });

      hide.forEach(function (el) { el.style.display = ''; });

      btn.textContent = 'PDF';
      btn.disabled = false;
    }

    window.addEventListener('afterprint', function handler() {
      restore();
      window.removeEventListener('afterprint', handler);
    });

    // Fallback si afterprint ne se déclenche pas (timeout 30s)
    setTimeout(function () {
      if (btn.disabled) restore();
    }, 30000);
  });
})();

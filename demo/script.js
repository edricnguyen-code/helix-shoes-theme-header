(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const scrim = document.querySelector('[data-scrim]');
  const drawers = [...document.querySelectorAll('[data-drawer]')];
  let activeDrawer = null;
  let returnFocus = null;
  let lastScrollY = window.scrollY;

  const focusable = (root) => [...root.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')];

  const hideScrimIfIdle = () => {
    const menuOpen = document.querySelector('.nav-item.is-open');
    if (!activeDrawer && !menuOpen) {
      scrim.classList.remove('is-visible');
      window.setTimeout(() => {
        if (!activeDrawer && !document.querySelector('.nav-item.is-open')) scrim.hidden = true;
      }, 300);
      body.classList.remove('has-overlay');
    }
  };

  const showScrim = () => {
    scrim.hidden = false;
    requestAnimationFrame(() => scrim.classList.add('is-visible'));
    body.classList.add('has-overlay');
  };

  const closeMegaMenus = () => {
    document.querySelectorAll('.nav-item.is-open').forEach((item) => {
      item.classList.remove('is-open');
      const button = item.querySelector('[data-mega-toggle]');
      const panel = item.querySelector('[data-mega-panel]');
      button?.setAttribute('aria-expanded', 'false');
      if (panel) panel.hidden = true;
    });
    hideScrimIfIdle();
  };

  const closeDrawer = () => {
    if (!activeDrawer) return;
    const drawer = activeDrawer;
    activeDrawer = null;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.hidden = true;
    drawer.querySelectorAll('[data-open-nested]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    drawer.querySelectorAll('[data-nested]').forEach((panel) => { panel.hidden = true; });
    drawer.querySelector('[data-nav-root]')?.removeAttribute('hidden');
    drawer.querySelector('[data-close-drawer]')?.setAttribute('aria-label', drawer.dataset.drawer === 'navigation' ? 'Close menu' : `Close ${drawer.dataset.drawer}`);
    hideScrimIfIdle();
    returnFocus?.focus();
    returnFocus = null;
  };

  const openDrawer = (name, origin) => {
    closeMegaMenus();
    if (activeDrawer) closeDrawer();
    const drawer = document.querySelector(`[data-drawer="${name}"]`);
    if (!drawer) return;
    activeDrawer = drawer;
    returnFocus = origin || document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    origin?.setAttribute('aria-expanded', 'true');
    showScrim();
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    window.setTimeout(() => focusable(drawer)[0]?.focus(), 80);
  };

  document.querySelectorAll('[data-open-drawer]').forEach((button) => {
    button.addEventListener('click', () => openDrawer(button.dataset.openDrawer, button));
  });
  document.querySelectorAll('[data-close-drawer]').forEach((button) => button.addEventListener('click', closeDrawer));
  scrim.addEventListener('click', () => { closeMegaMenus(); closeDrawer(); });

  document.querySelectorAll('[data-mega-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.nav-item');
      const panel = item.querySelector('[data-mega-panel]');
      const willOpen = !item.classList.contains('is-open');
      closeMegaMenus();
      if (!willOpen) return;
      item.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
      showScrim();
    });
  });

  document.querySelectorAll('[data-open-nested]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = button.closest('[data-drawer]');
      drawer.querySelector('[data-nav-root]').hidden = true;
      drawer.querySelector(`[data-nested="${button.dataset.openNested}"]`).hidden = false;
      button.setAttribute('aria-expanded', 'true');
    });
  });
  document.querySelectorAll('[data-close-nested]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = button.closest('[data-drawer]');
      drawer.querySelectorAll('[data-nested]').forEach((panel) => { panel.hidden = true; });
      drawer.querySelector('[data-nav-root]').hidden = false;
      drawer.querySelectorAll('[data-open-nested]').forEach((entry) => entry.setAttribute('aria-expanded', 'false'));
      button.closest('[data-nested]')?.querySelector('h3')?.focus?.();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { closeMegaMenus(); closeDrawer(); return; }
    if (event.key !== 'Tab' || !activeDrawer) return;
    const elements = focusable(activeDrawer);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    header.classList.toggle('is-sticky', currentY > 32);
    if (currentY > 120 && delta > 4) header.classList.add('is-hidden');
    if (delta < -4 || currentY < 32) header.classList.remove('is-hidden');
    lastScrollY = currentY;
  }, { passive: true });

  const track = document.querySelector('[data-announcement-track]');
  const messages = [...document.querySelectorAll('.announcement__message')];
  let announcementIndex = 0;
  let announcementTimer;
  const setAnnouncement = (index) => {
    announcementIndex = (index + messages.length) % messages.length;
    track.style.transform = `translateX(-${announcementIndex * 50}%)`;
  };
  const stopAnnouncement = () => window.clearInterval(announcementTimer);
  const startAnnouncement = () => {
    stopAnnouncement();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) announcementTimer = window.setInterval(() => setAnnouncement(announcementIndex + 1), 5000);
  };
  document.querySelector('[data-announcement-prev]').addEventListener('click', () => { setAnnouncement(announcementIndex - 1); startAnnouncement(); });
  document.querySelector('[data-announcement-next]').addEventListener('click', () => { setAnnouncement(announcementIndex + 1); startAnnouncement(); });
  document.querySelector('[data-announcement]').addEventListener('mouseenter', stopAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('mouseleave', startAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('focusin', stopAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('focusout', startAnnouncement);
  startAnnouncement();

  document.querySelectorAll('form').forEach((form) => form.addEventListener('submit', (event) => event.preventDefault()));
})();

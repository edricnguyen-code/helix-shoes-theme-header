(() => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const scrim = document.querySelector('[data-scrim]');
  const drawers = [...document.querySelectorAll('[data-drawer]')];
  const megaItems = [...document.querySelectorAll('[data-menu]')];
  const mobileNavigation = document.querySelector('[data-drawer="navigation"]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeDrawer = null;
  let activeMega = null;
  let returnFocus = null;
  let megaCloseTimer = null;
  let lastScrollY = window.scrollY;
  let scrollIntent = 0;
  let scrollFrame = 0;

  const focusable = (root) => [...root.querySelectorAll('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.closest('[inert]') && element.offsetParent !== null);

  const hideScrimIfIdle = () => {
    if (activeDrawer || activeMega) return;
    scrim.classList.remove('is-visible');
    window.setTimeout(() => {
      if (!activeDrawer && !activeMega) {
        scrim.hidden = true;
        scrim.classList.remove('is-menu', 'is-drawer');
      }
    }, reduceMotion.matches ? 0 : 300);
    body.classList.remove('has-overlay');
  };

  const showScrim = (mode) => {
    scrim.hidden = false;
    scrim.classList.remove('is-menu', 'is-drawer');
    scrim.classList.add(mode === 'menu' ? 'is-menu' : 'is-drawer');
    if (mode === 'menu') {
      scrim.style.setProperty('--menu-scrim-top', `${Math.round(header.getBoundingClientRect().bottom)}px`);
      body.classList.remove('has-overlay');
    } else {
      body.classList.add('has-overlay');
    }
    requestAnimationFrame(() => scrim.classList.add('is-visible'));
  };

  const closeMega = (item, immediate = false) => {
    if (!item) return;
    const button = item.querySelector('[data-mega-toggle]');
    const panel = item.querySelector('[data-mega-panel]');
    item.classList.remove('is-open');
    button?.setAttribute('aria-expanded', 'false');
    if (activeMega === item) activeMega = null;
    if (!activeMega) header.classList.remove('is-menu-active');
    window.setTimeout(() => {
      if (panel && !item.classList.contains('is-open')) panel.hidden = true;
    }, immediate || reduceMotion.matches ? 0 : 440);
  };

  const closeMegaMenus = (immediate = false) => {
    window.clearTimeout(megaCloseTimer);
    megaItems.forEach((item) => closeMega(item, immediate));
    hideScrimIfIdle();
  };

  const openMega = (item) => {
    if (!item || !window.matchMedia('(min-width: 768px)').matches) return;
    window.clearTimeout(megaCloseTimer);
    megaItems.forEach((entry) => { if (entry !== item) closeMega(entry, true); });
    const button = item.querySelector('[data-mega-toggle]');
    const panel = item.querySelector('[data-mega-panel]');
    if (!panel) return;
    panel.hidden = false;
    activeMega = item;
    item.classList.add('is-open');
    button?.setAttribute('aria-expanded', 'true');
    header.classList.add('is-menu-active');
    header.classList.remove('is-hidden');
    showScrim('menu');
  };

  const scheduleMegaClose = (item) => {
    window.clearTimeout(megaCloseTimer);
    megaCloseTimer = window.setTimeout(() => {
      if (item.matches(':hover') || item.matches(':focus-within')) return;
      closeMega(item);
      hideScrimIfIdle();
    }, 140);
  };

  megaItems.forEach((item) => {
    const button = item.querySelector('[data-mega-toggle]');
    item.addEventListener('pointerenter', () => openMega(item));
    item.addEventListener('pointerleave', () => scheduleMegaClose(item));
    item.addEventListener('focusin', () => openMega(item));
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) scheduleMegaClose(item);
    });
    button?.addEventListener('click', (event) => {
      event.preventDefault();
      openMega(item);
    });
  });

  const resetNestedNavigation = (drawer, immediate = false) => {
    if (!drawer) return;
    drawer.classList.remove('has-nested-open');
    drawer.removeAttribute('data-active-nested');
    const root = drawer.querySelector('[data-nav-root]');
    root?.setAttribute('aria-hidden', 'false');
    root?.removeAttribute('inert');
    drawer.querySelectorAll('[data-open-nested]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
    drawer.querySelectorAll('[data-nested]').forEach((panel) => {
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('inert', '');
    });
    if (immediate) drawer.classList.add('no-nav-transition');
    requestAnimationFrame(() => drawer.classList.remove('no-nav-transition'));
  };

  const closeDrawer = (immediate = false) => {
    if (!activeDrawer) return;
    const drawer = activeDrawer;
    const focusTarget = returnFocus;
    activeDrawer = null;
    returnFocus = null;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.querySelectorAll(`[aria-controls="${drawer.id}"]`).forEach((control) => control.setAttribute('aria-expanded', 'false'));
    window.setTimeout(() => {
      if (activeDrawer !== drawer) {
        drawer.hidden = true;
        if (drawer === mobileNavigation) resetNestedNavigation(drawer, true);
      }
    }, immediate || reduceMotion.matches ? 0 : 520);
    hideScrimIfIdle();
    focusTarget?.focus();
  };

  const openDrawer = (name, origin) => {
    closeMegaMenus(true);
    if (activeDrawer) closeDrawer(true);
    const drawer = document.querySelector(`[data-drawer="${name}"]`);
    if (!drawer) return;
    activeDrawer = drawer;
    returnFocus = origin || document.activeElement;
    if (drawer === mobileNavigation) resetNestedNavigation(drawer, true);
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    origin?.setAttribute('aria-expanded', 'true');
    showScrim('drawer');
    requestAnimationFrame(() => drawer.classList.add('is-open'));
    window.setTimeout(() => focusable(drawer)[0]?.focus(), reduceMotion.matches ? 0 : 90);
  };

  document.querySelectorAll('[data-open-drawer]').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.matches('a')) event.preventDefault();
      openDrawer(button.dataset.openDrawer, button);
    });
  });
  document.querySelectorAll('[data-close-drawer]').forEach((button) => button.addEventListener('click', () => closeDrawer()));
  scrim.addEventListener('click', () => { closeMegaMenus(); closeDrawer(); });

  document.querySelectorAll('[data-open-nested]').forEach((button) => {
    button.addEventListener('click', () => {
      const drawer = button.closest('[data-drawer]');
      const root = drawer?.querySelector('[data-nav-root]');
      const panel = drawer?.querySelector(`[data-nested="${button.dataset.openNested}"]`);
      if (!drawer || !root || !panel) return;
      drawer.querySelectorAll('[data-nested]').forEach((entry) => {
        entry.classList.remove('is-active');
        entry.setAttribute('aria-hidden', 'true');
        entry.setAttribute('inert', '');
      });
      drawer.classList.add('has-nested-open');
      drawer.dataset.activeNested = button.dataset.openNested;
      root.setAttribute('aria-hidden', 'true');
      root.setAttribute('inert', '');
      panel.hidden = false;
      panel.setAttribute('aria-hidden', 'false');
      panel.removeAttribute('inert');
      requestAnimationFrame(() => panel.classList.add('is-active'));
      button.setAttribute('aria-expanded', 'true');
      window.setTimeout(() => focusable(panel)[0]?.focus(), reduceMotion.matches ? 0 : 530);
    });
  });

  const closeNested = (button) => {
    const drawer = button.closest('[data-drawer]');
    const panel = button.closest('[data-nested]');
    const root = drawer?.querySelector('[data-nav-root]');
    const opener = drawer?.querySelector(`[data-open-nested="${panel?.dataset.nested}"]`);
    if (!drawer || !panel || !root) return;
    drawer.classList.remove('has-nested-open');
    drawer.removeAttribute('data-active-nested');
    panel.classList.remove('is-active');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');
    root.setAttribute('aria-hidden', 'false');
    root.removeAttribute('inert');
    opener?.setAttribute('aria-expanded', 'false');
    window.setTimeout(() => opener?.focus(), reduceMotion.matches ? 0 : 530);
  };

  document.querySelectorAll('[data-close-nested]').forEach((button) => button.addEventListener('click', () => closeNested(button)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const activeNested = activeDrawer?.querySelector('[data-nested].is-active');
      const backButton = activeNested?.querySelector('[data-close-nested]');
      if (backButton) closeNested(backButton);
      else { closeMegaMenus(); closeDrawer(); }
      return;
    }
    if (event.key !== 'Tab' || !activeDrawer) return;
    const elements = focusable(activeDrawer);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const updateStickyHeader = () => {
    scrollFrame = 0;
    const currentY = Math.max(window.scrollY, 0);
    const delta = currentY - lastScrollY;
    header.classList.toggle('is-sticky', currentY > 28);
    if (currentY < 92 || activeMega || activeDrawer) {
      header.classList.remove('is-hidden');
      scrollIntent = 0;
    } else if (Math.abs(delta) > 1) {
      if (Math.sign(delta) !== Math.sign(scrollIntent)) scrollIntent = 0;
      scrollIntent = Math.max(-32, Math.min(32, scrollIntent + delta));
      if (scrollIntent > 20) header.classList.add('is-hidden');
      if (scrollIntent < -10) header.classList.remove('is-hidden');
    }
    lastScrollY = currentY;
  };

  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStickyHeader);
  }, { passive: true });
  updateStickyHeader();

  const messages = [...document.querySelectorAll('.announcement__message')];
  let announcementIndex = 0;
  let announcementTimer;
  let announcementTransitionTimer;
  let announcementFrame;
  let announcementAnimating = false;
  let queuedAnnouncementIndex = null;
  const announcementDuration = 760;
  const normalizeAnnouncementIndex = (index) => (index + messages.length) % messages.length;
  const commitAnnouncement = (index) => {
    messages.forEach((message, messageIndex) => {
      const active = messageIndex === index;
      message.classList.toggle('is-active', active);
      message.classList.toggle('is-hidden', !active);
      message.classList.remove('is-entering', 'is-leaving');
      message.setAttribute('aria-hidden', active ? 'false' : 'true');
      message.tabIndex = active ? 0 : -1;
    });
  };
  const setAnnouncement = (index) => {
    if (!messages.length) return;
    const targetIndex = normalizeAnnouncementIndex(index);
    if (announcementAnimating) {
      queuedAnnouncementIndex = targetIndex === announcementIndex ? null : targetIndex;
      return;
    }

    const nextMessage = messages[targetIndex];
    const currentMessage = messages.find((message) => message.classList.contains('is-active'));
    announcementIndex = targetIndex;

    if (!currentMessage || currentMessage === nextMessage || reduceMotion.matches) {
      commitAnnouncement(targetIndex);
      return;
    }

    announcementAnimating = true;
    window.clearTimeout(announcementTransitionTimer);
    window.cancelAnimationFrame(announcementFrame);
    messages.forEach((message) => {
      message.classList.remove('is-active', 'is-entering', 'is-leaving');
      message.classList.add('is-hidden');
      message.setAttribute('aria-hidden', 'true');
      message.tabIndex = -1;
    });

    currentMessage.classList.remove('is-active');
    currentMessage.classList.remove('is-hidden');
    currentMessage.classList.add('is-leaving');
    currentMessage.setAttribute('aria-hidden', 'true');
    currentMessage.tabIndex = -1;
    nextMessage.classList.remove('is-hidden');
    nextMessage.classList.add('is-entering');
    nextMessage.setAttribute('aria-hidden', 'false');
    nextMessage.tabIndex = 0;

    // Force the entering state to paint before promoting it to the active state.
    void nextMessage.offsetHeight;
    announcementFrame = requestAnimationFrame(() => {
      nextMessage.classList.remove('is-entering');
      nextMessage.classList.add('is-active');
    });
    announcementTransitionTimer = window.setTimeout(() => {
      currentMessage.classList.remove('is-leaving');
      commitAnnouncement(targetIndex);
      announcementAnimating = false;
      const queuedIndex = queuedAnnouncementIndex;
      queuedAnnouncementIndex = null;
      if (queuedIndex !== null && queuedIndex !== announcementIndex) setAnnouncement(queuedIndex);
    }, announcementDuration);
  };
  const stopAnnouncement = () => window.clearInterval(announcementTimer);
  const startAnnouncement = () => {
    stopAnnouncement();
    if (!reduceMotion.matches) announcementTimer = window.setInterval(() => setAnnouncement(announcementIndex + 1), 5000);
  };
  document.querySelector('[data-announcement-prev]').addEventListener('click', () => { setAnnouncement(announcementIndex - 1); startAnnouncement(); });
  document.querySelector('[data-announcement-next]').addEventListener('click', () => { setAnnouncement(announcementIndex + 1); startAnnouncement(); });
  document.querySelector('[data-announcement]').addEventListener('mouseenter', stopAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('mouseleave', startAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('focusin', stopAnnouncement);
  document.querySelector('[data-announcement]').addEventListener('focusout', startAnnouncement);
  setAnnouncement(0);
  startAnnouncement();

  window.addEventListener('resize', () => {
    if (window.matchMedia('(max-width: 767px)').matches) closeMegaMenus(true);
    if (activeMega) showScrim('menu');
  }, { passive: true });

  document.querySelectorAll('form').forEach((form) => form.addEventListener('submit', (event) => event.preventDefault()));
})();

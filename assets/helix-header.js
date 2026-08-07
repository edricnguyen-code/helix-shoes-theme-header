if (!customElements.get('helix-header')) {
  customElements.define('helix-header', class HelixHeader extends HTMLElement {
    connectedCallback() {
      this.shell = this.querySelector('[data-helix-header-shell]');
      this.overlay = this.querySelector('[data-helix-header-overlay]');
      this.menuItems = [...this.querySelectorAll('[data-helix-menu-item]')];
      this.openItem = null;
      this.closeTimer = null;
      this.lastScrollY = window.scrollY;
      this.scrollIntent = 0;
      this.scrollTicking = false;
      this.drawerTrigger = null;
      this.searchAbortController = null;
      this.mobileTransitioning = false;
      this.surfaceReadyAt = 0;
      this.panelDuration = Number.parseInt(getComputedStyle(this).getPropertyValue('--helix-panel-duration'), 10) || 300;
      this.surfaceDuration = Number.parseInt(getComputedStyle(this).getPropertyValue('--helix-surface-duration'), 10) || 150;
      const handoffOverlap = Number.parseInt(getComputedStyle(this).getPropertyValue('--helix-panel-handoff'), 10);
      this.handoffOverlap = Number.isNaN(handoffOverlap) ? 20 : Math.max(0, handoffOverlap);
      this.mobilePanelDuration = Number.parseInt(getComputedStyle(this).getPropertyValue('--helix-mobile-panel-duration'), 10) || 520;
      this.drawerDuration = Number.parseInt(getComputedStyle(this).getPropertyValue('--helix-drawer-duration'), 10) || 520;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.defaultPredictiveMarkup = new Map();
      this.onClick = this.handleClick.bind(this);
      this.onKeydown = this.handleKeydown.bind(this);
      this.onScroll = this.queueScrollUpdate.bind(this);
      this.onResize = this.handleResize.bind(this);
      this.onDocumentClick = this.handleDocumentClick.bind(this);
      this.onInput = this.handleInput.bind(this);
      this.onChange = this.handleChange.bind(this);
      this.onSubmit = this.handleSubmit.bind(this);
      this.onEditorBlockSelect = this.handleEditorBlockSelect.bind(this);
      this.addEventListener('click', this.onClick);
      this.addEventListener('keydown', this.onKeydown);
      this.addEventListener('input', this.onInput);
      this.addEventListener('change', this.onChange);
      this.addEventListener('submit', this.onSubmit);
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });
      document.addEventListener('click', this.onDocumentClick);
      document.addEventListener('shopify:block:select', this.onEditorBlockSelect);
      this.bindDesktopMenus();
      this.bindLocalization();
      this.bindDrawers();
      this.querySelectorAll('[data-helix-predictive-results]').forEach((element) => this.defaultPredictiveMarkup.set(element, element.innerHTML));
      this.initialTop = this.getBoundingClientRect().top + window.scrollY;
      requestAnimationFrame(() => {
        this.updateHeaderBottom();
        this.updateStickyState(true);
      });
    }

    disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
      this.removeEventListener('keydown', this.onKeydown);
      this.removeEventListener('input', this.onInput);
      this.removeEventListener('change', this.onChange);
      this.removeEventListener('submit', this.onSubmit);
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      document.removeEventListener('click', this.onDocumentClick);
      document.removeEventListener('shopify:block:select', this.onEditorBlockSelect);
      clearTimeout(this.closeTimer);
      clearTimeout(this.searchTimer);
      this.querySelectorAll('.is-sequenced-open').forEach((element) => clearTimeout(element.helixSequenceTimer));
      this.querySelectorAll('[data-helix-localization-details]').forEach((details) => clearTimeout(details.helixCloseTimer));
      this.searchAbortController?.abort();
    }

    bindDesktopMenus() {
      this.menuItems.forEach((item) => {
        item.addEventListener('pointerenter', () => {
          if (!window.matchMedia('(min-width: 768px)').matches) return;
          clearTimeout(this.closeTimer);
          this.openDesktopItem(item);
        });
        item.addEventListener('pointerleave', () => {
          if (!window.matchMedia('(min-width: 768px)').matches) return;
          clearTimeout(this.closeTimer);
          this.closeTimer = setTimeout(() => this.closeDesktopItem(item), item.classList.contains('is-sequenced-open') ? this.surfaceDuration + 80 : 70);
        });
        item.addEventListener('focusin', () => this.openDesktopItem(item));
        item.addEventListener('focusout', (event) => {
          if (item.contains(event.relatedTarget)) return;
          clearTimeout(this.closeTimer);
          this.closeTimer = setTimeout(() => this.closeDesktopItem(item), 80);
        });
      });
    }

    bindLocalization() {
      this.querySelectorAll('[data-helix-localization-details]').forEach((details) => {
        let hoverTimer;
        const summary = details.querySelector('summary');
        summary?.addEventListener('click', (event) => {
          if (details.closest('[data-helix-drawer]') || !window.matchMedia('(min-width: 768px)').matches) return;
          event.preventDefault();
          details.open && details.classList.contains('is-panel-open')
            ? this.closeLocalization(details)
            : this.openLocalization(details);
        });
        details.addEventListener('pointerenter', () => {
          if (!window.matchMedia('(min-width: 768px)').matches) return;
          clearTimeout(hoverTimer);
          this.openLocalization(details);
        });
        details.addEventListener('pointerleave', () => {
          if (!window.matchMedia('(min-width: 768px)').matches) return;
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(() => this.closeLocalization(details), 70);
        });
        details.addEventListener('toggle', () => {
          if (details.open) this.positionLocalizationPopover(details);
          else {
            clearTimeout(details.helixCloseTimer);
            details.classList.remove('is-panel-open');
            this.clearPanelSequence(details);
            this.resetCountrySearch(details);
          }
          this.syncLocalizationState();
        });
      });
    }

    openLocalization(details) {
      if (!details || (details.open && details.classList.contains('is-panel-open'))) return;
      clearTimeout(details.helixCloseTimer);
      details.classList.remove('is-panel-open');
      if (!details.open) this.setPanelSequence(details, this.getPanelSequenceDelay());
      details.open = true;
      this.positionLocalizationPopover(details);
      const popover = details.querySelector('.helix-localization__popover');
      popover?.getBoundingClientRect();
      this.syncLocalizationState();
      requestAnimationFrame(() => {
        if (details.open) details.classList.add('is-panel-open');
      });
    }

    closeLocalization(details, immediate = false) {
      if (!details?.open) return;
      clearTimeout(details.helixCloseTimer);
      details.classList.remove('is-panel-open');
      const finish = () => {
        if (details.classList.contains('is-panel-open')) return;
        details.open = false;
        this.clearPanelSequence(details);
        this.resetCountrySearch(details);
        this.syncLocalizationState();
      };
      if (immediate || this.reducedMotion) finish();
      else details.helixCloseTimer = setTimeout(finish, this.panelDuration);
    }

    bindDrawers() {
      this.querySelectorAll('[data-helix-drawer]').forEach((dialog) => {
        dialog.addEventListener('cancel', (event) => {
          event.preventDefault();
          this.closeDrawer(dialog);
        });
        dialog.addEventListener('click', (event) => {
          if (event.target === dialog) this.closeDrawer(dialog);
        });
      });
    }

    handleClick(event) {
      const menuToggle = event.target.closest('[data-helix-menu-toggle]');
      if (menuToggle) {
        event.preventDefault();
        const item = menuToggle.closest('[data-helix-menu-item]');
        item?.classList.contains('is-open') ? this.closeDesktopItem(item) : this.openDesktopItem(item);
        return;
      }

      const drawerButton = event.target.closest('[data-helix-open-drawer]');
      if (drawerButton) {
        event.preventDefault();
        this.openDrawer(drawerButton.dataset.helixOpenDrawer, drawerButton);
        return;
      }

      const closeButton = event.target.closest('[data-helix-close-drawer]');
      if (closeButton) {
        event.preventDefault();
        this.closeDrawer(closeButton.closest('[data-helix-drawer]'));
        return;
      }

      const mobileOpen = event.target.closest('[data-helix-mobile-open]');
      if (mobileOpen) {
        event.preventDefault();
        this.transitionMobilePanel(mobileOpen.dataset.helixMobileOpen, true, mobileOpen);
        return;
      }

      const mobileBack = event.target.closest('[data-helix-mobile-back]');
      if (mobileBack) {
        event.preventDefault();
        this.transitionMobilePanel(mobileBack.dataset.helixMobileBack, false, mobileBack);
        return;
      }

      const localizationOption = event.target.closest('[data-helix-localization-option]');
      if (localizationOption) {
        event.preventDefault();
        const form = localizationOption.closest('form');
        const input = form?.querySelector('[data-helix-localization-input]');
        if (form && input) {
          input.value = localizationOption.dataset.helixLocalizationOption;
          form.requestSubmit();
        }
        return;
      }

      const cartRemove = event.target.closest('[data-helix-cart-remove]');
      if (cartRemove) {
        event.preventDefault();
        this.changeCartLine(Number(cartRemove.dataset.helixCartRemove), 0);
        return;
      }

      if (event.target === this.overlay) this.closeAllDesktopMenus();
    }

    handleKeydown(event) {
      if (event.target.matches('[data-helix-country-search]') && event.key === 'Enter') {
        event.preventDefault();
        return;
      }
      if (event.key !== 'Escape') return;
      const openDialog = this.querySelector('[data-helix-drawer][open]');
      if (openDialog) {
        event.preventDefault();
        this.closeDrawer(openDialog);
        return;
      }
      this.closeAllDesktopMenus();
      this.closeAllLocalization();
    }

    handleDocumentClick(event) {
      if (!this.isConnected || this.contains(event.target)) return;
      this.closeAllDesktopMenus();
      this.closeAllLocalization();
    }

    openDesktopItem(item) {
      const panel = item?.querySelector(':scope > [data-helix-menu-panel]');
      if (!item || !panel || !window.matchMedia('(min-width: 768px)').matches) return;
      if (item.classList.contains('is-open')) return;
      const isMega = item.dataset.panelType === 'mega';
      const sequenceDelay = isMega ? 0 : this.getPanelSequenceDelay();
      if (this.openItem && this.openItem !== item) this.closeDesktopItem(this.openItem, true, true);
      clearTimeout(this.closeTimer);
      if (isMega) this.clearPanelSequence(item);
      else this.setPanelSequence(item, sequenceDelay);
      panel.hidden = false;
      panel.removeAttribute('inert');
      this.updateHeaderBottom();
      if (isMega) this.updateMegaSurfaceHeight(panel);
      panel.getBoundingClientRect();
      item.querySelector('[data-helix-menu-toggle]')?.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => {
        item.classList.add('is-open');
        this.openItem = item;
        this.classList.add('has-open-menu');
        this.classList.toggle('has-open-mega', item.dataset.panelType === 'mega');
        this.classList.toggle('has-open-dropdown', item.dataset.panelType === 'dropdown');
        this.classList.remove('is-hidden');
        this.scrollIntent = 0;
        this.showOverlay();
        this.updateHeaderBottom();
      });
    }

    closeDesktopItem(item, immediate = false, preserveHeader = false) {
      if (!item) return;
      const panel = item.querySelector(':scope > [data-helix-menu-panel]');
      item.classList.remove('is-open');
      this.clearPanelSequence(item);
      item.querySelector('[data-helix-menu-toggle]')?.setAttribute('aria-expanded', 'false');
      const finish = () => {
        if (!item.classList.contains('is-open') && panel) {
          panel.hidden = true;
          panel.setAttribute('inert', '');
        }
        if (!this.classList.contains('has-open-mega')) this.style.removeProperty('--helix-open-panel-height');
      };
      if (immediate) finish(); else setTimeout(finish, this.panelDuration);
      if (this.openItem === item) this.openItem = null;
      if (!preserveHeader && !this.menuItems.some((candidate) => candidate.classList.contains('is-open'))) {
        this.classList.remove('has-open-menu');
        this.classList.remove('has-open-mega', 'has-open-dropdown');
        if (!this.classList.contains('has-open-localization')) this.surfaceReadyAt = 0;
        if (!this.classList.contains('has-open-localization')) this.hideOverlay();
      }
    }

    closeAllDesktopMenus() {
      this.menuItems.forEach((item) => this.closeDesktopItem(item, true));
    }

    syncLocalizationState() {
      const openDetails = [...this.querySelectorAll('[data-helix-localization-details]')].find((details) => details.open && !details.closest('[data-helix-drawer]'));
      const anyOpen = Boolean(openDetails);
      this.classList.toggle('has-open-localization', anyOpen);
      if (anyOpen) {
        this.positionLocalizationPopover(openDetails);
        this.closeAllDesktopMenus();
        this.classList.remove('is-hidden');
        this.scrollIntent = 0;
        this.showOverlay();
        this.updateHeaderBottom();
      } else if (!this.classList.contains('has-open-menu')) {
        this.surfaceReadyAt = 0;
        this.hideOverlay();
      }
    }

    closeAllLocalization() {
      this.querySelectorAll('[data-helix-localization-details][open]').forEach((details) => {
        clearTimeout(details.helixCloseTimer);
        details.classList.remove('is-panel-open');
        details.removeAttribute('open');
        this.clearPanelSequence(details);
        this.resetCountrySearch(details);
      });
      this.classList.remove('has-open-localization');
      if (!this.classList.contains('has-open-menu')) {
        this.surfaceReadyAt = 0;
        this.hideOverlay();
      }
    }

    showOverlay() {
      if (!this.overlay) return;
      this.overlay.hidden = false;
      requestAnimationFrame(() => this.overlay.removeAttribute('tabindex'));
    }

    hideOverlay() {
      if (!this.overlay) return;
      this.overlay.setAttribute('tabindex', '-1');
      setTimeout(() => {
        if (!this.classList.contains('has-open-menu') && !this.classList.contains('has-open-localization')) this.overlay.hidden = true;
      }, this.panelDuration);
    }

    openDrawer(id, trigger) {
      const dialog = this.querySelector(`#${CSS.escape(id)}`);
      if (!dialog || dialog.open) return;
      this.closeAllDesktopMenus();
      this.closeAllLocalization();
      this.drawerTrigger = trigger;
      trigger?.setAttribute('aria-expanded', 'true');
      dialog.showModal();
      dialog.classList.remove('is-visible');
      document.documentElement.classList.add('helix-scroll-locked');
      void dialog.offsetWidth;
      dialog.querySelector('.helix-drawer__surface')?.getBoundingClientRect();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!dialog.open || dialog.dataset.closing === 'true') return;
          dialog.classList.add('is-visible');
          const focusTarget = dialog.querySelector('[autofocus], input:not([type="hidden"]), button, a[href]');
          focusTarget?.focus({ preventScroll: true });
        });
      });
    }

    closeDrawer(dialog) {
      if (!dialog?.open || dialog.dataset.closing === 'true') return;
      dialog.dataset.closing = 'true';
      dialog.classList.remove('is-visible');
      setTimeout(() => {
        if (dialog.open) dialog.close();
        delete dialog.dataset.closing;
        this.resetMobilePanels(dialog);
        const trigger = this.drawerTrigger;
        trigger?.setAttribute('aria-expanded', 'false');
        if (!this.querySelector('[data-helix-drawer][open]')) document.documentElement.classList.remove('helix-scroll-locked');
        trigger?.focus({ preventScroll: true });
        this.drawerTrigger = null;
      }, this.reducedMotion ? 0 : this.drawerDuration);
    }

    transitionMobilePanel(targetId, forward, control) {
      if (this.mobileTransitioning) return;
      const stage = control.closest('[data-helix-mobile-stage]');
      const source = stage?.querySelector('[data-helix-mobile-panel].is-current');
      const target = stage?.querySelector(`#${CSS.escape(targetId)}`);
      if (!source || !target || source === target) return;
      this.mobileTransitioning = true;
      target.hidden = false;
      target.removeAttribute('inert');
      target.setAttribute('aria-hidden', 'false');
      target.classList.remove('is-current', 'is-left', 'is-right');
      target.classList.add(forward ? 'is-right' : 'is-left');
      target.getBoundingClientRect();
      requestAnimationFrame(() => {
        source.classList.remove('is-current');
        source.classList.add(forward ? 'is-left' : 'is-right');
        target.classList.remove(forward ? 'is-right' : 'is-left');
        target.classList.add('is-current');
        control.setAttribute('aria-expanded', forward ? 'true' : 'false');
        setTimeout(() => {
          source.hidden = true;
          source.setAttribute('inert', '');
          source.setAttribute('aria-hidden', 'true');
          source.classList.remove('is-left', 'is-right');
          if (!forward) {
            const sourceId = source.id;
            stage.querySelectorAll(`[data-helix-mobile-open="${CSS.escape(sourceId)}"]`).forEach((button) => button.setAttribute('aria-expanded', 'false'));
          }
          this.mobileTransitioning = false;
          const focusTarget = target.querySelector('[data-helix-mobile-back], a, button');
          focusTarget?.focus({ preventScroll: true });
        }, this.mobilePanelDuration);
      });
    }

    resetMobilePanels(scope) {
      const panels = [...scope.querySelectorAll('[data-helix-mobile-panel]')];
      panels.forEach((panel) => {
        const isRoot = panel.dataset.panelDepth === '0';
        panel.classList.toggle('is-current', isRoot);
        panel.classList.remove('is-left', 'is-right');
        panel.hidden = !isRoot;
        panel.setAttribute('aria-hidden', isRoot ? 'false' : 'true');
        if (isRoot) panel.removeAttribute('inert'); else panel.setAttribute('inert', '');
      });
      scope.querySelectorAll('[data-helix-mobile-open]').forEach((button) => button.setAttribute('aria-expanded', 'false'));
      this.mobileTransitioning = false;
    }

    handleInput(event) {
      if (event.target.matches('[data-helix-country-search]')) {
        this.filterCountryOptions(event.target);
        return;
      }
      if (!event.target.matches('[data-helix-predictive-input]')) return;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.updatePredictiveSearch(event.target), 180);
    }

    async updatePredictiveSearch(input) {
      const results = this.querySelector(`#${CSS.escape(input.getAttribute('aria-controls'))}`);
      if (!results) return;
      const query = input.value.trim();
      if (!query) {
        results.innerHTML = this.defaultPredictiveMarkup.get(results) || '';
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      this.searchAbortController?.abort();
      this.searchAbortController = new AbortController();
      try {
        const url = `${this.dataset.predictiveUrl}?q=${encodeURIComponent(query)}&section_id=predictive-search`;
        const response = await fetch(url, { signal: this.searchAbortController.signal, headers: { Accept: 'text/html' } });
        if (!response.ok) throw new Error(`Predictive search failed: ${response.status}`);
        const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
        const renderedSection = documentFragment.querySelector('#shopify-section-predictive-search');
        results.innerHTML = renderedSection?.innerHTML || documentFragment.body.innerHTML;
        input.setAttribute('aria-expanded', 'true');
      } catch (error) {
        if (error.name !== 'AbortError') input.setAttribute('aria-expanded', 'false');
      }
    }

    handleChange(event) {
      if (!event.target.matches('[data-helix-cart-quantity]')) return;
      event.target.closest('form')?.requestSubmit();
    }

    async handleSubmit(event) {
      const quickAdd = event.target.closest('[data-helix-quick-add]');
      const cartForm = event.target.closest('[data-helix-cart-form]');
      if (cartForm) {
        event.preventDefault();
        const line = Number(new FormData(cartForm).get('line'));
        const quantity = Number(new FormData(cartForm).get('quantity'));
        await this.changeCartLine(line, quantity);
        return;
      }
      if (!quickAdd) return;
      event.preventDefault();
      const button = quickAdd.querySelector('button[type="submit"]');
      button?.setAttribute('aria-busy', 'true');
      if (button) button.disabled = true;
      try {
        const response = await fetch(this.dataset.cartAddUrl, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(quickAdd)
        });
        if (!response.ok) throw new Error(`Cart add failed: ${response.status}`);
        await this.refreshCart();
        const cartTrigger = this.querySelector(`[data-helix-open-drawer="HelixCartDrawer-${CSS.escape(this.dataset.sectionId)}"]`);
        this.openDrawer(`HelixCartDrawer-${this.dataset.sectionId}`, cartTrigger);
      } catch (error) {
        const status = this.querySelector('[data-helix-cart-status]');
        if (status) status.textContent = error.message;
      } finally {
        button?.removeAttribute('aria-busy');
        if (button) button.disabled = false;
      }
    }

    async changeCartLine(line, quantity) {
      const status = this.querySelector('[data-helix-cart-status]');
      try {
        const response = await fetch(`${this.dataset.cartChangeUrl}.js`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ line, quantity })
        });
        if (!response.ok) throw new Error(`Cart update failed: ${response.status}`);
        await this.refreshCart();
        if (status) status.textContent = '';
      } catch (error) {
        if (status) status.textContent = error.message;
      }
    }

    async refreshCart() {
      const cartResponse = await fetch(`${this.dataset.cartUrl}.js`, { headers: { Accept: 'application/json' } });
      if (!cartResponse.ok) return;
      const cart = await cartResponse.json();
      this.querySelectorAll('[data-helix-cart-count]').forEach((count) => {
        count.textContent = cart.item_count;
        count.classList.toggle('is-empty', cart.item_count === 0);
      });
      this.querySelectorAll('[data-helix-cart-heading-count]').forEach((count) => {
        count.textContent = cart.item_count > 0 ? `(${cart.item_count})` : '';
      });
      try {
        const sectionResponse = await fetch(`${this.dataset.cartUrl}?section_id=${encodeURIComponent(this.dataset.sectionId)}`);
        if (!sectionResponse.ok) return;
        const rendered = new DOMParser().parseFromString(await sectionResponse.text(), 'text/html');
        const replacement = rendered.querySelector('[data-helix-cart-drawer]');
        const current = this.querySelector('[data-helix-cart-drawer]');
        if (replacement && current) current.innerHTML = replacement.innerHTML;
      } catch (error) {
        const status = this.querySelector('[data-helix-cart-status]');
        if (status) status.textContent = error.message;
      }
    }

    queueScrollUpdate() {
      if (this.scrollTicking) return;
      this.scrollTicking = true;
      requestAnimationFrame(() => {
        this.updateStickyState(false);
        this.scrollTicking = false;
      });
    }

    updateStickyState(initial) {
      const mode = this.dataset.stickyMode;
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - this.lastScrollY;
      const menuOpen = this.classList.contains('has-open-menu') || this.classList.contains('has-open-localization');
      const drawerOpen = Boolean(this.querySelector('[data-helix-drawer][open]'));
      const sticky = currentY > 28;
      if (mode === 'none') {
        this.classList.remove('is-sticky', 'is-hidden');
      } else {
        this.classList.toggle('is-sticky', sticky);
        const canHide = this.dataset.hideOnScroll === 'true' && mode === 'scroll_up';
        if (!sticky || currentY < 92 || menuOpen || drawerOpen || mode === 'always' || !canHide) {
          this.classList.remove('is-hidden');
          this.scrollIntent = 0;
        } else if (Math.abs(delta) > 1) {
          if (Math.sign(delta) !== Math.sign(this.scrollIntent)) this.scrollIntent = 0;
          this.scrollIntent = Math.max(-32, Math.min(32, this.scrollIntent + delta));
          if (this.scrollIntent > 20) this.classList.add('is-hidden');
          if (this.scrollIntent < -10) this.classList.remove('is-hidden');
        }
      }
      this.lastScrollY = currentY;
      if (!initial) this.updateHeaderBottom();
    }

    updateHeaderBottom() {
      if (!this.shell) return;
      this.style.setProperty('--helix-header-bottom', `${Math.round(this.shell.getBoundingClientRect().bottom)}px`);
    }

    updateMegaSurfaceHeight(panel = this.openItem?.querySelector(':scope > [data-helix-menu-panel]')) {
      if (!panel || panel.hidden) return;
      const panelHeight = Math.max(panel.scrollHeight, panel.getBoundingClientRect().height);
      if (panelHeight > 0) this.style.setProperty('--helix-open-panel-height', `${Math.ceil(panelHeight)}px`);
    }

    handleResize() {
      this.updateHeaderBottom();
      if (this.openItem?.dataset.panelType === 'mega') this.updateMegaSurfaceHeight();
      this.querySelectorAll('[data-helix-localization-details][open]').forEach((details) => this.positionLocalizationPopover(details));
      if (!window.matchMedia('(min-width: 768px)').matches) this.closeAllDesktopMenus();
    }

    getPanelSequenceDelay() {
      if (this.reducedMotion
        || !window.matchMedia('(min-width: 768px)').matches
        || this.dataset.transparent !== 'true'
        || this.classList.contains('is-sticky')) return 0;
      const now = performance.now();
      if (this.classList.contains('has-open-menu') || this.classList.contains('has-open-localization')) {
        return Math.max(0, Math.round(this.surfaceReadyAt - now - this.handoffOverlap));
      }
      this.surfaceReadyAt = now + this.surfaceDuration;
      return Math.max(0, this.surfaceDuration - this.handoffOverlap);
    }

    setPanelSequence(element, sequenceDelay) {
      clearTimeout(element.helixSequenceTimer);
      element.classList.toggle('is-sequenced-open', sequenceDelay > 0);
      if (sequenceDelay <= 0) {
        element.style.removeProperty('--helix-sequence-delay');
        return;
      }
      element.style.setProperty('--helix-sequence-delay', `${sequenceDelay}ms`);
      element.helixSequenceTimer = setTimeout(() => {
        element.classList.remove('is-sequenced-open');
        element.style.removeProperty('--helix-sequence-delay');
      }, sequenceDelay + this.panelDuration + 80);
    }

    clearPanelSequence(element) {
      if (!element) return;
      clearTimeout(element.helixSequenceTimer);
      element.classList.remove('is-sequenced-open');
      element.style.removeProperty('--helix-sequence-delay');
    }

    positionLocalizationPopover(details) {
      if (!details || details.dataset.localizationContext !== 'desktop' || !window.matchMedia('(min-width: 768px)').matches) return;
      const summary = details.querySelector('summary');
      if (!summary) return;
      const rect = summary.getBoundingClientRect();
      const right = Math.max(16, Math.round(window.innerWidth - rect.right));
      details.style.setProperty('--helix-localization-right', `${right}px`);
    }

    filterCountryOptions(input) {
      const details = input.closest('[data-helix-localization-details]');
      const query = input.value.trim().toLocaleLowerCase();
      let visibleCount = 0;
      details?.querySelectorAll('[data-helix-country-item]').forEach((item) => {
        const searchableText = item.querySelector('[data-country-search-text]')?.dataset.countrySearchText || '';
        const visible = !query || searchableText.includes(query);
        item.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      const empty = details?.querySelector('[data-helix-country-empty]');
      if (empty) empty.hidden = visibleCount !== 0;
    }

    resetCountrySearch(details) {
      const input = details?.querySelector('[data-helix-country-search]');
      if (!input) return;
      input.value = '';
      details.querySelectorAll('[data-helix-country-item]').forEach((item) => { item.hidden = false; });
      const empty = details.querySelector('[data-helix-country-empty]');
      if (empty) empty.hidden = true;
    }

    handleEditorBlockSelect(event) {
      const block = event.target.closest?.('[data-block-id]');
      if (!block || !this.contains(block)) return;
      const menuItem = block.closest('[data-helix-menu-item]');
      if (menuItem) this.openDesktopItem(menuItem);
    }
  });
}

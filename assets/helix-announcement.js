if (!customElements.get('helix-announcement')) {
  customElements.define('helix-announcement', class HelixAnnouncement extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.messages = [...this.querySelectorAll('[data-helix-announcement-message]')];
      this.viewport = this.querySelector('[data-helix-announcement-viewport]');
      this.previousButton = this.querySelector('[data-helix-announcement-previous]');
      this.nextButton = this.querySelector('[data-helix-announcement-next]');
      this.index = Math.max(0, this.messages.findIndex((message) => message.classList.contains('is-active')));
      this.animating = false;
      this.queuedIndex = null;
      this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.duration = Number(this.dataset.transitionDuration || 700);
      this.interval = Number(this.dataset.autoplaySeconds || 5) * 1000;
      this.onPrevious = () => this.show(this.index - 1, true);
      this.onNext = () => this.show(this.index + 1, true);
      this.onVisibility = () => document.hidden ? this.stop() : this.start();
      this.onBlockSelect = (event) => {
        const selected = event.target.closest('[data-helix-announcement-message]');
        if (!selected || !this.contains(selected)) return;
        this.stop();
        this.show(this.messages.indexOf(selected), true);
      };
      this.previousButton?.addEventListener('click', this.onPrevious);
      this.nextButton?.addEventListener('click', this.onNext);
      if (this.dataset.pauseHover === 'true') {
        this.addEventListener('mouseenter', () => this.stop());
        this.addEventListener('mouseleave', () => this.start());
      }
      if (this.dataset.pauseFocus === 'true') {
        this.addEventListener('focusin', () => this.stop());
        this.addEventListener('focusout', () => this.start());
      }
      document.addEventListener('visibilitychange', this.onVisibility);
      document.addEventListener('shopify:block:select', this.onBlockSelect);
      this.commit(this.index);
      this.start();
    }

    disconnectedCallback() {
      this.stop();
      this.previousButton?.removeEventListener('click', this.onPrevious);
      this.nextButton?.removeEventListener('click', this.onNext);
      document.removeEventListener('visibilitychange', this.onVisibility);
      document.removeEventListener('shopify:block:select', this.onBlockSelect);
    }

    normalize(index) {
      return (index + this.messages.length) % this.messages.length;
    }

    setInteractivity(message, active) {
      message.querySelectorAll('a, button').forEach((control) => {
        control.tabIndex = active ? 0 : -1;
      });
    }

    commit(index) {
      this.messages.forEach((message, messageIndex) => {
        const active = messageIndex === index;
        message.classList.toggle('is-active', active);
        message.classList.toggle('is-hidden', !active);
        message.classList.remove('is-entering', 'is-leaving');
        message.setAttribute('aria-hidden', active ? 'false' : 'true');
        this.setInteractivity(message, active);
      });
    }

    show(index, manual = false) {
      if (this.messages.length < 2) return;
      const targetIndex = this.normalize(index);
      if (this.animating) {
        this.queuedIndex = targetIndex === this.index ? null : targetIndex;
        return;
      }
      const current = this.messages[this.index];
      const next = this.messages[targetIndex];
      this.index = targetIndex;
      if (!current || current === next || this.reduceMotion.matches) {
        this.commit(targetIndex);
        if (manual) this.announce();
        this.restart();
        return;
      }
      this.animating = true;
      this.messages.forEach((message) => {
        message.classList.remove('is-active', 'is-entering', 'is-leaving');
        message.classList.add('is-hidden');
        message.setAttribute('aria-hidden', 'true');
        this.setInteractivity(message, false);
      });
      current.classList.remove('is-hidden');
      current.classList.add('is-leaving');
      next.classList.remove('is-hidden');
      next.classList.add('is-entering');
      next.setAttribute('aria-hidden', 'false');
      this.setInteractivity(next, true);
      void next.offsetHeight;
      requestAnimationFrame(() => {
        next.classList.remove('is-entering');
        next.classList.add('is-active');
      });
      window.setTimeout(() => {
        this.commit(targetIndex);
        this.animating = false;
        if (manual) this.announce();
        const queued = this.queuedIndex;
        this.queuedIndex = null;
        if (queued !== null && queued !== this.index) this.show(queued, manual);
      }, this.duration + 40);
      this.restart();
    }

    announce() {
      if (!this.viewport) return;
      this.viewport.setAttribute('aria-live', 'polite');
      window.setTimeout(() => this.viewport?.setAttribute('aria-live', 'off'), 1000);
    }

    start() {
      this.stop();
      if (this.dataset.autoplay !== 'true' || this.reduceMotion.matches || document.hidden || this.messages.length < 2 || window.Shopify?.designMode) return;
      this.timer = window.setInterval(() => this.show(this.index + 1), this.interval);
    }

    stop() {
      window.clearInterval(this.timer);
    }

    restart() {
      this.start();
    }
  });
}

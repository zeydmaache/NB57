/* ==========================================================================
   NIGHTBURGER — NAVIGATION
   --------------------------------------------------------------------------
   Mobile menu (open/close, keyboard, focus trap, scroll lock) and the
   sticky header's "scrolled" state. Call NBNav.init() after the header
   markup is in the DOM.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const DESKTOP_QUERY = "(min-width: 1024px)";

  function init() {
    initHeaderScroll();
    initMobileMenu();
  }

  /* ----------------------------------------------------------------------
     Sticky header — add .is-scrolled once the page has moved a little
     -------------------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.querySelector("[data-header]");
    if (!header) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Mobile menu
     -------------------------------------------------------------------- */
  function initMobileMenu() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;

    let lastFocused = null;

    const focusables = () =>
      Array.from(
        menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.getClientRects().length > 0);

    function open() {
      lastFocused = document.activeElement;
      menu.hidden = false;
      // Force a reflow with the pre-transition styles applied, then add
      // .is-open so the fade/slide plays. Doing this synchronously (rather
      // than in requestAnimationFrame) keeps focus management working even
      // when the tab is briefly backgrounded and rAF is throttled.
      void menu.offsetHeight;
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
      document.body.classList.add("no-scroll");
      document.addEventListener("keydown", onKeydown);
      // The menu is laid out (hidden attribute removed) so it can take focus.
      const first = focusables()[0];
      if (first) first.focus();
    }

    function close(returnFocus) {
      const focusWasInside = menu.contains(document.activeElement);
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKeydown);

      const finish = () => {
        menu.hidden = true;
        menu.removeEventListener("transitionend", finish);
      };
      // Fallback in case transitionend doesn't fire (reduced motion / hidden tab)
      menu.addEventListener("transitionend", finish);
      window.setTimeout(finish, 400);

      // Never strand focus on the about-to-be-hidden menu.
      if (returnFocus === false) return;
      const restore =
        lastFocused && lastFocused !== document.body && document.contains(lastFocused)
          ? lastFocused
          : focusWasInside
          ? toggle
          : null;
      if (restore) restore.focus();
    }

    function isOpen() {
      return toggle.getAttribute("aria-expanded") === "true";
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === "Tab") {
        const items = focusables();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    toggle.addEventListener("click", () => (isOpen() ? close() : open()));

    // Close when a menu link is chosen
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) close(false);
    });

    // Close if the viewport grows to desktop while the menu is open
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = (e) => {
      if (e.matches && isOpen()) close(false);
    };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
  }

  window.NBNav = { init };
})(window, document);

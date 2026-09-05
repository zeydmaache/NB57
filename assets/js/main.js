/* ==========================================================================
   NIGHTBURGER — MAIN
   --------------------------------------------------------------------------
   Boots the site: injects shared components, wires config-driven links,
   renders the dynamic lists for the current page, starts navigation and
   scroll-reveal animations.
   ========================================================================== */

(function (window, document) {
  "use strict";

  const UI = window.NBUI;
  const DATA = window.NB_DATA;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    UI.mount(); // header + footer
    hydrateConfigBindings(); // data-* hooks in static HTML
    renderPage(); // dynamic lists for this page
    window.NBNav.init(); // mobile menu + sticky header
    initScrollReveal(); // fade/translate on scroll
    initFooterYearlessLegal();
  }

  /* ----------------------------------------------------------------------
     Fill static markup from SITE_CONFIG so pages stay config-driven.
       [data-order-link]     -> primary order URL (WhatsApp or phone)
       [data-whatsapp-link]  -> WhatsApp deep link
       [data-phone-link]     -> tel: link
       [data-phone-display]  -> readable phone number (text)
       [data-opening-label]  -> opening hours label (text)
       [data-site-name]      -> brand name (text)
     -------------------------------------------------------------------- */
  function hydrateConfigBindings() {
    setAttrAll("[data-order-link]", "href", NB_LINKS.order());
    setAttrAll("[data-whatsapp-link]", "href", NB_LINKS.whatsapp());
    setAttrAll("[data-phone-link]", "href", NB_LINKS.phone());

    setAttrAll("[data-hero-image]", "src", SITE_CONFIG.heroImage);

    setTextAll("[data-phone-display]", SITE_CONFIG.phoneDisplay);
    setTextAll("[data-opening-label]", SITE_CONFIG.openingLabel);
    setTextAll("[data-site-name]", SITE_CONFIG.name);

    document.querySelectorAll("[data-whatsapp-link], [data-order-link]").forEach((el) => {
      if (/^https?:/i.test(el.getAttribute("href") || "")) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    });
  }

  function setAttrAll(selector, attr, value) {
    document.querySelectorAll(selector).forEach((el) => el.setAttribute(attr, value));
  }
  function setTextAll(selector, value) {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = value;
    });
  }

  /* ----------------------------------------------------------------------
     Page router — based on <body data-page="...">
     -------------------------------------------------------------------- */
  function renderPage() {
    const page = document.body.dataset.page;
    if (page === "home") return renderHome();
    if (page === "menu") return renderMenu();
    if (page === "order") return renderOrder();
  }

  function fill(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
    return el;
  }

  /* ---- HOME ---------------------------------------------------------- */
  function renderHome() {
    fill("#best-sellers-grid", DATA.bestSellers.map(UI.BurgerCard).join(""));
    fill("#steps-grid", DATA.steps.map(UI.StepCard).join(""));
    fill("#zones-grid", DATA.deliveryZones.map(UI.ZoneCard).join(""));
    fill("#social-grid", DATA.socialPosts.map(UI.SocialCard).join(""));
  }

  /* ---- MENU -------------------------------------------------------- */
  const MENU_GROUPS = [
  { key: "burgers", label: "Burgers", data: () => DATA.burgers },
  { key: "sides", label: "Accompagnements", data: () => DATA.sides },
  { key: "drinks", label: "Boissons", data: () => DATA.drinks },
];

  function renderMenu() {
    const root = document.querySelector("#menu-root");
    if (!root) return;

    const groupsHtml = MENU_GROUPS.map((group) => {
      const items = group.data();
      return `
        <section class="menu-group reveal" data-group="${group.key}" aria-label="${group.label}">
          <h2 class="menu-group__title h3">${group.label} <span>${items.length} items</span></h2>
          <div class="grid grid--3">
            ${items.map(UI.ProductCard).join("")}
          </div>
        </section>`;
    }).join("");

    root.innerHTML = `${groupsHtml}<p class="menu-empty" hidden>No products in this category yet.</p>`;

    initMenuFilters(root);
  }

  function initMenuFilters(root) {
    const buttons = document.querySelectorAll("[data-filter]");
    const groups = root.querySelectorAll(".menu-group");
    const empty = root.querySelector(".menu-empty");
    if (!buttons.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const value = btn.dataset.filter;

        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));

        let visible = 0;
        groups.forEach((group) => {
          const show = value === "all" || group.dataset.group === value;
          group.hidden = !show;
          if (show) visible += 1;
        });
        if (empty) empty.hidden = visible !== 0;
      });
    });
  }

  /* ---- HOW TO ORDER --------------------------------------------- */
  function renderOrder() {
    const list = document.querySelector("#order-steps");
    if (list) {
      list.innerHTML = DATA.orderSteps
        .map(
          (step) => `
          <li class="order-step reveal">
            <span class="order-step__num">${UI.esc(step.number)}</span>
            <div>
              <h3 class="order-step__title">${UI.esc(step.title)}</h3>
              <p class="order-step__text">${UI.esc(step.description)}</p>
            </div>
          </li>`
        )
        .join("");
    }
  }

  /* ----------------------------------------------------------------------
     Scroll reveal — IntersectionObserver, respects reduced motion
     -------------------------------------------------------------------- */
  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* Give the footer legal anchors a harmless no-op target note. */
  function initFooterYearlessLegal() {
    document.querySelectorAll('.site-footer__legal a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        // Placeholder pages — prevent a jump to top, keep it obvious in v1.
        if (a.getAttribute("href") === "#legal" || a.getAttribute("href") === "#privacy") {
          e.preventDefault();
        }
      });
    });
  }
})(window, document);

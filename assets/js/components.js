/* ==========================================================================
   NIGHTBURGER — REUSABLE COMPONENTS
   --------------------------------------------------------------------------
   Pure functions that return HTML strings + a mount() that injects the
   shared Header / Footer into every page. No framework, no build step.

   Usage in a page:
     <div data-component="header"></div>   ->  full <header> + mobile menu
     <div data-component="footer"></div>   ->  full <footer>

   Dynamic lists (burgers, zones, ...) are rendered from main.js using the
   card factories below.
   ========================================================================== */

(function (window, document) {
  "use strict";

  /* ----------------------------------------------------------------------
     Helpers
     -------------------------------------------------------------------- */

  /** Escape user/data text before putting it into markup. */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Format a numeric price using SITE_CONFIG.currency. */
  function formatPrice(value) {
    const { symbol, position } = SITE_CONFIG.currency;
    const amount = Number(value).toFixed(2);
    return position === "before" ? `${symbol}${amount}` : `${amount} ${symbol}`;
  }

  /** Filename of the current page, e.g. "menu.html" (defaults to index.html). */
  function currentFile() {
    const path = window.location.pathname.split("/").pop();
    return path && path.length ? path : "index.html";
  }

  /* Primary navigation — single source of truth. */
  const NAV_LINKS = [
    { label: "Accueil", href: "index.html" },
    { label: "Menu", href: "menu.html" },
    { label: "Comment commander", href: "commander.html" },
  ];

  /* ----------------------------------------------------------------------
     Icon — tinted <span> backed by a swappable file in /assets/icons
     -------------------------------------------------------------------- */
  function icon(name, opts) {
    const o = opts || {};
    const extra = o.className ? ` ${esc(o.className)}` : "";
    return `<span class="icon icon--${esc(name)}${extra}" aria-hidden="true"></span>`;
  }

  /* ----------------------------------------------------------------------
     Button
     props: { label, href, type, variant, size, icon, iconBefore,
              block, ariaLabel, attrs }
     -------------------------------------------------------------------- */
  function Button(props) {
    const p = props || {};
    const variant = p.variant || "primary";
    const classes = ["btn", `btn--${variant}`];
    if (p.size) classes.push(`btn--${p.size}`);
    if (p.block) classes.push("btn--block");

    const iconMarkup = p.icon ? icon(p.icon) : "";
    const inner = p.iconBefore
      ? `${iconMarkup}<span>${esc(p.label)}</span>`
      : `<span>${esc(p.label)}</span>${iconMarkup}`;

    const aria = p.ariaLabel ? ` aria-label="${esc(p.ariaLabel)}"` : "";
    const extra = p.attrs ? ` ${p.attrs}` : "";

    if (p.href) {
      const rel = /^https?:/i.test(p.href) ? ' target="_blank" rel="noopener"' : "";
      return `<a class="${classes.join(" ")}" href="${esc(p.href)}"${rel}${aria}${extra}>${inner}</a>`;
    }
    return `<button class="${classes.join(" ")}" type="${esc(p.type || "button")}"${aria}${extra}>${inner}</button>`;
  }

  /* ----------------------------------------------------------------------
     Badge
     -------------------------------------------------------------------- */
  function Badge(text, type) {
    if (!text) return "";
    const cls = type ? ` badge--${esc(type)}` : "";
    return `<span class="badge${cls}">${esc(text)}</span>`;
  }

  /** Status badge for delivery zones. */
  function StatusBadge(status) {
    const map = {
      available: { cls: "Disponible", label: "Disponible" },
      soon: { cls: "soon", label: "Bientôt disponible" },
    };
    const s = map[status] || map.available;
    return `<span class="badge badge--status badge--${s.cls}"><span class="badge__dot"></span>${s.label}</span>`;
  }

  /* ----------------------------------------------------------------------
     Section heading
     -------------------------------------------------------------------- */
  function SectionHead(opts) {
    const o = opts || {};
    const center = o.center ? " section__head--center" : "";
    return `
      <div class="section__head${center} reveal">
        ${o.eyebrow ? `<p class="section__eyebrow">${esc(o.eyebrow)}</p>` : ""}
        <h2 class="section__title">${esc(o.title)}</h2>
        ${o.subtitle ? `<p class="section__subtitle">${esc(o.subtitle)}</p>` : ""}
      </div>`;
  }

  /* ----------------------------------------------------------------------
     Image with automatic placeholder fallback
     -------------------------------------------------------------------- */
  const PLACEHOLDER_IMG = "assets/images/placeholder.svg";

  function productImage(src, alt, eager) {
    const loading = eager ? "" : ' loading="lazy"';
    return (
      `<img class="card__img" src="${esc(src)}" alt="${esc(alt)}"${loading} decoding="async" ` +
      `onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}';this.classList.add('is-placeholder')">`
    );
  }

  /* ----------------------------------------------------------------------
     BurgerCard / ProductCard — same component (menu + home reuse it)
     -------------------------------------------------------------------- */
  function ProductCard(product) {
    const orderMsg = `${SITE_CONFIG.deliveryMessage} (${product.name})`;
    const button = Button({
      label: "Commander maintenant",
      href: NB_LINKS.whatsapp(orderMsg),
      variant: "secondary",
      size: "sm",
      icon: "arrow-right",
    });

    return `
      <article class="card card--burger card--interactive reveal" data-category="${esc(product.category)}">
        <div class="card__media">
          ${productImage(product.image, product.name)}
          ${product.badge ? `<div class="card__badges">${Badge(product.badge, product.badgeType)}</div>` : ""}
        </div>
        <div class="card__body">
          <h3 class="card__title">${esc(product.name)}</h3>
          <p class="card__desc">${esc(product.description)}</p>
          <div class="card__footer">
            <span class="card__price">${formatPrice(product.price)}</span>
            ${button}
          </div>
        </div>
      </article>`;
  }

  /* ----------------------------------------------------------------------
     StepCard
     -------------------------------------------------------------------- */
  function StepCard(step) {
    return `
      <article class="card card--step reveal">
        <span class="card__index">${esc(step.number)}</span>
        <span class="card__icon" role="img" aria-label="${esc(step.title)}">${step.icon}</span>
        <h3 class="card__title">${esc(step.title)}</h3>
        <p class="card__desc">${esc(step.description)}</p>
      </article>`;
  }

  /* ----------------------------------------------------------------------
     ZoneCard
     -------------------------------------------------------------------- */
  function ZoneCard(zone) {
    return `
      <article class="card card--zone reveal">
        <span class="card__title">${esc(zone.name)}</span>
        ${StatusBadge(zone.status)}
      </article>`;
  }

  /* ----------------------------------------------------------------------
     SocialCard — vertical 9:16
     -------------------------------------------------------------------- */
  function SocialCard(post) {
    const href = NB_LINKS.social(post.linkKey);
    const isVideo = post.type === "video";
    return `
      <a class="card card--social card--interactive reveal" href="${esc(href)}"
         target="_blank" rel="noopener" aria-label="${esc(post.platform)}: ${esc(post.title)}">
        <img class="card__img" src="${esc(post.image)}" alt="${esc(post.title)}" loading="lazy" decoding="async"
             onerror="this.onerror=null;this.src='${PLACEHOLDER_IMG}'">
        ${isVideo ? '<span class="card__play" aria-hidden="true"></span>' : ""}
        <div class="card__body">
          <span class="card__platform">${esc(post.platform)}</span>
          <span class="card__title">${esc(post.title)}</span>
        </div>
      </a>`;
  }

  /* ----------------------------------------------------------------------
     Logo — image file from SITE_CONFIG.logo, used by header + footer.
     Falls back to a text wordmark if the file can't be loaded.
     -------------------------------------------------------------------- */
  function Logo(opts) {
    const o = opts || {};
    const tag = o.href === false ? "span" : "a";
    const href = o.href === false ? "" : ` href="${esc(o.href || "index.html")}"`;
    const logo = SITE_CONFIG.logo || {};
    const src = logo.src || "assets/images/logo/logo.svg";
    const height = Number(logo.height) || 30;
    return `
      <${tag} class="brand"${href} aria-label="${esc(SITE_CONFIG.name)} — home">
        <img class="brand__img" src="${esc(src)}" alt="${esc(SITE_CONFIG.name)}" style="height:${height}px"
             onerror="this.hidden=true;this.nextElementSibling.hidden=false">
        <span class="brand__word" hidden>NIGHT<b>BURGER</b></span>
      </${tag}>`;
  }

  /* ----------------------------------------------------------------------
     Header (+ mobile menu)
     -------------------------------------------------------------------- */
  function navLinksMarkup(linkClass) {
    const file = currentFile();
    return NAV_LINKS.map((l) => {
      const current = l.href === file ? ' aria-current="page"' : "";
      return `<li><a class="${linkClass}" href="${esc(l.href)}"${current}>${esc(l.label)}</a></li>`;
    }).join("");
  }

  function Header() {
    const orderHref = NB_LINKS.order();
    return `
      <a class="skip-link" href="#main">Skip to content</a>

      <header class="site-header" data-header>
        <div class="container site-header__inner">
          ${Logo()}

          <nav class="site-nav" aria-label="Primary">
            <ul class="site-nav__list">
              ${navLinksMarkup("site-nav__link")}
            </ul>
          </nav>

          <div class="site-header__actions">
            ${Button({ label: "Commander maintenant", href: orderHref, variant: "primary", size: "sm", icon: "arrow-right" })}
            <button class="nav-toggle" type="button" aria-expanded="false"
                    aria-controls="mobile-menu" aria-label="Open menu" data-nav-toggle>
              <span class="nav-toggle__bar"></span>
              <span class="nav-toggle__bar"></span>
              <span class="nav-toggle__bar"></span>
            </button>
          </div>
        </div>
      </header>

      <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
        <nav aria-label="Mobile">
          <ul class="mobile-menu__list">
            ${NAV_LINKS.map((l) => {
              const current = l.href === currentFile() ? ' aria-current="page"' : "";
              return `<li><a class="mobile-menu__link" href="${esc(l.href)}"${current}>${esc(l.label)} <span aria-hidden="true">→</span></a></li>`;
            }).join("")}
          </ul>
        </nav>
        ${Button({ label: "Commander maintenant", href: orderHref, variant: "primary", size: "lg", block: true, icon: "arrow-right" })}
        <div class="mobile-menu__meta">
          <span>${esc(SITE_CONFIG.openingLabel)}</span>
          <a href="${NB_LINKS.phone()}">Call ${esc(SITE_CONFIG.phoneDisplay)}</a>
        </div>
      </div>`;
  }

  /* ----------------------------------------------------------------------
     Footer
     -------------------------------------------------------------------- */
  function Footer() {
    const year = new Date().getFullYear();
    const ig = NB_LINKS.social("instagram");
    const tt = NB_LINKS.social("tiktok");

    return `
      <footer class="site-footer">
        <div class="container site-footer__grid">
          <div class="site-footer__brand">
            ${Logo()}
            <p class="site-footer__tagline">${esc(SITE_CONFIG.tagline)}. Passionately made burgers, delivered across ${esc(SITE_CONFIG.city)} after dark.</p>
            <div class="social-row">
              <a class="social-link" href="${esc(ig)}" ${ig === "#" ? "" : 'target="_blank" rel="noopener"'} aria-label="NightBurger on Instagram">${icon("instagram")}</a>
              <a class="social-link" href="${esc(tt)}" ${tt === "#" ? "" : 'target="_blank" rel="noopener"'} aria-label="NightBurger on TikTok">${icon("tiktok")}</a>
            </div>
          </div>

          <div class="footer-col">
            <p class="footer-col__title">Navigation</p>
            <ul class="footer-col__list">
              ${NAV_LINKS.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("")}
            </ul>
          </div>

          <div class="footer-col">
            <p class="footer-col__title">Contact</p>
            <ul class="footer-col__list">
              <li><a href="${NB_LINKS.phone()}">${esc(SITE_CONFIG.phoneDisplay)}</a></li>
              <li><a href="${NB_LINKS.whatsapp()}" target="_blank" rel="noopener">WhatsApp order</a></li>
              <li><a href="${NB_LINKS.email()}">${esc(SITE_CONFIG.email)}</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <p class="footer-col__title">Opening hours</p>
            <ul class="footer-col__list">
              <li>Every night</li>
              <li>${esc(SITE_CONFIG.openingHours.start)} – ${esc(SITE_CONFIG.openingHours.end)}</li>
              <li>${esc(SITE_CONFIG.city)}, ${esc(SITE_CONFIG.country)}</li>
            </ul>
          </div>
        </div>

        <div class="container site-footer__bottom">
          <p>© ${year} ${esc(SITE_CONFIG.name)}. All rights reserved.</p>
          <ul class="site-footer__legal">
            <li><a href="#legal">Legal notice</a></li>
            <li><a href="#privacy">Privacy policy</a></li>
          </ul>
        </div>
      </footer>`;
  }

  /* ----------------------------------------------------------------------
     mount() — swap every [data-component] placeholder for real markup
     -------------------------------------------------------------------- */
  const REGISTRY = { header: Header, footer: Footer };

  function mount(root) {
    (root || document).querySelectorAll("[data-component]").forEach((el) => {
      const name = el.getAttribute("data-component");
      const build = REGISTRY[name];
      if (build) el.outerHTML = build();
    });
  }

  /* ----------------------------------------------------------------------
     Public API
     -------------------------------------------------------------------- */
  window.NBUI = {
    esc,
    icon,
    formatPrice,
    Button,
    Badge,
    StatusBadge,
    SectionHead,
    ProductCard,
    BurgerCard: ProductCard, // alias — a burger card is a product card
    StepCard,
    ZoneCard,
    SocialCard,
    Logo,
    Header,
    Footer,
    mount,
    NAV_LINKS,
  };
})(window, document);

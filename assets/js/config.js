/* ==========================================================================
   NIGHTBURGER — SITE CONFIGURATION
   --------------------------------------------------------------------------
   The ONLY place to edit contact details, social links and opening hours.
   Nothing here should require touching an HTML file.
   ========================================================================== */

const SITE_CONFIG = {
  name: "Night Burger",
  tagline: "Spécialiste de la livraison de nuit",

  /* Contact ---------------------------------------------------------------- */
  // Human-readable phone (shown on screen).
  phoneDisplay: "06 12 34 56 78",
  // Dialable phone in international format (used for tel: links).
  phone: "+33612345678",
  // WhatsApp number: digits only, country code first, no "+" and no spaces.
  whatsapp: "33612345678",
  email: "hello@nightburger.fr",

  /* Location shown in the footer (not a delivery address) ----------------- */
  city: "Metz",
  country: "France",

  /* Logo — used by the header AND the footer -----------------------------
     To change the logo: either replace the file assets/images/logo/logo.svg
     with your own (SVG / PNG / WebP), or point `logo.src` at a new file.
     `logo.height` is the on-screen height in px (width scales automatically).
     If the file is missing, a "NIGHTBURGER" text wordmark is shown instead. */
  logo: {
    src: "assets/images/logo/NIGHT_BURGER.png",
    height: 60,
  },

  /* Social links — replace "#" with real URLs when available -------------- */
  social: {
    instagram: "#",
    tiktok: "#",
  },

  /* Opening hours -------------------------------------------------------- */
  openingHours: {
    start: "22:00",
    end: "04:00",
  },
  // Short label reused across hero / footer / order page.
  openingLabel: "Ouvert toutes les nuits · 22 h – 4 h",

  /* Prefilled message for WhatsApp orders ------------------------------- */
  deliveryMessage: "Bonjour NightBurger, je souhaiterais passer une commande.",

  /* Hero vehicle image ------------------------------------------------- */
  // Drop a real photo at assets/images/hero/nightburger-van.webp and point
  // this at it. An on-brand SVG placeholder ships in the repo.
  heroImage: "assets/images/hero/bg.png",

  /* Currency for prices in data.js ----------------------------------- */
  currency: { symbol: "€", position: "after" }, // "12.90 €"

  /* Basic SEO / Open Graph defaults --------------------------------- */
  url: "https://nightburger.example",
  ogImage: "assets/images/social/og-cover.svg",
};

/* ==========================================================================
   LINK HELPERS — build action URLs from the config above.
   Used by components.js and main.js. Do not hardcode links elsewhere.
   ========================================================================== */
const NB_LINKS = {
  /** WhatsApp deep link with a prefilled order message. */
  whatsapp(message) {
    const text = encodeURIComponent(message || SITE_CONFIG.deliveryMessage);
    return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${text}`;
  },

  /** tel: link, stripped to "+" and digits. */
  phone() {
    return `tel:${SITE_CONFIG.phone.replace(/[^+\d]/g, "")}`;
  },

  /** mailto: link. */
  email() {
    return `mailto:${SITE_CONFIG.email}`;
  },

  /** The primary "Order now" destination: WhatsApp if set, else phone. */
  order() {
    const wa = SITE_CONFIG.whatsapp && SITE_CONFIG.whatsapp.replace(/\D/g, "");
    return wa ? NB_LINKS.whatsapp() : NB_LINKS.phone();
  },

  /** A social URL by key, or "#" when not configured. */
  social(key) {
    const value = SITE_CONFIG.social[key];
    return value && value !== "#" ? value : "#";
  },
};

/* Expose on window so plain <script> files can share them (no bundler). */
window.SITE_CONFIG = SITE_CONFIG;
window.NB_LINKS = NB_LINKS;

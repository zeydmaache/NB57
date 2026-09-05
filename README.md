# NightBurger

Premium static website for **NightBurger**, a nighttime burger delivery brand.
Dark / neon / Miami‑night identity. Three pages: Home, Menu, How to order.

No framework. No build step. No backend. Just HTML5, CSS3 and vanilla JavaScript.

---

## Installation

No installation required.

Open **`index.html`** in a browser.

> Fonts (Bebas Neue + Inter) load from Google Fonts, so the first load looks
> best online. Offline, the site falls back to system fonts and still works.
> If you prefer, run any static server from the project root, e.g.
> `python -m http.server`.

---

## Structure

```
nightburger/
├── index.html            Home
├── menu.html             Menu (with live category filter)
├── commander.html        How to order
│
├── assets/
│   ├── css/
│   │   ├── tokens.css        design variables — colors, type, spacing, radius…
│   │   ├── reset.css         small modern reset
│   │   ├── base.css          body, typography, links, focus, helpers
│   │   ├── layout.css        container, sections, grid primitives
│   │   ├── components.css    buttons, badges, cards, header, footer, menu
│   │   ├── pages.css         page‑specific sections (hero, CTA, filters…)
│   │   └── responsive.css    breakpoint overrides (640 / 768 / 1024 / 1280)
│   │
│   ├── js/
│   │   ├── config.js         ★ contact details, hours, social links, helpers
│   │   ├── data.js           ★ burgers, sides, drinks, zones, steps, social
│   │   ├── components.js     reusable UI components (return HTML strings)
│   │   ├── navigation.js     mobile menu + sticky header behaviour
│   │   └── main.js           boots the site, renders lists, scroll reveal
│   │
│   ├── icons/                single‑color SVG icons (tinted via CSS mask)
│   └── images/
│       ├── hero/             nightburger-van.svg  (replace with a real photo)
│       ├── burgers/          one SVG placeholder per product
│       ├── delivery/         stylised map placeholder
│       ├── social/           vertical 9:16 placeholders + og-cover
│       └── logo/             logo.svg, logo-white.svg, favicon.svg
│
├── components/               ★ REFERENCE markup only (not loaded)
│   ├── header.html
│   ├── footer.html
│   └── components.html       component cheat‑sheet
│
└── README.md
```

### How the "components" work

Each page contains only placeholders:

```html
<div data-component="header"></div>
...
<div data-component="footer"></div>
```

On load, `main.js` calls `NBUI.mount()`, which swaps every `[data-component]`
for markup built in `assets/js/components.js`. The header and footer are
therefore defined **once**. Product / zone / step / social lists are rendered
the same way from `data.js`.

The files in `components/` are **reference snapshots** of that markup — handy
for reading the structure. Editing them does nothing; edit `components.js`.

---

## Editing information

| I want to change…                              | Edit this file            |
| ---------------------------------------------- | ------------------------- |
| Colors, fonts, spacing, radius, shadows        | `assets/css/tokens.css`   |
| Phone, WhatsApp, email, opening hours, socials | `assets/js/config.js`     |
| Logo (header + footer)                         | `assets/images/logo/logo.svg` or `config.js` |
| Burgers, sides, drinks, prices, descriptions   | `assets/js/data.js`       |
| Delivery zones                                 | `assets/js/data.js`       |
| Ordering steps                                 | `assets/js/data.js`       |
| Page copy / headings                           | the matching `*.html`     |

### `config.js` — contact & settings

```js
const SITE_CONFIG = {
  phoneDisplay: "06 12 34 56 78",   // shown on screen
  phone: "+33612345678",            // used for tel: links
  whatsapp: "33612345678",          // digits only, country code first, no "+"
  email: "hello@nightburger.fr",
  social: { instagram: "#", tiktok: "#" },   // replace "#" with real URLs
  logo: { src: "assets/images/logo/logo.svg", height: 30 },  // header + footer
  openingHours: { start: "22:00", end: "04:00" },
  openingLabel: "Open every night · 10 PM – 4 AM",
  deliveryMessage: "Hello NightBurger, I would like to place an order.",
  heroImage: "assets/images/hero/nightburger-van.svg",
};
```

### Change the logo

Two ways, no code:

1. **Keep the filename** — overwrite `assets/images/logo/logo.svg` with your own
   logo (SVG, PNG or WebP all work). Done.
2. **Use a different file** — drop it in `assets/images/logo/` and set
   `logo.src` in `config.js` to its path. Adjust `logo.height` (px) to taste.

The logo shows in the header and the footer. If the file is missing or broken,
a plain "NIGHTBURGER" text wordmark is shown instead.

Every "Order now" button, the phone links and the WhatsApp deep link are all
built from these values by `NB_LINKS` in the same file. Nothing to touch in
the HTML.

### `data.js` — products

```js
const burgers = [
  {
    id: "night-classic",
    name: "Night Classic",
    description: "Smashed beef, aged cheddar, crisp lettuce and homemade night sauce.",
    price: 12.90,                                   // number
    image: "assets/images/burgers/night-classic.svg",
    category: "burgers",                            // burgers | sides | drinks
    badge: "Best seller",                           // optional
    badgeType: "hot",                               // hot | new | veggie
    featured: true,                                 // show on home "Best sellers"
  },
  // …
];
```

---

## Add a burger

Add an object to the `burgers` array in `assets/js/data.js`:

```js
{
  id: "smoke-signal",
  name: "Smoke Signal",
  description: "Beef patty, smoked scamorza, charred onion, chipotle mayo.",
  price: 14.50,
  image: "assets/images/burgers/smoke-signal.svg",
  category: "burgers",
  badge: "New",
  badgeType: "new",
  featured: false
}
```

Drop an image at `assets/images/burgers/smoke-signal.svg` (or `.webp`/`.jpg` —
just match the path). Missing images fall back to
`assets/images/placeholder.svg` automatically. The card appears on the Menu
page instantly; set `featured: true` to also show it on the home page.

## Add a delivery zone

Add to the `deliveryZones` array in `assets/js/data.js`:

```js
{ name: "Sablon", status: "available" }   // status: "available" | "soon"
```

## Change the theme

Open `assets/css/tokens.css` and edit the CSS variables under `:root`.
Everything reads from there — change a value once and it updates everywhere.

```css
:root {
  --color-bg: #03030a;
  --color-pink: #ff2da6;
  --color-purple: #8b3dff;
  --color-blue: #216cff;
  --gradient-primary: linear-gradient(135deg, #ff2da6, #8b3dff);
  --radius-xl: 20px;
  --container-width: 1280px;
  /* …type scale, spacing, shadows, motion… */
}
```

Want a lighter or different palette? Swap the surface + accent colors and the
gradients; no other file needs editing.

---

## Replacing placeholder images

All images ship as clearly labelled SVG placeholders.

| Placeholder                                   | Replace with                          |
| --------------------------------------------- | ------------------------------------- |
| `assets/images/hero/nightburger-van.svg`      | real van photo (update `heroImage`)   |
| `assets/images/burgers/<id>.svg`              | real product photo (keep the path)    |
| `assets/images/social/social-1..3.svg`        | vertical 9:16 photos / video posters  |
| `assets/images/delivery/map.svg`              | real coverage map image               |
| `assets/images/social/og-cover.svg`           | 1200×630 share image (PNG/JPG ideally)|
| `assets/images/logo/*.svg`                    | final logo files                      |

---

## Accessibility & performance notes

- Semantic landmarks (`header` / `nav` / `main` / `section` / `footer`), skip
  link, visible focus, keyboard‑operable mobile menu with focus trap + `Esc`.
- All images have `alt`; icons are decorative with text labels alongside.
- `prefers-reduced-motion` disables scroll‑reveal and hover motion.
- Non‑hero images use `loading="lazy"`; JavaScript is tiny and framework‑free.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses CSS custom
properties, `clamp()`, CSS mask, `IntersectionObserver` and
`backdrop-filter`.

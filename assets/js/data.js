/* ==========================================================================
   NIGHTBURGER — CONTENT DATA
   --------------------------------------------------------------------------
   Products, delivery zones, ordering steps and social posts.
   Pages never contain this data directly — edit it here only.

   PRODUCT SHAPE
   {
     id:          "night-classic",                  // unique slug
     name:        "Night Classic",
     description: "Beef patty, cheddar, lettuce...",
     price:       12.90,                             // number
     image:       "assets/images/burgers/night-classic.svg",
     category:    "burgers" | "sides" | "drinks",
     badge:       "BEST SELLER" (optional),
     badgeType:   "hot" | "new" | "veggie" (optional, styles the badge),
     featured:    true (optional — shows on the home "Best sellers" grid)
   }

   IMAGES: every product currently points at an on-brand SVG *placeholder*
   in assets/images/burgers/. To use a real photo, drop it in that folder
   (e.g. night-classic.webp) and update the "image" path below — nothing
   else changes. Any missing/broken image auto-falls back to
   assets/images/placeholder.svg.
   ========================================================================== */

const burgers = [
  {
    id: "night-classic",
    name: "Night Classic",
    description:
      "Steak haché smashé, cheddar affiné, salade croquante et notre sauce maison Night.",
    price: 12.9,
    image: "assets/images/burgers/night-classic.svg",
    category: "burgers",
    badge: "Meilleure vente",
    badgeType: "hot",
    featured: true,
  },
  {
    id: "neon-bbq",
    name: "Neon BBQ",
    description:
      "Double steak haché, bacon fumé, onion rings et sauce barbecue au bourbon.",
    price: 15.5,
    image: "assets/images/burgers/neon-bbq.svg",
    category: "burgers",
    badge: "Meilleure vente",
    badgeType: "hot",
    featured: true,
  },
  {
    id: "purple-haze",
    name: "Purple Haze",
    description:
      "Poulet épicé, chou rouge mariné, mayonnaise au jalapeño et pain brioché.",
    price: 13.9,
    image: "assets/images/burgers/purple-haze.svg",
    category: "burgers",
    featured: true,
  },
  {
    id: "midnight-veggie",
    name: "Midnight Veggie",
    description:
      "Portobello grillé, halloumi, poivron rôti et aïoli au basilic.",
    price: 12.5,
    image: "assets/images/burgers/midnight-veggie.svg",
    category: "burgers",
    badge: "Végétarien",
    badgeType: "veggie",
    featured: true,
  },
  {
    id: "after-hours-double",
    name: "After Hours Double",
    description:
      "Triple steak haché, triple fromage et oignons caramélisés — pour les longues nuits.",
    price: 17.9,
    image: "assets/images/burgers/after-hours-double.svg",
    category: "burgers",
    badge: "Nouveau",
    badgeType: "new",
  },
  {
    id: "electric-blue",
    name: "Electric Blue",
    description:
      "Steak haché, fromage bleu, éclats de noix et sauce moutarde au miel.",
    price: 14.2,
    image: "assets/images/burgers/electric-blue.svg",
    category: "burgers",
  },
];

const sides = [
  {
    id: "neon-fries",
    name: "Frites Neon",
    description:
      "Frites avec peau, relevées d’un sel au paprika fumé.",
    price: 4.5,
    image: "assets/images/burgers/neon-fries.svg",
    category: "sides",
  },
  {
    id: "loaded-fries",
    name: "Frites Night Garnies",
    description:
      "Frites, cheddar fondu, morceaux de bacon et oignons nouveaux.",
    price: 6.9,
    image: "assets/images/burgers/loaded-fries.svg",
    category: "sides",
    badge: "Meilleure vente",
    badgeType: "hot",
  },
  {
    id: "onion-rings",
    name: "Onion Rings Neon",
    description:
      "Six onion rings croustillants à la bière, accompagnés d’une sauce chipotle.",
    price: 5.2,
    image: "assets/images/burgers/onion-rings.svg",
    category: "sides",
  },
  {
    id: "mozza-sticks",
    name: "Bâtonnets de mozzarella",
    description:
      "Six bâtonnets dorés, accompagnés d’une sauce marinara.",
    price: 5.9,
    image: "assets/images/burgers/mozza-sticks.svg",
    category: "sides",
  },
];

const drinks = [
  {
    id: "cola-classic",
    name: "Cola",
    description: "Cola classique bien frais, canette de 33 cl.",
    price: 2.5,
    image: "assets/images/burgers/cola.svg",
    category: "drinks",
  },
  {
    id: "citrus-soda",
    name: "Soda citron-citron vert",
    description: "Soda pétillant citron et citron vert, canette de 33 cl.",
    price: 2.5,
    image: "assets/images/burgers/citrus-soda.svg",
    category: "drinks",
  },
  {
    id: "night-lemonade",
    name: "Limonade Night",
    description: "Limonade rose trouble légèrement pétillante, 33 cl.",
    price: 3.2,
    image: "assets/images/burgers/night-lemonade.svg",
    category: "drinks",
    badge: "Nouveau",
    badgeType: "new",
  },
  {
    id: "still-water",
    name: "Eau plate",
    description: "Bouteille d’eau de source de 50 cl.",
    price: 1.8,
    image: "assets/images/burgers/water.svg",
    category: "drinks",
  },
];

const products = [...burgers, ...sides, ...drinks];

const deliveryZones = [
  { name: "Metz Centre", status: "disponible" },
  { name: "Montigny-lès-Metz", status: "disponible" },
  { name: "Woippy", status: "disponible" },
  { name: "Longeville-lès-Metz", status: "disponible" },
  { name: "Le Ban-Saint-Martin", status: "disponible" },
  { name: "Queuleu", status: "disponible" },
  { name: "Borny", status: "bientot" },
  { name: "Marly", status: "bientot" },
];

const steps = [
  {
    number: "01",
    icon: "📍",
    title: "Indiquez votre adresse",
    description:
      "Envoyez-nous votre adresse de livraison afin que nous vérifiions que vous êtes dans notre zone de livraison de nuit.",
  },
  {
    number: "02",
    icon: "🍔",
    title: "Choisissez votre burger",
    description:
      "Choisissez vos burgers et accompagnements dans le menu, puis indiquez-nous votre commande.",
  },
  {
    number: "03",
    icon: "🚐",
    title: "Nous livrons",
    description:
      "Notre équipe de nuit vous livre directement chez vous, chaud et rapidement.",
  },
];

const orderSteps = [
  steps[0],
  {
    number: "02",
    icon: "🍔",
    title: "Choisissez vos produits",
    description:
      "Parcourez le menu et composez votre commande : burgers, accompagnements et boissons.",
  },
  {
    number: "03",
    icon: "✅",
    title: "Confirmez votre commande",
    description:
      "Envoyez votre commande sur WhatsApp ou appelez-nous. Nous confirmons le prix et le délai de livraison.",
  },
  {
    number: "04",
    icon: "🚐",
    title: "Nous livrons",
    description:
      "Réglez le livreur à son arrivée. Bon appétit avec NightBurger !",
  },
];

const socialPosts = [
  {
    platform: "Instagram",
    type: "video",
    title: "Le rush du vendredi soir à Metz Centre",
    image: "assets/images/social/social-1.svg",
    linkKey: "instagram",
  },
  {
    platform: "TikTok",
    type: "video",
    title: "Préparation du After Hours Double",
    image: "assets/images/social/social-2.svg",
    linkKey: "tiktok",
  },
  {
    platform: "Instagram",
    type: "image",
    title: "Livraison à 3 h du matin dans les rues illuminées au néon",
    image: "assets/images/social/social-3.svg",
    linkKey: "instagram",
  },
];

/* Expose everything on a single namespace. */
window.NB_DATA = {
  burgers,
  sides,
  drinks,
  products,
  deliveryZones,
  steps,
  orderSteps,
  socialPosts,
  /** Burgers flagged for the home "Best sellers" grid. */
  get bestSellers() {
    return burgers.filter((b) => b.featured);
  },
};

/** Homepage marketing content — category links mirror `constants/shopTaxonomy.js`. */

export const heroContent = {
  eyebrow: 'Next-gen electronics',
  title: 'Upgrade your everyday.',
  highlight: 'TechNova',
  description:
    'Premium smartphones, laptops, gaming gear, and studio-grade audio — merchandised like a real Series A storefront with live MongoDB inventory.',
  primaryCta: { label: 'Shop trending', to: '/shop?trending=true&sort=rating' },
  secondaryCta: { label: 'Build a gaming setup', to: '/shop?category=Gaming&sort=newest' },
  stats: [
    { label: 'Same-day dispatch', value: 'Major metros' },
    { label: 'Member savings', value: 'Up to 30%' },
    { label: 'Support', value: '24/7 chat' },
  ],
}

function shopCategory(category) {
  return `/shop?category=${encodeURIComponent(category)}`
}

export const featuredCategories = [
  {
    id: 'cat-smartphones',
    title: 'Smartphones',
    description: 'Flagship silicon · 5G · pro cameras',
    accent: 'from-sky-500/80 to-cyan-600/80',
    to: shopCategory('Smartphones'),
  },
  {
    id: 'cat-laptops',
    title: 'Laptops',
    description: 'Ultrabooks · creator · business',
    accent: 'from-slate-600/80 to-sky-600/80',
    to: shopCategory('Laptops'),
  },
  {
    id: 'cat-gaming',
    title: 'Gaming',
    description: 'Handhelds · battlestations',
    accent: 'from-rose-600/80 to-orange-600/80',
    to: shopCategory('Gaming'),
  },
  {
    id: 'cat-audio',
    title: 'Audio',
    description: 'ANC · studio · portable',
    accent: 'from-cyan-500/80 to-blue-600/80',
    to: shopCategory('Audio'),
  },
  {
    id: 'cat-watches',
    title: 'Smart watches',
    description: 'Health stacks · endurance GPS',
    accent: 'from-emerald-500/80 to-teal-600/80',
    to: shopCategory('Smart Watches'),
  },
  {
    id: 'cat-monitors',
    title: 'Monitors',
    description: 'OLED · ultrawide · color',
    accent: 'from-amber-500/80 to-orange-600/80',
    to: shopCategory('Monitors'),
  },
  {
    id: 'cat-keyboards',
    title: 'Keyboards',
    description: 'Mechanical · low profile',
    accent: 'from-sky-500/80 to-blue-700/80',
    to: shopCategory('Keyboards'),
  },
  {
    id: 'cat-tablets',
    title: 'Tablets',
    description: 'Creators · readers · 5G',
    accent: 'from-rose-500/80 to-orange-700/80',
    to: shopCategory('Tablets'),
  },
]

export const trendingProducts = [
  {
    id: 'p-iphone',
    title: 'iPhone 15 Pro',
    price: 1199,
    rating: 4.9,
    reviewCount: 8420,
    imageHint: 'Titanium · Action button',
    gradient: 'from-slate-800 via-sky-900 to-slate-950',
  },
  {
    id: 'p-galaxy',
    title: 'Galaxy S24 Ultra',
    price: 1419,
    rating: 4.8,
    reviewCount: 6120,
    imageHint: 'S Pen · 200MP sensor',
    gradient: 'from-slate-700 via-zinc-800 to-zinc-900',
  },
  {
    id: 'p-airpods',
    title: 'AirPods Pro (2nd gen)',
    price: 249,
    rating: 4.7,
    reviewCount: 15400,
    imageHint: 'USB-C · Adaptive Audio',
    gradient: 'from-sky-700 via-cyan-800 to-slate-950',
  },
  {
    id: 'p-rog',
    title: 'ROG Zephyrus G16',
    price: 2299,
    rating: 4.8,
    reviewCount: 980,
    imageHint: 'OLED · RTX 4080',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
  },
]

export const featuredBrands = [
  { id: 'b-apple', name: 'Apple', tagline: 'Phones · tablets · wearables', to: '/shop?search=Apple' },
  { id: 'b-samsung', name: 'Samsung', tagline: 'Galaxy ecosystem', to: '/shop?search=Samsung' },
  { id: 'b-sony', name: 'Sony', tagline: 'Alpha-grade audio', to: '/shop?search=Sony' },
  { id: 'b-asus', name: 'ASUS', tagline: 'ROG · ProArt · Zenbook', to: '/shop?search=ASUS' },
  { id: 'b-logi', name: 'Logitech', tagline: 'MX workspace · PRO play', to: '/shop?search=Logitech' },
  { id: 'b-razer', name: 'Razer', tagline: 'Chroma everything', to: '/shop?search=Razer' },
]

export const promoBanner = {
  badge: 'Spring upgrade',
  title: 'Up to $250 off creator laptops',
  subtitle: 'Auto-refreshed from MongoDB discount pricing — ends when inventory clears.',
  cta: { label: 'Browse laptops', to: '/shop?category=Laptops&sort=price_asc' },
}

export const newsletterContent = {
  title: 'Join the TechNova drop list',
  description:
    'Early access to launches, one-tap restock alerts, and curated picks — no spam.',
  placeholder: 'you@company.com',
  buttonLabel: 'Subscribe',
}

export const footerSocialLinks = [
  { id: 'x', label: 'X', href: 'https://twitter.com' },
  { id: 'github', label: 'GitHub', href: 'https://github.com' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
]

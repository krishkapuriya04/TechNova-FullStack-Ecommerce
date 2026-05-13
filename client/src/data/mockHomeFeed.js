/** Temporary homepage content — replace with API responses later. */

export const heroContent = {
  eyebrow: 'Next-gen electronics',
  title: 'Upgrade your everyday.',
  highlight: 'TechNova',
  description:
    'Curated devices, smart home, and accessories — engineered for clarity, speed, and a premium checkout experience.',
  primaryCta: { label: 'Shop trending', to: '/shop' },
  secondaryCta: { label: 'View wishlist', to: '/wishlist' },
  stats: [
    { label: 'Same-day dispatch', value: '48 cities' },
    { label: 'Member savings', value: 'Up to 25%' },
    { label: 'Support', value: '24/7 chat' },
  ],
}

export const featuredCategories = [
  {
    id: 'cat-laptops',
    title: 'Laptops',
    description: 'Workstations & ultrabooks',
    accent: 'from-indigo-500/80 to-violet-600/80',
    to: '/shop',
  },
  {
    id: 'cat-audio',
    title: 'Audio',
    description: 'ANC · studio · portable',
    accent: 'from-fuchsia-500/80 to-pink-600/80',
    to: '/shop',
  },
  {
    id: 'cat-wearables',
    title: 'Wearables',
    description: 'Health & performance',
    accent: 'from-cyan-500/80 to-blue-600/80',
    to: '/shop',
  },
  {
    id: 'cat-smart-home',
    title: 'Smart home',
    description: 'Lights · hubs · security',
    accent: 'from-emerald-500/80 to-teal-600/80',
    to: '/shop',
  },
]

export const trendingProducts = [
  {
    id: 'p-nova-x1',
    title: 'NovaBook X1',
    price: 1899,
    rating: 4.8,
    reviewCount: 312,
    imageHint: '16" OLED · 32GB RAM',
    gradient: 'from-indigo-600 via-violet-600 to-fuchsia-500',
  },
  {
    id: 'p-pulse-ear',
    title: 'Pulse ANC Pro',
    price: 249,
    rating: 4.6,
    reviewCount: 1284,
    imageHint: 'Hybrid noise canceling',
    gradient: 'from-slate-700 via-zinc-800 to-zinc-900',
  },
  {
    id: 'p-orbit-watch',
    title: 'Orbit Watch Ultra',
    price: 429,
    rating: 4.7,
    reviewCount: 891,
    imageHint: 'Titanium · satellite SOS',
    gradient: 'from-sky-600 via-blue-700 to-indigo-800',
  },
  {
    id: 'p-lumen-hub',
    title: 'Lumen Hub Max',
    price: 179,
    rating: 4.5,
    reviewCount: 640,
    imageHint: 'Matter-ready smart hub',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
  },
]

export const featuredBrands = [
  { id: 'b-aurora', name: 'Aurora', tagline: 'Displays & panels' },
  { id: 'b-helix', name: 'Helix Audio', tagline: 'Signature sound' },
  { id: 'b-vertex', name: 'Vertex Labs', tagline: 'AI edge devices' },
]

export const promoBanner = {
  badge: 'Member week',
  title: '20% off flagship laptops',
  subtitle: 'Ends Sunday · auto-applied at checkout for logged-in members.',
  cta: { label: 'Unlock deal', to: '/shop' },
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

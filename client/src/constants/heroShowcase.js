import { ROUTES } from '@/constants/routes.js'

const q = 'auto=format&fit=crop&w=800&h=640&q=86'

function shopCategory(category) {
  return `${ROUTES.SHOP}?category=${encodeURIComponent(category)}`
}

/** Floating hero visuals — Unsplash CDN, fixed aspect for layout stability */
export const heroShowcaseDevices = [
  {
    key: 'laptop',
    title: 'Laptops',
    subtitle: 'Ultrabooks to battlestations',
    to: shopCategory('Laptops'),
    image: `https://images.unsplash.com/photo-1496181133206-80ce9b88a853?${q}`,
    floatClass: 'lg:-translate-y-2 lg:translate-x-2',
  },
  {
    key: 'audio',
    title: 'Audio',
    subtitle: 'ANC · studio clarity',
    to: shopCategory('Audio'),
    image: `https://images.unsplash.com/photo-1505740420920-2020a001a226?${q}`,
    floatClass: 'lg:translate-y-6 lg:-translate-x-4',
  },
  {
    key: 'phone',
    title: 'Phones',
    subtitle: 'Flagship pocket power',
    to: shopCategory('Smartphones'),
    image: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?${q}`,
    floatClass: 'lg:-translate-y-8 lg:translate-x-6',
  },
]

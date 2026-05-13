/** Keep aligned with `server/src/constants/shopTaxonomy.js`. */

export const SHOP_CATEGORIES = [
  'Smartphones',
  'Laptops',
  'Gaming',
  'Audio',
  'Smart Watches',
  'Monitors',
  'Accessories',
  'Keyboards',
  'Mice',
  'Tablets',
]

export const SHOP_BRANDS = [
  'Apple',
  'Samsung',
  'Sony',
  'ASUS',
  'Logitech',
  'Razer',
  'Dell',
  'HP',
  'Lenovo',
  'MSI',
  'JBL',
  'Bose',
  'Nothing',
  'OnePlus',
]

export const SHOP_SEARCH_SUGGESTIONS = [
  'iPhone',
  'MacBook',
  'Galaxy',
  'AirPods',
  'gaming laptop',
  'OLED monitor',
  'mechanical keyboard',
  'noise cancelling',
  'smartwatch',
  'tablet',
  ...SHOP_BRANDS,
  ...SHOP_CATEGORIES,
]

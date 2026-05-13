/**
 * Central route paths — import these in NavLink, navigate(), and route definitions.
 * Add feature routes (auth, cart, admin, etc.) here as you build them.
 */
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  PRODUCT: '/shop/:slug',
  CART: '/cart',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  CHECKOUT: '/checkout',
  PROFILE: '/profile',
  ADMIN: '/admin',
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
}

export function productPath(slug) {
  return `/shop/${slug}`
}

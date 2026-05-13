import { ROUTES } from '@/constants/routes.js'

export const adminNavItems = [
  { to: ROUTES.ADMIN, label: 'Dashboard', end: true },
  { to: ROUTES.ADMIN_PRODUCTS, label: 'Products' },
  { to: ROUTES.ADMIN_ORDERS, label: 'Orders' },
  { to: ROUTES.ADMIN_USERS, label: 'Users' },
  { to: ROUTES.ADMIN_ANALYTICS, label: 'Analytics' },
  { to: ROUTES.ADMIN_SETTINGS, label: 'Settings' },
]

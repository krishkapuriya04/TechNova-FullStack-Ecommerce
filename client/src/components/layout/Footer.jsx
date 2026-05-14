import { APP_NAME } from '@/constants/app.js'
import { ROUTES } from '@/constants/routes.js'
import { footerSocialLinks } from '@/data/mockHomeFeed.js'
import { Link } from 'react-router-dom'

const footerColumns = [
  {
    title: 'Explore',
    links: [
      { to: ROUTES.SHOP, label: 'Shop' },
      { to: ROUTES.ORDERS, label: 'Orders' },
      { to: ROUTES.WISHLIST, label: 'Wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: ROUTES.FAQ, label: 'FAQ' },
      { to: ROUTES.SHIPPING_INFO, label: 'Shipping' },
      { to: ROUTES.RETURNS, label: 'Returns' },
      { to: ROUTES.CONTACT, label: 'Contact' },
      { to: ROUTES.NEWSLETTER, label: 'Newsletter' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: ROUTES.AUTH_LOGIN, label: 'Sign in' },
      { to: ROUTES.AUTH_REGISTER, label: 'Register' },
      { to: ROUTES.PROFILE, label: 'Profile' },
      { to: ROUTES.CHECKOUT, label: 'Checkout' },
      { to: ROUTES.ADMIN, label: 'Admin' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: ROUTES.RETURNS, label: 'Return policy' },
      { to: ROUTES.FAQ, label: 'Help center' },
      { label: 'Privacy (soon)', disabled: true },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-zinc-200/70 bg-zinc-50/90 dark:border-white/[0.06] dark:bg-gradient-to-b dark:from-tn-950 dark:to-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/35 to-transparent" />
      <div className="tn-container py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">{APP_NAME}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Premium ecommerce experience — tuned for conversion, accessibility, and a scalable component system.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footerSocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-zinc-200/90 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700 shadow-sm backdrop-blur-sm tn-transition-base hover:border-teal-400/50 hover:text-teal-800 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:border-teal-400/35 dark:hover:text-teal-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid flex-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{col.title}</p>
                <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                  {col.links.map((link) =>
                    link.disabled ? (
                      <li key={link.label}>
                        <span className="cursor-not-allowed opacity-60">{link.label}</span>
                      </li>
                    ) : (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="tn-transition-base hover:text-teal-700 dark:hover:text-teal-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-zinc-200/70 pt-6 text-center text-xs text-zinc-500 dark:border-white/[0.06] dark:text-zinc-600">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

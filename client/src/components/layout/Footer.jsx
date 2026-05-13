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
    title: 'Account',
    links: [
      { to: ROUTES.AUTH_LOGIN, label: 'Sign in' },
      { to: ROUTES.AUTH_REGISTER, label: 'Register' },
      { to: ROUTES.ADMIN, label: 'Admin' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', disabled: true },
      { label: 'Terms', disabled: true },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-zinc-200/90 bg-white dark:border-white/5 dark:bg-tn-950">
      <div className="tn-container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {APP_NAME}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Premium e-commerce UI foundation — optimized for conversion, accessibility, and a
              scalable component system.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footerSocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-tn border border-zinc-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-700 tn-transition-base hover:border-indigo-300/60 hover:text-indigo-700 dark:border-white/10 dark:text-zinc-200 dark:hover:border-indigo-400/40 dark:hover:text-indigo-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="grid flex-1 gap-8 sm:grid-cols-3 lg:col-span-8">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{col.title}</p>
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
                          className="tn-transition-base hover:text-indigo-600 dark:hover:text-indigo-300"
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

        <p className="mt-12 border-t border-zinc-200/80 pt-6 text-center text-xs text-zinc-500 dark:border-white/5 dark:text-zinc-600">
          © {year} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

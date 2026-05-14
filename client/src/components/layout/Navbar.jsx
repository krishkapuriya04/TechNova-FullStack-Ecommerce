import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '@/constants/app.js'
import { ROUTES } from '@/constants/routes.js'
import { primaryNavLinks } from '@/data/navLinks.js'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'
import { NotificationBell } from '@/components/layout/NotificationBell.jsx'
import { MobileMenu, MobileMenuButton } from '@/components/layout/MobileMenu.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'

const linkClass = ({ isActive }) =>
  [
    'rounded-full px-3.5 py-2 text-sm font-medium tn-transition-base',
    isActive
      ? 'bg-teal-500/12 text-teal-900 shadow-sm ring-1 ring-teal-500/20 dark:text-teal-100 dark:ring-teal-400/25'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-white',
  ].join(' ')

const authLinkClass =
  'rounded-full px-3.5 py-2 text-sm font-semibold text-teal-800 transition hover:bg-teal-500/10 dark:text-teal-100 dark:hover:bg-white/[0.06]'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, bootstrapped, logout, user } = useAuth()
  const { itemCount } = useCart()

  useEffect(() => {
    if (!mobileOpen) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/75 shadow-[0_1px_0_rgb(0_0_0/0.03)] backdrop-blur-2xl dark:border-white/[0.06] dark:bg-black/45 dark:shadow-[0_1px_0_rgb(255_255_255/0.04)]">
        <div className="tn-container flex h-16 items-center justify-between gap-4">
          <NavLink
            to={ROUTES.HOME}
            className="group flex items-center gap-2.5 rounded-full pr-2 outline-none ring-teal-500/30 focus-visible:ring-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-teal-700 text-sm font-bold text-white shadow-lg ring-1 ring-white/15 tn-transition-transform group-hover:scale-[1.04]">
              TN
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-white">{APP_NAME}</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {primaryNavLinks.map((item) =>
              item.to === ROUTES.CART ? (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    {bootstrapped && isAuthenticated && itemCount > 0 ? (
                      <span className="min-w-[1.25rem] rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white shadow-sm">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    ) : null}
                  </span>
                </NavLink>
              ) : (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex" aria-label="Account">
            {!bootstrapped ? (
              <span className="h-8 w-20 animate-pulse rounded-full bg-zinc-200/80 dark:bg-white/10" />
            ) : isAuthenticated ? (
              <>
                <NavLink to={ROUTES.PROFILE} className={authLinkClass}>
                  {user?.name?.split(' ')[0] ?? 'Profile'}
                </NavLink>
                {user?.role === 'admin' ? (
                  <NavLink to={ROUTES.ADMIN} className={authLinkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full border border-zinc-200/90 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-300 dark:border-white/10 dark:text-zinc-100 dark:hover:border-white/20"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to={ROUTES.AUTH_LOGIN} className={authLinkClass}>
                  Log in
                </NavLink>
                <NavLink
                  to={ROUTES.AUTH_REGISTER}
                  className="rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-md transition hover:brightness-105"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex" aria-label="Tools">
              <NotificationBell />
              <ThemeToggle />
            </div>
            <MobileMenuButton open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
          </div>
        </div>
      </header>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}

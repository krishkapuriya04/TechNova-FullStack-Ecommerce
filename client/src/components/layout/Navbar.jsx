import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '@/constants/app.js'
import { ROUTES } from '@/constants/routes.js'
import { primaryNavLinks } from '@/data/navLinks.js'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'
import { MobileMenu, MobileMenuButton } from '@/components/layout/MobileMenu.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'

const linkClass = ({ isActive }) =>
  [
    'rounded-tn px-3 py-2 text-sm font-medium tn-transition-base',
    isActive
      ? 'bg-sky-500/12 text-sky-800 dark:text-sky-200'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100',
  ].join(' ')

const authLinkClass =
  'rounded-tn px-3 py-2 text-sm font-semibold text-sky-800 transition hover:bg-sky-500/10 dark:text-sky-200 dark:hover:bg-white/5'

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
      <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/85 shadow-sm backdrop-blur-lg dark:border-white/5 dark:bg-tn-950/80">
        <div className="tn-container flex h-16 items-center justify-between gap-4">
          <NavLink
            to={ROUTES.HOME}
            className="group flex items-center gap-2 rounded-tn outline-none ring-sky-500/35 focus-visible:ring-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-tn bg-gradient-to-br from-slate-800 via-slate-900 to-sky-700 text-sm font-bold text-white shadow-md tn-transition-transform group-hover:scale-[1.03]">
              TN
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {APP_NAME}
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {primaryNavLinks.map((item) =>
              item.to === ROUTES.CART ? (
                <NavLink key={item.to} to={item.to} className={linkClass}>
                  <span className="inline-flex items-center gap-2">
                    {item.label}
                    {bootstrapped && isAuthenticated && itemCount > 0 ? (
                      <span className="min-w-[1.25rem] rounded-full bg-sky-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white dark:bg-sky-400 dark:text-tn-950">
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
              <span className="h-8 w-20 animate-pulse rounded-tn bg-zinc-200/80 dark:bg-white/10" />
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
                  className="rounded-tn border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:border-zinc-300 dark:border-white/10 dark:text-zinc-100 dark:hover:border-white/20"
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
                  className="rounded-tn bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-sky-500"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
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

import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { APP_NAME } from '@/constants/app.js'
import { ROUTES } from '@/constants/routes.js'
import { primaryNavLinks } from '@/data/navLinks.js'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'
import { MobileMenu, MobileMenuButton } from '@/components/layout/MobileMenu.jsx'

const linkClass = ({ isActive }) =>
  [
    'rounded-tn px-3 py-2 text-sm font-medium tn-transition-base',
    isActive
      ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-200'
      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100',
  ].join(' ')

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

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
            className="group flex items-center gap-2 rounded-tn outline-none ring-indigo-500/40 focus-visible:ring-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-tn bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-tn-glow-sm tn-transition-transform group-hover:scale-[1.03]">
              TN
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {APP_NAME}
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {primaryNavLinks.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

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

import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { primaryNavLinks } from '@/data/navLinks.js'
import { IconClose, IconMenu } from '@/components/ui/IconSymbols.jsx'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'
import { NotificationBell } from '@/components/layout/NotificationBell.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'
import { ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'

const linkClass = ({ isActive }) =>
  [
    'block rounded-xl px-4 py-3.5 text-base font-medium tn-transition-base',
    isActive
      ? 'bg-teal-500/15 text-teal-900 ring-1 ring-teal-500/25 dark:text-teal-100 dark:ring-teal-400/30'
      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/[0.06]',
  ].join(' ')

export function MobileMenu({ open, onClose }) {
  const reduceMotion = usePrefersReducedMotion()
  const { isAuthenticated, bootstrapped, logout, user } = useAuth()
  const { itemCount } = useCart()

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] md:hidden"
          initial={reduceMotion ? undefined : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={onClose}
          />
          <motion.nav
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            initial={reduceMotion ? undefined : { x: '100%' }}
            animate={reduceMotion ? undefined : { x: 0 }}
            exit={reduceMotion ? undefined : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="absolute right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col border-l border-zinc-200/70 bg-white/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/95"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-white/10">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Menu</p>
              <div className="flex items-center gap-2">
                <NotificationBell />
                <ThemeToggle />
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-tn border border-zinc-200 text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:text-zinc-100 dark:hover:bg-white/5"
                  aria-label="Close navigation"
                >
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-4">
              <div className="flex flex-col gap-1">
                {primaryNavLinks.map((item) =>
                  item.to === ROUTES.CART ? (
                    <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
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
                    <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
                      {item.label}
                    </NavLink>
                  ),
                )}
                {bootstrapped && isAuthenticated ? (
                  <>
                    <NavLink to={ROUTES.PROFILE} className={linkClass} onClick={onClose}>
                      Profile ({user?.name ?? 'you'})
                    </NavLink>
                    {user?.role === 'admin' ? (
                      <NavLink to={ROUTES.ADMIN} className={linkClass} onClick={onClose}>
                        Admin dashboard
                      </NavLink>
                    ) : null}
                    <button
                      type="button"
                      className="block w-full rounded-tn px-4 py-3 text-left text-base font-semibold text-red-600 hover:bg-red-500/10 dark:text-red-300"
                      onClick={() => {
                        logout()
                        onClose()
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : null}
                {bootstrapped && !isAuthenticated ? (
                  <>
                    <NavLink to={ROUTES.AUTH_LOGIN} className={linkClass} onClick={onClose}>
                      Log in
                    </NavLink>
                    <NavLink to={ROUTES.AUTH_REGISTER} className={linkClass} onClick={onClose}>
                      Register
                    </NavLink>
                  </>
                ) : null}
              </div>
            </div>
          </motion.nav>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

export function MobileMenuButton({ open, onClick }) {
  return (
    <button
      type="button"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200/90 bg-white/90 text-zinc-800 shadow-sm transition hover:border-teal-400/50 hover:bg-zinc-50 md:hidden dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-100 dark:hover:border-teal-400/40 dark:hover:bg-white/[0.07]"
      aria-controls="mobile-navigation"
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
    </button>
  )
}

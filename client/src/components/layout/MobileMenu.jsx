import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { primaryNavLinks } from '@/data/navLinks.js'
import { IconClose, IconMenu } from '@/components/ui/IconSymbols.jsx'
import { ThemeToggle } from '@/components/layout/ThemeToggle.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'
import { ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'

const linkClass = ({ isActive }) =>
  [
    'block rounded-tn px-4 py-3 text-base font-medium tn-transition-base',
    isActive
      ? 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-200'
      : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5',
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
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-tn-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 dark:border-white/10">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Menu</p>
              <div className="flex items-center gap-2">
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
                          <span className="min-w-[1.25rem] rounded-full bg-indigo-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-none text-white dark:bg-indigo-400 dark:text-tn-950">
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-tn border border-zinc-200 text-zinc-800 transition hover:border-indigo-300/50 hover:bg-zinc-50 md:hidden dark:border-white/10 dark:text-zinc-100 dark:hover:border-indigo-400/30 dark:hover:bg-white/5"
      aria-controls="mobile-navigation"
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
    </button>
  )
}

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminNavItems } from '@/data/adminNavLinks.js'
import { ROUTES } from '@/constants/routes.js'

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-tn px-3 py-2.5 text-sm font-medium tn-transition-base',
    isActive
      ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/10'
      : 'text-zinc-300 hover:bg-white/5 hover:text-white',
  ].join(' ')

export function AdminSidebar({ onNavigate, variant = 'desktop' }) {
  const root =
    variant === 'desktop'
      ? 'hidden w-60 shrink-0 flex-col border-r border-white/10 bg-tn-950/40 p-4 backdrop-blur-xl lg:flex'
      : 'flex h-full w-full flex-col bg-transparent p-0'

  return (
    <aside className={root}>
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/90">TechNova</p>
        <p className="mt-1 text-lg font-semibold text-white">Admin</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Admin">
        {adminNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={onNavigate}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <NavLink
        to={ROUTES.HOME}
        className="mt-4 rounded-tn border border-white/10 px-3 py-2 text-center text-xs font-semibold text-zinc-300 transition hover:border-sky-400/40 hover:text-white"
        onClick={onNavigate}
      >
        ← Storefront
      </NavLink>
    </aside>
  )
}

export function AdminMobileSidebar({ open, onClose }) {
  return (
    <motion.div
      className={`fixed inset-0 z-[70] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      initial={false}
      animate={open ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close admin menu"
        onClick={onClose}
      />
      <motion.aside
        initial={false}
        animate={open ? { x: 0 } : { x: '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col border-r border-white/10 bg-tn-950/95 p-4 shadow-2xl backdrop-blur-xl"
      >
        <AdminSidebar onNavigate={onClose} variant="drawer" />
      </motion.aside>
    </motion.div>
  )
}

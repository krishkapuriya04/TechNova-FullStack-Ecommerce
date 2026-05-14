import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Footer } from '@/components/layout/Footer.jsx'
import { Navbar } from '@/components/layout/Navbar.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function MainLayout() {
  const { pathname } = useLocation()
  const reduceMotion = usePrefersReducedMotion()

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100 text-zinc-900 antialiased dark:bg-black dark:text-zinc-100">
      <a
        href="#tn-main"
        className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-gradient-to-r from-teal-600 to-cyan-500 px-4 py-2 text-sm font-semibold text-white opacity-0 shadow-lg transition focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-teal-300"
      >
        Skip to content
      </a>
      <Navbar />
      <motion.main
        id="tn-main"
        key={pathname}
        className="flex-1 outline-none"
        tabIndex={-1}
        initial={reduceMotion ? undefined : { opacity: 0.94, y: 8 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  )
}

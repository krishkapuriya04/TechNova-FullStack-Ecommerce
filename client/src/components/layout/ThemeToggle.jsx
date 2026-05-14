import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme.js'
import { IconMoon, IconSun } from '@/components/ui/IconSymbols.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const reduceMotion = usePrefersReducedMotion()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-tn border border-zinc-200 bg-white text-zinc-800 shadow-sm tn-transition-base hover:border-sky-300/60 hover:text-sky-700 dark:border-white/10 dark:bg-tn-850 dark:text-zinc-100 dark:hover:border-sky-400/40 dark:hover:text-sky-200"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {isDark ? (
          <motion.span
            key="moon"
            initial={reduceMotion ? undefined : { opacity: 0, rotate: -40, scale: 0.85 }}
            animate={reduceMotion ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, rotate: 40, scale: 0.85 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <IconMoon className="h-5 w-5" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={reduceMotion ? undefined : { opacity: 0, rotate: 40, scale: 0.85 }}
            animate={reduceMotion ? undefined : { opacity: 1, rotate: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, rotate: -40, scale: 0.85 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
          >
            <IconSun className="h-5 w-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

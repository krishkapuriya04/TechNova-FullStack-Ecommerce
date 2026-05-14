import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function SectionTitle({ eyebrow, title, subtitle, align = 'left' }) {
  const reduceMotion = usePrefersReducedMotion()
  const alignClass =
    align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'

  return (
    <div className={`mb-10 space-y-4 ${alignClass}`}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-700 dark:text-teal-300/90">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">{subtitle}</p>
      ) : null}
      <motion.span
        aria-hidden
        className={`block h-0.5 rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-400 ${
          align === 'center' ? 'mx-auto w-20' : 'w-20'
        }`}
        initial={reduceMotion ? undefined : { opacity: 0, scaleX: 0.35 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, scaleX: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: align === 'center' ? 0.5 : 0 }}
      />
    </div>
  )
}

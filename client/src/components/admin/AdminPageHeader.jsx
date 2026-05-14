import { motion } from 'framer-motion'

export function AdminPageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300/90">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-2 max-w-2xl text-sm text-zinc-400">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function AdminStatCard({ label, value, hint }) {
  return (
    <motion.div
      layout
      className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 shadow-inner backdrop-blur-md transition hover:border-sky-400/30 hover:bg-white/[0.07]"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-bold tabular-nums text-white sm:text-3xl">{value}</p>
      {hint ? <p className="mt-1 text-xs text-zinc-500">{hint}</p> : null}
    </motion.div>
  )
}

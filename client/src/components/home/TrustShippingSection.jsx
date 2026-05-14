import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

const trust = [
  { title: 'Secure checkout', body: 'TLS everywhere · PCI-minded flows' },
  { title: 'Authentic inventory', body: 'Serialized picks · fraud monitoring' },
  { title: '30-day returns', body: 'Hassle-light policy on eligible SKUs' },
]

const shipping = [
  { title: 'Free shipping $99+', body: 'Contiguous US · weight exclusions apply' },
  { title: 'Same-day dispatch', body: 'In-stock orders before 2pm local' },
  { title: 'Carbon-aware routing', body: 'Optimized carrier selection' },
]

export function TrustShippingSection() {
  const reduceMotion = usePrefersReducedMotion()

  return (
    <section className="relative overflow-hidden border-y border-zinc-200/70 py-16 dark:border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-zinc-50/90 to-zinc-100 dark:from-tn-950 dark:via-black dark:to-tn-void" />
      <div className="tn-container relative grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-700 dark:text-teal-300">
            Trust
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Built like a production storefront
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trust.map((item) => (
              <div
                key={item.title}
                className="rounded-tn-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.07] dark:bg-zinc-950/55"
              >
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-teal-700 dark:text-teal-300">
            Shipping
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            Fast, transparent fulfillment
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {shipping.map((item) => (
              <div
                key={item.title}
                className="rounded-tn-2xl border border-zinc-200/70 bg-white/70 p-4 shadow-sm backdrop-blur-xl dark:border-white/[0.07] dark:bg-zinc-950/55"
              >
                <p className="text-sm font-semibold text-zinc-950 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

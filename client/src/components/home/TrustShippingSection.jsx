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
    <section className="border-y border-zinc-200/80 bg-gradient-to-b from-white to-zinc-50 py-14 dark:border-white/5 dark:from-tn-950 dark:to-tn-void">
      <div className="tn-container grid gap-10 lg:grid-cols-2">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
            Trust
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Built like a production storefront
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {trust.map((item) => (
              <div
                key={item.title}
                className="rounded-tn-xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-tn-900/70"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600 dark:text-indigo-300">
            Shipping
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            Fast, transparent fulfillment
          </h2>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {shipping.map((item) => (
              <div
                key={item.title}
                className="rounded-tn-xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-tn-900/70"
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

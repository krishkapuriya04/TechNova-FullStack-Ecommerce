import { useState } from 'react'
import { motion } from 'framer-motion'
import { newsletterContent } from '@/data/mockHomeFeed.js'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const reduceMotion = usePrefersReducedMotion()

  function handleSubmit(e) {
    e.preventDefault()
    setEmail('')
  }

  return (
    <section className="border-t border-zinc-200/80 bg-zinc-50 py-16 dark:border-white/5 dark:bg-tn-950/80">
      <div className="tn-container">
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="tn-surface mx-auto max-w-3xl rounded-tn-2xl p-8 sm:p-10"
        >
          <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              {newsletterContent.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              {newsletterContent.description}
            </p>
          </div>
          <form
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              autoComplete="email"
              placeholder={newsletterContent.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full flex-1 rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-inner outline-none ring-sky-500/30 placeholder:text-zinc-400 focus:border-sky-400 focus:ring-2 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <PrimaryButton type="submit" className="sm:w-auto sm:min-w-[9rem]">
              {newsletterContent.buttonLabel}
            </PrimaryButton>
          </form>
          <p className="mt-4 text-center text-xs text-zinc-500">
            Demo form — connect to your email provider or API in the next phase.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

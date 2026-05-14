import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'

export function ReturnsPage() {
  return (
    <div className="tn-container tn-section-y max-w-3xl">
      <SectionTitle eyebrow="Policy" title="Returns" subtitle="Fair, documented return windows for premium electronics." />
      <div className="mt-10 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        <p>
          Unopened items may be returned within 14 days of delivery for a full refund minus return shipping unless the
          product arrived defective. Opened items are assessed case-by-case to prevent fraud while protecting genuine
          buyers.
        </p>
        <p>
          Initiate a return from your orders view once signed in, or email{' '}
          <a className="font-semibold text-sky-700 dark:text-sky-300" href="mailto:support@technova.dev">
            support@technova.dev
          </a>
          .
        </p>
        <p>
          <Link className="font-semibold text-sky-700 dark:text-sky-300" to={ROUTES.FAQ}>
            Read the FAQ
          </Link>{' '}
          for timelines and eligibility.
        </p>
      </div>
    </div>
  )
}

import { SectionTitle } from '@/components/ui/SectionTitle.jsx'

export function ContactPage() {
  return (
    <div className="tn-container tn-section-y max-w-3xl">
      <SectionTitle eyebrow="Support" title="Contact" subtitle="Operational desk — this page is a structured placeholder." />
      <div className="mt-10 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 dark:border-white/10 dark:bg-tn-900/80">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Wire this route to Zendesk, Intercom, or your internal ticketing API. For now, shoppers can reach the demo
          operations alias at{' '}
          <a className="font-semibold text-sky-700 dark:text-sky-300" href="mailto:support@technova.dev">
            support@technova.dev
          </a>
          .
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Include order id, SKU, and photos for damaged shipments — it speeds up carrier claims by hours.
        </p>
      </div>
    </div>
  )
}

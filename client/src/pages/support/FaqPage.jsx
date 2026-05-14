import { SectionTitle } from '@/components/ui/SectionTitle.jsx'

const items = [
  {
    q: 'How fast do you ship?',
    a: 'Most metro orders dispatch within one business day. You will receive tracking as soon as the carrier scans the label.',
  },
  {
    q: 'Can I change my order after checkout?',
    a: 'Contact support immediately — once fulfillment starts we lock edits to protect picking accuracy.',
  },
  {
    q: 'Do you price-match?',
    a: 'We periodically align flagship SKUs with major retailers. Stack a coupon at checkout when campaigns are active.',
  },
]

export function FaqPage() {
  return (
    <div className="tn-container tn-section-y max-w-3xl">
      <SectionTitle eyebrow="Help" title="FAQ" subtitle="Straight answers for shoppers evaluating TechNova." />
      <div className="mt-10 space-y-4">
        {items.map((row) => (
          <article key={row.q} className="rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-5 dark:border-white/10 dark:bg-tn-900/80">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">{row.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{row.a}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'

const cards = [
  {
    title: 'Newsletter & CRM',
    body: 'Subscriber exports, consent timelines, and ESP sync will live here. Until APIs land, capture leads via the public newsletter page.',
  },
  {
    title: 'Payments',
    body: 'Stripe / Razorpay connectors will mount here with webhook replay and settlement exports.',
  },
  {
    title: 'Coupons & promos',
    body: 'Operational coupons now live under Admin → Coupons with expiry governance.',
  },
  {
    title: 'Notifications',
    body: 'Transactional email/SMS with provider abstraction — the in-app bell mirrors critical ops events today.',
  },
]

export function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        eyebrow="Platform"
        title="Settings"
        subtitle="Configuration surface reserved for billing, compliance, and messaging integrations."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <article
            key={c.title}
            className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 shadow-inner backdrop-blur-md transition hover:border-sky-400/25"
          >
            <h2 className="text-base font-semibold text-white">{c.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{c.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

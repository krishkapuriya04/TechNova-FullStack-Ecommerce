import { SectionTitle } from '@/components/ui/SectionTitle.jsx'

export function OrdersPage() {
  return (
    <div className="tn-container tn-section-y">
      <SectionTitle
        eyebrow="History"
        title="Orders"
        subtitle="Order documents will live under /api/v1/orders with payment references."
      />
    </div>
  )
}

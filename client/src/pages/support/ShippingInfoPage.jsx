import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'

export function ShippingInfoPage() {
  return (
    <div className="tn-container tn-section-y max-w-3xl">
      <SectionTitle eyebrow="Logistics" title="Shipping" subtitle="Transparent delivery expectations before you buy." />
      <div className="mt-10 space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        <p>
          TechNova ships from verified inventory nodes. Standard orders include tracking, insurance on high-value SKUs,
          and carbon-conscious packaging where available.
        </p>
        <ul>
          <li>Flat-rate shipping mirrors checkout — same numbers you see in cart and order confirmation.</li>
          <li>Expedited lanes unlock automatically on qualifying basket sizes.</li>
          <li>Signature-required delivery can be toggled per SKU at fulfillment time.</li>
        </ul>
        <p>
          Need exceptions?{' '}
          <Link className="font-semibold text-sky-700 dark:text-sky-300" to={ROUTES.CONTACT}>
            Contact the operations desk
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { OrderDetailSection } from '@/components/orders/OrderDetailSection.jsx'
import { ROUTES } from '@/constants/routes.js'
import * as orderService from '@/services/orderService.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const doc = await orderService.fetchOrderById(orderId)
        if (active) setOrder(doc)
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Order not found'))
      } finally {
        if (active) setLoading(false)
      }
    }
    if (orderId) load()
    return () => {
      active = false
    }
  }, [orderId])

  if (loading && !order) {
    return <PageLoader label="Loading order…" />
  }

  if (error || !order) {
    return (
      <div className="tn-container tn-section-y space-y-4 text-center">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white">Order unavailable</p>
        {error ? <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p> : null}
        <Link to={ROUTES.ORDERS} className="text-sm font-semibold text-sky-600 dark:text-sky-300">
          ← Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="tn-section-y">
      <div className="tn-container max-w-4xl space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Details" title="Order summary" subtitle="Shipment and payment in one view." />
          <Link
            to={ROUTES.ORDERS}
            className="text-sm font-semibold text-sky-600 transition hover:text-sky-500 dark:text-sky-300"
          >
            ← All orders
          </Link>
        </div>
        <OrderDetailSection order={order} />
      </div>
    </div>
  )
}

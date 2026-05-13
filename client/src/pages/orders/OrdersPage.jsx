import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { OrderCard } from '@/components/orders/OrderCard.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import * as orderService from '@/services/orderService.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      try {
        const list = await orderService.fetchMyOrders()
        if (active) setOrders(list)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to load orders'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="tn-section-y">
      <div className="tn-container space-y-8">
        <SectionTitle
          eyebrow="Account"
          title="Your orders"
          subtitle="Track fulfillment, payment state, and totals across every purchase."
        />

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-tn-xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-tn-2xl border border-dashed border-zinc-300/80 bg-white/60 px-8 py-14 text-center dark:border-white/15 dark:bg-tn-900/50">
            <p className="text-lg font-semibold text-zinc-900 dark:text-white">No orders yet</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              When you check out, your receipts and tracking will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ROUTES, orderDetailPath } from '@/constants/routes.js'
import * as orderService from '@/services/orderService.js'
import { formatOrderMoney, formatShortDate } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function CheckoutSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const orderId = location.state?.orderId
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      navigate(ROUTES.ORDERS, { replace: true })
      return undefined
    }
    let active = true
    async function load() {
      setLoading(true)
      try {
        const doc = await orderService.fetchOrderById(orderId)
        if (active) setOrder(doc)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to load order'))
        if (active) navigate(ROUTES.ORDERS, { replace: true })
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [orderId, navigate])

  if (!orderId) return null

  if (loading || !order) {
    return <PageLoader label="Confirming your order…" />
  }

  return (
    <div className="tn-section-y">
      <div className="tn-container max-w-2xl space-y-8">
        <SectionTitle
          eyebrow="Success"
          title="Thank you for your order"
          subtitle="You will receive status updates as we prepare your shipment."
        />
        <div className="rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-tn-soft dark:border-white/10 dark:bg-tn-900/80">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Order <span className="font-mono font-semibold text-zinc-900 dark:text-white">{order.id}</span>
          </p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{formatShortDate(order.createdAt)}</p>
          <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">
            {formatOrderMoney(order.totalPrice)}
          </p>
          <p className="mt-2 text-sm capitalize text-zinc-600 dark:text-zinc-400">
            {order.orderStatus} · Payment {order.paymentStatus}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton to={orderDetailPath(order.id)}>View order details</PrimaryButton>
            <SecondaryButton to={ROUTES.SHOP}>Continue shopping</SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

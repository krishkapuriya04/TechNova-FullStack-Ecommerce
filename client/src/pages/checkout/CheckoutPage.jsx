import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm.jsx'
import { PaymentSection } from '@/components/checkout/PaymentSection.jsx'
import { CheckoutOrderSummary } from '@/components/checkout/CheckoutOrderSummary.jsx'
import { CheckoutCouponField } from '@/components/checkout/CheckoutCouponField.jsx'
import { EmptyCartState } from '@/components/cart/EmptyCartState.jsx'
import { CartPageSkeleton } from '@/components/cart/CartPageSkeleton.jsx'
import { useCart } from '@/hooks/useCart.js'
import { ROUTES } from '@/constants/routes.js'
import { PAYMENT_METHOD, estimateOrderTotals } from '@/constants/checkout.js'
import * as orderService from '@/services/orderService.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { useNotifications } from '@/hooks/useNotifications.js'

const emptyAddress = {
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
}

function validateShipping(addr) {
  const errors = {}
  if (!addr.fullName?.trim()) errors.fullName = 'Required'
  if (!addr.line1?.trim()) errors.line1 = 'Required'
  if (!addr.city?.trim()) errors.city = 'Required'
  if (!addr.postalCode?.trim()) errors.postalCode = 'Required'
  if (!addr.country?.trim()) errors.country = 'Required'
  if (!addr.phone?.trim()) errors.phone = 'Required'
  return errors
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { push } = useNotifications()
  const { cart, loading, refreshCart, mutating } = useCart()
  const [address, setAddress] = useState(emptyAddress)
  const [errors, setErrors] = useState({})
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.COD)
  const [cardLast4, setCardLast4] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [couponInput, setCouponInput] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState('')

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  useEffect(() => {
    const h = window.setTimeout(() => {
      setAppliedDiscount(0)
      setAppliedCode('')
      setCouponInput('')
    }, 0)
    return () => window.clearTimeout(h)
  }, [cart?.subtotal])

  const pricing = useMemo(
    () => estimateOrderTotals(cart?.subtotal ?? 0, appliedDiscount),
    [cart?.subtotal, appliedDiscount],
  )

  const hasItems = (cart?.items?.length ?? 0) > 0

  const onAddressChange = useCallback((name, value) => {
    setAddress((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const handleCouponApplied = useCallback((discount, code) => {
    setAppliedDiscount(discount)
    setAppliedCode(code)
  }, [])

  const handleCouponClear = useCallback(() => {
    setAppliedDiscount(0)
    setAppliedCode('')
    setCouponInput('')
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      const shipErr = validateShipping(address)
      const payErr = {}
      if (paymentMethod === PAYMENT_METHOD.CARD && cardLast4.length !== 4) {
        payErr.cardLast4 = 'Enter 4 digits'
      }
      setErrors({ ...shipErr, ...payErr })
      if (Object.keys(shipErr).length || Object.keys(payErr).length) {
        toast.error('Please fix the highlighted fields')
        return
      }
      if (!hasItems) {
        toast.error('Your cart is empty')
        return
      }

      setSubmitting(true)
      try {
        const payload = {
          paymentMethod,
          shippingAddress: {
            fullName: address.fullName.trim(),
            line1: address.line1.trim(),
            line2: address.line2?.trim() || '',
            city: address.city.trim(),
            postalCode: address.postalCode.trim(),
            country: address.country.trim(),
            phone: address.phone.trim(),
          },
        }
        if (paymentMethod === PAYMENT_METHOD.CARD) {
          payload.cardLast4 = cardLast4
        }
        if (appliedCode) {
          payload.couponCode = appliedCode
        }
        const order = await orderService.createOrderRequest(payload)
        await refreshCart()
        toast.success('Order placed')
        push({
          type: 'order',
          title: 'Order placed',
          message: `Order ${order.id} — ${order.orderItems?.length ?? 0} line(s)`,
        })
        navigate(ROUTES.CHECKOUT_SUCCESS, { replace: true, state: { orderId: order.id } })
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to place order'))
      } finally {
        setSubmitting(false)
      }
    },
    [address, paymentMethod, cardLast4, hasItems, navigate, refreshCart, appliedCode, push],
  )

  const busy = submitting || mutating

  return (
    <div className="tn-section-y">
      <div className="tn-container space-y-10">
        <SectionTitle
          eyebrow="Secure"
          title="Checkout"
          subtitle="Shipping, tax, and totals mirror the server — inventory is reserved when you place the order."
        />

        {loading && !cart ? <CartPageSkeleton /> : null}

        {!loading && !hasItems ? <EmptyCartState /> : null}

        {hasItems ? (
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-8 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-tn-900/80">
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Shipping address</h2>
                <ShippingAddressForm
                  value={address}
                  errors={errors}
                  disabled={busy}
                  onChange={onAddressChange}
                />
              </section>
              <CheckoutCouponField
                subtotal={cart?.subtotal ?? 0}
                couponInput={couponInput}
                onCouponInputChange={setCouponInput}
                appliedCode={appliedCode}
                onApplied={handleCouponApplied}
                onClear={handleCouponClear}
                disabled={busy}
              />
              <section>
                <PaymentSection
                  method={paymentMethod}
                  onMethodChange={setPaymentMethod}
                  cardLast4={cardLast4}
                  onCardLast4Change={setCardLast4}
                  disabled={busy}
                  errors={errors}
                />
              </section>
              <PrimaryButton type="submit" className="w-full justify-center sm:w-auto" disabled={busy}>
                {busy ? 'Placing order…' : 'Place order'}
              </PrimaryButton>
            </div>
            <CheckoutOrderSummary cart={cart} pricing={pricing} />
          </form>
        ) : null}
      </div>
    </div>
  )
}

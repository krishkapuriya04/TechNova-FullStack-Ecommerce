import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { CartItemCard } from '@/components/cart/CartItemCard.jsx'
import { CartSummary } from '@/components/cart/CartSummary.jsx'
import { EmptyCartState } from '@/components/cart/EmptyCartState.jsx'
import { CartPageSkeleton } from '@/components/cart/CartPageSkeleton.jsx'
import { useCart } from '@/hooks/useCart.js'
import { ROUTES } from '@/constants/routes.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function CartPage() {
  const navigate = useNavigate()
  const { cart, loading, mutating, updateQuantity, removeItem, clearCart } = useCart()

  const handleCheckout = useCallback(() => {
    navigate(ROUTES.CHECKOUT)
  }, [navigate])

  const handleClear = useCallback(async () => {
    if (!window.confirm('Remove all items from your cart?')) return
    try {
      await clearCart()
      toast.success('Cart cleared')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to clear cart'))
    }
  }, [clearCart])

  const handleIncrement = useCallback(
    async (item) => {
      const max = item.product.stock ?? 0
      if (item.quantity >= max) {
        toast.error('Maximum stock reached for this product')
        return
      }
      try {
        await updateQuantity(item.id, item.quantity + 1)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to update quantity'))
      }
    },
    [updateQuantity],
  )

  const handleDecrement = useCallback(
    async (item) => {
      if (item.quantity <= 1) return
      try {
        await updateQuantity(item.id, item.quantity - 1)
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to update quantity'))
      }
    },
    [updateQuantity],
  )

  const handleRemove = useCallback(
    async (itemId) => {
      try {
        await removeItem(itemId)
        toast.success('Removed from cart')
      } catch (err) {
        toast.error(getErrorMessage(err, 'Unable to remove item'))
      }
    },
    [removeItem],
  )

  const hasItems = (cart?.items?.length ?? 0) > 0

  return (
    <div className="tn-section-y">
      <div className="tn-container space-y-10">
        <SectionTitle
          eyebrow="Bag"
          title="Your cart"
          subtitle="Quantities and totals stay in sync with live inventory on the server."
        />

        {loading && !cart ? <CartPageSkeleton /> : null}

        {!loading && !hasItems ? <EmptyCartState /> : null}

        {hasItems ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  disabled={mutating}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </div>
            <CartSummary
              cart={cart}
              disabled={mutating}
              onClear={handleClear}
              onCheckout={handleCheckout}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}

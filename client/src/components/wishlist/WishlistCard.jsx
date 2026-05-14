import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { IconHeart } from '@/components/ui/IconSymbols.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { productPath } from '@/constants/routes.js'
import { useCart } from '@/hooks/useCart.js'
import { useWishlist } from '@/hooks/useWishlist.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function WishlistCard({ product }) {
  const { addToCart } = useCart()
  const { removeProduct, mutating } = useWishlist()
  const [moving, setMoving] = useState(false)
  const detailTo = product.slug ? productPath(product.slug) : null
  const price =
    typeof product.discountPrice === 'number' &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
      ? product.discountPrice
      : product.effectivePrice ?? product.price

  async function handleMoveToCart() {
    setMoving(true)
    try {
      await addToCart({ productId: product.id, quantity: 1 })
      await removeProduct(product.id)
      toast.success('Moved to cart')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not move to cart'))
    } finally {
      setMoving(false)
    }
  }

  async function handleRemove() {
    try {
      await removeProduct(product.id)
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update wishlist'))
    }
  }

  const busy = mutating || moving

  return (
    <article className="flex flex-col overflow-hidden rounded-tn-xl border border-zinc-200/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-tn-900/80">
      <div className="relative">
        {detailTo ? (
          <Link to={detailTo} className="block" aria-label={`View ${product.title}`}>
            <div className="aspect-[4/3] bg-zinc-100 dark:bg-tn-950">
              {product.image ? (
                <img
                  src={product.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                  No image
                </div>
              )}
            </div>
          </Link>
        ) : (
          <div className="aspect-[4/3] bg-zinc-100 dark:bg-tn-950">
            {product.image ? (
              <img src={product.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            ) : null}
          </div>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={handleRemove}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition hover:border-white/40 hover:bg-black/45 disabled:opacity-50"
          aria-label="Remove from wishlist"
        >
          <IconHeart className="h-5 w-5 text-rose-300" filled />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        {detailTo ? (
          <Link to={detailTo} className="block">
            <h3 className="text-base font-semibold text-zinc-900 transition hover:text-sky-600 dark:text-white dark:hover:text-sky-300">
              {product.title}
            </h3>
          </Link>
        ) : (
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{product.title}</h3>
        )}
        <p className="text-lg font-semibold text-zinc-900 dark:text-white">{formatCurrency(price)}</p>
        <div className="mt-auto flex flex-col gap-2 sm:flex-row">
          <PrimaryButton
            type="button"
            size="sm"
            className="flex-1 justify-center"
            disabled={busy || (product.stock ?? 0) <= 0}
            onClick={handleMoveToCart}
          >
            Move to cart
          </PrimaryButton>
          <SecondaryButton
            type="button"
            size="sm"
            className="flex-1 justify-center"
            disabled={busy}
            onClick={handleRemove}
          >
            Remove
          </SecondaryButton>
        </div>
      </div>
    </article>
  )
}

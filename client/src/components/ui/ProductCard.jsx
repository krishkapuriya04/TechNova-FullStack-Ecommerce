import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { RatingStars } from '@/components/ui/RatingStars.jsx'
import { IconHeart, IconCart } from '@/components/ui/IconSymbols.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'
import { productPath, ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'
import { useWishlist } from '@/hooks/useWishlist.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { ProductImage } from '@/components/ui/ProductImage.jsx'

function hashGradient(seed) {
  const palettes = [
    'from-zinc-800 via-zinc-900 to-black',
    'from-slate-800 via-zinc-900 to-tn-950',
    'from-teal-950 via-zinc-900 to-black',
    'from-zinc-700 via-neutral-900 to-black',
  ]
  let sum = 0
  const key = seed || 'product'
  for (let i = 0; i < key.length; i += 1) sum += key.charCodeAt(i)
  return palettes[sum % palettes.length]
}

export function ProductCard({ product, detailSlug, onAddToCart, onToggleWishlist }) {
  const reduceMotion = usePrefersReducedMotion()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, bootstrapped } = useAuth()
  const { addToCart, mutating: cartBusy } = useCart()
  const { toggleWishlist, isInWishlist, mutating: wishBusy } = useWishlist()
  const [addBusy, setAddBusy] = useState(false)
  const [heartBusy, setHeartBusy] = useState(false)

  const images = product.images ?? []
  const hero = images[0]
  const gradient = product.gradient ?? hashGradient(detailSlug ?? product.slug ?? product.id)
  const rating = product.ratings?.average ?? product.rating ?? 0
  const reviewCount = product.ratings?.count ?? product.reviewCount ?? 0
  const hasDiscount =
    typeof product.discountPrice === 'number' &&
    product.discountPrice > 0 &&
    product.discountPrice < product.price
  const effective = hasDiscount ? product.discountPrice : product.price
  const stockCount = product.stock ?? 0
  const lowStock = stockCount > 0 && stockCount <= 8
  const hint =
    product.imageHint ??
    ([product.brand, product.category].filter(Boolean).join(' · ') || 'Premium tech')

  const detailTo = detailSlug ? productPath(detailSlug) : null
  const saved = isAuthenticated && isInWishlist(product.id)
  const commerceLocked = !bootstrapped || cartBusy || wishBusy

  async function handleAddToCart() {
    if (onAddToCart) {
      onAddToCart(product.id)
      return
    }
    if (!bootstrapped) return
    if (!isAuthenticated) {
      toast.error('Sign in to add items to your cart')
      navigate(ROUTES.AUTH_LOGIN, { state: { from: location } })
      return
    }
    setAddBusy(true)
    try {
      await addToCart({ productId: product.id, quantity: 1 })
      toast.success('Added to cart')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add to cart'))
    } finally {
      setAddBusy(false)
    }
  }

  async function handleWishlist() {
    if (onToggleWishlist) {
      onToggleWishlist(product.id)
      return
    }
    if (!bootstrapped) return
    if (!isAuthenticated) {
      toast.error('Sign in to save items')
      navigate(ROUTES.AUTH_LOGIN, { state: { from: location } })
      return
    }
    setHeartBusy(true)
    try {
      await toggleWishlist(product.id)
      toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Wishlist could not be updated'))
    } finally {
      setHeartBusy(false)
    }
  }

  const mediaBlock = (
    <div className="relative overflow-hidden rounded-t-[1.35rem]">
      {hero ? (
        <ProductImage
          src={hero}
          alt={product.title}
          seed={detailSlug ?? product.slug ?? product.id}
          aspectClassName="aspect-[4/3]"
          className="rounded-none bg-zinc-100 dark:bg-tn-950"
        />
      ) : (
        <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(255,255,255,0.32),transparent_55%)]" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/5 opacity-90 transition-opacity duration-500 group-hover:opacity-100 dark:from-black/70 dark:to-transparent" />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-black/35 px-3 py-2 text-xs font-medium text-white/95 shadow-lg backdrop-blur-md dark:bg-black/45">
        {hint}
      </div>
    </div>
  )

  return (
    <motion.article
      layout
      className="group relative flex flex-col overflow-hidden rounded-[1.35rem] border border-zinc-200/80 bg-white shadow-[0_22px_50px_-24px_rgb(0_0_0/0.18)] tn-transition-base dark:border-white/[0.07] dark:bg-zinc-950/90 dark:shadow-[0_28px_64px_-28px_rgb(0_0_0/0.75)]"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -8,
              boxShadow: '0 32px 72px -28px rgb(0 0 0 / 0.45)',
            }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <div className="relative p-2 pb-0">
        {detailTo ? (
          <Link to={detailTo} className="block" aria-label={`View ${product.title}`}>
            {mediaBlock}
          </Link>
        ) : (
          mediaBlock
        )}
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          {product.featured ? (
            <span className="rounded-full border border-amber-400/30 bg-amber-500/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950 shadow-sm backdrop-blur-sm">
              Featured
            </span>
          ) : null}
          {product.trending ? (
            <span className="rounded-full border border-teal-400/25 bg-teal-600/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Trending
            </span>
          ) : null}
          {stockCount <= 0 ? (
            <span className="rounded-full border border-white/10 bg-zinc-800/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Out of stock
            </span>
          ) : lowStock ? (
            <span className="rounded-full border border-amber-300/30 bg-amber-500/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950 shadow-sm">
              Low stock
            </span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={commerceLocked || heartBusy}
          onClick={handleWishlist}
          className={`absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/35 text-white shadow-lg backdrop-blur-md tn-transition-base hover:border-teal-300/50 hover:bg-black/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-black/45 ${
            saved ? 'text-rose-300' : ''
          }`}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <IconHeart className="h-5 w-5" filled={saved} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 pt-4">
        <div className="space-y-2">
          {product.brand ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-500">
              {product.brand}
            </p>
          ) : null}
          {detailTo ? (
            <Link to={detailTo} className="block">
              <h3 className="text-[1.05rem] font-semibold leading-snug text-zinc-950 transition group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                {product.title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-[1.05rem] font-semibold leading-snug text-zinc-950 dark:text-white">{product.title}</h3>
          )}
          <RatingStars value={rating} reviewCount={reviewCount} />
        </div>
        <div className="mt-auto flex flex-wrap items-end gap-x-3 gap-y-1 border-t border-zinc-100/90 pt-4 dark:border-white/[0.06]">
          <p className="text-xl font-semibold tabular-nums tracking-tight text-zinc-950 dark:text-white">
            {formatCurrency(effective)}
          </p>
          {hasDiscount ? (
            <p className="text-sm tabular-nums text-zinc-500 line-through dark:text-zinc-500">
              {formatCurrency(product.price)}
            </p>
          ) : null}
        </div>
        <PrimaryButton
          type="button"
          size="sm"
          className="w-full justify-center shadow-none"
          disabled={commerceLocked || addBusy || stockCount <= 0}
          onClick={handleAddToCart}
        >
          <IconCart className="h-4 w-4" />
          {addBusy ? 'Adding…' : stockCount <= 0 ? 'Out of stock' : 'Add to cart'}
        </PrimaryButton>
      </div>
    </motion.article>
  )
}

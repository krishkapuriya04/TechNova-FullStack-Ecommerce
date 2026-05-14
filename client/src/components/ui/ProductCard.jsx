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
    'from-slate-800 via-slate-900 to-black',
    'from-slate-700 via-zinc-800 to-zinc-900',
    'from-sky-900 via-slate-900 to-black',
    'from-amber-600 via-orange-700 to-rose-900',
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

  return (
    <motion.article
      layout
      className="group relative flex flex-col overflow-hidden rounded-tn-xl border border-zinc-200/90 bg-white/95 shadow-tn-card tn-transition-base dark:border-white/10 dark:bg-tn-900/85"
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, boxShadow: '0 24px 60px -24px rgb(0 0 0 / 0.55)' }
      }
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="relative">
        {detailTo ? (
          <Link to={detailTo} className="block" aria-label={`View ${product.title}`}>
            <div className="relative">
              {hero ? (
                <ProductImage
                  src={hero}
                  alt={product.title}
                  seed={detailSlug ?? product.slug ?? product.id}
                  aspectClassName="aspect-[4/3]"
                  className="rounded-none"
                />
              ) : (
                <div
                  className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm dark:bg-black/35">
                {hint}
              </div>
            </div>
          </Link>
        ) : (
          <div className="relative">
            {hero ? (
              <ProductImage
                src={hero}
                alt={product.title}
                seed={product.slug ?? product.id}
                aspectClassName="aspect-[4/3]"
              />
            ) : (
              <div
                className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm dark:bg-black/35">
              {hint}
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
          {product.featured ? (
            <span className="rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950 shadow">
              Featured
            </span>
          ) : null}
          {product.trending ? (
            <span className="rounded-full bg-sky-600/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Trending
            </span>
          ) : null}
          {stockCount <= 0 ? (
            <span className="rounded-full bg-zinc-700/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
              Out of stock
            </span>
          ) : lowStock ? (
            <span className="rounded-full bg-amber-500/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-950 shadow">
              Low stock
            </span>
          ) : null}
        </div>
        <button
          type="button"
          disabled={commerceLocked || heartBusy}
          onClick={handleWishlist}
          className={`absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md tn-transition-base hover:border-white/40 hover:bg-black/45 disabled:cursor-not-allowed disabled:opacity-50 ${
            saved ? 'text-rose-300' : ''
          }`}
          aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <IconHeart className="h-5 w-5" filled={saved} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          {detailTo ? (
            <Link to={detailTo} className="block">
              <h3 className="text-base font-semibold text-zinc-900 transition hover:text-sky-700 dark:text-white dark:hover:text-sky-300">
                {product.title}
              </h3>
            </Link>
          ) : (
            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">{product.title}</h3>
          )}
          <RatingStars value={rating} reviewCount={reviewCount} />
        </div>
        <div className="mt-auto flex items-end gap-2">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(effective)}
          </p>
          {hasDiscount ? (
            <p className="text-sm text-zinc-500 line-through dark:text-zinc-500">
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

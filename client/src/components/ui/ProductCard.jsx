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

function hashGradient(seed) {
  const palettes = [
    'from-indigo-600 via-violet-600 to-fuchsia-500',
    'from-slate-700 via-zinc-800 to-zinc-900',
    'from-sky-600 via-blue-700 to-indigo-800',
    'from-amber-500 via-orange-600 to-rose-600',
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
      className="group relative flex flex-col overflow-hidden rounded-tn-xl border border-zinc-200/90 bg-white/90 shadow-tn-card tn-transition-base dark:border-white/10 dark:bg-tn-900/80"
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
            <div
              className={`relative aspect-[4/3] ${
                hero ? 'bg-zinc-100 dark:bg-tn-950' : `bg-gradient-to-br ${gradient}`
              }`}
            >
              {hero ? (
                <img
                  src={hero}
                  alt={product.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
              )}
              <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm dark:bg-black/35">
                {hint}
              </div>
            </div>
          </Link>
        ) : (
          <div
            className={`relative aspect-[4/3] ${
              hero ? 'bg-zinc-100 dark:bg-tn-950' : `bg-gradient-to-br ${gradient}`
            }`}
          >
            {hero ? (
              <img
                src={hero}
                alt={product.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
            )}
            <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm dark:bg-black/35">
              {hint}
            </div>
          </div>
        )}
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
              <h3 className="text-base font-semibold text-zinc-900 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300">
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
          disabled={commerceLocked || addBusy || (product.stock ?? 0) <= 0}
          onClick={handleAddToCart}
        >
          <IconCart className="h-4 w-4" />
          {addBusy ? 'Adding…' : (product.stock ?? 0) <= 0 ? 'Out of stock' : 'Add to cart'}
        </PrimaryButton>
      </div>
    </motion.article>
  )
}

import { motion } from 'framer-motion'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { RatingStars } from '@/components/ui/RatingStars.jsx'
import { IconHeart, IconCart } from '@/components/ui/IconSymbols.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion.js'

export function ProductCard({ product, onAddToCart, onToggleWishlist }) {
  const reduceMotion = usePrefersReducedMotion()

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
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${product.gradient} opacity-95 transition duration-300 group-hover:opacity-100`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.35),transparent_55%)]" />
        <div className="absolute inset-x-4 bottom-4 rounded-lg bg-black/25 px-3 py-2 text-xs font-medium text-white backdrop-blur-sm dark:bg-black/35">
          {product.imageHint}
        </div>
        <button
          type="button"
          onClick={() => onToggleWishlist?.(product.id)}
          className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md tn-transition-base hover:border-white/40 hover:bg-black/45"
          aria-label="Add to wishlist"
        >
          <IconHeart className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            {product.title}
          </h3>
          <RatingStars value={product.rating} reviewCount={product.reviewCount} />
        </div>
        <p className="mt-auto text-lg font-semibold text-zinc-900 dark:text-white">
          {formatCurrency(product.price)}
        </p>
        <PrimaryButton
          type="button"
          size="sm"
          className="w-full justify-center shadow-none"
          onClick={() => onAddToCart?.(product.id)}
        >
          <IconCart className="h-4 w-4" />
          Add to cart
        </PrimaryButton>
      </div>
    </motion.article>
  )
}

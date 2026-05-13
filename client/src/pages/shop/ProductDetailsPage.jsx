import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProductBySlug, fetchProducts } from '@/services/productService.js'
import { ROUTES, productPath } from '@/constants/routes.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { RatingStars } from '@/components/ui/RatingStars.jsx'
import { ProductImage } from '@/components/ui/ProductImage.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { IconHeart, IconCart } from '@/components/ui/IconSymbols.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { useAuth } from '@/hooks/useAuth.js'
import { useCart } from '@/hooks/useCart.js'
import { useWishlist } from '@/hooks/useWishlist.js'
import { recordProductView, getRecentlyViewedSnapshots } from '@/hooks/useRecentlyViewed.js'

function ReviewPreview({ product }) {
  const avg = product.ratings?.average ?? 0
  const count = product.ratings?.count ?? 0
  const snippets = [
    { title: 'Everyday upgrade', body: 'Feels flagship where it matters — display, battery, and polish.' },
    { title: 'Shipped fast', body: 'Arrived with double boxing and zero dead pixels. Setup was painless.' },
    { title: 'Worth the price', body: 'Compared three retailers — TechNova matched the best deal with cleaner UX.' },
  ]

  return (
    <div className="rounded-tn-xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-tn-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Buyer snapshot</p>
        <RatingStars value={avg} reviewCount={count} />
      </div>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
        Community average {avg.toFixed(1)}★ across {count.toLocaleString()} verified purchases on TechNova.
      </p>
      <ul className="mt-4 space-y-3">
        {snippets.map((row) => (
          <li key={row.title} className="rounded-tn border border-zinc-100 bg-zinc-50/80 p-3 text-sm dark:border-white/5 dark:bg-white/5">
            <p className="font-semibold text-zinc-900 dark:text-white">{row.title}</p>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{row.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-500">
        Preview UI only — wire to a reviews collection when you are ready for moderation workflows.
      </p>
    </div>
  )
}

export function ProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, bootstrapped } = useAuth()
  const { addToCart, mutating: cartBusy } = useCart()
  const { toggleWishlist, isInWishlist, mutating: wishlistMutating } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [addBusy, setAddBusy] = useState(false)
  const [wishActionBusy, setWishActionBusy] = useState(false)
  const [related, setRelated] = useState([])
  const [trending, setTrending] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const doc = await fetchProductBySlug(slug)
        if (active) {
          setProduct(doc)
          setActiveImage(0)
          setQty(1)
          recordProductView(doc)
        }
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Product unavailable'))
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [slug])

  useEffect(() => {
    if (!product?.id) return undefined
    let active = true

    async function loadRecos() {
      try {
        const [rel, trend] = await Promise.all([
          fetchProducts({
            category: product.category,
            excludeId: product.id,
            limit: '4',
            sort: 'rating',
          }),
          fetchProducts({
            trending: 'true',
            excludeId: product.id,
            limit: '4',
            sort: 'newest',
          }),
        ])
        if (!active) return
        setRelated(rel.products ?? [])
        setTrending(trend.products ?? [])
      } catch {
        if (active) {
          setRelated([])
          setTrending([])
        }
      }
    }

    loadRecos()
    return () => {
      active = false
    }
  }, [product?.id, product?.category])

  const recentSnapshots = product?.id ? getRecentlyViewedSnapshots(product.id) : []

  if (loading && !product) {
    return <PageLoader label="Loading product…" />
  }

  if (error || !product) {
    return (
      <div className="tn-container tn-section-y space-y-4 text-center">
        <p className="text-lg font-semibold text-zinc-900 dark:text-white">Product not found</p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{error}</p>
        <Link
          to={ROUTES.SHOP}
          className="inline-flex rounded-tn bg-indigo-500 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Back to shop
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : []
  const hero = images[activeImage]
  const effective =
    product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price
  const stock = product.stock ?? 0
  const saved = isAuthenticated && isInWishlist(product.id)
  const commerceLocked = !bootstrapped || cartBusy || wishlistMutating
  const maxQty = Math.max(1, Math.min(stock, 999))
  const safeQty = Math.min(qty, maxQty)

  async function handleAddToCart() {
    if (!bootstrapped) return
    if (!isAuthenticated) {
      toast.error('Sign in to add items to your cart')
      navigate(ROUTES.AUTH_LOGIN, { state: { from: location } })
      return
    }
    setAddBusy(true)
    try {
      await addToCart({ productId: product.id, quantity: safeQty })
      toast.success('Added to cart')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not add to cart'))
    } finally {
      setAddBusy(false)
    }
  }

  async function handleWishlist() {
    if (!bootstrapped) return
    if (!isAuthenticated) {
      toast.error('Sign in to save items')
      navigate(ROUTES.AUTH_LOGIN, { state: { from: location } })
      return
    }
    setWishActionBusy(true)
    try {
      await toggleWishlist(product.id)
      toast.success(saved ? 'Removed from wishlist' : 'Saved to wishlist')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Wishlist could not be updated'))
    } finally {
      setWishActionBusy(false)
    }
  }

  return (
    <div className="tn-section-y">
      <div className="tn-container grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-tn-2xl border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-tn-900">
            <ProductImage
              src={hero}
              alt={product.title}
              seed={product.slug}
              aspectClassName="aspect-[4/3] w-full"
            />
          </div>
          {images.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((src, index) => (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-24 overflow-hidden rounded-tn border transition ${
                    index === activeImage
                      ? 'border-indigo-500 ring-2 ring-indigo-400/40'
                      : 'border-zinc-200 hover:border-indigo-200 dark:border-white/10 dark:hover:border-indigo-400/40'
                  }`}
                  aria-label={`Show image ${index + 1}`}
                >
                  <ProductImage
                    src={src}
                    alt=""
                    seed={`${product.slug}-t-${index}`}
                    aspectClassName="aspect-[4/3] h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="rounded-tn-xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-tn-900/70">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Highlights</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
              <li>Premium fit-and-finish with retail-grade packaging.</li>
              <li>Compatible with TechNova standard warranty and returns policy.</li>
              <li>Ships from verified inventory — stock counts update in real time.</li>
            </ul>
          </div>

          <div className="rounded-tn-xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-tn-900/70">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Shipping & delivery</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Free expedited shipping on qualifying orders. Tracking hits your inbox as soon as the carrier scans the
              label — typical metro delivery is 1–3 business days after dispatch.
            </p>
          </div>

          <ReviewPreview product={product} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-tn-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-tn-card dark:border-white/10 dark:bg-tn-900/80">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
                {product.brand} · {product.category}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                {product.title}
              </h1>
              <RatingStars value={product.ratings?.average ?? 0} reviewCount={product.ratings?.count ?? 0} />
              <div className="flex flex-wrap items-end gap-3">
                <p className="text-3xl font-semibold text-zinc-900 dark:text-white">{formatCurrency(effective)}</p>
                {product.discountPrice && product.discountPrice < product.price ? (
                  <p className="text-lg text-zinc-500 line-through dark:text-zinc-500">
                    {formatCurrency(product.price)}
                  </p>
                ) : null}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {stock > 0 ? `${stock} in stock` : 'Currently out of stock'}
              </p>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Quantity
              </span>
              <div className="inline-flex items-center rounded-tn border border-zinc-200 dark:border-white/10">
                <button
                  type="button"
                  disabled={safeQty <= 1 || commerceLocked}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-100 dark:enabled:hover:bg-white/5"
                >
                  −
                </button>
                <span className="min-w-[2.5rem] px-2 py-2 text-center text-sm font-semibold tabular-nums text-zinc-900 dark:text-white">
                  {safeQty}
                </span>
                <button
                  type="button"
                  disabled={safeQty >= maxQty || stock <= 0 || commerceLocked}
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  className="px-3 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:bg-zinc-100 disabled:opacity-40 dark:text-zinc-100 dark:enabled:hover:bg-white/5"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton
                type="button"
                className="sm:flex-1"
                disabled={commerceLocked || addBusy || stock <= 0}
                onClick={handleAddToCart}
              >
                <IconCart className="h-4 w-4" />
                {addBusy ? 'Adding…' : stock <= 0 ? 'Out of stock' : 'Add to cart'}
              </PrimaryButton>
              <SecondaryButton
                type="button"
                className="sm:flex-1"
                disabled={commerceLocked || wishActionBusy}
                onClick={handleWishlist}
              >
                <IconHeart className="h-4 w-4" filled={saved} />
                {saved ? 'Saved' : 'Wishlist'}
              </SecondaryButton>
            </div>
          </div>

          <div className="rounded-tn-xl border border-zinc-200/80 bg-white/70 p-5 dark:border-white/10 dark:bg-tn-900/70">
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">Specifications</p>
            <dl className="mt-4 space-y-3">
              {product.specifications?.length ? (
                product.specifications.map((row) => (
                  <div
                    key={`${row.name}-${row.value}`}
                    className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-3 last:border-b-0 last:pb-0 dark:border-white/5"
                  >
                    <dt className="text-sm text-zinc-500 dark:text-zinc-400">{row.name}</dt>
                    <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{row.value}</dd>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Specifications will appear here.</p>
              )}
            </dl>
          </div>

          <Link to={ROUTES.SHOP} className="inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            ← Back to shop
          </Link>
        </div>
      </div>

      {related.length ? (
        <div className="tn-container mt-16 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            Related in {product.category}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} detailSlug={p.slug} />
            ))}
          </div>
        </div>
      ) : null}

      {trending.length ? (
        <div className="tn-container mt-12 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            Trending now
          </p>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} detailSlug={p.slug} />
            ))}
          </div>
        </div>
      ) : null}

      {recentSnapshots.length ? (
        <div className="tn-container mt-12 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
            Recently viewed
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentSnapshots.map((snap) => (
              <Link
                key={snap.slug}
                to={productPath(snap.slug)}
                className="flex items-center gap-3 rounded-tn-xl border border-zinc-200/80 bg-white/80 p-3 shadow-sm transition hover:border-indigo-300/60 dark:border-white/10 dark:bg-tn-900/70"
              >
                <ProductImage
                  src={snap.thumb}
                  alt={snap.title}
                  seed={snap.slug}
                  aspectClassName="h-16 w-20 shrink-0 rounded-tn"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">{snap.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Continue browsing</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

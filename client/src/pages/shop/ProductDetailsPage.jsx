import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { fetchProductBySlug } from '@/services/productService.js'
import { ROUTES } from '@/constants/routes.js'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { RatingStars } from '@/components/ui/RatingStars.jsx'
import { IconHeart, IconCart } from '@/components/ui/IconSymbols.jsx'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { getErrorMessage } from '@/utils/apiError.js'

function hashGradient(slug) {
  const palettes = [
    'from-indigo-600 via-violet-600 to-fuchsia-500',
    'from-slate-700 via-zinc-800 to-zinc-900',
    'from-sky-600 via-blue-700 to-indigo-800',
    'from-amber-500 via-orange-600 to-rose-600',
  ]
  let sum = 0
  for (let i = 0; i < slug.length; i += 1) sum += slug.charCodeAt(i)
  return palettes[sum % palettes.length]
}

export function ProductDetailsPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeImage, setActiveImage] = useState(0)

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

  const gradient = useMemo(() => hashGradient(slug ?? ''), [slug])

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
  const effective = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice
    : product.price

  return (
    <div className="tn-section-y">
      <div className="tn-container grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-4">
          <div
            className={`relative overflow-hidden rounded-tn-2xl border border-zinc-200/80 bg-zinc-100 dark:border-white/10 dark:bg-tn-900 ${
              hero ? '' : `bg-gradient-to-br ${gradient}`
            }`}
          >
            {hero ? (
              <img
                src={hero}
                alt={product.title}
                className="aspect-[4/3] w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className={`aspect-[4/3] w-full bg-gradient-to-br ${gradient}`} />
            )}
          </div>
          {images.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`h-16 w-24 overflow-hidden rounded-tn border ${
                    index === activeImage
                      ? 'border-indigo-500 ring-2 ring-indigo-400/40'
                      : 'border-zinc-200 dark:border-white/10'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">
              {product.brand} · {product.category}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              {product.title}
            </h1>
            <RatingStars
              value={product.ratings?.average ?? 0}
              reviewCount={product.ratings?.count ?? 0}
            />
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-3xl font-semibold text-zinc-900 dark:text-white">
                {formatCurrency(effective)}
              </p>
              {product.discountPrice && product.discountPrice < product.price ? (
                <p className="text-lg text-zinc-500 line-through dark:text-zinc-500">
                  {formatCurrency(product.price)}
                </p>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            {product.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PrimaryButton
              type="button"
              className="sm:flex-1"
              onClick={() => toast.success('Cart module ships next — item saved locally soon.')}
            >
              <IconCart className="h-4 w-4" />
              Add to cart
            </PrimaryButton>
            <SecondaryButton
              type="button"
              className="sm:flex-1"
              onClick={() => toast.success('Wishlist sync arrives with the wishlist service.')}
            >
              <IconHeart className="h-4 w-4" />
              Wishlist
            </SecondaryButton>
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
                    <dd className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {row.value}
                    </dd>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500">Specifications will appear here.</p>
              )}
            </dl>
          </div>

          <Link to={ROUTES.SHOP} className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}

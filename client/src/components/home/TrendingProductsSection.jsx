import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchProducts } from '@/services/productService.js'
import { sleep } from '@/utils/sleep.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { getErrorMessage } from '@/utils/apiError.js'

export function TrendingProductsSection() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        await sleep(450)
        const payload = await fetchProducts({ featured: 'true', limit: '4', sort: 'rating' })
        if (active) setProducts(payload.products)
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Unable to load featured products'))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="tn-section-y">
      <div className="tn-container">
        <SectionTitle
          eyebrow="Trending"
          title="Products shoppers love"
          subtitle="Pulled live from MongoDB — featured catalog items rotate with your merchandising rules."
        />
        {error ? (
          <p className="rounded-tn-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
            {error}
          </p>
        ) : null}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                detailSlug={product.slug}
                onAddToCart={() => toast.success('Cart service is on the roadmap.')}
                onToggleWishlist={() => toast.success('Wishlist sync arrives with auth persistence.')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

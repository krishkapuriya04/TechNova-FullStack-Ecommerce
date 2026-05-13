import { startTransition, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '@/services/productService.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ShopToolbar } from '@/components/shop/ShopToolbar.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { getErrorMessage } from '@/utils/apiError.js'
import { useDebounce } from '@/hooks/useDebounce.js'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const queryKey = useMemo(() => params.toString(), [params])

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState(() => params.get('search') ?? '')
  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    startTransition(() => {
      setSearchInput(params.get('search') ?? '')
    })
  }, [params])

  useEffect(() => {
    const current = params.get('search') ?? ''
    if (debouncedSearch === current) return
    const next = new URLSearchParams(params)
    if (debouncedSearch) {
      next.set('search', debouncedSearch)
    } else {
      next.delete('search')
    }
    next.delete('page')
    setParams(next, { replace: true })
  }, [debouncedSearch, params, setParams])

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const payload = await fetchProducts(Object.fromEntries(params.entries()))
        if (active) setData(payload)
      } catch (err) {
        if (active) setError(getErrorMessage(err, 'Unable to load products'))
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [queryKey, params])

  return (
    <div className="tn-section-y">
      <div className="tn-container space-y-10">
        <SectionTitle
          eyebrow="Catalog"
          title="Shop the collection"
          subtitle="Live inventory powered by MongoDB — filters sync to the URL for shareable searches."
        />

        <ShopToolbar searchInput={searchInput} onSearchChange={setSearchInput} />

        {loading && !data ? <ProductGridSkeleton count={8} /> : null}

        {error ? (
          <p className="rounded-tn-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </p>
        ) : null}

        {loading && data ? <PageLoader label="Updating results…" /> : null}

        {data ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                Showing{' '}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {data.products.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {data.meta.total}
                </span>{' '}
                products
              </p>
              <p>
                Page {data.meta.page} / {data.meta.pages}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} detailSlug={product.slug} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                type="button"
                disabled={data.meta.page <= 1 || loading}
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.set('page', String(data.meta.page - 1))
                  setParams(next, { replace: true })
                }}
                className="rounded-tn border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:border-indigo-400 enabled:hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-100"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={data.meta.page >= data.meta.pages || loading}
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.set('page', String(data.meta.page + 1))
                  setParams(next, { replace: true })
                }}
                className="rounded-tn border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:border-indigo-400 enabled:hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-100"
              >
                Next
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

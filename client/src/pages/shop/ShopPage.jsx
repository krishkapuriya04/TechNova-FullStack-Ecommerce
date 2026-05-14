import { startTransition, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '@/services/productService.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { ProductGridSkeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { PageLoader } from '@/components/ui/PageLoader.jsx'
import { ShopToolbar } from '@/components/shop/ShopToolbar.jsx'
import { ShopCategoryNav } from '@/components/shop/ShopCategoryNav.jsx'
import { ProductCard } from '@/components/ui/ProductCard.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { getErrorMessage } from '@/utils/apiError.js'
import { useDebounce } from '@/hooks/useDebounce.js'
import { pushRecentSearch } from '@/hooks/useRecentSearches.js'
import { ROUTES } from '@/constants/routes.js'
import { Seo } from '@/components/seo/Seo.jsx'

export function ShopPage() {
  const [params, setParams] = useSearchParams()
  const queryKey = useMemo(() => params.toString(), [params])

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchInput, setSearchInput] = useState(() => params.get('search') ?? '')
  const debouncedSearch = useDebounce(searchInput, 400)

  const searchInUrl = params.get('search') ?? ''

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
    const s = searchInUrl.trim()
    if (s.length >= 2) pushRecentSearch(s)
  }, [searchInUrl])

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

  const emptyResults = Boolean(data) && !loading && data.meta.total === 0

  return (
    <>
      <Seo
        title="Shop catalog"
        canonicalPath={ROUTES.SHOP}
        description="Browse smartphones, laptops, gaming gear, audio, and accessories with live inventory and filters."
      />
      <div className="tn-section-y bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-tn-void dark:via-tn-950 dark:to-slate-950">
      <div className="tn-container space-y-8">
        <SectionTitle
          eyebrow="Catalog"
          title="Shop the collection"
          subtitle="Filters sync to the URL for shareable searches — sticky controls keep context while you scroll."
        />

        <ShopToolbar searchInput={searchInput} onSearchChange={setSearchInput} />

        <div className="grid gap-10 xl:grid-cols-[15rem_minmax(0,1fr)] xl:items-start">
          <aside className="hidden xl:block">
            <div className="sticky top-24 rounded-tn-2xl border border-zinc-200/90 bg-white/90 p-5 shadow-tn-card backdrop-blur-md dark:border-white/10 dark:bg-slate-950/60">
              <ShopCategoryNav />
            </div>
          </aside>

          <div className="space-y-8">
            {loading && !data ? <ProductGridSkeleton count={8} /> : null}

            {error ? (
              <p className="rounded-tn-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-200">
                {error}
              </p>
            ) : null}

            {loading && data ? <PageLoader label="Updating results…" /> : null}

            {emptyResults ? (
              <div className="rounded-tn-2xl border border-dashed border-zinc-300/80 bg-white/70 px-8 py-16 text-center dark:border-white/15 dark:bg-tn-900/50">
                <p className="text-lg font-semibold text-zinc-900 dark:text-white">No matches for this search</p>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  Try clearing filters, browsing categories from the sidebar, or searching for a brand like Apple or
                  Samsung.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      setParams(new URLSearchParams(), { replace: true })
                    }}
                  >
                    Reset catalog
                  </PrimaryButton>
                  <PrimaryButton to={ROUTES.HOME}>Back to homepage</PrimaryButton>
                </div>
              </div>
            ) : null}

            {data && !emptyResults ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>
                    Showing{' '}
                    <span className="font-semibold text-zinc-900 dark:text-white">{data.products.length}</span> of{' '}
                    <span className="font-semibold text-zinc-900 dark:text-white">{data.meta.total}</span> products
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
                    className="rounded-tn border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:border-sky-400 enabled:hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-100"
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
                    className="rounded-tn border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition enabled:hover:border-sky-400 enabled:hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-zinc-100"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

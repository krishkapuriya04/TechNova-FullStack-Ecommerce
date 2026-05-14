import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { SHOP_CATEGORIES, SHOP_SEARCH_SUGGESTIONS } from '@/constants/shopTaxonomy.js'
import { getRecentSearches } from '@/hooks/useRecentSearches.js'

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

export function ShopToolbar({ searchInput, onSearchChange }) {
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [suggestOpen, setSuggestOpen] = useState(false)
  const searchWrapRef = useRef(null)

  const recent = getRecentSearches()

  useEffect(() => {
    function onDocClick(e) {
      if (!searchWrapRef.current?.contains(e.target)) setSuggestOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  function patch(updates) {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value == null) {
        next.delete(key)
      } else {
        next.set(key, String(value))
      }
    })
    if (!('page' in updates)) {
      next.delete('page')
    }
    setParams(next, { replace: true })
  }

  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'newest'
  const featured = params.get('featured') ?? ''
  const trending = params.get('trending') ?? ''
  const minPrice = params.get('minPrice') ?? ''
  const maxPrice = params.get('maxPrice') ?? ''

  const suggestions = useMemo(() => {
    const q = searchInput.trim().toLowerCase()
    const pool = SHOP_SEARCH_SUGGESTIONS
    if (!q) return pool.slice(0, 10)
    return pool.filter((s) => s.toLowerCase().includes(q)).slice(0, 12)
  }, [searchInput])

  const chips = useMemo(() => {
    const out = []
    if (category) out.push({ key: 'category', label: `Category: ${category}`, clear: { category: '' } })
    if (featured === 'true') out.push({ key: 'featured', label: 'Featured', clear: { featured: '' } })
    if (trending === 'true') out.push({ key: 'trending', label: 'Trending', clear: { trending: '' } })
    if (minPrice) out.push({ key: 'min', label: `Min $${minPrice}`, clear: { minPrice: '' } })
    if (maxPrice) out.push({ key: 'max', label: `Max $${maxPrice}`, clear: { maxPrice: '' } })
    if (sort && sort !== 'newest') {
      const label = SORTS.find((s) => s.value === sort)?.label ?? sort
      out.push({ key: 'sort', label, clear: { sort: 'newest' } })
    }
    return out
  }, [category, featured, trending, minPrice, maxPrice, sort])

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 border-b border-zinc-200/60 bg-white/70 px-4 py-3 shadow-[0_8px_30px_-18px_rgb(0_0_0/0.12)] backdrop-blur-2xl dark:border-white/[0.05] dark:bg-black/50">
        <div className="tn-container flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Refine results
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-4 py-2 text-xs font-semibold text-zinc-800 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/80 dark:text-zinc-100 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="shop-filter-drawer"
          >
            Filters & sort
          </button>
        </div>
        {chips.length ? (
          <div className="tn-container mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => patch(chip.clear)}
                className="inline-flex items-center gap-1 rounded-full border border-teal-200/80 bg-teal-50/90 px-3 py-1 text-xs font-semibold text-teal-950 transition hover:border-teal-300 dark:border-teal-500/35 dark:bg-teal-500/10 dark:text-teal-50"
              >
                {chip.label}
                <span aria-hidden className="text-teal-600 dark:text-teal-300">
                  ×
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-tn-3xl border border-zinc-200/70 bg-white/70 p-5 shadow-tn-card backdrop-blur-2xl dark:border-white/[0.07] dark:bg-zinc-950/50 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="relative lg:col-span-5" ref={searchWrapRef}>
            <label
              htmlFor="shop-search"
              className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
            >
              Search
            </label>
            <input
              id="shop-search"
              value={searchInput}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              autoComplete="off"
              placeholder="Search products, brands, categories…"
              className="mt-2 w-full rounded-tn-xl border border-zinc-200/90 bg-white/95 px-4 py-3 text-sm text-zinc-900 outline-none ring-teal-500/25 focus:border-teal-400/80 focus:ring-2 dark:border-white/10 dark:bg-zinc-950/90 dark:text-zinc-100"
            />
            {suggestOpen ? (
              <div className="absolute left-0 right-0 z-40 mt-2 max-h-72 overflow-auto rounded-tn-xl border border-zinc-200/80 bg-white/95 p-2 text-sm shadow-tn-soft backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95">
                {recent.length ? (
                  <div className="mb-2">
                    <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                      Recent
                    </p>
                    <ul>
                      {recent.slice(0, 6).map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            className="w-full rounded-tn px-2 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-white/5"
                            onClick={() => {
                              onSearchChange(term)
                              patch({ search: term })
                              setSuggestOpen(false)
                            }}
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                  Suggestions
                </p>
                <ul>
                  {suggestions.map((term) => (
                    <li key={term}>
                      <button
                        type="button"
                        className="w-full rounded-tn px-2 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-white/5"
                        onClick={() => {
                          onSearchChange(term)
                          patch({ search: term })
                          setSuggestOpen(false)
                        }}
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="hidden gap-3 lg:col-span-7 lg:grid lg:grid-cols-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Category
              </label>
              <select
                value={category || 'All'}
                onChange={(e) => {
                  const value = e.target.value
                  patch({ category: value === 'All' ? '' : value })
                }}
                className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
              >
                <option value="All">All</option>
                {SHOP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => patch({ sort: e.target.value })}
                className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
              >
                {SORTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Min price
              </label>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => patch({ minPrice: e.target.value })}
                className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Max price
              </label>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => patch({ maxPrice: e.target.value })}
                className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 hidden flex-wrap items-center gap-3 lg:flex">
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={featured === 'true'}
              onChange={(e) => patch({ featured: e.target.checked ? 'true' : '' })}
              className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
            />
            Featured only
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
            <input
              type="checkbox"
              checked={trending === 'true'}
              onChange={(e) => patch({ trending: e.target.checked ? 'true' : '' })}
              className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500"
            />
            Trending only
          </label>
          <SecondaryButton
            type="button"
            size="sm"
            onClick={() => {
              onSearchChange('')
              setParams(new URLSearchParams(), { replace: true })
            }}
          >
            Reset filters
          </SecondaryButton>
          <PrimaryButton type="button" size="sm" onClick={() => patch({ featured: 'true', sort: 'rating' })}>
            Staff picks
          </PrimaryButton>
          <SecondaryButton type="button" size="sm" onClick={() => patch({ trending: 'true', sort: 'newest' })}>
            Trending picks
          </SecondaryButton>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden" id="shop-filter-drawer" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close filters"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border border-zinc-200/80 bg-white/98 p-5 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-950/96">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Filters</p>
              <button
                type="button"
                className="text-sm font-semibold text-teal-600 dark:text-teal-300"
                onClick={() => setDrawerOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="grid gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Category</label>
                <select
                  value={category || 'All'}
                  onChange={(e) => {
                    const value = e.target.value
                    patch({ category: value === 'All' ? '' : value })
                  }}
                  className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-black/30 dark:text-white"
                >
                  <option value="All">All</option>
                  {SHOP_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => patch({ sort: e.target.value })}
                  className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm dark:border-white/10 dark:bg-black/30 dark:text-white"
                >
                  {SORTS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Min</label>
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => patch({ minPrice: e.target.value })}
                    className="mt-2 w-full rounded-tn border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/30 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Max</label>
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => patch({ maxPrice: e.target.value })}
                    className="mt-2 w-full rounded-tn border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/30 dark:text-white"
                  />
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-100">
                <input
                  type="checkbox"
                  checked={featured === 'true'}
                  onChange={(e) => patch({ featured: e.target.checked ? 'true' : '' })}
                  className="h-4 w-4 rounded border-zinc-300 text-teal-600"
                />
                Featured only
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-zinc-800 dark:text-zinc-100">
                <input
                  type="checkbox"
                  checked={trending === 'true'}
                  onChange={(e) => patch({ trending: e.target.checked ? 'true' : '' })}
                  className="h-4 w-4 rounded border-zinc-300 text-teal-600"
                />
                Trending only
              </label>
              <SecondaryButton
                type="button"
                className="w-full justify-center"
                onClick={() => {
                  onSearchChange('')
                  setParams(new URLSearchParams(), { replace: true })
                  setDrawerOpen(false)
                }}
              >
                Reset all
              </SecondaryButton>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

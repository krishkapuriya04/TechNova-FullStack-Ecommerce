import { useSearchParams } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'

const CATEGORIES = ['All', 'Laptops', 'Audio', 'Wearables', 'Smart Home', 'Accessories']

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
]

export function ShopToolbar({ searchInput, onSearchChange }) {
  const [params, setParams] = useSearchParams()

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

  const category = params.get('category') ?? 'All'
  const sort = params.get('sort') ?? 'newest'
  const featured = params.get('featured') ?? ''
  const minPrice = params.get('minPrice') ?? ''
  const maxPrice = params.get('maxPrice') ?? ''

  return (
    <div className="tn-surface rounded-tn-2xl p-5 sm:p-6">
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-5">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Search
          </label>
          <input
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products, brands, categories…"
            className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-indigo-500/30 focus:border-indigo-400 focus:ring-2 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                const value = e.target.value
                patch({ category: value === 'All' ? '' : value })
              }}
              className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 dark:border-white/10 dark:bg-tn-900 dark:text-zinc-100"
            >
              {CATEGORIES.map((c) => (
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

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-200">
          <input
            type="checkbox"
            checked={featured === 'true'}
            onChange={(e) => patch({ featured: e.target.checked ? 'true' : '' })}
            className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          Featured only
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
      </div>
    </div>
  )
}

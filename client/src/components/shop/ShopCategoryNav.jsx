import { Link, useSearchParams } from 'react-router-dom'
import { SHOP_CATEGORIES } from '@/constants/shopTaxonomy.js'
import { ROUTES } from '@/constants/routes.js'

function mergeSearch(params, mutator) {
  const next = new URLSearchParams(params)
  mutator(next)
  next.delete('page')
  const qs = next.toString()
  return qs ? `${ROUTES.SHOP}?${qs}` : ROUTES.SHOP
}

export function ShopCategoryNav({ className = '' }) {
  const [params] = useSearchParams()
  const current = params.get('category') ?? ''

  return (
    <nav className={className} aria-label="Product categories">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        Categories
      </p>
      <ul className="space-y-1">
        <li>
          <Link
            to={mergeSearch(params, (next) => {
              next.delete('category')
            })}
            className={`block rounded-tn px-3 py-2 text-sm font-medium transition ${
              !current
                ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5'
            }`}
          >
            All products
          </Link>
        </li>
        {SHOP_CATEGORIES.map((cat) => {
          const active = current.toLowerCase() === cat.toLowerCase()
          return (
            <li key={cat}>
              <Link
                to={mergeSearch(params, (next) => {
                  next.set('category', cat)
                })}
                className={`block rounded-tn px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5'
                }`}
              >
                {cat}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

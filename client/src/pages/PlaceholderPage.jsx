import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'

/** Minimal placeholder for routes you have not built yet (shop, cart, auth, etc.). */
export function PlaceholderPage() {
  const location = useLocation()

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Coming soon</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-900 capitalize dark:text-white">
        {location.pathname.replace(/\//g, ' ').trim() || 'Page'}
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        This section is reserved for a future feature. Keep routes in{' '}
        <code className="rounded bg-zinc-100 px-1 py-0.5 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
          constants/routes.js
        </code>{' '}
        in sync as you add modules.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 inline-block rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:border-zinc-300 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-zinc-600"
      >
        Home
      </Link>
    </div>
  )
}

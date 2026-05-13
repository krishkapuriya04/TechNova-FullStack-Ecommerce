import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        This route is not implemented yet, or the URL may be wrong.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
      >
        Back home
      </Link>
    </div>
  )
}

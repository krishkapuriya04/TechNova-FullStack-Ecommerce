import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { Seo } from '@/components/seo/Seo.jsx'

export function NotFoundPage() {
  return (
    <>
      <Seo title="Page not found" noindex description="The page you requested does not exist on TechNova." />
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <p className="text-sm font-semibold text-sky-600 dark:text-sky-300">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
        Page not found
      </h1>
      <p className="mt-3 text-zinc-600 dark:text-zinc-400">
        This route is not implemented yet, or the URL may be wrong.
      </p>
      <Link
        to={ROUTES.HOME}
        className="mt-8 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400"
      >
        Back home
      </Link>
    </div>
    </>
  )
}

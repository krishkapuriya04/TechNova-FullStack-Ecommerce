import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { Link } from 'react-router-dom'

export function ProfilePage() {
  const { user, logout } = useAuth()

  return (
    <div className="tn-container tn-section-y">
      <SectionTitle
        eyebrow="Account"
        title="Profile"
        subtitle="JWT-backed session — extend with addresses, payment methods, and order stats."
      />

      <div className="tn-surface max-w-xl rounded-tn-2xl p-6">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Name</dt>
            <dd className="text-base font-semibold text-zinc-900 dark:text-white">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Email</dt>
            <dd className="text-base font-semibold text-zinc-900 dark:text-white">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-zinc-500">Role</dt>
            <dd className="text-base font-semibold capitalize text-zinc-900 dark:text-white">
              {user?.role}
            </dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-3">
          <SecondaryButton to={ROUTES.ORDERS}>View orders</SecondaryButton>
          <PrimaryButton type="button" onClick={logout}>
            Sign out
          </PrimaryButton>
        </div>
        <p className="mt-4 text-xs text-zinc-500">
          Need admin tooling?{' '}
          <Link className="font-semibold text-sky-600 dark:text-sky-300" to={ROUTES.ADMIN}>
            Open admin placeholder
          </Link>
        </p>
      </div>
    </div>
  )
}

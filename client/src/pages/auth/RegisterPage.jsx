import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useAuth } from '@/hooks/useAuth.js'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { Seo } from '@/components/seo/Seo.jsx'

export function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await register(form, { redirectTo: ROUTES.HOME })
    } catch {
      // handled in context
    }
  }

  return (
    <>
      <Seo title="Create account" canonicalPath={ROUTES.AUTH_REGISTER} noindex description="Create a TechNova shopper account." />
      <div className="w-full rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-8 shadow-tn-soft backdrop-blur dark:border-white/10 dark:bg-tn-900/80">
      <div className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-300">
          Join TechNova
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Create your account</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Password must be 8+ chars with upper, lower, and number (server enforced).
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300" htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-sky-500/30 focus:border-sky-400 focus:ring-2 dark:border-white/10 dark:bg-tn-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-300" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-sky-500/30 focus:border-sky-400 focus:ring-2 dark:border-white/10 dark:bg-tn-950 dark:text-zinc-100"
          />
        </div>
        <div>
          <label
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="mt-2 w-full rounded-tn border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-sky-500/30 focus:border-sky-400 focus:ring-2 dark:border-white/10 dark:bg-tn-950 dark:text-zinc-100"
          />
        </div>
        <PrimaryButton type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{' '}
        <Link className="font-semibold text-sky-600 dark:text-sky-300" to={ROUTES.AUTH_LOGIN}>
          Sign in
        </Link>
      </p>
      <div className="mt-4 text-center">
        <SecondaryButton type="button" onClick={() => navigate(ROUTES.HOME)}>
          Continue browsing
        </SecondaryButton>
      </div>
    </div>
    </>
  )
}

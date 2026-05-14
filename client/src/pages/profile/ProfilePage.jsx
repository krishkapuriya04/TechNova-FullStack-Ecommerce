import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { useWishlist } from '@/hooks/useWishlist.js'
import { ROUTES } from '@/constants/routes.js'
import * as orderService from '@/services/orderService.js'

const emptyAddress = {
  label: 'Home',
  fullName: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: '',
  phone: '',
}

export function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const { products: wishlistProducts } = useWishlist()
  const [name, setName] = useState(user?.name ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [addresses, setAddresses] = useState(user?.savedAddresses ?? [])
  const [draft, setDraft] = useState(emptyAddress)
  const [ordersCount, setOrdersCount] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const h = window.setTimeout(() => {
      setName(user?.name ?? '')
      setAvatar(user?.avatar ?? '')
      setAddresses(user?.savedAddresses ?? [])
    }, 0)
    return () => window.clearTimeout(h)
  }, [user])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const rows = await orderService.fetchMyOrders()
        if (active) setOrdersCount(rows.length)
      } catch {
        if (active) setOrdersCount(null)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const persist = useCallback(async () => {
    setSaving(true)
    try {
      const cleaned = addresses.map(({ label, fullName, line1, line2, city, postalCode, country, phone }) => ({
        label,
        fullName,
        line1,
        line2: line2 || '',
        city,
        postalCode,
        country,
        phone,
      }))
      await updateProfile({ name: name.trim(), avatar: avatar.trim(), savedAddresses: cleaned })
    } catch {
      /* toast handled in provider */
    } finally {
      setSaving(false)
    }
  }, [updateProfile, name, avatar, addresses])

  function addAddress() {
    if (!draft.fullName.trim() || !draft.line1.trim()) {
      toast.error('Name and line 1 are required')
      return
    }
    const clientKey =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `k-${Date.now()}`
    setAddresses((prev) => [...prev, { ...draft, clientKey }])
    setDraft(emptyAddress)
  }

  function removeAddress(key) {
    setAddresses((prev) => prev.filter((a) => (a.clientKey ?? a.id) !== key))
  }

  return (
    <div className="tn-container tn-section-y">
      <SectionTitle
        eyebrow="Account"
        title="Profile"
        subtitle="Identity, avatar, saved shipping templates, and a snapshot of commerce activity."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-6 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-tn-900/85">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Basics</h2>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Display name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-tn border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Avatar URL
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="mt-2 w-full rounded-tn border border-zinc-200 px-3 py-2 text-sm dark:border-white/10 dark:bg-tn-950"
              placeholder="https://…"
            />
          </label>
          {avatar ? (
            <img src={avatar} alt="" className="h-20 w-20 rounded-full border border-zinc-200 object-cover dark:border-white/10" />
          ) : null}
          <PrimaryButton type="button" className="justify-center sm:w-auto" disabled={saving} onClick={persist}>
            {saving ? 'Saving…' : 'Save profile'}
          </PrimaryButton>
        </div>

        <div className="space-y-4 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-tn-900/85">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Activity snapshot</h2>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between rounded-tn border border-zinc-100 px-3 py-2 dark:border-white/5">
              <dt className="text-zinc-500">Orders</dt>
              <dd className="font-semibold text-zinc-900 dark:text-white">{ordersCount ?? '—'}</dd>
            </div>
            <div className="flex justify-between rounded-tn border border-zinc-100 px-3 py-2 dark:border-white/5">
              <dt className="text-zinc-500">Wishlist</dt>
              <dd className="font-semibold text-zinc-900 dark:text-white">{wishlistProducts.length}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            <SecondaryButton to={ROUTES.ORDERS}>Orders</SecondaryButton>
            <SecondaryButton to={ROUTES.WISHLIST}>Wishlist</SecondaryButton>
            {user?.role === 'admin' ? <SecondaryButton to={ROUTES.ADMIN}>Admin</SecondaryButton> : null}
          </div>
          <PrimaryButton type="button" onClick={logout} className="w-full justify-center sm:w-auto">
            Sign out
          </PrimaryButton>
        </div>
      </div>

      <div className="mt-10 rounded-tn-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-sm dark:border-white/10 dark:bg-tn-900/85">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Saved addresses</h2>
        <p className="mt-1 text-sm text-zinc-500">Used at checkout — up to ten entries.</p>
        <ul className="mt-4 space-y-3">
          {addresses.map((a) => (
            <li
              key={a.clientKey ?? a.id}
              className="flex flex-wrap items-start justify-between gap-3 rounded-tn border border-zinc-100 p-3 text-sm dark:border-white/5"
            >
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white">{a.label}</p>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {a.fullName}
                  <br />
                  {a.line1}
                  {a.line2 ? <>, {a.line2}</> : null}
                  <br />
                  {a.city}, {a.postalCode} · {a.country}
                  <br />
                  {a.phone}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-rose-600 dark:text-rose-300"
                onClick={() => removeAddress(a.clientKey ?? a.id)}
              >
                Remove
              </button>
            </li>
          ))}
          {addresses.length === 0 ? <li className="text-sm text-zinc-500">No saved addresses yet.</li> : null}
        </ul>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Label
            <input
              value={draft.label}
              onChange={(e) => setDraft((d) => ({ ...d, label: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Full name
            <input
              value={draft.fullName}
              onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 sm:col-span-2">
            Line 1
            <input
              value={draft.line1}
              onChange={(e) => setDraft((d) => ({ ...d, line1: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300 sm:col-span-2">
            Line 2
            <input
              value={draft.line2}
              onChange={(e) => setDraft((d) => ({ ...d, line2: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            City
            <input
              value={draft.city}
              onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Postal
            <input
              value={draft.postalCode}
              onChange={(e) => setDraft((d) => ({ ...d, postalCode: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Country
            <input
              value={draft.country}
              onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Phone
            <input
              value={draft.phone}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              className="mt-1 w-full rounded-tn border border-zinc-200 px-2 py-1.5 text-sm dark:border-white/10 dark:bg-tn-950"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <SecondaryButton type="button" onClick={addAddress}>
            Add address
          </SecondaryButton>
          <PrimaryButton type="button" size="sm" className="justify-center" disabled={saving} onClick={persist}>
            Save addresses
          </PrimaryButton>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-zinc-500">
        Need storefront help? <Link className="font-semibold text-sky-700 dark:text-sky-300" to={ROUTES.FAQ}>FAQ</Link> ·{' '}
        <Link className="font-semibold text-sky-700 dark:text-sky-300" to={ROUTES.CONTACT}>
          Contact
        </Link>
      </p>
    </div>
  )
}

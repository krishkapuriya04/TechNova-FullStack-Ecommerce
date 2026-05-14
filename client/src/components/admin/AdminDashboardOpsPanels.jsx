import { Link } from 'react-router-dom'
import { ROUTES, productPath } from '@/constants/routes.js'
import { formatOrderMoney, formatShortDate } from '@/utils/ecommerce.js'

export function AdminDashboardStatRow({ data }) {
  if (!data?.inventory) return null
  const inv = data.inventory
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <div className="rounded-tn-2xl border border-amber-500/25 bg-amber-500/10 p-4 backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">Low stock SKUs</p>
        <p className="mt-1 text-2xl font-bold text-white">{inv.lowStock}</p>
        <p className="mt-1 text-xs text-amber-100/80">Threshold ≤ {inv.lowStockThreshold} units</p>
      </div>
      <div className="rounded-tn-2xl border border-rose-500/25 bg-rose-500/10 p-4 backdrop-blur-md">
        <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">Out of stock</p>
        <p className="mt-1 text-2xl font-bold text-white">{inv.outOfStock}</p>
        <p className="mt-1 text-xs text-rose-100/80">Needs replenishment or unpublish</p>
      </div>
      <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:col-span-2 xl:col-span-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Catalog SKUs</p>
        <p className="mt-1 text-2xl font-bold text-white">{inv.totalSkus}</p>
        <Link to={ROUTES.ADMIN_PRODUCTS} className="mt-2 inline-block text-xs font-semibold text-sky-300 hover:text-sky-200">
          Open inventory →
        </Link>
      </div>
    </div>
  )
}

export function AdminDashboardQuickActions() {
  const actions = [
    { to: ROUTES.ADMIN_PRODUCTS, label: 'Create product', hint: 'Opens catalog with new SKU flow' },
    { to: ROUTES.ADMIN_ORDERS, label: 'Manage orders', hint: 'Fulfillment & payment flags' },
    { to: ROUTES.ADMIN_USERS, label: 'Manage users', hint: 'Roles and access' },
    { to: ROUTES.ADMIN_COUPONS, label: 'Coupons', hint: 'Campaign codes & expiry' },
  ]
  return (
    <div className="mt-10 rounded-tn-2xl border border-white/10 bg-gradient-to-br from-sky-500/10 via-white/5 to-transparent p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Quick actions</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="rounded-tn border border-white/10 bg-black/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-sky-400/40 hover:bg-black/35"
          >
            <span className="block">{a.label}</span>
            <span className="mt-1 block text-xs font-normal text-zinc-400">{a.hint}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function AdminDashboardActivity({ activities }) {
  const rows = activities ?? []
  return (
    <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Recent activity</h2>
      <p className="mt-1 text-xs text-zinc-500">Merged stream of orders and new accounts.</p>
      <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {rows.map((a) => (
          <li key={a.id} className="flex gap-3 rounded-tn border border-white/5 bg-black/20 px-3 py-2 text-sm">
            <span
              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                a.type === 'order' ? 'bg-sky-400' : 'bg-emerald-400'
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white">{a.label}</p>
              <p className="truncate text-xs text-zinc-400">{a.detail}</p>
            </div>
            <time className="shrink-0 text-[10px] uppercase tracking-wide text-zinc-500">{formatShortDate(a.at)}</time>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="py-6 text-center text-sm text-zinc-500">No activity yet.</p> : null}
    </div>
  )
}

export function AdminDashboardTopSelling({ topSelling }) {
  const rows = topSelling ?? []
  return (
    <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Top selling</h2>
      <p className="mt-1 text-xs text-zinc-500">Units sold across non-cancelled orders.</p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[20rem] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
              <th className="pb-2 pr-2">Product</th>
              <th className="pb-2 pr-2">Units</th>
              <th className="pb-2">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.slug} className="text-zinc-300">
                <td className="py-2 pr-2">
                  <Link to={productPath(r.slug)} className="font-medium text-white hover:text-sky-200" target="_blank" rel="noreferrer">
                    {r.title}
                  </Link>
                </td>
                <td className="py-2 pr-2 tabular-nums">{r.unitsSold}</td>
                <td className="py-2 tabular-nums font-semibold text-white">{formatOrderMoney(r.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="py-6 text-center text-sm text-zinc-500">No sales data yet.</p> : null}
      </div>
    </div>
  )
}

export function AdminDashboardTrending({ trendingSnapshot }) {
  const rows = trendingSnapshot ?? []
  return (
    <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-white">Trending catalog</h2>
      <p className="mt-1 text-xs text-zinc-500">Editorial trending flag with rating signal.</p>
      <ul className="mt-4 space-y-2">
        {rows.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 rounded-tn border border-white/5 bg-black/15 px-3 py-2 text-sm">
            <div className="min-w-0">
              <Link to={productPath(p.slug)} className="truncate font-medium text-white hover:text-sky-200" target="_blank" rel="noreferrer">
                {p.title}
              </Link>
              <p className="text-xs text-zinc-500">
                {p.brand} · stock {p.stock}
              </p>
            </div>
            <span className="shrink-0 text-xs text-amber-200">{p.ratings?.average?.toFixed?.(1) ?? '—'}★</span>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="py-6 text-center text-sm text-zinc-500">No trending SKUs flagged.</p> : null}
    </div>
  )
}

export function AdminDashboardLowStockList({ lowStockProducts }) {
  const rows = lowStockProducts ?? []
  return (
    <div className="rounded-tn-2xl border border-amber-500/20 bg-amber-950/20 p-5 backdrop-blur-md">
      <h2 className="text-sm font-semibold text-amber-100">Stock alerts</h2>
      <ul className="mt-3 space-y-2">
        {rows.map((p) => (
          <li key={p.id ?? p.slug} className="flex items-center justify-between gap-2 text-sm text-amber-50">
            <Link to={productPath(p.slug)} className="min-w-0 truncate font-medium hover:text-white" target="_blank" rel="noreferrer">
              {p.title}
            </Link>
            <span className="shrink-0 rounded-full bg-amber-500/30 px-2 py-0.5 text-xs font-bold tabular-nums text-amber-100">
              {p.stock} left
            </span>
          </li>
        ))}
      </ul>
      {rows.length === 0 ? <p className="py-4 text-sm text-amber-200/70">All SKUs above alert threshold.</p> : null}
      <Link to={ROUTES.ADMIN_PRODUCTS} className="mt-3 inline-block text-xs font-semibold text-amber-200 hover:text-white">
        Update stock in catalog →
      </Link>
    </div>
  )
}

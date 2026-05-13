import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AdminPageHeader, AdminStatCard } from '@/components/admin/AdminPageHeader.jsx'
import { AdminRevenueChart } from '@/components/admin/charts/AdminRevenueChart.jsx'
import { AdminOrdersBarChart } from '@/components/admin/charts/AdminOrdersBarChart.jsx'
import { AdminSalesOverviewChart } from '@/components/admin/charts/AdminSalesOverviewChart.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { ROUTES } from '@/constants/routes.js'
import * as adminService from '@/services/adminService.js'
import { formatOrderMoney, formatShortDate } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminAnalyticsOverview()
      setData(payload)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load analytics'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(h)
  }, [load])

  const chartMonthly =
    data?.monthlySales?.map((row) => ({
      label: row.label,
      revenue: row.revenue,
      orders: row.orders,
    })) ?? []

  const trendData =
    data?.ordersTrend?.map((row) => ({
      key: row.key?.slice(5) ?? row.key,
      revenue: row.revenue,
      orders: row.orders,
    })) ?? []

  return (
    <div>
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        subtitle="Live metrics from MongoDB — revenue excludes cancelled orders."
      />

      {loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-tn-2xl" />
          ))}
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard label="Total revenue" value={formatOrderMoney(data.totalRevenue)} />
            <AdminStatCard label="Orders" value={String(data.totalOrders)} hint="All-time count" />
            <AdminStatCard label="Products" value={String(data.totalProducts)} />
            <AdminStatCard label="Users" value={String(data.totalUsers)} />
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h2 className="text-sm font-semibold text-white">Revenue (12 months)</h2>
              <div className="mt-4">
                <AdminRevenueChart data={chartMonthly} />
              </div>
            </div>
            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h2 className="text-sm font-semibold text-white">Orders per month</h2>
              <div className="mt-4">
                <AdminOrdersBarChart data={chartMonthly} />
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h2 className="text-sm font-semibold text-white">Sales overview (14 days)</h2>
            <p className="mt-1 text-xs text-zinc-500">Dual axis: revenue vs order count by day.</p>
            <div className="mt-4">
              <AdminSalesOverviewChart data={trendData} />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h2 className="text-sm font-semibold text-white">Recent orders</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                      <th className="pb-2 pr-3">Customer</th>
                      <th className="pb-2 pr-3">Total</th>
                      <th className="pb-2 pr-3">Status</th>
                      <th className="pb-2">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(data.latestOrders ?? []).map((o) => (
                      <tr key={o.id} className="text-zinc-300">
                        <td className="py-2 pr-3">
                          <p className="font-medium text-white">{o.customerName}</p>
                          <p className="text-xs text-zinc-500">{o.customerEmail}</p>
                        </td>
                        <td className="py-2 pr-3 font-semibold text-white">{formatOrderMoney(o.totalPrice)}</td>
                        <td className="py-2 pr-3 capitalize">{o.orderStatus}</td>
                        <td className="py-2 text-xs text-zinc-500">{formatShortDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.latestOrders?.length === 0 ? (
                  <p className="py-6 text-center text-sm text-zinc-500">No orders yet.</p>
                ) : null}
              </div>
              <Link
                to={ROUTES.ADMIN_ORDERS}
                className="mt-4 inline-block text-xs font-semibold text-indigo-300 hover:text-indigo-200"
              >
                Manage orders →
              </Link>
            </div>

            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h2 className="text-sm font-semibold text-white">Recent users</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[24rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                      <th className="pb-2 pr-3">Name</th>
                      <th className="pb-2 pr-3">Role</th>
                      <th className="pb-2">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(data.latestUsers ?? []).map((u) => (
                      <tr key={u.id} className="text-zinc-300">
                        <td className="py-2 pr-3">
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-xs text-zinc-500">{u.email}</p>
                        </td>
                        <td className="py-2 pr-3 capitalize">{u.role}</td>
                        <td className="py-2 text-xs text-zinc-500">{formatShortDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.latestUsers?.length === 0 ? (
                  <p className="py-6 text-center text-sm text-zinc-500">No users yet.</p>
                ) : null}
              </div>
              <Link
                to={ROUTES.ADMIN_USERS}
                className="mt-4 inline-block text-xs font-semibold text-indigo-300 hover:text-indigo-200"
              >
                Manage users →
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

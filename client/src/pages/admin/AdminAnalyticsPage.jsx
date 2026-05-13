import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminPageHeader, AdminStatCard } from '@/components/admin/AdminPageHeader.jsx'
import { AdminRevenueChart } from '@/components/admin/charts/AdminRevenueChart.jsx'
import { AdminOrdersBarChart } from '@/components/admin/charts/AdminOrdersBarChart.jsx'
import { AdminSalesOverviewChart } from '@/components/admin/charts/AdminSalesOverviewChart.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import * as adminService from '@/services/adminService.js'
import { formatOrderMoney } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function AdminAnalyticsPage() {
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
        eyebrow="Insights"
        title="Analytics"
        subtitle="Aggregation-backed metrics — ready to plug into warehouse exports or BI tools later."
      />

      {loading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-tn-2xl" />
          ))}
        </div>
      ) : null}

      {data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <AdminStatCard label="Revenue (ex. cancelled)" value={formatOrderMoney(data.totalRevenue)} />
            <AdminStatCard label="Orders" value={String(data.totalOrders)} />
            <AdminStatCard label="AOV (approx.)" value={formatOrderMoney(data.totalOrders ? data.totalRevenue / data.totalOrders : 0)} />
            <AdminStatCard label="Active catalog" value={String(data.totalProducts)} />
          </div>

          <div className="mt-10 grid gap-6 xl:grid-cols-3">
            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md xl:col-span-2">
              <h2 className="text-sm font-semibold text-white">Sales overview</h2>
              <p className="mt-1 text-xs text-zinc-500">Dual series for the last 14 days.</p>
              <div className="mt-4">
                <AdminSalesOverviewChart data={trendData} />
              </div>
            </div>
            <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <h2 className="text-sm font-semibold text-white">Monthly orders</h2>
              <div className="mt-4 h-72">
                <AdminOrdersBarChart data={chartMonthly} />
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-tn-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <h2 className="text-sm font-semibold text-white">Trailing revenue</h2>
            <div className="mt-4 h-80">
              <AdminRevenueChart data={chartMonthly} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

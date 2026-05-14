import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { AdminOrderDetailModal } from '@/components/admin/AdminOrderDetailModal.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { useDebounce } from '@/hooks/useDebounce.js'
import * as adminService from '@/services/adminService.js'
import { formatOrderMoney, formatShortDate, orderStatusBadgeClass, paymentStatusBadgeClass } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
const PAYMENT_STATUSES = ['pending', 'paid', 'failed']

export function AdminOrdersPage() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [detailId, setDetailId] = useState(null)
  const [detailOrder, setDetailOrder] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminOrders({
        page,
        limit: 15,
        ...(status ? { status } : {}),
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      })
      setData(payload)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load orders'))
    } finally {
      setLoading(false)
    }
  }, [page, status, debouncedSearch])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(h)
  }, [load])

  useEffect(() => {
    const h = window.setTimeout(() => setPage(1), 0)
    return () => window.clearTimeout(h)
  }, [status, debouncedSearch])

  const loadDetail = useCallback(async (id) => {
    setDetailLoading(true)
    try {
      const order = await adminService.fetchAdminOrder(id)
      setDetailOrder(order)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load order'))
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!detailId) {
      const h = window.setTimeout(() => setDetailOrder(null), 0)
      return () => window.clearTimeout(h)
    }
    const h = window.setTimeout(() => {
      void loadDetail(detailId)
    }, 0)
    return () => window.clearTimeout(h)
  }, [detailId, loadDetail])

  async function patchOrderStatus(id, orderStatus) {
    setBusyId(id)
    try {
      await adminService.updateAdminOrderStatus(id, orderStatus)
      toast.success('Order status updated')
      load()
      if (detailId === id) loadDetail(id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Update failed'))
    } finally {
      setBusyId(null)
    }
  }

  async function patchPaymentStatus(id, paymentStatus) {
    setBusyId(id)
    try {
      await adminService.updateAdminPaymentStatus(id, paymentStatus)
      toast.success('Payment status updated')
      load()
      if (detailId === id) loadDetail(id)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Update failed'))
    } finally {
      setBusyId(null)
    }
  }

  const meta = data?.meta

  return (
    <div className="relative">
      {loading && data ? (
        <div className="pointer-events-none absolute inset-0 z-[5] flex items-start justify-center bg-black/20 pt-24 backdrop-blur-[1px]" aria-hidden />
      ) : null}

      <AdminPageHeader
        eyebrow="Fulfillment"
        title="Orders"
        subtitle="Search by customer, line item, or Mongo id — update fulfillment and payment in one surface."
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <label className="text-xs font-semibold text-zinc-400">
          Filter
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="ml-2 rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <input
          type="search"
          placeholder="Search email, name, product title, order id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-tn border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none ring-sky-400/30 focus:ring-2 lg:ml-4"
        />
        {meta ? (
          <span className="text-xs text-zinc-500 lg:ml-auto">
            {meta.total} orders · page {meta.page}/{meta.pages}
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-tn-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[60rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Order status</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Placed</th>
                  <th className="px-4 py-3 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.orders ?? []).map((o) => (
                  <tr key={o.id} className="text-zinc-300">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{o.customerName}</p>
                      <p className="text-xs text-zinc-500">{o.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-white">{formatOrderMoney(o.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${orderStatusBadgeClass(o.orderStatus)}`}
                      >
                        {o.orderStatus}
                      </span>
                      <select
                        value={o.orderStatus}
                        disabled={busyId === o.id}
                        onChange={(e) => patchOrderStatus(o.id, e.target.value)}
                        className="rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${paymentStatusBadgeClass(o.paymentStatus)}`}
                      >
                        {o.paymentStatus}
                      </span>
                      <select
                        value={o.paymentStatus}
                        disabled={busyId === o.id}
                        onChange={(e) => patchPaymentStatus(o.id, e.target.value)}
                        className="rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                      >
                        {PAYMENT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">{formatShortDate(o.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDetailId(o.id)}
                        className="text-xs font-semibold text-sky-300 hover:text-sky-200"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.orders?.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">No orders for this filter.</p>
            ) : null}
          </div>
        )}
      </div>

      {meta && meta.pages > 1 ? (
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-tn border border-white/10 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= meta.pages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-tn border border-white/10 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-white/5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}

      {detailId ? (
        <AdminOrderDetailModal
          order={detailOrder}
          loading={detailLoading}
          onClose={() => { setDetailId(null); setDetailOrder(null) }}
          onRefresh={() => loadDetail(detailId)}
        />
      ) : null}
    </div>
  )
}

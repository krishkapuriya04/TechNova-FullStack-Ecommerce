import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { CouponFormModal } from '@/components/admin/CouponFormModal.jsx'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import * as adminService from '@/services/adminService.js'
import { getErrorMessage } from '@/utils/apiError.js'

function expiryLabel(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  const now = new Date()
  if (d < now) return 'Expired'
  const days = Math.ceil((d - now) / 86400000)
  return `Active · ${days}d left`
}

export function AdminCouponsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await adminService.fetchAdminCoupons()
      setRows(list)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load coupons'))
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

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminService.deleteAdminCoupon(deleteTarget.id)
      toast.success('Coupon removed')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <AdminPageHeader
        eyebrow="Growth"
        title="Coupons"
        subtitle="Campaign codes with guardrails — minimum order, expiry, and activation toggles."
        actions={<PrimaryButton type="button" onClick={() => { setEditing(null); setModalOpen(true) }}>New coupon</PrimaryButton>}
      />

      <div className="overflow-hidden rounded-tn-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {loading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-4 py-3">Min order</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Uses</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((c) => (
                  <tr key={c.id} className="text-zinc-300">
                    <td className="px-4 py-3 font-mono font-semibold text-white">{c.code}</td>
                    <td className="px-4 py-3 capitalize">{c.discountType}</td>
                    <td className="px-4 py-3">{c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`}</td>
                    <td className="px-4 py-3">${c.minimumOrder ?? 0}</td>
                    <td className="px-4 py-3 text-xs text-zinc-400">{new Date(c.expiryDate).toLocaleString()}</td>
                    <td className="px-4 py-3 tabular-nums">{c.usageCount ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={c.active ? 'text-emerald-300' : 'text-zinc-500'}>{c.active ? 'On' : 'Off'}</span>
                      <span className="ml-2 text-xs text-zinc-500">{expiryLabel(c.expiryDate)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => { setEditing(c); setModalOpen(true) }}
                        className="mr-3 text-xs font-semibold text-sky-300 hover:text-sky-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(c)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? <p className="py-12 text-center text-sm text-zinc-500">No coupons yet.</p> : null}
          </div>
        )}
      </div>

      <CouponFormModal
        key={`${modalOpen}-${editing?.id ?? 'new'}`}
        open={modalOpen}
        coupon={editing}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSaved={load}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete coupon?"
        message="Existing carts will stop accepting this code."
        confirmLabel="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { useDebounce } from '@/hooks/useDebounce.js'
import * as adminService from '@/services/adminService.js'
import { productPath } from '@/constants/routes.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function AdminReviewsPage() {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 350)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminReviews({
        page,
        limit: 15,
        ...(debounced ? { search: debounced } : {}),
      })
      setData(payload)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load reviews'))
    } finally {
      setLoading(false)
    }
  }, [page, debounced])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void load()
    }, 0)
    return () => window.clearTimeout(h)
  }, [load])

  useEffect(() => {
    const h = window.setTimeout(() => setPage(1), 0)
    return () => window.clearTimeout(h)
  }, [debounced])

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminService.deleteAdminReview(deleteTarget.id)
      toast.success('Review removed')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'))
    } finally {
      setDeleting(false)
    }
  }

  const meta = data?.meta

  return (
    <div>
      <AdminPageHeader
        eyebrow="Trust & safety"
        title="Reviews"
        subtitle="Moderate community feedback — removals refresh catalog rating aggregates."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search comment, title, or id…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-tn border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none ring-sky-400/30 focus:ring-2 sm:w-80"
        />
        {meta ? (
          <p className="text-xs text-zinc-500">
            Page {meta.page} of {meta.pages} · {meta.total} reviews
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-tn-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Comment</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.reviews ?? []).map((r) => (
                  <tr key={r.id} className="text-zinc-300">
                    <td className="px-4 py-3">
                      <Link
                        to={productPath(r.product.slug)}
                        className="font-medium text-white hover:text-sky-200"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {r.product.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{r.user.name}</p>
                      <p className="text-xs text-zinc-500">{r.user.email}</p>
                    </td>
                    <td className="px-4 py-3">{r.rating}★</td>
                    <td className="max-w-xs px-4 py-3">
                      <p className="line-clamp-2 text-xs text-zinc-400">{r.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data?.reviews?.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">No reviews match this search.</p>
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remove review?"
        message="This permanently deletes the comment and recalculates product ratings."
        confirmLabel="Remove"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

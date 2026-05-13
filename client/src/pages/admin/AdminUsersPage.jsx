import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { useAuth } from '@/hooks/useAuth.js'
import { useDebounce } from '@/hooks/useDebounce.js'
import * as adminService from '@/services/adminService.js'
import { formatShortDate } from '@/utils/ecommerce.js'
import { getErrorMessage } from '@/utils/apiError.js'

export function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 350)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminUsers({
        page,
        limit: 15,
        search: debounced || undefined,
      })
      setData(payload)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load users'))
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
    const h = window.setTimeout(() => {
      setPage(1)
    }, 0)
    return () => window.clearTimeout(h)
  }, [debounced])

  async function changeRole(id, role) {
    setBusyId(id)
    try {
      await adminService.updateAdminUserRole(id, role)
      toast.success('Role updated')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update role'))
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminService.deleteAdminUser(deleteTarget.id)
      toast.success('User removed')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete user'))
    } finally {
      setDeleting(false)
    }
  }

  const meta = data?.meta

  return (
    <div>
      <AdminPageHeader
        eyebrow="Access"
        title="Users"
        subtitle="Promote teammates to admin or revoke access. Deletes are blocked when historical orders exist."
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-tn border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none ring-indigo-400/30 focus:ring-2 sm:w-80"
        />
        {meta ? (
          <p className="text-xs text-zinc-500">
            {meta.total} users · page {meta.page}/{meta.pages}
          </p>
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
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.users ?? []).map((u) => {
                  const isSelf = u.id === currentUser?.id
                  return (
                    <tr key={u.id} className="text-zinc-300">
                      <td className="px-4 py-3">
                        <p className="font-medium text-white">{u.name}</p>
                        <p className="text-xs text-zinc-500">{u.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={u.role}
                          disabled={busyId === u.id}
                          onChange={(e) => changeRole(u.id, e.target.value)}
                          className="rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs capitalize text-white"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{formatShortDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => setDeleteTarget(u)}
                          className="text-xs font-semibold text-rose-400 transition enabled:hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {data?.users?.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">No users match your search.</p>
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
        title="Delete user?"
        message="This cannot be undone. Users with orders cannot be deleted."
        confirmLabel="Delete user"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader.jsx'
import { ProductFormModal } from '@/components/admin/ProductFormModal.jsx'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog.jsx'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { useDebounce } from '@/hooks/useDebounce.js'
import * as adminService from '@/services/adminService.js'
import { deleteProduct } from '@/services/productService.js'
import { productPath } from '@/constants/routes.js'
import { formatCurrency } from '@/utils/formatCurrency.js'
import { getErrorMessage } from '@/utils/apiError.js'

const LOW_STOCK = 8

export function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 350)
  const [page, setPage] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [inventory, setInventory] = useState(null)
  const [stockInput, setStockInput] = useState({})
  const [stockBusy, setStockBusy] = useState(null)

  const loadOverview = useCallback(async () => {
    try {
      const o = await adminService.fetchAdminAnalyticsOverview()
      setInventory(o.inventory ?? null)
    } catch {
      setInventory(null)
    }
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const payload = await adminService.fetchAdminProducts({ page, search: debounced || undefined, limit: 12 })
      setData(payload)
      setStockInput({})
    } catch (err) {
      toast.error(getErrorMessage(err, 'Unable to load products'))
    } finally {
      setLoading(false)
    }
  }, [page, debounced])

  useEffect(() => {
    const h = window.setTimeout(() => {
      void loadOverview()
    }, 0)
    return () => window.clearTimeout(h)
  }, [loadOverview])

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

  function openCreate() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(p) {
    setEditing(p)
    setModalOpen(true)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      toast.success('Product deleted')
      setDeleteTarget(null)
      load()
      loadOverview()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'))
    } finally {
      setDeleting(false)
    }
  }

  async function saveStock(p) {
    const raw = stockInput[p.id] ?? String(p.stock)
    const n = parseInt(raw, 10)
    if (!Number.isInteger(n) || n < 0) {
      toast.error('Stock must be a non-negative integer')
      return
    }
    setStockBusy(p.id)
    try {
      await adminService.patchAdminProductStock(p.id, n)
      toast.success('Stock updated')
      await load()
      await loadOverview()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Stock update failed'))
    } finally {
      setStockBusy(null)
    }
  }

  const meta = data?.meta

  return (
    <div>
      <AdminPageHeader
        eyebrow="Catalog"
        title="Products"
        subtitle="Inventory-aware grid with quick stock edits — thresholds match operational analytics."
        actions={<PrimaryButton type="button" onClick={openCreate}>New product</PrimaryButton>}
      />

      {inventory ? (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-tn-2xl border border-amber-500/25 bg-amber-500/10 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">Low stock</p>
            <p className="mt-1 text-2xl font-bold text-white">{inventory.lowStock}</p>
            <p className="text-xs text-amber-100/80">≤ {inventory.lowStockThreshold} units, in stock</p>
          </div>
          <div className="rounded-tn-2xl border border-rose-500/25 bg-rose-500/10 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">Out of stock</p>
            <p className="mt-1 text-2xl font-bold text-white">{inventory.outOfStock}</p>
            <p className="text-xs text-rose-100/80">Zero on hand</p>
          </div>
          <div className="rounded-tn-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Total SKUs</p>
            <p className="mt-1 text-2xl font-bold text-white">{inventory.totalSkus}</p>
            <p className="text-xs text-zinc-500">Live catalog count</p>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search title, slug, brand…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-tn border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none ring-sky-400/30 focus:ring-2 sm:w-80"
        />
        {meta ? (
          <p className="text-xs text-zinc-500">
            Page {meta.page} of {meta.pages} · {meta.total} products
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-tn-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {loading && !data ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[64rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Trending</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data?.products ?? []).map((p) => {
                  const st = p.stock ?? 0
                  const rowTone =
                    st <= 0
                      ? 'bg-rose-500/5'
                      : st <= LOW_STOCK
                        ? 'bg-amber-500/5'
                        : ''
                  return (
                    <tr key={p.id} className={`text-zinc-300 ${rowTone}`}>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-white">{p.title}</p>
                          {st <= 0 ? (
                            <span className="rounded-full bg-rose-500/25 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-200">
                              Out
                            </span>
                          ) : st <= LOW_STOCK ? (
                            <span className="rounded-full bg-amber-500/25 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-100">
                              Low
                            </span>
                          ) : null}
                        </div>
                        <Link
                          to={productPath(p.slug)}
                          className="text-xs text-sky-300 hover:text-sky-200"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View live
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-semibold text-white">{formatCurrency(p.effectivePrice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            disabled={stockBusy === p.id}
                            value={stockInput[p.id] ?? String(st)}
                            onChange={(e) => setStockInput((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            className="w-20 rounded-tn border border-white/10 bg-black/40 px-2 py-1 text-xs text-white"
                          />
                          <SecondaryButton
                            type="button"
                            size="sm"
                            className="!px-2 !py-1 text-[11px]"
                            disabled={stockBusy === p.id}
                            onClick={() => saveStock(p)}
                          >
                            Save
                          </SecondaryButton>
                        </div>
                      </td>
                      <td className="px-4 py-3">{p.featured ? 'Yes' : '—'}</td>
                      <td className="px-4 py-3">{p.trending ? 'Yes' : '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="mr-3 text-xs font-semibold text-sky-300 hover:text-sky-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="text-xs font-semibold text-rose-400 hover:text-rose-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {data?.products?.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">No products match your search.</p>
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

      <ProductFormModal
        key={`${modalOpen}-${editing?.id ?? 'new'}`}
        open={modalOpen}
        product={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => {
          load()
          loadOverview()
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete product?"
        message="This removes the SKU from the catalog. Existing orders keep their line snapshots."
        confirmLabel="Delete"
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

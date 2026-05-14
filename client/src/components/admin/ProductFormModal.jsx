import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { ProductImage } from '@/components/ui/ProductImage.jsx'
import { createProduct, updateProduct } from '@/services/productService.js'
import { getErrorMessage } from '@/utils/apiError.js'
import { SHOP_CATEGORIES, SHOP_BRANDS } from '@/constants/shopTaxonomy.js'

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  price: '',
  discountPrice: '',
  category: '',
  brand: '',
  images: '',
  stock: '',
  featured: false,
  trending: false,
}

function toForm(product) {
  if (!product) return { ...emptyForm }
  return {
    title: product.title ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    price: String(product.price ?? ''),
    discountPrice:
      product.discountPrice != null && product.discountPrice > 0 ? String(product.discountPrice) : '',
    category: product.category ?? '',
    brand: product.brand ?? '',
    images: (product.images ?? []).join('\n'),
    stock: String(product.stock ?? ''),
    featured: Boolean(product.featured),
    trending: Boolean(product.trending),
  }
}

function emptySpecRow() {
  return { name: '', value: '' }
}

function toSpecRows(product) {
  const rows = (product?.specifications ?? []).map((s) => ({
    name: s.name ?? '',
    value: s.value ?? '',
  }))
  return rows.length ? rows : [emptySpecRow()]
}

function isHttpUrl(s) {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const fieldRing = 'ring-sky-500/30 focus:ring-2'

/** Keyed by product id so opening the modal always gets a fresh form instance. */
function ProductFormModalInner({ product, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(product))
  const [specRows, setSpecRows] = useState(() => toSpecRows(product))
  const [saving, setSaving] = useState(false)

  const imageUrls = useMemo(
    () =>
      form.images
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 24),
    [form.images],
  )

  async function handleSubmit(e) {
    e.preventDefault()
    const images = form.images
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 24)

    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required')
      return
    }
    if (!form.category.trim()) {
      toast.error('Select a category')
      return
    }
    if (!form.brand.trim()) {
      toast.error('Select or enter a brand')
      return
    }
    if (Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
      toast.error('Enter valid price and stock')
      return
    }
    if (images.length) {
      const bad = images.find((u) => !isHttpUrl(u))
      if (bad) {
        toast.error('Each image must be a valid http(s) URL')
        return
      }
    }
    const dpRaw = form.discountPrice.trim()
    if (dpRaw) {
      const dp = Number(dpRaw)
      if (Number.isNaN(dp) || dp < 0) {
        toast.error('Discount price must be a valid number')
        return
      }
      if (dp >= price) {
        toast.error('Discount price must be less than regular price')
        return
      }
    }

    const specifications = specRows
      .map((r) => ({ name: r.name.trim(), value: r.value.trim() }))
      .filter((r) => r.name && r.value)

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || undefined,
      description: form.description.trim(),
      price,
      category: form.category.trim(),
      brand: form.brand.trim(),
      images: images.length ? images : undefined,
      stock,
      featured: form.featured,
      trending: form.trending,
      specifications,
    }
    const dp = form.discountPrice.trim()
    if (dp) {
      const n = Number(dp)
      if (!Number.isNaN(n) && n >= 0) payload.discountPrice = n
    } else {
      payload.discountPrice = null
    }

    setSaving(true)
    try {
      if (product?.id) {
        await updateProduct(product.id, payload)
        toast.success('Product updated')
      } else {
        await createProduct(payload)
        toast.success('Product created')
      }
      onSaved?.()
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save product'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 16, opacity: 0 }}
      className="relative z-10 w-full max-w-2xl rounded-tn-2xl border border-white/12 bg-slate-950/96 p-6 shadow-2xl backdrop-blur-xl"
    >
      <h2 className="text-lg font-semibold text-white">{product?.id ? 'Edit product' : 'New product'}</h2>
      <div className="mt-4 max-h-[75vh] space-y-4 overflow-y-auto pr-1">
        <div className="grid gap-3 lg:grid-cols-2">
          <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
          <Field label="Slug (optional)" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} />
        </div>
        <Field
          label="Description"
          value={form.description}
          onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          multiline
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Price" type="number" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
          <Field
            label="Discount price"
            type="number"
            value={form.discountPrice}
            onChange={(v) => setForm((f) => ({ ...f, discountPrice: v }))}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-zinc-400">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={`mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
            >
              <option value="">Select category</option>
              {SHOP_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400">Brand</label>
            <select
              value={SHOP_BRANDS.includes(form.brand) ? form.brand : ''}
              onChange={(e) => {
                const v = e.target.value
                setForm((f) => ({ ...f, brand: v }))
              }}
              className={`mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
            >
              <option value="">Select brand</option>
              {SHOP_BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={SHOP_BRANDS.includes(form.brand) ? '' : form.brand}
              onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              placeholder="Or custom brand"
              className={`mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
            />
          </div>
        </div>
        <Field label="Stock" type="number" value={form.stock} onChange={(v) => setForm((f) => ({ ...f, stock: v }))} />
        <div>
          <label className="text-xs font-semibold text-zinc-400">Image URLs (one per line, max 24)</label>
          <textarea
            value={form.images}
            onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
            rows={4}
            className={`mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
            placeholder="https://…"
          />
        </div>
        {imageUrls.length ? (
          <div>
            <p className="text-xs font-semibold text-zinc-400">Preview</p>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {imageUrls.map((url) => (
                <div key={url} className="overflow-hidden rounded-tn border border-white/10">
                  <ProductImage src={url} alt="" seed={url} aspectClassName="aspect-[4/3] w-full" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-zinc-400">Specifications</p>
            <button
              type="button"
              className="text-xs font-semibold text-sky-400 hover:text-sky-300"
              onClick={() => setSpecRows((rows) => [...rows, emptySpecRow()])}
            >
              + Add row
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {specRows.map((row, i) => (
              <div key={i} className="flex flex-wrap gap-2 sm:flex-nowrap">
                <input
                  type="text"
                  value={row.name}
                  onChange={(e) =>
                    setSpecRows((rows) => rows.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
                  }
                  placeholder="Name"
                  className={`min-w-0 flex-1 rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) =>
                    setSpecRows((rows) => rows.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)))
                  }
                  placeholder="Value"
                  className={`min-w-0 flex-[1.3] rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ${fieldRing}`}
                />
                <button
                  type="button"
                  disabled={specRows.length <= 1}
                  className="rounded-tn border border-white/10 px-2 py-2 text-xs font-semibold text-zinc-300 transition enabled:hover:bg-white/5 disabled:opacity-40"
                  onClick={() => setSpecRows((rows) => rows.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="rounded border-white/20 bg-black/30 accent-sky-500"
            />
            Featured catalog
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.trending}
              onChange={(e) => setForm((f) => ({ ...f, trending: e.target.checked }))}
              className="rounded border-white/20 bg-black/30 accent-sky-500"
            />
            Trending
          </label>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <SecondaryButton type="button" onClick={onClose} disabled={saving}>
          Cancel
        </SecondaryButton>
        <PrimaryButton type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </PrimaryButton>
      </div>
    </motion.form>
  )
}

export function ProductFormModal({ open, product, onClose, onSaved }) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close"
            onClick={onClose}
          />
          <ProductFormModalInner
            key={product?.id ?? 'new-product'}
            product={product}
            onClose={onClose}
            onSaved={onSaved}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function Field({ label, value, onChange, type = 'text', multiline }) {
  const base =
    'mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-sky-500/30 focus:ring-2'
  return (
    <div>
      <label className="text-xs font-semibold text-zinc-400">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} className={base} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={base} />
      )}
    </div>
  )
}

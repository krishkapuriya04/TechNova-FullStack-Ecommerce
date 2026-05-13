import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { PrimaryButton } from '@/components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@/components/ui/SecondaryButton.jsx'
import { createProduct, updateProduct } from '@/services/productService.js'
import { getErrorMessage } from '@/utils/apiError.js'

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
  }
}

export function ProductFormModal({ open, product, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(product))
  const [saving, setSaving] = useState(false)

  if (typeof document === 'undefined') return null

  async function handleSubmit(e) {
    e.preventDefault()
    const images = form.images
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required')
      return
    }
    if (Number.isNaN(price) || price < 0 || Number.isNaN(stock) || stock < 0) {
      toast.error('Enter valid price and stock')
      return
    }
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
          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            className="relative z-10 w-full max-w-lg rounded-tn-2xl border border-white/10 bg-tn-900/95 p-6 shadow-2xl backdrop-blur-xl"
          >
            <h2 className="text-lg font-semibold text-white">
              {product?.id ? 'Edit product' : 'New product'}
            </h2>
            <div className="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              <Field label="Title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} />
              <Field label="Slug (optional)" value={form.slug} onChange={(v) => setForm((f) => ({ ...f, slug: v }))} />
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
                <Field label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
                <Field label="Brand" value={form.brand} onChange={(v) => setForm((f) => ({ ...f, brand: v }))} />
              </div>
              <Field label="Stock" type="number" value={form.stock} onChange={(v) => setForm((f) => ({ ...f, stock: v }))} />
              <div>
                <label className="text-xs font-semibold text-zinc-400">Image URLs (one per line)</label>
                <textarea
                  value={form.images}
                  onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
                  rows={4}
                  className="mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-indigo-400/30 focus:ring-2"
                  placeholder="https://…"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="rounded border-white/20 bg-black/30 accent-indigo-500"
                />
                Featured catalog
              </label>
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
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function Field({ label, value, onChange, type = 'text', multiline }) {
  const base =
    'mt-2 w-full rounded-tn border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-indigo-400/30 focus:ring-2'
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

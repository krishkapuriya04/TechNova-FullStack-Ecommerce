const STORAGE_KEY = 'technova-recently-viewed'
const MAX = 10

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore */
  }
}

/**
 * @param {{ id: string; slug: string; title: string; images?: string[]; price?: number; discountPrice?: number | null }} product
 */
export function recordProductView(product) {
  if (typeof window === 'undefined' || !product?.id || !product.slug) return
  const thumb = product.images?.[0] ?? ''
  const snapshot = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    thumb,
    price: product.price,
    discountPrice: product.discountPrice ?? null,
  }
  const prev = read().filter((x) => x && x.id !== snapshot.id)
  write([snapshot, ...prev].slice(0, MAX))
}

export function getRecentlyViewedSnapshots(excludeId) {
  if (typeof window === 'undefined') return []
  return read().filter((x) => x && x.id && x.slug && x.id !== excludeId)
}

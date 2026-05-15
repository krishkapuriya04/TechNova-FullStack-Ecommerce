/**
 * Shared product image URLs and sanitization for API responses.
 */
export const DEFAULT_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&h=900&q=82'

const FALLBACK_POOL = [
  DEFAULT_PRODUCT_IMAGE,
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&h=900&q=82',
  'https://images.unsplash.com/photo-1505740420920-2020a001a226?auto=format&fit=crop&w=1200&h=900&q=82',
  'https://images.unsplash.com/photo-1525547719571-a2d4ac8944e2?auto=format&fit=crop&w=1200&h=900&q=82',
]

function isUsableImageUrl(value) {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * @param {string[] | undefined | null} images
 * @param {string} [seed] Used to pick a stable fallback from the pool
 * @returns {string[]}
 */
export function sanitizeProductImages(images, seed = '') {
  const valid = (Array.isArray(images) ? images : [])
    .map((u) => (typeof u === 'string' ? u.trim() : ''))
    .filter(isUsableImageUrl)

  if (valid.length > 0) return valid

  let sum = 0
  for (let i = 0; i < seed.length; i += 1) sum += seed.charCodeAt(i)
  return [FALLBACK_POOL[sum % FALLBACK_POOL.length]]
}

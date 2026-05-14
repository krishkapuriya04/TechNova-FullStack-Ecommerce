import mongoose from 'mongoose'

export function buildProductFilter(query) {
  const filter = {}

  if (query.excludeId && mongoose.isValidObjectId(query.excludeId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(query.excludeId) }
  }

  if (query.search) {
    const term = String(query.search).trim()
    if (term) {
      const safe = escapeRegex(term)
      filter.$or = [
        { title: new RegExp(safe, 'i') },
        { brand: new RegExp(safe, 'i') },
        { category: new RegExp(safe, 'i') },
      ]
    }
  }

  if (query.category) {
    const c = String(query.category).trim()
    if (c) {
      filter.category = new RegExp(`^${escapeRegex(c)}$`, 'i')
    }
  }

  if (query.featured === 'true' || query.featured === true) {
    filter.featured = true
  } else if (query.featured === 'false' || query.featured === false) {
    filter.featured = false
  }

  if (query.trending === 'true' || query.trending === true) {
    filter.trending = true
  } else if (query.trending === 'false' || query.trending === false) {
    filter.trending = false
  }

  const minRaw = query.minPrice != null ? Number(query.minPrice) : NaN
  const maxRaw = query.maxPrice != null ? Number(query.maxPrice) : NaN
  let min = Number.isFinite(minRaw) && minRaw >= 0 ? minRaw : null
  let max = Number.isFinite(maxRaw) && maxRaw >= 0 ? maxRaw : null
  if (min != null && max != null && min > max) {
    ;[min, max] = [max, min]
  }
  if (min != null || max != null) {
    filter.effectivePrice = {}
    if (min != null) filter.effectivePrice.$gte = min
    if (max != null) filter.effectivePrice.$lte = max
  }

  return filter
}

export function buildProductSort(sort) {
  switch (sort) {
    case 'price_asc':
      return { effectivePrice: 1 }
    case 'price_desc':
      return { effectivePrice: -1 }
    case 'rating':
      return { 'ratings.average': -1, 'ratings.count': -1 }
    case 'newest':
    default:
      return { createdAt: -1 }
  }
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

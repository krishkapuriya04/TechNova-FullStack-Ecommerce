import mongoose from 'mongoose'

export function buildProductFilter(query) {
  const filter = {}

  if (query.excludeId && mongoose.isValidObjectId(query.excludeId)) {
    filter._id = { $ne: new mongoose.Types.ObjectId(query.excludeId) }
  }

  if (query.search) {
    const term = query.search.trim()
    filter.$or = [
      { title: new RegExp(term, 'i') },
      { brand: new RegExp(term, 'i') },
      { category: new RegExp(term, 'i') },
    ]
  }

  if (query.category) {
    filter.category = new RegExp(`^${escapeRegex(query.category.trim())}$`, 'i')
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

  const min = query.minPrice
  const max = query.maxPrice
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
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

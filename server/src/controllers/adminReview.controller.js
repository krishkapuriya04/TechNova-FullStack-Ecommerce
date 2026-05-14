import mongoose from 'mongoose'
import { Review } from '../models/Review.js'
import { sendSuccess } from '../utils/apiResponse.js'

function mapAdminReview(doc) {
  const u = doc.user
  const p = doc.product
  return {
    id: doc._id.toString(),
    rating: doc.rating,
    title: doc.title ?? '',
    comment: doc.comment,
    createdAt: doc.createdAt,
    user: { id: u?._id?.toString?.() ?? '', name: u?.name ?? '', email: u?.email ?? '' },
    product: {
      id: p?._id?.toString?.() ?? '',
      title: p?.title ?? '',
      slug: p?.slug ?? '',
    },
  }
}

export async function listAdminReviews(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const skip = (page - 1) * limit
  const search = (req.query.search ?? '').trim()

  const filter = {}
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: rx }, { comment: rx }]
    if (mongoose.isValidObjectId(search)) {
      filter.$or.push({ _id: new mongoose.Types.ObjectId(search) })
    }
  }

  const [items, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .populate('product', 'title slug')
      .lean(),
    Review.countDocuments(filter),
  ])

  sendSuccess(res, {
    reviews: items.map(mapAdminReview),
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
}

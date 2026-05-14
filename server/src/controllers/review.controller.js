import mongoose from 'mongoose'
import { Review } from '../models/Review.js'
import { Product } from '../models/Product.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendCreated, sendSuccess } from '../utils/apiResponse.js'

async function refreshProductRating(productId) {
  const [row] = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, c: { $sum: 1 } } },
  ])
  const avg = row?.avg != null ? Math.round(row.avg * 10) / 10 : 0
  const count = row?.c ?? 0
  await Product.updateOne({ _id: productId }, { $set: { 'ratings.average': avg, 'ratings.count': count } })
}

function mapReview(doc) {
  const u = doc.user
  return {
    id: doc._id.toString(),
    rating: doc.rating,
    title: doc.title ?? '',
    comment: doc.comment,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    user: {
      id: u?._id?.toString?.() ?? '',
      name: u?.name ?? 'Member',
    },
  }
}

export async function listProductReviews(req, res) {
  const { productId } = req.params
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError('Invalid product id', HttpStatus.BAD_REQUEST)
  }
  const exists = await Product.exists({ _id: productId })
  if (!exists) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }
  const [docs, distRows] = await Promise.all([
    Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .populate('user', 'name')
      .limit(100)
      .lean(),
    Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]),
  ])

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const row of distRows) {
    if (row._id >= 1 && row._id <= 5) breakdown[row._id] = row.count
  }

  sendSuccess(res, { reviews: docs.map(mapReview), breakdown })
}

export async function createReview(req, res) {
  const userId = req.user.sub
  const { productId, rating, title, comment } = req.body

  const product = await Product.findById(productId).select('_id')
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  try {
    const doc = await Review.create({
      user: userId,
      product: productId,
      rating,
      title: title ?? '',
      comment,
    })
    await refreshProductRating(productId)
    const populated = await Review.findById(doc._id).populate('user', 'name').lean()
    sendCreated(res, { review: mapReview(populated) }, 'Review posted')
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('You already reviewed this product', HttpStatus.CONFLICT)
    }
    throw err
  }
}

export async function updateReview(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid review id', HttpStatus.BAD_REQUEST)
  }
  const review = await Review.findById(id)
  if (!review) {
    throw new AppError('Review not found', HttpStatus.NOT_FOUND)
  }
  if (review.user.toString() !== req.user.sub) {
    throw new AppError('Not allowed to edit this review', HttpStatus.FORBIDDEN)
  }
  if (req.body.rating != null) review.rating = req.body.rating
  if (req.body.title != null) review.title = req.body.title
  if (req.body.comment != null) review.comment = req.body.comment
  await review.save()
  await refreshProductRating(review.product)
  const populated = await Review.findById(id).populate('user', 'name').lean()
  sendSuccess(res, { review: mapReview(populated) }, 'Review updated')
}

export async function deleteOwnReview(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid review id', HttpStatus.BAD_REQUEST)
  }
  const review = await Review.findById(id)
  if (!review) {
    throw new AppError('Review not found', HttpStatus.NOT_FOUND)
  }
  if (review.user.toString() !== req.user.sub) {
    throw new AppError('Not allowed to delete this review', HttpStatus.FORBIDDEN)
  }
  const productId = review.product.toString()
  await review.deleteOne()
  await refreshProductRating(productId)
  sendSuccess(res, { id }, 'Review removed')
}

export async function adminDeleteReview(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid review id', HttpStatus.BAD_REQUEST)
  }
  const review = await Review.findById(id)
  if (!review) {
    throw new AppError('Review not found', HttpStatus.NOT_FOUND)
  }
  const productId = review.product.toString()
  await review.deleteOne()
  await refreshProductRating(productId)
  sendSuccess(res, { id }, 'Review removed by admin')
}

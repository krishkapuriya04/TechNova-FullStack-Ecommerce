import mongoose from 'mongoose'
import { Wishlist } from '../models/Wishlist.js'
import { Product } from '../models/Product.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendSuccess } from '../utils/apiResponse.js'

async function getOrCreateWishlist(userId) {
  let list = await Wishlist.findOne({ user: userId }).populate({
    path: 'products',
    select: 'title slug images stock price discountPrice effectivePrice ratings brand category',
  })
  if (!list) {
    list = await Wishlist.create({ user: userId, products: [] })
    list = await Wishlist.findById(list._id).populate({
      path: 'products',
      select: 'title slug images stock price discountPrice effectivePrice ratings brand category',
    })
  }
  return list
}

function mapWishlistProducts(products) {
  return (products ?? []).map((p) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    image: p.images?.[0] ?? '',
    stock: p.stock,
    price: p.price,
    discountPrice: p.discountPrice,
    effectivePrice: p.effectivePrice,
    brand: p.brand,
    category: p.category,
    ratings: p.ratings,
  }))
}

export async function getWishlist(req, res) {
  const list = await getOrCreateWishlist(req.user.sub)
  sendSuccess(res, { products: mapWishlistProducts(list.products) })
}

export async function addToWishlist(req, res) {
  const { productId } = req.body
  const product = await Product.findById(productId)
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  await Wishlist.findOneAndUpdate(
    { user: req.user.sub },
    { $addToSet: { products: product._id }, $setOnInsert: { user: req.user.sub } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  )

  const list = await getOrCreateWishlist(req.user.sub)
  sendSuccess(res, { products: mapWishlistProducts(list.products) }, 'Added to wishlist')
}

export async function removeFromWishlist(req, res) {
  const { productId } = req.params
  if (!mongoose.isValidObjectId(productId)) {
    throw new AppError('Invalid product id', HttpStatus.BAD_REQUEST)
  }

  await Wishlist.updateOne({ user: req.user.sub }, { $pull: { products: productId } })

  const list = await getOrCreateWishlist(req.user.sub)
  sendSuccess(res, { products: mapWishlistProducts(list.products) }, 'Removed from wishlist')
}

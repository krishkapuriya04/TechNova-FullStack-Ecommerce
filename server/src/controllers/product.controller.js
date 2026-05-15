import { HttpStatus } from '../constants/httpStatus.js'
import { env } from '../config/env.js'
import { Product } from '../models/Product.js'
import { AppError } from '../utils/AppError.js'
import { sendCreated, sendSuccess } from '../utils/apiResponse.js'
import { slugify } from '../utils/slugify.js'
import { buildProductFilter, buildProductSort } from '../utils/productQuery.js'
import { sanitizeProductImages } from '../utils/productImages.js'

export async function getProducts(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Math.min(Number(req.query.limit) || 12, 50)
  const skip = (page - 1) * limit

  const filter = buildProductFilter(req.query)
  const sort = buildProductSort(req.query.sort)

  if (!env.isProduction) {
    console.log('[products] list', {
      page,
      limit,
      sort: req.query.sort ?? 'newest',
      trending: filter.trending,
      featured: filter.featured,
      hasSearch: Boolean(filter.$or),
      hasCategory: Boolean(filter.category),
      priceFilter: Boolean(filter.effectivePrice),
    })
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ])

  sendSuccess(res, {
    products: items.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      discountPrice: doc.discountPrice,
      effectivePrice: doc.effectivePrice,
      category: doc.category,
      brand: doc.brand,
      images: sanitizeProductImages(doc.images, doc.slug ?? doc._id?.toString()),
      stock: doc.stock,
      ratings: doc.ratings,
      featured: doc.featured,
      trending: Boolean(doc.trending),
      specifications: doc.specifications,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    meta: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit) || 1,
    },
  })
}

export async function getSingleProduct(req, res) {
  const product = await Product.findById(req.params.id).lean()
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, { product: mapProduct(product) })
}

export async function getProductBySlug(req, res) {
  const slug = String(req.params.slug ?? '')
    .trim()
    .toLowerCase()
  if (!slug || slug.length > 180) {
    throw new AppError('Invalid product slug', HttpStatus.BAD_REQUEST)
  }

  const product = await Product.findOne({ slug }).lean()
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, { product: mapProduct(product) })
}

export async function createProduct(req, res) {
  const payload = { ...req.body }
  if (!payload.slug) {
    payload.slug = slugify(payload.title)
  }
  payload.images = sanitizeProductImages(payload.images, payload.slug ?? payload.title)

  try {
    const product = await Product.create(payload)
    sendCreated(res, { product: product.toPublicJSON() }, 'Product created')
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Slug must be unique', HttpStatus.CONFLICT)
    }
    throw err
  }
}

export async function updateProduct(req, res) {
  const product = await Product.findById(req.params.id)
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  const updates = { ...req.body }
  if (updates.title && !updates.slug) {
    updates.slug = slugify(updates.title)
  }
  if (updates.images !== undefined) {
    updates.images = sanitizeProductImages(updates.images, updates.slug ?? product.slug)
  }

  Object.assign(product, updates)

  try {
    await product.save()
    sendSuccess(res, { product: product.toPublicJSON() }, 'Product updated')
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Slug must be unique', HttpStatus.CONFLICT)
    }
    throw err
  }
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    throw new AppError('Product not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, { id: product._id.toString() }, 'Product deleted')
}

function mapProduct(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    slug: doc.slug,
    description: doc.description,
    price: doc.price,
    discountPrice: doc.discountPrice,
    effectivePrice: doc.effectivePrice,
    category: doc.category,
    brand: doc.brand,
    images: sanitizeProductImages(doc.images, doc.slug ?? doc._id?.toString()),
    stock: doc.stock,
    ratings: doc.ratings,
    featured: doc.featured,
    trending: Boolean(doc.trending),
    specifications: doc.specifications,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

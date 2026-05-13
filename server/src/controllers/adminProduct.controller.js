import { Product } from '../models/Product.js'
import { sendSuccess } from '../utils/apiResponse.js'

export async function listAdminProducts(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Math.min(Number(req.query.limit) || 24, 100)
  const skip = (page - 1) * limit
  const search = (req.query.search ?? '').trim()

  const filter = {}
  if (search) {
    const rx = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
    filter.$or = [{ title: rx }, { slug: rx }, { brand: rx }, { category: rx }]
  }

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ])

  sendSuccess(res, {
    products: items.map((doc) => ({
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      price: doc.price,
      discountPrice: doc.discountPrice,
      effectivePrice: doc.effectivePrice,
      category: doc.category,
      brand: doc.brand,
      images: doc.images,
      stock: doc.stock,
      featured: doc.featured,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
}

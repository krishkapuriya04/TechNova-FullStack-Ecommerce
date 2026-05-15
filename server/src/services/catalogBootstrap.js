import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { Coupon } from '../models/Coupon.js'
import { generateBulkCatalog } from '../scripts/lib/generateBulkCatalog.js'
import { getCatalogImageUrls } from '../scripts/lib/productImageUrls.js'

const ADMIN_EMAIL = 'admin@technova.dev'
const ADMIN_PASSWORD = 'Password123'

/**
 * Ensures the catalog is usable immediately after startup or seed.
 * @param {{ fresh?: boolean }} [options]
 */
export async function ensureCatalogBootstrap({ fresh = false } = {}) {
  if (fresh) {
    const cleared = await Product.deleteMany({})
    console.log(`[catalog] Cleared ${cleared.deletedCount} products (--fresh)`)
  }

  let productCount = await Product.countDocuments()

  if (productCount === 0) {
    const catalog = generateBulkCatalog()
    await Product.insertMany(catalog)
    productCount = catalog.length
    console.log(`[catalog] Inserted ${productCount} demo products`)
  } else {
    console.log(`[catalog] ${productCount} products in database`)
  }

  await repairProductImages()
  await ensureMerchandisingFlags()
  await ensureAdminUser()
  await ensureStarterCoupons()

  const trending = await Product.countDocuments({ trending: true })
  const featured = await Product.countDocuments({ featured: true })
  console.log(`[catalog] Merchandising: ${trending} trending, ${featured} featured`)
}

async function repairProductImages() {
  const broken = await Product.find({
    $or: [{ images: { $exists: false } }, { images: { $size: 0 } }, { images: null }],
  })
    .select('_id slug category')
    .lean()

  if (!broken.length) return

  const ops = broken.map((doc, index) => ({
    updateOne: {
      filter: { _id: doc._id },
      update: {
        $set: {
          images: getCatalogImageUrls(doc.category ?? 'Accessories', index),
        },
      },
    },
  }))

  await Product.bulkWrite(ops)
  console.log(`[catalog] Repaired images on ${broken.length} products`)
}

async function ensureMerchandisingFlags() {
  const [trendingCount, featuredCount] = await Promise.all([
    Product.countDocuments({ trending: true }),
    Product.countDocuments({ featured: true }),
  ])

  if (trendingCount === 0) {
    const picks = await Product.find().sort({ 'ratings.average': -1, createdAt: -1 }).limit(16).select('_id')
    if (picks.length) {
      await Product.updateMany(
        { _id: { $in: picks.map((p) => p._id) } },
        { $set: { trending: true } },
      )
      console.log(`[catalog] Marked ${picks.length} products as trending`)
    }
  }

  if (featuredCount === 0) {
    const picks = await Product.find().sort({ 'ratings.average': -1, createdAt: -1 }).limit(12).select('_id')
    if (picks.length) {
      await Product.updateMany(
        { _id: { $in: picks.map((p) => p._id) } },
        { $set: { featured: true } },
      )
      console.log(`[catalog] Marked ${picks.length} products as featured`)
    }
  }
}

async function ensureAdminUser() {
  const exists = await User.exists({ email: ADMIN_EMAIL })
  if (exists) return

  await User.create({
    name: 'TechNova Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: 'admin',
    avatar: '',
  })
  console.log(`[catalog] Created admin user (${ADMIN_EMAIL} / ${ADMIN_PASSWORD})`)
}

async function ensureStarterCoupons() {
  const count = await Coupon.countDocuments()
  if (count > 0) return

  const soon = new Date()
  soon.setDate(soon.getDate() + 45)
  await Coupon.insertMany([
    {
      code: 'TECH10',
      discountType: 'percent',
      discountValue: 10,
      minimumOrder: 75,
      expiryDate: soon,
      active: true,
    },
    {
      code: 'FLAT15',
      discountType: 'fixed',
      discountValue: 15,
      minimumOrder: 120,
      expiryDate: soon,
      active: true,
    },
  ])
  console.log('[catalog] Inserted starter coupons (TECH10, FLAT15)')
}

export { ADMIN_EMAIL, ADMIN_PASSWORD }

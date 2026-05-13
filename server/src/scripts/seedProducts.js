import dotenv from 'dotenv'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import { Product } from '../models/Product.js'
import { User } from '../models/User.js'
import { generateBulkCatalog } from './lib/generateBulkCatalog.js'

dotenv.config()

const ADMIN_EMAIL = 'admin@technova.dev'
const ADMIN_PASSWORD = 'Password123'

const fresh = process.argv.includes('--fresh')

async function seed() {
  await connectDatabase()

  if (fresh) {
    const cleared = await Product.deleteMany({})
    console.log(`[seed] Cleared ${cleared.deletedCount} products (--fresh)`)
  }

  const existingProducts = await Product.countDocuments()
  if (existingProducts === 0) {
    const catalog = generateBulkCatalog()
    await Product.insertMany(catalog)
    console.log(`[seed] Inserted ${catalog.length} products`)
  } else {
    console.log('[seed] Products already present — skipping catalog insert (use --fresh to replace)')
  }

  const adminExists = await User.exists({ email: ADMIN_EMAIL })
  if (!adminExists) {
    await User.create({
      name: 'TechNova Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      avatar: '',
    })
    console.log(`[seed] Created admin user (${ADMIN_EMAIL})`)
  } else {
    console.log('[seed] Admin user already exists — skipping')
  }

  await disconnectDatabase()
  console.log('[seed] Done')
}

seed().catch((err) => {
  console.error('[seed] Failed', err)
  process.exit(1)
})

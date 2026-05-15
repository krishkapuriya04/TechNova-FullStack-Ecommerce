import '../config/env.js'
import { connectDatabase, disconnectDatabase } from '../config/database.js'
import { ensureCatalogBootstrap } from '../services/catalogBootstrap.js'

const fresh = process.argv.includes('--fresh')

async function seed() {
  await connectDatabase()
  await ensureCatalogBootstrap({ fresh })
  await disconnectDatabase()
  console.log('[seed] Done')
}

seed().catch((err) => {
  console.error('[seed] Failed', err)
  process.exit(1)
})

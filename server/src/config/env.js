import dotenv from 'dotenv'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
/** Always load `server/.env` relative to this package, not the process cwd. */
const envPath = join(__dirname, '..', '..', '.env')
dotenv.config({ path: envPath })

const JWT_DEV_FALLBACK = '__TECHNOVA_DEV_ONLY_JWT_SECRET__'

const nodeEnv = process.env.NODE_ENV ?? 'development'
const isProduction = nodeEnv === 'production'

const rawMongo = (process.env.MONGODB_URI ?? '').trim()
let rawJwt = (process.env.JWT_SECRET ?? '').trim()

if (!rawJwt && !isProduction) {
  rawJwt = JWT_DEV_FALLBACK
  console.warn(
    '[env] JWT_SECRET is not set — using a development-only placeholder. Set JWT_SECRET in server/.env before any shared or production environment.',
  )
}

if (!rawJwt && isProduction) {
  console.error('[env] JWT_SECRET is required in production. See server/.env.example')
  process.exit(1)
}

if (!rawMongo) {
  console.warn(
    '[env] MONGODB_URI is not set — the API cannot connect to MongoDB until you add it to server/.env (see server/.env.example).',
  )
}

function parseClientOrigins() {
  const multi = (process.env.CLIENT_ORIGINS ?? '').trim()
  if (multi) {
    return multi
      .split(',')
      .map((s) => s.trim().replace(/\/$/, ''))
      .filter(Boolean)
  }
  const single = (process.env.CLIENT_ORIGIN ?? '').trim().replace(/\/$/, '')
  if (single) return [single]
  return ['http://localhost:5173']
}

const trustProxy =
  process.env.TRUST_PROXY === '1' ||
  process.env.TRUST_PROXY === 'true' ||
  process.env.TRUST_PROXY === 'yes'

const autoSeedCatalog =
  process.env.AUTO_SEED_CATALOG !== '0' &&
  process.env.AUTO_SEED_CATALOG !== 'false' &&
  process.env.AUTO_SEED_CATALOG !== 'no'

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  /** When true (default), seed demo catalog if the database has no products. Set AUTO_SEED_CATALOG=0 to disable. */
  autoSeedCatalog,
  /** Allowed browser origins for CORS (comma list or single CLIENT_ORIGIN). */
  clientOrigins: parseClientOrigins(),
  mongodbUri: rawMongo,
  jwtSecret: rawJwt,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  jwtUsingDevFallback: rawJwt === JWT_DEV_FALLBACK,
  /** When true, Express honors X-Forwarded-* (Render, Railway, etc.). */
  trustProxy,
}

/**
 * Log safe, non-secret startup info (for operators / beginners).
 */
export function logStartupEnv() {
  const mongoState = env.mongodbUri ? 'configured' : 'MISSING (set MONGODB_URI in server/.env)'
  const jwtState = env.jwtUsingDevFallback ? 'DEV PLACEHOLDER (set JWT_SECRET for real auth)' : 'configured'

  if (env.isProduction) {
    console.log(
      `[env] production port=${env.port} trustProxy=${env.trustProxy} origins=${env.clientOrigins.length} mongo=${mongoState === 'configured' ? 'ok' : 'MISSING'} jwt=${jwtState === 'configured' ? 'ok' : 'PLACEHOLDER'}`,
    )
    return
  }

  console.log(`[env] Loaded from: ${envPath}`)
  console.log(`[env] NODE_ENV=${env.nodeEnv} PORT=${env.port} trustProxy=${env.trustProxy}`)
  console.log(`[env] CORS origins (${env.clientOrigins.length}): ${env.clientOrigins.join(' | ')}`)
  console.log(`[env] MONGODB_URI: ${mongoState}`)
  console.log(`[env] JWT_SECRET: ${jwtState}`)
  console.log(`[env] AUTO_SEED_CATALOG: ${env.autoSeedCatalog ? 'on (empty DB → demo products)' : 'off'}`)
}

/**
 * Fail fast with actionable messages before opening sockets or DB.
 */
export function assertBootstrapConfig() {
  if (!env.mongodbUri) {
    console.error('')
    console.error('[bootstrap] Cannot start: MONGODB_URI is missing.')
    console.error('  1. Copy server/.env.example → server/.env')
    console.error('  2. Paste your MongoDB connection string as MONGODB_URI=')
    console.error('  3. Set a strong JWT_SECRET (required in production; recommended everywhere)')
    console.error('  4. Set CLIENT_ORIGIN or CLIENT_ORIGINS to match your deployed frontend URL(s)')
    console.error('')
    process.exit(1)
  }

  if (env.isProduction && env.jwtUsingDevFallback) {
    console.error('[bootstrap] Production requires a real JWT_SECRET in server/.env (not the dev placeholder).')
    process.exit(1)
  }
}

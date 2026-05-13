import mongoose from 'mongoose'
import { env } from './env.js'

function mongoFailureHints(message) {
  const m = message || ''
  if (/authentication failed|bad auth/i.test(m)) {
    return '\n  → Check the database username and password in MONGODB_URI (Atlas: Database → Database Users).'
  }
  if (/ENOTFOUND|getaddrinfo|ECONNREFUSED/i.test(m)) {
    return '\n  → Check the cluster hostname in MONGODB_URI and your network/DNS. For local MongoDB use mongodb://127.0.0.1:27017/yourdb'
  }
  if (/IPWhitelist|whitelist|not allowed|network/i.test(m)) {
    return '\n  → Atlas: Network Access → allow your current IP (or 0.0.0.0/0 for quick local testing only).'
  }
  if (/Server selection timed out|timeout/i.test(m)) {
    return '\n  → Firewall/VPN or Atlas cluster paused. Confirm the cluster is running and reachable.'
  }
  if (/SSL|TLS|certificate/i.test(m)) {
    return '\n  → TLS issue: Atlas URIs usually need no extra flags; try the exact string from Atlas “Connect”.'
  }
  return '\n  → Compare your URI with server/.env.example and Atlas “Connect your application”.'
}

/**
 * Connects to MongoDB Atlas (or local URI). Call once on startup.
 */
export async function connectDatabase() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set. Copy server/.env.example to server/.env and add your URI.')
  }

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(env.mongodbUri, {
      autoIndex: !env.isProduction,
    })
  } catch (err) {
    const base = err instanceof Error ? err.message : String(err)
    const hints = mongoFailureHints(base)
    const wrapped = new Error(`MongoDB connection failed: ${base}${hints}`)
    wrapped.cause = err
    throw wrapped
  }

  return mongoose.connection
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}

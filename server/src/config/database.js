import mongoose from 'mongoose'
import { env } from './env.js'

/**
 * Connects to MongoDB Atlas (or local URI). Call once on startup.
 */
export async function connectDatabase() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not set. See server/.env.example')
  }

  mongoose.set('strictQuery', true)

  await mongoose.connect(env.mongodbUri, {
    autoIndex: !env.isProduction,
  })

  return mongoose.connection
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}

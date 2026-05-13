import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { registerRoutes } from './routes/index.js'
import { notFoundHandler } from './middleware/notFound.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'

const allowedOrigins = new Set(env.clientOrigins)

function corsOrigin(origin, callback) {
  if (!origin) {
    callback(null, true)
    return
  }
  const normalized = origin.replace(/\/$/, '')
  if (allowedOrigins.has(normalized)) {
    callback(null, true)
    return
  }
  callback(null, false)
}

export function createApp() {
  const app = express()

  if (env.trustProxy) {
    app.set('trust proxy', 1)
  }

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  registerRoutes(app)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}

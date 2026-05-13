import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { env } from './config/env.js'
import { registerRoutes } from './routes/index.js'
import { notFoundHandler } from './middleware/notFound.middleware.js'
import { errorHandler } from './middleware/error.middleware.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(
    cors({
      origin: env.clientOrigin,
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

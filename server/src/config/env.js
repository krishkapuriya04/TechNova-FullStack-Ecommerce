import dotenv from 'dotenv'

dotenv.config()

const required = ['MONGODB_URI', 'JWT_SECRET']

function validateEnv() {
  const missing = required.filter((key) => !process.env[key])
  if (missing.length > 0) {
    console.warn(
      `[env] Missing: ${missing.join(', ')} — copy server/.env.example to server/.env`,
    )
  }
}

validateEnv()

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 5000,
  clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  isProduction: (process.env.NODE_ENV ?? 'development') === 'production',
}

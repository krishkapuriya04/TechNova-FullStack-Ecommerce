import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function signAccessToken(payload) {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

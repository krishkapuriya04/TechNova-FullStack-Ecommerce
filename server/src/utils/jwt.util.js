import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const DEFAULT_EXPIRES = '7d'

export function signAccessToken(payload) {
  if (!env.jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRES,
  })
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

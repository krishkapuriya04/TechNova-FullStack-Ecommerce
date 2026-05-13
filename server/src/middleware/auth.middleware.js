import jwt from 'jsonwebtoken'
import { HttpStatus } from '../constants/httpStatus.js'
import { env } from '../config/env.js'

/**
 * Protects routes with JWT Bearer authentication.
 * Attach to routes when you implement login (e.g. `router.get('/me', authenticate, handler)`).
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Authorization header missing or invalid',
    })
  }

  const token = header.slice(7)

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.user = payload
    next()
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

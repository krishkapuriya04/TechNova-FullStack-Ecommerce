import { verifyAccessToken } from '../utils/jwt.util.js'
import { HttpStatus } from '../constants/httpStatus.js'

/**
 * Protects routes with JWT Bearer authentication.
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
    const payload = verifyAccessToken(token)
    req.user = { sub: payload.sub, role: payload.role }
    next()
  } catch {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Authentication required',
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HttpStatus.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to perform this action',
      })
    }

    next()
  }
}

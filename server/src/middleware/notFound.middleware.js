import { HttpStatus } from '../constants/httpStatus.js'

export function notFoundHandler(req, res) {
  res.status(HttpStatus.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
}

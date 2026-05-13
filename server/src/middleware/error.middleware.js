import { HttpStatus } from '../constants/httpStatus.js'
import { env } from '../config/env.js'

export function errorHandler(err, req, res, _next) {
  const status =
    err.statusCode ?? err.status ?? HttpStatus.INTERNAL_SERVER_ERROR
  const isClientError = status >= 400 && status < 500

  if (!isClientError) {
    console.error(err)
  }

  res.status(status).json({
    success: false,
    message: isClientError ? err.message : 'Internal server error',
    ...(env.isProduction ? {} : { stack: err.stack }),
  })
}

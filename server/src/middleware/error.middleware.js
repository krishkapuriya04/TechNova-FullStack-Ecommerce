import mongoose from 'mongoose'
import { HttpStatus } from '../constants/httpStatus.js'
import { env } from '../config/env.js'
import { AppError } from '../utils/AppError.js'

export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'field'
    return res.status(HttpStatus.CONFLICT).json({
      success: false,
      message: `Duplicate value for ${field}`,
    })
  }

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

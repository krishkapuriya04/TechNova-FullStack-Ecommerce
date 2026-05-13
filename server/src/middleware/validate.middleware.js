import { validationResult } from 'express-validator'
import { HttpStatus } from '../constants/httpStatus.js'

export function validate(validations) {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)))
    const result = validationResult(req)
    if (!result.isEmpty()) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        success: false,
        message: 'Validation failed',
        errors: result.array(),
      })
    }
    next()
  }
}

import { body, param, query } from 'express-validator'

const mongoId = param('id').isMongoId().withMessage('Invalid product id')

export const listProductValidators = [
  query('page').optional().toInt().isInt({ min: 1 }),
  query('limit').optional().toInt().isInt({ min: 1, max: 50 }),
  query('search').optional().isString().trim().isLength({ max: 120 }),
  query('category').optional().isString().trim().isLength({ max: 64 }),
  query('featured').optional().isIn(['true', 'false']),
  query('minPrice').optional().toFloat().isFloat({ min: 0 }),
  query('maxPrice').optional().toFloat().isFloat({ min: 0 }),
  query('sort').optional().isIn(['newest', 'price_asc', 'price_desc', 'rating']),
]

export const idParamValidators = [mongoId]

export const createProductValidators = [
  body('title').trim().notEmpty().isLength({ max: 160 }),
  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 180 })
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('description').trim().notEmpty().isLength({ max: 8000 }),
  body('price').isFloat({ min: 0 }).toFloat(),
  body('discountPrice').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('category').trim().notEmpty().isLength({ max: 64 }),
  body('brand').trim().notEmpty().isLength({ max: 64 }),
  body('images').isArray({ min: 1 }).withMessage('At least one image URL is required'),
  body('images.*').isURL().withMessage('Each image must be a valid URL'),
  body('stock').isInt({ min: 0 }).toInt(),
  body('featured').optional().isBoolean().toBoolean(),
  body('specifications').optional().isArray(),
  body('specifications.*.name').optional().isString().trim().isLength({ max: 80 }),
  body('specifications.*.value').optional().isString().trim().isLength({ max: 240 }),
]

export const updateProductValidators = [
  mongoId,
  body('title').optional().trim().notEmpty().isLength({ max: 160 }),
  body('slug')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 180 })
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  body('description').optional().trim().notEmpty().isLength({ max: 8000 }),
  body('price').optional().isFloat({ min: 0 }).toFloat(),
  body('discountPrice').optional({ nullable: true }).isFloat({ min: 0 }).toFloat(),
  body('category').optional().trim().notEmpty().isLength({ max: 64 }),
  body('brand').optional().trim().notEmpty().isLength({ max: 64 }),
  body('images').optional().isArray({ min: 1 }),
  body('images.*').optional().isURL(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
  body('featured').optional().isBoolean().toBoolean(),
  body('specifications').optional().isArray(),
]

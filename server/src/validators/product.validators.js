import { body, param, query } from 'express-validator'

const mongoId = param('id').isMongoId().withMessage('Invalid product id')

export const listProductValidators = [
  query('page').optional({ checkFalsy: true }).toInt().isInt({ min: 1 }),
  query('limit').optional({ checkFalsy: true }).toInt().isInt({ min: 1, max: 50 }),
  query('search').optional({ checkFalsy: true }).isString().trim().isLength({ max: 120 }),
  query('category').optional({ checkFalsy: true }).isString().trim().isLength({ max: 64 }),
  query('featured').optional({ checkFalsy: true }).isIn(['true', 'false']),
  query('trending').optional({ checkFalsy: true }).isIn(['true', 'false']),
  query('excludeId').optional({ checkFalsy: true }).isMongoId(),
  query('minPrice').optional({ checkFalsy: true }).toFloat().isFloat({ min: 0 }),
  query('maxPrice').optional({ checkFalsy: true }).toFloat().isFloat({ min: 0 }),
  query('sort').optional({ checkFalsy: true }).isIn(['newest', 'price_asc', 'price_desc', 'rating']),
]

export const idParamValidators = [mongoId]

export const slugParamValidators = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isLength({ max: 180 })
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .withMessage('Invalid slug format'),
]

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
  body('images')
    .optional()
    .isArray({ max: 24 })
    .withMessage('Images must be an array'),
  body('images.*').optional().isString().trim().isLength({ min: 1, max: 2048 }).isURL(),
  body('stock').isInt({ min: 0 }).toInt(),
  body('featured').optional().isBoolean().toBoolean(),
  body('trending').optional().isBoolean().toBoolean(),
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
  body('images').optional().isArray({ min: 1, max: 24 }),
  body('images.*').optional().isString().trim().isLength({ min: 1, max: 2048 }).isURL(),
  body('stock').optional().isInt({ min: 0 }).toInt(),
  body('featured').optional().isBoolean().toBoolean(),
  body('trending').optional().isBoolean().toBoolean(),
  body('specifications').optional().isArray(),
  body('specifications.*.name').optional().isString().trim().isLength({ max: 80 }),
  body('specifications.*.value').optional().isString().trim().isLength({ max: 240 }),
]

import { body } from 'express-validator'

export const registerValidators = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain an uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain a lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain a number'),
  body('avatar').optional({ checkFalsy: true }).isURL().withMessage('Avatar must be a valid URL'),
]

export const loginValidators = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

export const updateProfileValidators = [
  body('name').optional().trim().notEmpty().isLength({ max: 80 }),
  body('avatar').optional().isString().trim().isLength({ max: 2048 }),
  body('savedAddresses').optional().isArray({ max: 10 }),
  body('savedAddresses.*.label').optional().trim().isLength({ max: 40 }),
  body('savedAddresses.*.fullName').optional().trim().notEmpty().isLength({ max: 120 }),
  body('savedAddresses.*.line1').optional().trim().notEmpty().isLength({ max: 200 }),
  body('savedAddresses.*.line2').optional().trim().isLength({ max: 200 }),
  body('savedAddresses.*.city').optional().trim().notEmpty().isLength({ max: 80 }),
  body('savedAddresses.*.postalCode').optional().trim().notEmpty().isLength({ max: 24 }),
  body('savedAddresses.*.country').optional().trim().notEmpty().isLength({ max: 80 }),
  body('savedAddresses.*.phone').optional().trim().notEmpty().isLength({ max: 32 }),
]

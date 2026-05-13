import { Router } from 'express'
import * as productController from '../controllers/product.controller.js'
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import {
  createProductValidators,
  idParamValidators,
  listProductValidators,
  updateProductValidators,
} from '../validators/product.validators.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  validate(listProductValidators),
  asyncHandler(productController.getProducts),
)

router.get('/slug/:slug', asyncHandler(productController.getProductBySlug))

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  validate(createProductValidators),
  asyncHandler(productController.createProduct),
)

router.get('/:id', validate(idParamValidators), asyncHandler(productController.getSingleProduct))

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  validate(updateProductValidators),
  asyncHandler(productController.updateProduct),
)

router.delete(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  validate(idParamValidators),
  asyncHandler(productController.deleteProduct),
)

export default router

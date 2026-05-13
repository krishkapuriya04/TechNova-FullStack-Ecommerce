import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import * as orderController from '../controllers/order.controller.js'
import { createOrderValidators, orderIdValidators } from '../validators/order.validators.js'

const router = Router()

router.use(authenticate)

router.get('/my-orders', asyncHandler(orderController.getMyOrders))

router.post('/', validate(createOrderValidators), asyncHandler(orderController.createOrder))

router.get('/:id', validate(orderIdValidators), asyncHandler(orderController.getOrderById))

export default router

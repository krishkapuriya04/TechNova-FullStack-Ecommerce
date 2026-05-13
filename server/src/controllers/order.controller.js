import mongoose from 'mongoose'
import { Cart } from '../models/Cart.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendCreated, sendSuccess } from '../utils/apiResponse.js'
import { lineSubtotal } from '../utils/cartCalculations.js'
import { computeOrderTotals } from '../utils/orderTotals.js'

function formatOrder(order) {
  if (!order) return null
  const id = order._id?.toString?.() ?? order.id
  return {
    id,
    orderItems: order.orderItems,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    tax: order.tax,
    totalPrice: order.totalPrice,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
  }
}

export async function createOrder(req, res) {
  const userId = req.user.sub
  const cart = await Cart.findOne({ user: userId }).populate('items.product')
  if (!cart?.items?.length) {
    throw new AppError('Your cart is empty', HttpStatus.BAD_REQUEST)
  }

  const orderItems = []
  let subtotal = 0

  for (const row of cart.items) {
    const product = row.product
    if (!product) {
      throw new AppError('Invalid product in cart', HttpStatus.BAD_REQUEST)
    }
    if (product.stock < row.quantity) {
      throw new AppError(`Insufficient stock for ${product.title}`, HttpStatus.BAD_REQUEST)
    }
    const unitPrice = product.effectivePrice
    const lineTotal = lineSubtotal(unitPrice, row.quantity)
    subtotal += lineTotal
    orderItems.push({
      product: product._id,
      title: product.title,
      slug: product.slug,
      image: product.images?.[0] ?? '',
      quantity: row.quantity,
      unitPrice,
      lineTotal,
    })
  }

  const totals = computeOrderTotals(subtotal)
  const paymentMethod = req.body.paymentMethod
  if (paymentMethod === 'card' && !req.body.cardLast4) {
    throw new AppError('Enter the last 4 digits of your card', HttpStatus.BAD_REQUEST)
  }
  const paymentStatus = paymentMethod === 'card' ? 'paid' : 'pending'

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress: req.body.shippingAddress,
    paymentMethod,
    ...totals,
    paymentStatus,
  })

  const decremented = []
  try {
    for (const line of orderItems) {
      const result = await Product.updateOne(
        { _id: line.product, stock: { $gte: line.quantity } },
        { $inc: { stock: -line.quantity } },
      )
      if (result.modifiedCount !== 1) {
        throw new AppError('Stock changed while placing order — please try again', HttpStatus.CONFLICT)
      }
      decremented.push(line)
    }
  } catch (err) {
    for (const line of decremented) {
      await Product.updateOne({ _id: line.product }, { $inc: { stock: line.quantity } })
    }
    await Order.deleteOne({ _id: order._id })
    throw err
  }

  cart.items = []
  await cart.save()

  sendCreated(res, { order: formatOrder(order) }, 'Order placed successfully')
}

export async function getMyOrders(req, res) {
  const orders = await Order.find({ user: req.user.sub })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean()

  sendSuccess(
    res,
    {
      orders: orders.map((o) => ({
        id: o._id.toString(),
        totalPrice: o.totalPrice,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        itemCount: o.orderItems.reduce((s, i) => s + i.quantity, 0),
        createdAt: o.createdAt,
        previewImage: o.orderItems[0]?.image ?? '',
      })),
    },
  )
}

export async function getOrderById(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid order id', HttpStatus.BAD_REQUEST)
  }

  const order = await Order.findOne({ _id: id, user: req.user.sub }).lean()
  if (!order) {
    throw new AppError('Order not found', HttpStatus.NOT_FOUND)
  }

  sendSuccess(res, { order: formatOrder(order) })
}

import mongoose from 'mongoose'
import { Order } from '../models/Order.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendSuccess } from '../utils/apiResponse.js'

function mapAdminOrder(doc) {
  const u = doc.user
  return {
    id: doc._id.toString(),
    userId: doc.user?._id?.toString?.() ?? doc.user?.toString?.() ?? '',
    customerName: u?.name ?? '—',
    customerEmail: u?.email ?? '',
    totalPrice: doc.totalPrice,
    orderStatus: doc.orderStatus,
    paymentStatus: doc.paymentStatus,
    paymentMethod: doc.paymentMethod,
    itemCount: doc.orderItems.reduce((s, i) => s + i.quantity, 0),
    createdAt: doc.createdAt,
    previewImage: doc.orderItems[0]?.image ?? '',
  }
}

function mapAdminOrderDetail(doc) {
  return {
    id: doc._id.toString(),
    userId: doc.user?._id?.toString?.() ?? doc.user?.toString?.() ?? '',
    customerName: doc.user?.name ?? '—',
    customerEmail: doc.user?.email ?? '',
    orderItems: doc.orderItems,
    shippingAddress: doc.shippingAddress,
    paymentMethod: doc.paymentMethod,
    subtotal: doc.subtotal,
    shippingFee: doc.shippingFee,
    tax: doc.tax,
    totalPrice: doc.totalPrice,
    orderStatus: doc.orderStatus,
    paymentStatus: doc.paymentStatus,
    createdAt: doc.createdAt,
  }
}

export async function listAdminOrders(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const skip = (page - 1) * limit
  const status = req.query.status
  const filter = {}
  if (status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    filter.orderStatus = status
  }

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email')
      .lean(),
    Order.countDocuments(filter),
  ])

  sendSuccess(res, {
    orders: items.map(mapAdminOrder),
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
}

export async function getAdminOrder(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid order id', HttpStatus.BAD_REQUEST)
  }
  const order = await Order.findById(id).populate('user', 'name email').lean()
  if (!order) {
    throw new AppError('Order not found', HttpStatus.NOT_FOUND)
  }
  sendSuccess(res, { order: mapAdminOrderDetail(order) })
}

export async function updateAdminOrderStatus(req, res) {
  const { id } = req.params
  const { orderStatus } = req.body
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid order id', HttpStatus.BAD_REQUEST)
  }
  const order = await Order.findById(id)
  if (!order) {
    throw new AppError('Order not found', HttpStatus.NOT_FOUND)
  }
  order.orderStatus = orderStatus
  await order.save()
  const fresh = await Order.findById(id).populate('user', 'name email').lean()
  sendSuccess(res, { order: mapAdminOrderDetail(fresh) }, 'Order status updated')
}

export async function updateAdminPaymentStatus(req, res) {
  const { id } = req.params
  const { paymentStatus } = req.body
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid order id', HttpStatus.BAD_REQUEST)
  }
  const order = await Order.findById(id)
  if (!order) {
    throw new AppError('Order not found', HttpStatus.NOT_FOUND)
  }
  order.paymentStatus = paymentStatus
  await order.save()
  const fresh = await Order.findById(id).populate('user', 'name email').lean()
  sendSuccess(res, { order: mapAdminOrderDetail(fresh) }, 'Payment status updated')
}

import mongoose from 'mongoose'
import { Coupon } from '../models/Coupon.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendCreated, sendSuccess } from '../utils/apiResponse.js'

function mapCoupon(doc) {
  return {
    id: doc._id.toString(),
    code: doc.code,
    discountType: doc.discountType,
    discountValue: doc.discountValue,
    minimumOrder: doc.minimumOrder,
    expiryDate: doc.expiryDate,
    active: doc.active,
    usageCount: doc.usageCount,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  }
}

export async function listCoupons(req, res) {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean()
  sendSuccess(res, { coupons: coupons.map(mapCoupon) })
}

export async function createCoupon(req, res) {
  const payload = { ...req.body, code: String(req.body.code).trim().toUpperCase() }
  try {
    const doc = await Coupon.create(payload)
    sendCreated(res, { coupon: mapCoupon(doc.toObject()) }, 'Coupon created')
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('Coupon code already exists', HttpStatus.CONFLICT)
    }
    throw err
  }
}

export async function updateCoupon(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid coupon id', HttpStatus.BAD_REQUEST)
  }
  const coupon = await Coupon.findById(id)
  if (!coupon) {
    throw new AppError('Coupon not found', HttpStatus.NOT_FOUND)
  }
  const b = req.body
  if (b.code != null) coupon.code = String(b.code).trim().toUpperCase()
  if (b.discountType != null) coupon.discountType = b.discountType
  if (b.discountValue != null) coupon.discountValue = b.discountValue
  if (b.minimumOrder != null) coupon.minimumOrder = b.minimumOrder
  if (b.expiryDate != null) coupon.expiryDate = b.expiryDate
  if (b.active != null) coupon.active = b.active
  await coupon.save()
  sendSuccess(res, { coupon: mapCoupon(coupon.toObject()) }, 'Coupon updated')
}

export async function deleteCoupon(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid coupon id', HttpStatus.BAD_REQUEST)
  }
  const doc = await Coupon.findByIdAndDelete(id)
  if (!doc) {
    throw new AppError('Coupon not found', HttpStatus.NOT_FOUND)
  }
  sendSuccess(res, { id: doc._id.toString() }, 'Coupon deleted')
}

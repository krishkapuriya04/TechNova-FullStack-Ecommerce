import mongoose from 'mongoose'
import { User } from '../models/User.js'
import { Order } from '../models/Order.js'
import { HttpStatus } from '../constants/httpStatus.js'
import { AppError } from '../utils/AppError.js'
import { sendSuccess } from '../utils/apiResponse.js'

export async function listAdminUsers(req, res) {
  const page = Number(req.query.page) || 1
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const skip = (page - 1) * limit
  const search = (req.query.search ?? '').trim()

  const filter = {}
  if (search) {
    filter.$or = [
      { name: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { email: new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
    ]
  }

  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-password').lean(),
    User.countDocuments(filter),
  ])

  sendSuccess(res, {
    users: items.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      createdAt: u.createdAt,
    })),
    meta: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  })
}

export async function updateAdminUserRole(req, res) {
  const { id } = req.params
  const { role } = req.body
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid user id', HttpStatus.BAD_REQUEST)
  }
  const user = await User.findById(id)
  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND)
  }

  const adminCount = await User.countDocuments({ role: 'admin' })
  if (user.role === 'admin' && role === 'user' && adminCount <= 1) {
    throw new AppError('Cannot remove the last admin account', HttpStatus.CONFLICT)
  }

  user.role = role
  await user.save()

  sendSuccess(res, { user: user.toSafeObject() }, 'Role updated')
}

export async function deleteAdminUser(req, res) {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid user id', HttpStatus.BAD_REQUEST)
  }
  if (id === req.user.sub) {
    throw new AppError('You cannot delete your own account', HttpStatus.BAD_REQUEST)
  }

  const user = await User.findById(id)
  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND)
  }

  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' })
    if (adminCount <= 1) {
      throw new AppError('Cannot delete the last admin account', HttpStatus.CONFLICT)
    }
  }

  const orderCount = await Order.countDocuments({ user: id })
  if (orderCount > 0) {
    throw new AppError('Cannot delete a user with existing orders', HttpStatus.CONFLICT)
  }

  await User.deleteOne({ _id: id })
  sendSuccess(res, { id }, 'User deleted')
}

import { User } from '../models/User.js'
import { Order } from '../models/Order.js'
import { Product } from '../models/Product.js'

const MS_DAY = 86_400_000

function startOfMonthsAgo(months) {
  const d = new Date()
  d.setMonth(d.getMonth() - (months - 1))
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getEntityCounts() {
  const [totalUsers, totalOrders, totalProducts] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
  ])
  return { totalUsers, totalOrders, totalProducts }
}

/** Sum order totals excluding cancelled orders. */
export async function getTotalRevenue() {
  const [row] = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: null, revenue: { $sum: '$totalPrice' } } },
  ])
  return row?.revenue ?? 0
}

export async function getMonthlySales(months = 12) {
  const since = startOfMonthsAgo(months)
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $year: '$createdAt' },
          m: { $month: '$createdAt' },
        },
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } },
  ])

  return rows.map((r) => ({
    year: r._id.y,
    month: r._id.m,
    key: `${r._id.y}-${String(r._id.m).padStart(2, '0')}`,
    label: `${r._id.y}-${String(r._id.m).padStart(2, '0')}`,
    revenue: Math.round(r.revenue * 100) / 100,
    orders: r.orders,
  }))
}

export async function getLatestOrders(limit = 10) {
  const docs = await Order.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email')
    .lean()

  return docs.map((o) => ({
    id: o._id.toString(),
    totalPrice: o.totalPrice,
    orderStatus: o.orderStatus,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    itemCount: o.orderItems.reduce((s, i) => s + i.quantity, 0),
    createdAt: o.createdAt,
    customerName: o.user?.name ?? '—',
    customerEmail: o.user?.email ?? '',
  }))
}

export async function getLatestUsers(limit = 10) {
  const docs = await User.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('name email role createdAt')
    .lean()

  return docs.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
  }))
}

export async function getOrdersTrend(days = 14) {
  const since = new Date(Date.now() - days * MS_DAY)
  const rows = await Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: {
          y: { $year: '$createdAt' },
          m: { $month: '$createdAt' },
          d: { $dayOfMonth: '$createdAt' },
        },
        orders: { $sum: 1 },
        revenue: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } },
  ])

  return rows.map((r) => ({
    key: `${r._id.y}-${String(r._id.m).padStart(2, '0')}-${String(r._id.d).padStart(2, '0')}`,
    orders: r.orders,
    revenue: Math.round(r.revenue * 100) / 100,
  }))
}

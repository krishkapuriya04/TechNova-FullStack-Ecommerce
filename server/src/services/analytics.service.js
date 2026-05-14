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

const LOW_STOCK_THRESHOLD = 8

export async function getInventorySummary() {
  const [lowStock, outOfStock, totalSkus] = await Promise.all([
    Product.countDocuments({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } }),
    Product.countDocuments({ stock: 0 }),
    Product.countDocuments(),
  ])
  return { lowStock, outOfStock, totalSkus, lowStockThreshold: LOW_STOCK_THRESHOLD }
}

export async function getLowStockProducts(limit = 8) {
  const docs = await Product.find({ stock: { $gt: 0, $lte: LOW_STOCK_THRESHOLD } })
    .sort({ stock: 1, updatedAt: -1 })
    .limit(limit)
    .select('title slug stock category brand')
    .lean()
  return docs.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    stock: p.stock,
    category: p.category,
    brand: p.brand,
  }))
}

export async function getTopSellingProducts(limit = 6) {
  const rows = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $unwind: '$orderItems' },
    {
      $group: {
        _id: '$orderItems.slug',
        title: { $first: '$orderItems.title' },
        units: { $sum: '$orderItems.quantity' },
        revenue: { $sum: '$orderItems.lineTotal' },
      },
    },
    { $sort: { units: -1 } },
    { $limit: limit },
  ])
  return rows.map((r) => ({
    slug: r._id,
    title: r.title,
    unitsSold: r.units,
    revenue: Math.round(r.revenue * 100) / 100,
  }))
}

export async function getTrendingCatalogSnapshot(limit = 6) {
  const docs = await Product.find({ trending: true })
    .sort({ 'ratings.average': -1, updatedAt: -1 })
    .limit(limit)
    .select('title slug category brand stock ratings images')
    .lean()
  return docs.map((p) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    category: p.category,
    brand: p.brand,
    stock: p.stock,
    ratings: p.ratings,
    thumb: p.images?.[0] ?? '',
  }))
}

export async function getRecentActivities(limit = 12) {
  const [orderRows, userRows] = await Promise.all([
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 2))
      .populate('user', 'name email')
      .select('totalPrice orderStatus createdAt user')
      .lean(),
    User.find({})
      .sort({ createdAt: -1 })
      .limit(Math.ceil(limit / 2))
      .select('name email role createdAt')
      .lean(),
  ])

  const activities = []
  for (const o of orderRows) {
    activities.push({
      id: `ord-${o._id}`,
      type: 'order',
      label: `Order ${o.orderStatus}`,
      detail: `${o.user?.name ?? 'Customer'} · $${Math.round(o.totalPrice * 100) / 100}`,
      at: o.createdAt,
    })
  }
  for (const u of userRows) {
    activities.push({
      id: `usr-${u._id}`,
      type: 'user',
      label: 'New account',
      detail: `${u.name} (${u.role})`,
      at: u.createdAt,
    })
  }
  activities.sort((a, b) => new Date(b.at) - new Date(a.at))
  return activities.slice(0, limit)
}

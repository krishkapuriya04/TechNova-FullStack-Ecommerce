import { sendSuccess } from '../utils/apiResponse.js'
import * as analytics from '../services/analytics.service.js'

export async function getAnalyticsOverview(req, res) {
  const [counts, totalRevenue, monthlySales, latestOrders, latestUsers, ordersTrend] =
    await Promise.all([
      analytics.getEntityCounts(),
      analytics.getTotalRevenue(),
      analytics.getMonthlySales(12),
      analytics.getLatestOrders(8),
      analytics.getLatestUsers(8),
      analytics.getOrdersTrend(14),
    ])

  sendSuccess(res, {
    ...counts,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    monthlySales,
    latestOrders,
    latestUsers,
    ordersTrend,
  })
}

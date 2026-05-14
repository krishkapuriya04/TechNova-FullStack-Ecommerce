import { sendSuccess } from '../utils/apiResponse.js'
import * as analytics from '../services/analytics.service.js'

export async function getAnalyticsOverview(req, res) {
  const [
    counts,
    totalRevenue,
    monthlySales,
    latestOrders,
    latestUsers,
    ordersTrend,
    inventory,
    lowStockProducts,
    topSelling,
    trendingSnapshot,
    activities,
  ] = await Promise.all([
    analytics.getEntityCounts(),
    analytics.getTotalRevenue(),
    analytics.getMonthlySales(12),
    analytics.getLatestOrders(8),
    analytics.getLatestUsers(8),
    analytics.getOrdersTrend(14),
    analytics.getInventorySummary(),
    analytics.getLowStockProducts(8),
    analytics.getTopSellingProducts(6),
    analytics.getTrendingCatalogSnapshot(6),
    analytics.getRecentActivities(12),
  ])

  sendSuccess(res, {
    ...counts,
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    monthlySales,
    latestOrders,
    latestUsers,
    ordersTrend,
    inventory,
    lowStockProducts,
    topSelling,
    trendingSnapshot,
    activities,
  })
}

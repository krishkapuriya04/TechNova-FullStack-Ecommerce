import { apiClient } from '@/services/api/index.js'

export async function fetchAdminAnalyticsOverview() {
  const { data } = await apiClient.get('/admin/analytics/overview')
  return data.data
}

export async function fetchAdminProducts(params) {
  const { data } = await apiClient.get('/admin/products', { params })
  return data.data
}

export async function fetchAdminOrders(params) {
  const { data } = await apiClient.get('/admin/orders', { params })
  return data.data
}

export async function fetchAdminOrder(id) {
  const { data } = await apiClient.get(`/admin/orders/${id}`)
  return data.data.order
}

export async function updateAdminOrderStatus(id, orderStatus) {
  const { data } = await apiClient.patch(`/admin/orders/${id}/status`, { orderStatus })
  return data.data.order
}

export async function updateAdminPaymentStatus(id, paymentStatus) {
  const { data } = await apiClient.patch(`/admin/orders/${id}/payment`, { paymentStatus })
  return data.data.order
}

export async function fetchAdminUsers(params) {
  const { data } = await apiClient.get('/admin/users', { params })
  return data.data
}

export async function updateAdminUserRole(id, role) {
  const { data } = await apiClient.patch(`/admin/users/${id}/role`, { role })
  return data.data.user
}

export async function deleteAdminUser(id) {
  const { data } = await apiClient.delete(`/admin/users/${id}`)
  return data.data
}

export async function patchAdminProductStock(id, stock) {
  const { data } = await apiClient.patch(`/admin/products/${id}/stock`, { stock })
  return data.data.product
}

export async function fetchAdminCoupons() {
  const { data } = await apiClient.get('/admin/coupons')
  return data.data.coupons
}

export async function createAdminCoupon(body) {
  const { data } = await apiClient.post('/admin/coupons', body)
  return data.data.coupon
}

export async function updateAdminCoupon(id, body) {
  const { data } = await apiClient.patch(`/admin/coupons/${id}`, body)
  return data.data.coupon
}

export async function deleteAdminCoupon(id) {
  const { data } = await apiClient.delete(`/admin/coupons/${id}`)
  return data.data
}

export async function fetchAdminReviews(params) {
  const { data } = await apiClient.get('/admin/reviews', { params })
  return data.data
}

export async function deleteAdminReview(id) {
  const { data } = await apiClient.delete(`/admin/reviews/${id}`)
  return data.data
}

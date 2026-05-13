import { apiClient } from '@/services/api/index.js'

export async function createOrderRequest(payload) {
  const { data } = await apiClient.post('/orders', payload)
  return data.data.order
}

export async function fetchMyOrders() {
  const { data } = await apiClient.get('/orders/my-orders')
  return data.data.orders
}

export async function fetchOrderById(orderId) {
  const { data } = await apiClient.get(`/orders/${orderId}`)
  return data.data.order
}

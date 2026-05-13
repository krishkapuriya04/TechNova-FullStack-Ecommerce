import { apiClient } from '@/services/api/index.js'

export async function fetchCart() {
  const { data } = await apiClient.get('/cart')
  return data.data.cart
}

export async function addToCartRequest({ productId, quantity }) {
  const { data } = await apiClient.post('/cart', { productId, quantity })
  return data.data.cart
}

export async function updateCartItemRequest(itemId, quantity) {
  const { data } = await apiClient.patch(`/cart/${itemId}`, { quantity })
  return data.data.cart
}

export async function removeCartItemRequest(itemId) {
  const { data } = await apiClient.delete(`/cart/${itemId}`)
  return data.data.cart
}

export async function clearCartRequest() {
  const { data } = await apiClient.delete('/cart')
  return data.data.cart
}

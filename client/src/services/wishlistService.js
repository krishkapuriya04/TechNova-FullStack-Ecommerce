import { apiClient } from '@/services/api/index.js'

export async function fetchWishlist() {
  const { data } = await apiClient.get('/wishlist')
  return data.data.products
}

export async function addToWishlistRequest(productId) {
  const { data } = await apiClient.post('/wishlist', { productId })
  return data.data.products
}

export async function removeFromWishlistRequest(productId) {
  const { data } = await apiClient.delete(`/wishlist/${productId}`)
  return data.data.products
}

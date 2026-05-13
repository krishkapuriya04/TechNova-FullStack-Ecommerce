import { apiClient } from '@/services/api/index.js'

export async function fetchProducts(params) {
  const { data } = await apiClient.get('/products', { params })
  return data.data
}

export async function fetchProductBySlug(slug) {
  const { data } = await apiClient.get(`/products/slug/${slug}`)
  return data.data.product
}

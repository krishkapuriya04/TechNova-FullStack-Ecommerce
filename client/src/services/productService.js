import { apiClient } from '@/services/api/index.js'

export async function fetchProducts(params) {
  const { data } = await apiClient.get('/products', { params })
  return data.data
}

export async function fetchProductBySlug(slug) {
  const { data } = await apiClient.get(`/products/slug/${slug}`)
  return data.data.product
}

export async function createProduct(payload) {
  const { data } = await apiClient.post('/products', payload)
  return data.data.product
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/products/${id}`, payload)
  return data.data.product
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`)
  return data.data
}

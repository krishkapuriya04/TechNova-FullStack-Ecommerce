import axios from 'axios'
import { apiClient } from '@/services/api/index.js'
import { resolveProductImages } from '@/utils/productImages.js'

function normalizeProduct(product) {
  if (!product) return product
  return {
    ...product,
    images: resolveProductImages(product.images, product.slug ?? product.id),
  }
}

function normalizeProductList(payload) {
  if (!payload) return payload
  return {
    ...payload,
    products: (payload.products ?? []).map(normalizeProduct),
  }
}

/**
 * Drops empty / null query values so the API does not receive "", which can break validators.
 * @param {Record<string, string>} raw
 */
export function normalizeProductListParams(raw) {
  const out = {}
  for (const [key, value] of Object.entries(raw ?? {})) {
    if (value === '' || value === undefined || value === null) continue
    out[key] = value
  }
  return out
}

export async function fetchProducts(params, axiosConfig = {}) {
  const clean = normalizeProductListParams(params)
  const { data } = await apiClient.get('/products', { params: clean, ...axiosConfig })
  return normalizeProductList(data.data)
}

export async function fetchProductBySlug(slug, axiosConfig = {}) {
  const { data } = await apiClient.get(`/products/slug/${slug}`, axiosConfig)
  return normalizeProduct(data.data.product)
}

export async function createProduct(payload) {
  const { data } = await apiClient.post('/products', payload)
  return normalizeProduct(data.data.product)
}

export async function updateProduct(id, payload) {
  const { data } = await apiClient.put(`/products/${id}`, payload)
  return normalizeProduct(data.data.product)
}

export async function deleteProduct(id) {
  const { data } = await apiClient.delete(`/products/${id}`)
  return data.data
}

export function isCancelledRequest(error) {
  return axios.isCancel(error) || error?.code === 'ERR_CANCELED'
}

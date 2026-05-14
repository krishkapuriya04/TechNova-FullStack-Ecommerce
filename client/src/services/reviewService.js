import { apiClient } from '@/services/api/index.js'

export async function fetchProductReviews(productId) {
  const { data } = await apiClient.get(`/reviews/product/${productId}`)
  return data.data
}

export async function createReviewRequest(body) {
  const { data } = await apiClient.post('/reviews', body)
  return data.data.review
}

export async function updateReviewRequest(id, body) {
  const { data } = await apiClient.patch(`/reviews/${id}`, body)
  return data.data.review
}

export async function deleteReviewRequest(id) {
  const { data } = await apiClient.delete(`/reviews/${id}`)
  return data.data
}

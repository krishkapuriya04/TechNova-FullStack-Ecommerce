import { apiClient } from '@/services/api/index.js'

export async function validateCouponRequest({ code, subtotal }) {
  const { data } = await apiClient.post('/coupons/validate', { code, subtotal })
  return data.data
}

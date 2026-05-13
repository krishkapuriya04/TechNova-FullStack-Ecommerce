import { apiClient } from '@/services/api/index.js'

/** Example service — hits the Express health endpoint */
export async function fetchApiHealth() {
  const { data } = await apiClient.get('/health')
  return data
}

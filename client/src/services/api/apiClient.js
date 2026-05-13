import axios from 'axios'
import { env } from '@/config/env.js'
import { AUTH_LOGOUT_EVENT, STORAGE_KEYS } from '@/constants/storageKeys.js'

/**
 * Single Axios instance for all API calls. Uses Vite dev proxy for `/api` in development.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/register']

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''

    if (status === 401 && !PUBLIC_AUTH_PATHS.some((path) => url.includes(path))) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
      window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
    }

    return Promise.reject(error)
  },
)

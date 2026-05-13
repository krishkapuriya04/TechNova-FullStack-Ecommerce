import axios from 'axios'
import { env } from '@/config/env.js'

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

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place for 401 handling, refresh tokens, etc.
    return Promise.reject(error)
  },
)

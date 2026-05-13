/**
 * Typed access to Vite public env. Only `VITE_*` variables are exposed to the client.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}

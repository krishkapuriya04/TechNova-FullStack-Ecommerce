/** API versioning and path prefixes */
export const API_PREFIX = '/api'
export const API_VERSION = 'v1'

export const apiPath = (segment = '') =>
  `${API_PREFIX}/${API_VERSION}${segment ? `/${segment}` : ''}`

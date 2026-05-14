export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error?.response) {
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      return 'Network error — check that the API is running and CORS allows this origin.'
    }
    return fallback
  }

  const data = error.response.data
  if (!data) return fallback

  if (typeof data.message === 'string' && data.message.trim()) {
    const msg = data.message.trim()
    if (msg === 'Validation failed' && Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0]
      if (typeof first === 'string') return first
      if (first?.msg) return first.msg
      if (first?.message) return first.message
    }
    return msg
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0]
    if (typeof first === 'string') return first
    if (first?.msg) return first.msg
    if (first?.message) return first.message
  }

  return fallback
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  const data = error?.response?.data
  if (!data) return fallback

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0]
    if (typeof first === 'string') return first
    if (first?.msg) return first.msg
    if (first?.message) return first.message
  }

  return fallback
}

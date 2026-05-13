const STORAGE_KEY = 'technova-recent-searches'
const MAX = 8

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : []
  } catch {
    return []
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota */
  }
}

export function getRecentSearches() {
  if (typeof window === 'undefined') return []
  return read()
}

export function pushRecentSearch(term) {
  if (typeof window === 'undefined') return
  const t = term.trim()
  if (t.length < 2) return
  const prev = read().filter((x) => x.toLowerCase() !== t.toLowerCase())
  write([t, ...prev].slice(0, MAX))
}

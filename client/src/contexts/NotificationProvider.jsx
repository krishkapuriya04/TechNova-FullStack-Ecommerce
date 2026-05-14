import { useCallback, useMemo, useState } from 'react'
import { NotificationContext } from '@/contexts/notification-context.js'

function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `n-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([])

  const push = useCallback((partial) => {
    const entry = {
      id: makeId(),
      at: Date.now(),
      message: '',
      ...partial,
    }
    setItems((prev) => [entry, ...prev].slice(0, 40))
    return entry.id
  }, [])

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({ items, push, dismiss, clear }), [items, push, dismiss, clear])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

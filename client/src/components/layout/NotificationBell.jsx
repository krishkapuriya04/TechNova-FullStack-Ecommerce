import { useMemo, useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications.js'

export function NotificationBell() {
  const { items, dismiss, clear } = useNotifications()
  const [open, setOpen] = useState(false)

  const unreadLabel = useMemo(() => (items.length ? String(items.length) : ''), [items.length])

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-tn border border-zinc-200 text-sm font-semibold text-zinc-800 transition hover:border-sky-300/70 dark:border-white/10 dark:text-zinc-100 dark:hover:border-sky-500/35"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Notifications"
      >
        <span className="sr-only">Notifications</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M12 22a2 2 0 002-2H10a2 2 0 002 2z" />
          <path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z" />
        </svg>
        {items.length ? (
          <span className="absolute -right-1 -top-1 min-w-[1.1rem] rounded-full bg-sky-600 px-1 text-[10px] font-bold leading-none text-white dark:bg-sky-400 dark:text-tn-950">
            {items.length > 9 ? '9+' : unreadLabel}
          </span>
        ) : null}
      </button>
      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-[45]" aria-label="Close notifications" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 z-[46] mt-2 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-tn-xl border border-zinc-200 bg-white shadow-xl dark:border-white/10 dark:bg-tn-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Activity</p>
              {items.length ? (
                <button type="button" className="text-xs font-semibold text-sky-700 dark:text-sky-300" onClick={clear}>
                  Clear
                </button>
              ) : null}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-zinc-500">You are all caught up.</li>
              ) : (
                items.map((n) => (
                  <li key={n.id} className="border-b border-zinc-100 px-3 py-2 text-sm last:border-b-0 dark:border-white/5">
                    <div className="flex justify-between gap-2">
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{n.title}</p>
                        {n.message ? <p className="text-xs text-zinc-500 dark:text-zinc-400">{n.message}</p> : null}
                      </div>
                      <button type="button" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200" onClick={() => dismiss(n.id)}>
                        ×
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  )
}

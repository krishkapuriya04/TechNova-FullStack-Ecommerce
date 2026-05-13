const ORDER_STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  processing: 'bg-sky-500/15 text-sky-800 dark:text-sky-200',
  shipped: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-200',
  delivered: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
  cancelled: 'bg-zinc-500/15 text-zinc-700 dark:text-zinc-300',
}

const PAYMENT_STATUS_STYLES = {
  pending: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  paid: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
  failed: 'bg-red-500/15 text-red-800 dark:text-red-200',
}

export function orderStatusBadgeClass(status) {
  return ORDER_STATUS_STYLES[status] ?? ORDER_STATUS_STYLES.pending
}

export function paymentStatusBadgeClass(status) {
  return PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES.pending
}

export function formatOrderMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

export function formatShortDate(iso) {
  if (!iso) return '—'
  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return '—'
  }
}

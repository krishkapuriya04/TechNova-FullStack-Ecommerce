export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
    </div>
  )
}

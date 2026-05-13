function Star({ filled }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-4 w-4 ${filled ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z"
      />
    </svg>
  )
}

export function RatingStars({ value, reviewCount }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < full} />
        ))}
      </div>
      {typeof reviewCount === 'number' ? (
        <span className="text-xs text-zinc-500 dark:text-zinc-500">({reviewCount})</span>
      ) : null}
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`tn-shimmer relative overflow-hidden rounded-md bg-zinc-200/75 dark:bg-zinc-800/75 ${className}`}
      aria-hidden
    />
  )
}

export function SkeletonText({ lines = 2 }) {
  return (
    <div className="space-y-2" aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={i === lines - 1 ? 'h-3 w-2/3' : 'h-3 w-full'}
        />
      ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-zinc-200/80 bg-white/90 shadow-[0_18px_40px_-22px_rgb(0_0_0/0.15)] dark:border-white/[0.07] dark:bg-zinc-950/80 dark:shadow-[0_24px_50px_-28px_rgb(0_0_0/0.6)]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

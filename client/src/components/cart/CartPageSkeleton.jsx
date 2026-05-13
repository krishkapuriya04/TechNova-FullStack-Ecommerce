import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'

export function CartPageSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-tn-xl border border-zinc-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-tn-900/70 sm:flex-row"
          >
            <Skeleton className="h-24 w-full shrink-0 sm:w-28" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-72 w-full rounded-tn-2xl" />
    </div>
  )
}

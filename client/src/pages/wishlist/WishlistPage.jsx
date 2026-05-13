import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { WishlistCard } from '@/components/wishlist/WishlistCard.jsx'
import { EmptyWishlistState } from '@/components/wishlist/EmptyWishlistState.jsx'
import { Skeleton } from '@/components/ui/LoadingSkeleton.jsx'
import { useWishlist } from '@/hooks/useWishlist.js'

function WishlistGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-96 rounded-tn-xl" />
      ))}
    </div>
  )
}

export function WishlistPage() {
  const { products, loading } = useWishlist()
  const hasItems = products.length > 0

  return (
    <div className="tn-section-y">
      <div className="tn-container space-y-10">
        <SectionTitle
          eyebrow="Saved"
          title="Wishlist"
          subtitle="Curate products you love — move them to cart when you are ready to buy."
        />

        {loading && !hasItems ? <WishlistGridSkeleton /> : null}

        {!loading && !hasItems ? <EmptyWishlistState /> : null}

        {hasItems ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

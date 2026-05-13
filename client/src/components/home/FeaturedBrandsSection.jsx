import { featuredBrands } from '@/data/mockHomeFeed.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { BrandCard } from '@/components/ui/BrandCard.jsx'

export function FeaturedBrandsSection() {
  return (
    <section className="border-t border-zinc-200/80 bg-white/60 py-16 dark:border-white/5 dark:bg-tn-900/40">
      <div className="tn-container">
        <SectionTitle
          eyebrow="Partners"
          title="Featured brands"
          subtitle="Each tile jumps into a live shop search — perfect for partner landing pages while you wait on official marks."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}

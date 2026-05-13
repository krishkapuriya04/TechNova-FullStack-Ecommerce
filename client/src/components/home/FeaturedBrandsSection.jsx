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
          subtitle="Logo-ready cards with consistent spacing — drop in SVG marks when design hands off assets."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {featuredBrands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { featuredBrands } from '@/data/mockHomeFeed.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { BrandCard } from '@/components/ui/BrandCard.jsx'

export function FeaturedBrandsSection() {
  return (
    <section className="relative overflow-hidden border-t border-zinc-200/70 bg-gradient-to-b from-white to-zinc-50 py-16 dark:border-white/[0.06] dark:from-tn-950 dark:to-black">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
      <div className="tn-container relative">
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

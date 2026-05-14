import { featuredCategories } from '@/data/mockHomeFeed.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { CategoryCard } from '@/components/ui/CategoryCard.jsx'

export function FeaturedCategoriesSection() {
  return (
    <section className="relative overflow-hidden border-y border-zinc-200/70 py-16 dark:border-white/[0.06]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-100/95 via-zinc-50 to-white dark:from-tn-void dark:via-tn-950 dark:to-black" />
      <div className="tn-container relative">
        <SectionTitle
          eyebrow="Browse"
          title="Featured categories"
          subtitle="High-intent collections — swap data for CMS or API-driven categories."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  )
}

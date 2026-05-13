import { featuredCategories } from '@/data/mockHomeFeed.js'
import { SectionTitle } from '@/components/ui/SectionTitle.jsx'
import { CategoryCard } from '@/components/ui/CategoryCard.jsx'

export function FeaturedCategoriesSection() {
  return (
    <section className="border-y border-zinc-200/80 bg-zinc-50/80 py-16 dark:border-white/5 dark:bg-tn-950/60">
      <div className="tn-container">
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

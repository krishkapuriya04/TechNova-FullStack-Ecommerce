import { HeroSection } from '@/components/home/HeroSection.jsx'
import { FeaturedCategoriesSection } from '@/components/home/FeaturedCategoriesSection.jsx'
import { TrendingProductsSection } from '@/components/home/TrendingProductsSection.jsx'
import { FeaturedBrandsSection } from '@/components/home/FeaturedBrandsSection.jsx'
import { PromotionalBannerSection } from '@/components/home/PromotionalBannerSection.jsx'
import { NewsletterSection } from '@/components/home/NewsletterSection.jsx'

export function HomePage() {
  return (
    <div className="bg-zinc-50 dark:bg-tn-void">
      <HeroSection />
      <FeaturedCategoriesSection />
      <TrendingProductsSection />
      <FeaturedBrandsSection />
      <PromotionalBannerSection />
      <NewsletterSection />
    </div>
  )
}

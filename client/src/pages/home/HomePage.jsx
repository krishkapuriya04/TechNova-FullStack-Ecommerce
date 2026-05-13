import { HeroSection } from '@/components/home/HeroSection.jsx'
import { TrustShippingSection } from '@/components/home/TrustShippingSection.jsx'
import { FeaturedCategoriesSection } from '@/components/home/FeaturedCategoriesSection.jsx'
import { TrendingProductsSection } from '@/components/home/TrendingProductsSection.jsx'
import { FeaturedCollectionsSection } from '@/components/home/FeaturedCollectionsSection.jsx'
import { GamingShowcaseSection } from '@/components/home/GamingShowcaseSection.jsx'
import { FeaturedBrandsSection } from '@/components/home/FeaturedBrandsSection.jsx'
import { PromotionalBannerSection } from '@/components/home/PromotionalBannerSection.jsx'
import { NewsletterSection } from '@/components/home/NewsletterSection.jsx'
import { Seo } from '@/components/seo/Seo.jsx'
import { SEO_DEFAULTS } from '@/constants/seoDefaults.js'

export function HomePage() {
  return (
    <>
      <Seo title="Premium electronics" canonicalPath="/" description={SEO_DEFAULTS.description} />
      <div className="bg-zinc-50 dark:bg-tn-void">
      <HeroSection />
      <TrustShippingSection />
      <FeaturedCategoriesSection />
      <TrendingProductsSection />
      <FeaturedCollectionsSection />
      <GamingShowcaseSection />
      <FeaturedBrandsSection />
      <PromotionalBannerSection />
      <NewsletterSection />
    </div>
    </>
  )
}

import { HeroEditorialCampaign } from '@/components/home/HeroEditorialCampaign';
import { MasterpieceGalleryShowcase } from '@/components/home/MasterpieceGalleryShowcase';
import { CollectionGallery } from '@/components/home/CollectionGallery';
import { FeaturedProductSection } from '@/components/home/FeaturedProductSection';
import { BridalExperienceSection } from '@/components/home/BridalExperienceSection';
import { BrandStorySection } from '@/components/home/BrandStorySection';
import { FinalStatementSection } from '@/components/home/FinalStatementSection';

export default function HomePage() {
  return (
    <div className="relative w-full overflow-x-clip bg-[#080807]">
      {/* High-Fashion Editorial Campaign Hero */}
      <HeroEditorialCampaign />

      {/* Masterpiece Gallery Showcase */}
      <MasterpieceGalleryShowcase />

      {/* The Four Foundations: Curated Collections Gallery */}
      <CollectionGallery />

      {/* Featured Jewellery Product (Spotlight Creation) */}
      <FeaturedProductSection />

      {/* Bridal Experience */}
      <BridalExperienceSection />

      {/* Brand Heritage & Boutique Information */}
      <BrandStorySection />

      {/* Final Statement */}
      <FinalStatementSection />
    </div>
  );
}

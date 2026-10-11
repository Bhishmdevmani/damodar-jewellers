import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export function BrandStorySection() {
  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto z-20 border-t border-[rgba(201,164,92,0.1)]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Left Column: Authentic Brand Heritage (7 cols) */}
        <div className="lg:col-span-7">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3 sm:mb-4 font-light">
            Our Heritage
          </span>

          <h2
            className="text-3xl sm:text-display-md lg:text-display-lg font-light text-[#F5F0E7] mb-6 sm:mb-8 leading-[1.08]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Rooted in Tradition. <br />
            <span className="text-gold-gradient italic font-normal">Crafted for Generations.</span>
          </h2>

          <div className="space-y-5 text-sm sm:text-base text-[#A8A197] font-light leading-relaxed max-w-xl">
            <p>
              Since 1984, {siteConfig.brandName} has upheld the heritage of Indian fine jewellery. Every creation begins with certified 22K and 18K gold, shaped by skilled artisans who specialize in traditional filigree, kundan setting, and precision stone setting.
            </p>
            <p>
              We believe fine jewellery should be as enduring in structure as it is timeless in beauty. Each piece is hallmarked with official purity stamps and delivered with complete gemological certification.
            </p>
          </div>

          <div className="pt-8 mt-8 border-t border-[rgba(201,164,92,0.12)]">
            <Link
              href="/about"
              className="text-xs tracking-wider text-[#C9A45C] hover:text-[#E9D5A0] flex items-center gap-2 transition-colors self-start border-b border-[#C9A45C]/40 pb-1"
            >
              <span>Learn More About Our Atelier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Authentic Boutique & Concierge Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center pl-0 lg:pl-8 border-l-0 lg:border-l border-[rgba(201,164,92,0.15)]">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-3 font-light">
            Private Consultations
          </span>

          <h3
            className="text-2xl text-[#F5F0E7] font-light mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Visit Our Flagship Boutique
          </h3>

          <p className="text-xs text-[#A8A197] font-light leading-relaxed mb-6 max-w-sm">
            Experience our high jewellery collections in person with dedicated guidance from our senior gemologists.
          </p>

          <div className="space-y-3 text-xs text-[#D1CCC4] font-light mb-8">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0" />
              <span>Panaji, Goa, India</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#C9A45C] shrink-0" />
              <span>Monday – Saturday, 10:30 AM – 7:30 PM</span>
            </div>
          </div>

          <Link
            href="/contact"
            className="btn-primary py-3.5 px-8 text-xs tracking-wider rounded-full self-start flex items-center gap-2"
          >
            <span>Book an Appointment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BrandStorySection;

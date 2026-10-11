'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function BridalExperienceSection() {
  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Left Narrative (7 cols) */}
        <div className="lg:col-span-7 max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3 sm:mb-4 font-light">
            The Bridal Haute Parure
          </span>

          <h2
            className="text-3xl sm:text-display-md lg:text-display-lg font-light text-[#F5F0E7] mb-4 sm:mb-6 leading-[1.08] sm:leading-[1.05]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            For the Beginning <br />
            <span className="text-gold-gradient italic font-normal">of Forever.</span>
          </h2>

          <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-8 sm:mb-10 font-light max-w-xl">
            A sacred celebration calls for generational poise. Our bridal parures marry classical temple Kundan geometry with weightless ergonomics, ensuring each royal choker, raani haar, and maang tikka drapes like a second skin as you step into your legacy.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Link
              href="/collections/bridal-jewellery"
              className="btn-primary py-3.5 px-8 text-xs tracking-wider rounded-full flex items-center justify-center gap-2 text-center"
            >
              <span>Explore Bridal Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="text-xs tracking-wider text-[#E9D5A0] hover:text-[#F5F0E7] transition-colors border-b border-[#C9A45C]/40 pb-0.5 text-center self-center sm:self-auto"
            >
              Book Private Consultation
            </Link>
          </div>

          {/* Quiet Hallmarks */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-3 sm:gap-x-6 text-[11px] sm:text-xs tracking-wide text-[#A8A197] font-light pt-6 border-t border-[rgba(201,164,92,0.12)]">
            <span>22K BIS 916 Hallmarked</span>
            <span className="text-[#C9A45C]">•</span>
            <span>Natural Basra Pearls</span>
            <span className="text-[#C9A45C]">•</span>
            <span>Bespoke Trousseau Curation</span>
          </div>
        </div>

        {/* Right Photographic Vitrine Frame (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-[rgba(201,164,92,0.18)] bg-[#0C0B0A]/80 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center p-8 group">
            <img
              src="/images/gallery/kundan-choker.jpg"
              alt="Imperial Polki and Basra Pearl Bridal Choker"
              className="max-h-[92%] max-w-[92%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <div className="pt-4 flex items-baseline justify-between text-xs text-[#A8A197] px-1">
            <span className="font-light tracking-wide text-[#E9D5A0]">
              The Maharani Imperial Collar
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#A8A197]/70">
              Uncut Polki & Basra Pearls
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BridalExperienceSection;

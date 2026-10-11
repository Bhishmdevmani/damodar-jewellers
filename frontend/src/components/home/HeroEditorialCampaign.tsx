'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroEditorialCampaign() {
  return (
    <div className="relative w-full bg-[#080807] overflow-hidden">
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 1. CINEMATIC HERO CAMPAIGN */}
      {/* Seamless Full-Bleed Editorial Presentation: Model Gracefully Showcasing the 22K Royal Necklace */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] lg:min-h-screen w-full flex items-center overflow-hidden">
        {/* Full-Bleed High-Fashion Photography Canvas */}
        <div className="absolute inset-0 w-full h-full select-none">
          <img
            src="/images/hero/hero-masterpiece.jpg"
            alt="Damodar Jewellers — Royal High Jewellery Campaign featuring 22K Gold Royal Sapphire Necklace"
            className="w-full h-full object-cover object-[72%_center] lg:object-center filter contrast-[1.03] brightness-[0.98]"
            loading="eager"
          />

          {/* Delicate Directional Shadow: Keeps typography readable on the left without obscuring the model */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080807] via-[#080807]/60 to-transparent w-full lg:w-[50%] pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#080807] via-[#080807]/60 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#080807]/80 to-transparent pointer-events-none" />
        </div>

        {/* Hero Editorial Narrative */}
        <div className="relative z-20 max-w-[1440px] w-full mx-auto px-6 sm:px-12 lg:px-20 pt-32 lg:pt-28 pb-16">
          <div className="max-w-xl lg:max-w-2xl">
            {/* Overtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="w-8 h-[1px] bg-[#C9A45C]" />
              <span className="text-xs tracking-wider text-[#E9D5A0] font-light">
                Haute Joaillerie · Damodar Atelier
              </span>
            </motion.div>

            {/* Grand Editorial Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-display-md sm:text-display-lg font-light text-[#F5F0E7] tracking-tight leading-[1.04] mb-6"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Jewellery That Becomes <br />
              <span className="text-gold-gradient italic font-normal">Your Legacy.</span>
            </motion.h1>

            {/* Editorial Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#D1CCC4] font-light leading-relaxed mb-10 max-w-xl"
            >
              Handcrafted in solid 22K gold with a magnificent natural Ceylon sapphire centerpiece and diamond pavé halos. An extraordinary union of sovereign Indian heritage and modern haute joaillerie.
            </motion.p>

            {/* Luxury CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-6 mb-12"
            >
              <Link
                href="/products"
                className="btn-primary py-3.5 px-8 text-xs tracking-wider rounded-full flex items-center gap-2.5 transition-all"
              >
                <span>Explore All Creations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/collections"
                className="text-xs tracking-wider text-[#E9D5A0] hover:text-[#F5F0E7] transition-colors border-b border-[#C9A45C]/50 pb-1"
              >
                View Curated Collections
              </Link>
            </motion.div>

            {/* Quiet Hallmark Assurance */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs tracking-wide text-[#A8A197] font-light"
            >
              <span>22K BIS 916 Hallmarked</span>
              <span className="text-[#C9A45C]">•</span>
              <span>100% Certified Gemstones</span>
              <span className="text-[#C9A45C]">•</span>
              <span>Artisan Handcrafted</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* 2. THE SAVOIR-FAIRE — EDITORIAL SPREAD */}
      {/* Refined 4:3 Aspect Ratio: Displays the Entire Necklace, Pendant, and Earring with Zero Cutoffs */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Editorial Narrative & Craft Pillars (6 cols) */}
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-4 font-light">
              Atelier Savoir-Faire
            </span>

            <h2
              className="text-display-md font-light text-[#F5F0E7] mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Designed with Intention. <br />
              <span className="text-gold-gradient italic font-normal">Finished by Hand.</span> <br />
              Made to Be Remembered.
            </h2>

            <p className="text-base text-[#A8A197] leading-relaxed mb-10 font-light max-w-xl">
              True luxury does not shout; it radiates from microscopic accuracy. Every individual link is calibrated for fluid movement across the clavicle, with natural royal sapphires seated in hand-burnished bezels engineered to endure across generations.
            </p>

            {/* Editorial Craftsmanship Details */}
            <div className="space-y-6 max-w-xl border-t border-[rgba(201,164,92,0.15)] pt-8">
              <div className="flex items-start gap-5">
                <span className="text-sm font-mono text-[#C9A45C] tracking-widest mt-0.5">01</span>
                <div>
                  <h3
                    className="text-lg text-[#F5F0E7] font-normal mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Hand-Assembled Interlocking Links
                  </h3>
                  <p className="text-xs text-[#A8A197] leading-relaxed font-light">
                    Over eighty articulated solid 22K gold links, hand-interlocked to drape with fluid, weightless grace across the collarbone.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 border-t border-[rgba(201,164,92,0.1)] pt-6">
                <span className="text-sm font-mono text-[#C9A45C] tracking-widest mt-0.5">02</span>
                <div>
                  <h3
                    className="text-lg text-[#F5F0E7] font-normal mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Tiered Filigree Medallion & Beading
                  </h3>
                  <p className="text-xs text-[#A8A197] leading-relaxed font-light">
                    Concentric hand-pierced gold petals with micro-beaded borders and round brilliant diamond accent settings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5 border-t border-[rgba(201,164,92,0.1)] pt-6">
                <span className="text-sm font-mono text-[#C9A45C] tracking-widest mt-0.5">03</span>
                <div>
                  <h3
                    className="text-lg text-[#F5F0E7] font-normal mb-1"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    Natural Royal Sapphire & Teardrop
                  </h3>
                  <p className="text-xs text-[#A8A197] leading-relaxed font-light">
                    A master-cut natural Royal Blue Sapphire framed in stepped gold bezels with an articulated pear-cut pendant.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Full 4:3 Photographic Editorial Vitrine Frame (6 cols) */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[rgba(201,164,92,0.22)] bg-[#0C0B0A] shadow-[0_25px_60px_rgba(0,0,0,0.7)] group">
              <img
                src="/images/hero/necklace-macro-drape.jpg"
                alt="Damodar Jewellers — Macro Craftsmanship Detail of 22K Gold Royal Sapphire Necklace"
                className="w-full h-full object-cover object-center filter contrast-[1.02] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-104"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080807]/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Editorial Caption Under Image */}
            <div className="pt-4 flex items-baseline justify-between text-xs text-[#A8A197] px-1">
              <span className="font-light tracking-wide text-[#E9D5A0]">
                The Royal Sapphire Medallion Drape
              </span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#A8A197]/70">
                BIS 916 · 22K Solid Gold
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroEditorialCampaign;

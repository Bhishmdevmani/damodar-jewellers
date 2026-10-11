import Link from 'next/link';
import { ArrowRight, Compass, Gem, ShieldCheck, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080807] pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* Hero */}
      <div className="max-w-3xl mb-12 sm:mb-20">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
          Our Heritage & Manifesto
        </span>
        <h1
          className="text-3xl sm:text-display-md lg:text-display-lg font-light text-[#F5F0E7] mb-4 sm:mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {siteConfig.brandName}: <br />
          <span className="text-gold-gradient italic">{siteConfig.tagline}</span>
        </h1>
        <p className="text-base sm:text-lg text-[#A8A197] font-light leading-relaxed">
          {siteConfig.secondaryMessage} In a world consumed by rapid obsolescence, we forge precious metals and gemstones into everlasting symbols of family legacy, timeless devotion, and generational milestones.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-16 sm:mb-28">
        <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-[#A8A197] font-light leading-relaxed">
          <h2
            className="text-2xl sm:text-3xl font-light text-[#F5F0E7] mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Discipline of Fine Jewellery
          </h2>
          <p>
            Every piece bearing the {siteConfig.brandName} hallmark begins as an architectural sketch. We study balance, weight distribution, and illumination angles—ensuring necklaces rest gracefully against the collarbone and solitaire rings maintain structural integrity through decades of daily wear.
          </p>
          <p>
            Our master jewelers hand-select each stone, scrutinizing cut symmetry, pavilion depth, and natural dispersion. Metal is alloyed under precise temperature curves to achieve our signature champagne lustre.
          </p>
        </div>

        <div className="pl-0 lg:pl-10 border-l-0 lg:border-l border-[rgba(201,164,92,0.2)] pt-6 lg:pt-0 border-t border-[rgba(201,164,92,0.15)] lg:border-t-0">
          <span className="text-xs tracking-wider text-[#C9A45C] block mb-2 sm:mb-3 font-light">
            Artisanal Standards
          </span>
          <h3
            className="text-xl sm:text-2xl text-[#F5F0E7] font-light mb-3 sm:mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Hand-Finished in Our Dedicated Workshop
          </h3>
          <p className="text-sm text-[#A8A197] font-light leading-relaxed mb-6">
            Our atelier brings together multi-generational artisans who master traditional Kundan foil backing, filigree granulation, and precision prong settings. Each creation takes between 40 to 120 artisan hours from initial casting to final polish.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-[#E9D5A0]/80">
            <span>22K BIS 916</span>
            <span>•</span>
            <span>GIA Certified</span>
            <span>•</span>
            <span>Conflict-Free</span>
          </div>
        </div>
      </div>

      {/* Four Pillars */}
      <div className="mb-16 sm:mb-28">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2">
            Principles
          </span>
          <h2
            className="text-2xl sm:text-3xl font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Pillars of Integrity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: '22K & 18K Solid Gold',
              desc: 'Pure, hallmarked gold alloys formulated for durability, rich warmth, and hypoallergenic skin feel.',
              icon: Compass,
            },
            {
              title: 'Ethical Gemstones',
              desc: 'Strictly vetted natural diamonds and precious gems adhering to certified provenance protocols.',
              icon: Gem,
            },
            {
              title: 'Master Filigree',
              desc: 'Artisanal hand-carving and tension-balanced prongs that celebrate ancient goldwork tradition.',
              icon: Sparkles,
            },
            {
              title: 'Heirloom Guarantee',
              desc: 'Lifetime complimentary inspection, ultrasonic cleaning, and prong tuning for our patrons.',
              icon: ShieldCheck,
            },
          ].map((pillar, i) => (
            <div
              key={i}
              className="p-6 sm:p-8 bg-[#11100E] border border-[rgba(201,164,92,0.15)] flex flex-col justify-between"
            >
              <div>
                <pillar.icon className="w-6 h-6 text-[#C9A45C] mb-4" />
                <h3
                  className="text-lg sm:text-xl font-light text-[#F5F0E7] mb-2 sm:mb-3"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  {pillar.title}
                </h3>
                <p className="text-xs text-[#A8A197] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center p-8 sm:p-12 border border-[rgba(201,164,92,0.2)] bg-[#11100E]">
        <h3
          className="text-xl sm:text-2xl font-light text-[#F5F0E7] mb-3 sm:mb-4"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Begin Your Commission
        </h3>
        <p className="text-xs text-[#A8A197] max-w-md mx-auto mb-6">
          Whether selecting from our permanent suites or commissioning a bespoke bridal parure, we welcome you.
        </p>
        <Link href="/contact" className="btn-primary inline-flex">
          <span>Arrange an Atelier Consultation</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalStatementSection() {
  return (
    <section className="relative py-36 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto z-20 text-center border-t border-[rgba(201,164,92,0.1)]">
      {/* Editorial Insignia Hairline */}
      <div className="w-12 h-[1px] bg-[#C9A45C] mx-auto mb-8" />

      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-4 font-light">
        The Forever Vow
      </span>

      <h2
        className="text-display-lg font-light text-[#F5F0E7] max-w-4xl mx-auto mb-8 leading-[1.02]"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Your Story. <br />
        <span className="text-gold-gradient italic font-normal">Your Signature.</span>
      </h2>

      <p className="text-base text-[#A8A197] max-w-lg mx-auto mb-12 font-light leading-relaxed">
        Let our master goldsmiths bring your dream to fruition. Explore our permanent collections or schedule a private consultation.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-6">
        <Link
          href="/collections"
          className="btn-primary py-3.5 px-8 text-xs uppercase tracking-[0.18em] rounded-full flex items-center gap-2"
        >
          <span>Find Your Jewellery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/contact"
          className="text-xs uppercase tracking-[0.18em] text-[#E9D5A0] hover:text-[#F5F0E7] transition-colors border-b border-[#C9A45C]/40 pb-0.5"
        >
          Bespoke Commission
        </Link>
      </div>
    </section>
  );
}

export default FinalStatementSection;

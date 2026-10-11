import { siteConfig } from '@/lib/config';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
        Legal Governance
      </span>
      <h1
        className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-8"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Terms of Service & Atelier Protocols
      </h1>

      <div className="space-y-8 text-sm text-[#A8A197] font-light leading-relaxed">
        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">1. Bespoke Authenticity & Pricing</h2>
          <p>
            All jewellery creations presented by {siteConfig.brandName} are crafted with genuine precious metals and ethically verified stones. Due to daily fluctuations in international bullion and diamond indices, displayed pricing remains subject to confirmation upon formal checkout verification.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">2. Intellectual Property</h2>
          <p>
            All original jewellery designs, 3D interactive models, filigree motifs, and digital exhibition elements are the proprietary intellectual property of {siteConfig.brandName}.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">3. Demonstration Disclaimer</h2>
          <p>
            When accessed in demonstration mode, sample catalogue items, fictional order numbers, and demo transactions do not represent binding contracts of commercial sale.
          </p>
        </section>
      </div>
    </div>
  );
}

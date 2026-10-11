import { siteConfig } from '@/lib/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
        Legal Governance
      </span>
      <h1
        className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-8"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Privacy Policy & Data Discretion
      </h1>

      <div className="space-y-8 text-sm text-[#A8A197] font-light leading-relaxed">
        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">1. Atelier Discretion Standard</h2>
          <p>
            At {siteConfig.brandName}, patron privacy is held to the highest standard of discretion. We collect only essential information required to fulfill bespoke commissions, coordinate secure armored transit, and maintain lifelong appraisal records for your heirs.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">2. Information Collection</h2>
          <p>
            When placing a commission or reserving a consultation, we record your name, delivery address, phone number, and transaction references. We never store raw payment card data on our servers; all financial exchanges are processed via PCI-DSS Level 1 compliant gateways.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">3. Zero Third-Party Monetization</h2>
          <p>
            We strictly do not sell, rent, or trade patron identities, acquisition histories, or contact profiles to marketing aggregators.
          </p>
        </section>
      </div>
    </div>
  );
}

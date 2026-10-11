import { siteConfig } from '@/lib/config';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
        Client Privilege
      </span>
      <h1
        className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-8"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Insured Luxury Logistics & Delivery
      </h1>

      <div className="space-y-8 text-sm text-[#A8A197] font-light leading-relaxed">
        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">1. Fully Insured Transit</h2>
          <p>
            Every order leaving the {siteConfig.brandName} vault is fully insured for 100% of its appraised value until the moment of signature confirmation at your door.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">2. Discreet Armored Packaging</h2>
          <p>
            To safeguard the secrecy of surprise proposals and ensure courier discretion, outer boxes carry no jewellery branding. Inside, your creation rests within our velvet-lined obsidian presentation casket.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">3. Delivery Timelines</h2>
          <p>
            In-stock creations are dispatched within 48 hours via expedited express freight (2–4 business days delivery). Bespoke bridal suites and made-to-order rings require 2 to 3 weeks of master artisan crafting prior to dispatch.
          </p>
        </section>
      </div>
    </div>
  );
}

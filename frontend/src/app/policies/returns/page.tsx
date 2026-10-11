import { siteConfig } from '@/lib/config';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1000px] mx-auto">
      <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
        Client Privilege
      </span>
      <h1
        className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-8"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        Complimentary Returns & Exchange Policy
      </h1>

      <div className="space-y-8 text-sm text-[#A8A197] font-light leading-relaxed">
        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">1. 15-Day Inspection Period</h2>
          <p>
            We want you to be completely captivated by your piece. If an unworn standard creation does not exceed your expectations, you may request a complimentary exchange or return within 15 calendar days of armored delivery receipt.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">2. Bespoke & Engraved Commissions</h2>
          <p>
            Custom-sized rings, personalized inscriptions, and bespoke bridal parures created to unique client specifications are final sale, but include lifetime complimentary resizing and prong realignment.
          </p>
        </section>

        <section className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.12)]">
          <h2 className="text-lg text-[#F5F0E7] font-serif mb-3">3. Insured Return Transit</h2>
          <p>
            Returns must be coordinated through our concierge to arrange an armored courier pickup with tamper-evident security sealing.
          </p>
        </section>
      </div>
    </div>
  );
}

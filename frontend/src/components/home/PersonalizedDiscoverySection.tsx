'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function PersonalizedDiscoverySection() {
  const [activeTab, setActiveTab] = useState<'bespoke' | 'bridal' | 'heritage'>('bespoke');

  const contentMap = {
    bespoke: {
      badge: 'Atelier Bespoke Service',
      title: 'Crafted Specially For Your Milestones',
      description:
        'Collaborate directly with our master goldsmiths and gemologists. From hand-drawn gouache sketches to architectural casting in solid 22K gold, we realize your vision with microscopic precision.',
      points: [
        'Private one-on-one consultation with senior gemologists',
        'Ethically sourced, GIA & IGI certified precious gemstones',
        'Wax prototyping and tactile fitting iterations',
        'Custom laser hallmark and permanent archival certificate',
      ],
      linkText: 'Inquire Bespoke Commission',
      linkHref: '/custom-design',
      note: '120+ Hours of Hand Craftsmanship per Creation',
    },
    bridal: {
      badge: 'Royal Bridal Trousseau',
      title: 'Heirloom Suites for Sacred Occasions',
      description:
        'Complete sovereign bridal ensembles calibrated for regal presence. Harmonized chokers, raani haars, jhumkas, and maang tikkas crafted in 22K gold with natural uncut polki diamonds and Basra pearls.',
      points: [
        'Coordinated suites designed for bridal couture silhouettes',
        'Weightless ergonomic articulation across the clavicle',
        'Traditional Kundan foil backing with reverse Meenakari',
        'Custom heirloom presentation wooden jewel casket',
      ],
      linkText: 'Explore Bridal Collection',
      linkHref: '/collections/bridal-jewellery',
      note: 'Generations of Enduring Purity & Grace',
    },
    heritage: {
      badge: 'Heritage Restoration & Care',
      title: 'Preserving Dynastic Treasures',
      description:
        'Every antique jewellery piece tells a sacred family story. Our restoration atelier cleans, reinforces, and resets ancestral gold and gemstones while preserving original patina and historical character.',
      points: [
        'Non-invasive structural laser reinforcement',
        'Traditional hand-burnished bezel restoration',
        'Certified spectroscopic alloy assaying',
        'Lifetime complimentary ultrasonic inspection',
      ],
      linkText: 'Learn About Our Heritage Care',
      linkHref: '/about',
      note: '100% Certified Historical Preservation',
    },
  };

  const current = contentMap[activeTab];

  return (
    <section className="relative py-28 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto z-20 border-t border-[rgba(201,164,92,0.1)]">
      {/* Editorial Section Header with Clean Understated Tabs (No Pill Box) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3 font-light">
            Atelier Capabilities
          </span>
          <h2
            className="text-display-md font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Personalized Discovery & Commission
          </h2>
        </div>

        {/* Clean Text-Link Tabs */}
        <div className="flex items-center gap-8 border-b border-[rgba(201,164,92,0.12)] pb-3">
          {[
            { key: 'bespoke', label: 'Bespoke Design' },
            { key: 'bridal', label: 'Bridal Suites' },
            { key: 'heritage', label: 'Heritage Care' },
          ].map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`relative pb-1 text-xs uppercase tracking-[0.18em] transition-colors ${
                  isActive ? 'text-[#E9D5A0] font-medium' : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeDiscoveryTab"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A45C]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seamless Editorial Grid — Zero Boxes, Zero Nested Cards */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
      >
        <div className="lg:col-span-7">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A45C] block mb-2 font-mono">
            {current.badge}
          </span>
          <h3
            className="text-2xl sm:text-3xl font-light text-[#F5F0E7] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {current.title}
          </h3>
          <p className="text-sm sm:text-base text-[#A8A197] leading-relaxed mb-8 font-light max-w-xl">
            {current.description}
          </p>

          <ul className="space-y-3 mb-10 max-w-xl border-t border-[rgba(201,164,92,0.1)] pt-6">
            {current.points.map((pt, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-[#D1CCC4] font-light">
                <span className="text-[#C9A45C] font-mono">0{i + 1}</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href={current.linkHref}
              className="btn-primary py-3.5 px-8 text-xs uppercase tracking-[0.18em] rounded-full flex items-center gap-2"
            >
              <span>{current.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/products"
              className="text-xs uppercase tracking-[0.18em] text-[#E9D5A0] hover:text-[#F5F0E7] transition-colors border-b border-[#C9A45C]/40 pb-0.5"
            >
              Browse Complete Catalog
            </Link>
          </div>
        </div>

        {/* Right Side: Open Editorial Statement (Zero Boxes, Zero Icons-in-Circles) */}
        <div className="lg:col-span-5 pl-0 lg:pl-8 border-l-0 lg:border-l border-[rgba(201,164,92,0.15)] flex flex-col justify-center">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] mb-2 font-light">
            Atelier Standard
          </span>
          <h4
            className="text-xl sm:text-2xl font-light text-[#F5F0E7] mb-3 leading-snug"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {current.note}
          </h4>
          <p className="text-xs text-[#A8A197] leading-relaxed font-light mb-8 max-w-sm">
            Every creation is registered in our permanent ledger and accompanied by physical hallmark authenticity passports and spectroscopic assays.
          </p>

          <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest text-[#A8A197]/80">
            <span>BIS 916 Hallmark</span>
            <span className="text-[#C9A45C]">•</span>
            <span>GIA Certified</span>
            <span className="text-[#C9A45C]">•</span>
            <span>Ethical Provenance</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default PersonalizedDiscoverySection;

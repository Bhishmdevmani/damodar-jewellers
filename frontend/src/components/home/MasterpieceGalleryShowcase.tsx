'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import DollyGallery from '@/components/ui/DollyGallery';

export type CategoryFilter = 'all' | 'necklaces' | 'rings' | 'bangles' | 'earrings' | 'bridal';

export interface GalleryShowcaseItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryFilter;
  image: string;
  metalPurity: string;
  gemstones: string;
  hallmark: string;
  story: string;
}

const GALLERY_ITEMS: GalleryShowcaseItem[] = [
  {
    id: 'gal-1',
    slug: 'celestial-royal-sapphire-necklace',
    title: 'The Celestial Royal Sapphire Necklace',
    subtitle: 'Haute Joaillerie Creation',
    category: 'necklaces',
    image: '/images/gallery/necklace-royal.webp',
    metalPurity: '22K Solid Gold (916 Purity)',
    gemstones: 'Natural Ceylon Sapphire (3.85ct) & Diamonds',
    hallmark: 'BIS Hallmarked 916',
    story: 'Forged across 120 artisan hours. Features 84 hand-articulated curb links and a natural royal blue sapphire seated in hand-burnished stepped bezels.',
  },
  {
    id: 'gal-2',
    slug: 'eternal-solitaire-diamond-ring',
    title: 'The Eternal Solitaire Diamond Ring',
    subtitle: 'Knife-Edge Pavé Crown',
    category: 'rings',
    image: '/images/gallery/diamond-ring.webp',
    metalPurity: '22K Yellow Gold Band',
    gemstones: '2.10 ct Round Brilliant Solitaire + 0.48 ct Pavé',
    hallmark: 'GIA Certified · BIS 916',
    story: 'A masterwork of diamond geometry. The 2.10-carat solitaire diamond is elevated in a six-prong cathedral crown flanked by 36 micro-pavé diamonds.',
  },
  {
    id: 'gal-3',
    slug: 'heritage-filigree-gold-bangles',
    title: 'The Heritage Filigree Gold Bangles',
    subtitle: 'Royal Heirloom Pair',
    category: 'bangles',
    image: '/images/gallery/gold-bangles.webp',
    metalPurity: '22K Solid Yellow Gold',
    gemstones: 'Natural Burmese Ruby Florets & Granulation',
    hallmark: 'BIS Hallmarked 916',
    story: 'Handcrafted according to ancestral temple jewellery traditions. Deeply embossed floral scrollwork accented with natural ruby petals and solid gold granulation.',
  },
  {
    id: 'gal-4',
    slug: 'empress-sapphire-chandelier-earrings',
    title: 'The Empress Sapphire Chandelier Earrings',
    subtitle: 'Cascading Royal Drop',
    category: 'earrings',
    image: '/images/gallery/sapphire-earrings.webp',
    metalPurity: '22K Solid Gold',
    gemstones: 'Pear & Marquise Sapphires with Diamond Cascades',
    hallmark: 'BIS 916 Certified',
    story: 'Exquisitely articulated chandelier tiers that capture light with every turn. Pear-cut sapphire drops dangle from open jaali scrollwork paved in brilliant diamonds.',
  },
  {
    id: 'gal-5',
    slug: 'maharani-kundan-pearl-bridal-choker',
    title: 'The Maharani Kundan & Pearl Bridal Choker',
    subtitle: 'Imperial Polki Collar',
    category: 'bridal',
    image: '/images/gallery/kundan-choker.webp',
    metalPurity: '22K Gold Collar Setting',
    gemstones: 'Uncut Polki Diamonds & Certified Basra Pearls',
    hallmark: 'BIS 916 · Basra Certified',
    story: 'The pinnacle of bridal grandeur. Featuring uncut polki diamonds set in pure gold foil (Kundan), bordered by triple-woven Basra natural seed pearls.',
  },
];

export function MasterpieceGalleryShowcase() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [inspectedItem, setInspectedItem] = useState<GalleryShowcaseItem | null>(null);

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="relative w-full z-20">
      {/* SECTION HEADER & CATEGORY TABS */}
      <div className="pt-16 sm:pt-24 pb-8 sm:pb-10 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-2 sm:mb-3 font-light">
              High Jewellery Gallery
            </span>
            <h2
              className="text-2xl sm:text-display-md font-light text-[#F5F0E7] leading-tight"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Curated Masterpieces & <br />
              <span className="text-gold-gradient italic font-normal">Atelier Archives.</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.18em] text-[#C9A45C] hover:text-[#E9D5A0] flex items-center gap-2 transition-colors border-b border-[#C9A45C]/40 pb-1 self-start md:self-auto"
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* EDITORIAL CATEGORY NAV */}
        <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto pb-3 sm:pb-4 scrollbar-none border-b border-[rgba(201,164,92,0.12)]">
          {[
            { key: 'all', label: 'All Creations' },
            { key: 'necklaces', label: 'Royal Necklaces' },
            { key: 'rings', label: 'Solitaire Rings' },
            { key: 'bangles', label: 'Heritage Bangles' },
            { key: 'earrings', label: 'Chandelier Earrings' },
            { key: 'bridal', label: 'Bridal Parures' },
          ].map((tab) => {
            const isActive = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveCategory(tab.key as CategoryFilter)}
                className={`relative pb-3 text-xs uppercase tracking-[0.18em] transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-[#E9D5A0] font-medium'
                    : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeGalleryCategory"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A45C]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* DOLLY GALLERY SHOWCASE */}
      <div className="px-2 sm:px-8 lg:px-16 max-w-[1520px] mx-auto mb-8">
        <DollyGallery
          items={filteredItems}
          onInspect={(item) => setInspectedItem(item as GalleryShowcaseItem)}
        />
      </div>

      {/* INSPECT MODAL */}
      <AnimatePresence>
        {inspectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-3xl rounded-2xl bg-[#0E0D0B] border border-[#C9A45C]/30 p-8 sm:p-12 shadow-2xl"
            >
              <button
                onClick={() => setInspectedItem(null)}
                aria-label="Close modal"
                className="absolute top-6 right-6 p-2 text-[#A8A197] hover:text-[#F5F0E7] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="aspect-square flex items-center justify-center p-4">
                  <img
                    src={inspectedItem.image}
                    alt={inspectedItem.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-2xl"
                  />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2 font-light">
                    {inspectedItem.hallmark}
                  </span>

                  <h3
                    className="text-2xl sm:text-3xl font-light text-[#F5F0E7] mb-3 leading-tight"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {inspectedItem.title}
                  </h3>

                  <p className="text-xs text-[#A8A197] leading-relaxed mb-6 font-light">
                    {inspectedItem.story}
                  </p>

                  <div className="space-y-2 border-t border-b border-[rgba(201,164,92,0.15)] py-4 mb-8 text-xs text-[#D1CCC4] font-light">
                    <p><strong className="text-[#E9D5A0] font-normal">Alloy:</strong> {inspectedItem.metalPurity}</p>
                    <p><strong className="text-[#E9D5A0] font-normal">Gemstones:</strong> {inspectedItem.gemstones}</p>
                  </div>

                  <Link
                    href={`/products/${inspectedItem.slug}`}
                    className="btn-primary py-3.5 px-8 text-xs tracking-wider rounded-full inline-flex items-center gap-2"
                  >
                    <span>View Pricing & Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MasterpieceGalleryShowcase;

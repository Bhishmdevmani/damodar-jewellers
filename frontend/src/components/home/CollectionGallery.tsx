'use client';

import Link from 'next/link';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import CircularGallery, { GalleryItem } from '@/components/ui/CircularGallery';
import { demoCollections } from '@/lib/demo-data';

const GALLERY_ITEMS: GalleryItem[] = [
  {
    image: '/images/gallery/kundan-choker.webp',
    text: 'Bridal Jewellery',
  },
  {
    image: '/images/gallery/gold-bangles.webp',
    text: 'Gold Essentials',
  },
  {
    image: '/images/gallery/diamond-ring.webp',
    text: 'Diamond Elegance',
  },
  {
    image: '/images/gallery/necklace-royal.webp',
    text: 'Everyday Classics',
  },
  {
    image: '/images/gallery/sapphire-earrings.webp',
    text: 'Royal Sapphire',
  },
  {
    image: '/images/hero/necklace-macro-drape.webp',
    text: 'Haute Joaillerie',
  },
];

export function CollectionGallery() {
  return (
    <section className="relative pt-16 pb-28 px-4 sm:px-8 lg:px-16 max-w-[1520px] mx-auto z-20">
      {/* Editorial Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#C9A45C] font-light">
              Interactive Curved Showcase
            </span>
          </div>
          <h2
            className="text-display-md font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Four Foundations
          </h2>
          <p className="text-xs text-[#A8A197] font-light mt-2 max-w-xl">
            Drag horizontally or scroll to rotate through our signature high-jewellery vitrines in 3D curvature.
          </p>
        </div>

        <div className="flex items-center gap-4 self-start md:self-auto">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(201,164,92,0.25)] bg-[rgba(201,164,92,0.05)] text-[11px] tracking-widest text-[#E9D5A0] uppercase">
            <Compass className="w-3 h-3 text-[#C9A45C] animate-pulse" />
            <span>Drag · Scroll · Explore</span>
          </div>
          <Link
            href="/collections"
            className="text-xs uppercase tracking-[0.18em] text-[#C9A45C] hover:text-[#E9D5A0] flex items-center gap-2 transition-colors border-b border-[#C9A45C]/40 pb-1"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3D WebGL Circular Gallery Curved Vitrine Showcase */}
      <div className="relative w-full h-[440px] sm:h-[560px] lg:h-[640px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[rgba(201,164,92,0.15)] bg-gradient-to-b from-[#0C0B0A]/95 via-[#080807] to-[#0A0A09] shadow-[0_24px_64px_rgba(0,0,0,0.85)] touch-pan-y">
        {/* Subtle ambient luxury light aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[radial-gradient(ellipse_at_top,rgba(201,164,92,0.12),transparent_70%)] pointer-events-none z-10" />

        {/* Side gradient vignettes for depth blending */}
        <div className="absolute inset-y-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#080807] via-[#080807]/70 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#080807] via-[#080807]/70 to-transparent pointer-events-none z-10" />

        {/* Circular Gallery WebGL Component */}
        <CircularGallery
          items={GALLERY_ITEMS}
          bend={3}
          textColor="#E9D5A0"
          borderRadius={0.05}
          scrollEase={0.025}
          scrollSpeed={2}
          fontUrl="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap"
          font="600 32px Cormorant Garamond"
        />

        {/* Floating subtle gesture cue on bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-[rgba(201,164,92,0.18)] text-[10px] tracking-[0.2em] uppercase text-[#A8A197]">
          <span>Use Arrow Keys or Drag to Spin</span>
        </div>
      </div>

      {/* Direct Series Quick Navigation below */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {demoCollections.map((col, index) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group relative p-4 rounded-xl border border-[rgba(201,164,92,0.1)] bg-[#0B0A09]/60 hover:bg-[#12110F] hover:border-[#C9A45C]/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#C9A45C] block mb-1 font-mono">
                Series 0{index + 1}
              </span>
              <h3
                className="text-base text-[#F5F0E7] group-hover:text-[#E9D5A0] transition-colors"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {col.name}
              </h3>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-wider text-[#C9A45C] group-hover:text-[#E9D5A0]">
              <span>Explore</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CollectionGallery;

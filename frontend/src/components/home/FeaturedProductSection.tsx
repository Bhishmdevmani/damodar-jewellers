'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Box, Camera } from 'lucide-react';
import { ProductViewer3D } from '@/components/three/ProductViewer3D';
import { demoProducts } from '@/lib/demo-data';

export function FeaturedProductSection() {
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const featuredProduct = demoProducts[1] || demoProducts[0];

  return (
    <section className="relative py-16 sm:py-28 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Left Side: Refined Photographic Stage with Optional 3D View (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col"
        >
          {/* View Switcher: Text Links */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-[rgba(201,164,92,0.12)]">
            <span className="text-xs tracking-wider text-[#C9A45C] font-light">
              Solitaire Spotlight
            </span>

            <div className="flex items-center gap-4 sm:gap-6 text-xs tracking-wider">
              <button
                onClick={() => setViewMode('photo')}
                className={`transition-colors flex items-center gap-1.5 ${
                  viewMode === 'photo'
                    ? 'text-[#E9D5A0] border-b border-[#C9A45C] pb-0.5'
                    : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Studio View</span>
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`transition-colors flex items-center gap-1.5 ${
                  viewMode === '3d'
                    ? 'text-[#E9D5A0] border-b border-[#C9A45C] pb-0.5'
                    : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Turntable</span>
              </button>
            </div>
          </div>

          {/* Refined Vitrine Media Frame */}
          <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[rgba(201,164,92,0.18)] bg-[#0C0B0A]/80 shadow-[0_25px_60px_rgba(0,0,0,0.7)] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {viewMode === 'photo' ? (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex items-center justify-center p-6 sm:p-8"
                >
                  <img
                    src="/images/gallery/diamond-ring.jpg"
                    alt="The Eternal Solitaire Diamond Ring — 2.10ct Brilliant Diamond in 22K Gold"
                    className="max-h-[85%] max-w-[85%] object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                  />
                  <div className="absolute bottom-3 sm:bottom-4 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] sm:text-xs text-[#A8A197]/70 font-light gap-1 sm:gap-0">
                    <span>2.10ct Center Solitaire · GIA Certified</span>
                    <span>Triple-Ex Cut Symmetry</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <ProductViewer3D
                    modelType="ring"
                    title="Interactive 3D Solitaire"
                    showControls={true}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Side: Editorial Spotlight Details (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:col-span-5 flex flex-col justify-center"
        >
          <span className="text-xs uppercase tracking-wider text-[#C9A45C] block mb-2 font-light">
            Signature Solitaire
          </span>

          <h2
            className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {featuredProduct.name}
          </h2>

          <p className="text-sm text-[#A8A197] leading-relaxed mb-6 sm:mb-8 font-light">
            {featuredProduct.description} Elevated in a six-prong cathedral crown to maximize internal fire, paired with hand-set micro-pavé shoulders along a tapered knife-edge band in solid 22K gold.
          </p>

          {/* Understated Editorial Specs List */}
          <div className="space-y-3 py-5 sm:py-6 border-t border-b border-[rgba(201,164,92,0.12)] mb-6 sm:mb-8 text-xs font-light text-[#D1CCC4]">
            <div className="flex justify-between">
              <span className="text-[#A8A197]">Metal:</span>
              <span className="text-[#F5F0E7]">Solid 22K Yellow Gold (BIS 916)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A8A197]">Diamond Setting:</span>
              <span className="text-[#F5F0E7]">6-Prong High Cathedral Crown</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A8A197]">Shoulder Stones:</span>
              <span className="text-[#F5F0E7]">French Micro-Pavé Diamonds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#A8A197]">Certification:</span>
              <span className="text-[#E9D5A0]">GIA Certified & BIS Hallmarked</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
            <Link
              href={`/products/${featuredProduct.slug}`}
              className="btn-primary py-3.5 px-8 text-xs tracking-wider rounded-full flex items-center justify-center gap-2 text-center"
            >
              <span>View Product & Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/products"
              className="text-xs tracking-wider text-[#E9D5A0] hover:text-[#F5F0E7] transition-colors border-b border-[#C9A45C]/40 pb-0.5 text-center self-center sm:self-auto"
            >
              Explore All Products
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedProductSection;

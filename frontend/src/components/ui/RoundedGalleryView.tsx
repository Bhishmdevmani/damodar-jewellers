'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles, ZoomIn, Eye } from 'lucide-react';

export interface GalleryMediaItem {
  id: string;
  url: string;
  alt: string;
  title?: string;
  badge?: string;
  tagline?: string;
  aspect?: string;
}

interface RoundedGalleryViewProps {
  items: GalleryMediaItem[];
  className?: string;
  showThumbnails?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
  onInspect?: (item: GalleryMediaItem) => void;
  roundedSize?: 'xl' | '2xl' | '3xl';
}

export function RoundedGalleryView({
  items,
  className = '',
  showThumbnails = true,
  aspectRatio = 'video',
  onInspect,
  roundedSize = '3xl',
}: RoundedGalleryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    wide: 'aspect-[16/10]',
  }[aspectRatio];

  const roundedClasses = {
    xl: 'rounded-xl',
    '2xl:': 'rounded-2xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }[roundedSize] || 'rounded-3xl';

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className={`relative flex flex-col gap-4 ${className}`}>
      {/* ── Main Media Display Stage ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full ${aspectClasses} ${roundedClasses} overflow-hidden bg-gradient-to-b from-[#14120E] via-[#0E0D0B] to-[#080807] border border-[rgba(201,164,92,0.22)] shadow-[0_25px_60px_rgba(0,0,0,0.8)] group select-none touch-pan-y`}
      >
        {/* Ambient Radial Illumination */}
        <div className="absolute inset-0 bg-radial-at-c from-[rgba(201,164,92,0.12)] via-transparent to-transparent pointer-events-none" />

        {/* Media Slide Transition with Framer Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: isZoomed ? 1.25 : 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex items-center justify-center p-4 sm:p-10"
            onClick={() => setIsZoomed(!isZoomed)}
            style={{ cursor: isZoomed ? 'zoom-out' : 'zoom-in' }}
          >
            <img
              src={currentItem.url}
              alt={currentItem.alt || currentItem.title || 'Haute Joaillerie Display'}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] transition-all duration-500"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Top Badges & Controls */}
        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 right-3 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
          {currentItem.badge ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#11100E]/90 backdrop-blur-md border border-[#C9A45C]/30 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#E9D5A0] shadow-lg pointer-events-auto"
            >
              <Sparkles className="w-3 h-3 text-[#C9A45C]" />
              <span>{currentItem.badge}</span>
            </motion.div>
          ) : <div />}

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-full bg-[#11100E]/90 backdrop-blur-md border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#E9D5A0] hover:border-[#C9A45C] transition-all shadow-md active:scale-95"
              title={isZoomed ? 'Reset Zoom' : 'Zoom In'}
            >
              <ZoomIn className={`w-3.5 h-3.5 ${isZoomed ? 'text-[#C9A45C]' : ''}`} />
            </button>

            {onInspect && (
              <button
                onClick={() => onInspect(currentItem)}
                className="p-2 rounded-full bg-[#11100E]/90 backdrop-blur-md border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#E9D5A0] hover:border-[#C9A45C] transition-all shadow-md active:scale-95"
                title="Inspect in High Resolution"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous view"
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[#11100E]/90 backdrop-blur-md border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#E9D5A0] hover:border-[#C9A45C] active:scale-95 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-20 shadow-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next view"
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-[#11100E]/90 backdrop-blur-md border border-[rgba(201,164,92,0.25)] text-[#A8A197] hover:text-[#E9D5A0] hover:border-[#C9A45C] active:scale-95 transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 z-20 shadow-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Bottom Title & Pill Navigation Bar */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 pointer-events-none">
          {currentItem.title && (
            <div className="bg-[#0E0D0B]/85 backdrop-blur-md border border-[rgba(201,164,92,0.2)] px-4 py-2 rounded-2xl pointer-events-auto">
              <span className="text-xs font-medium text-[#F5F0E7] block font-serif">
                {currentItem.title}
              </span>
              {currentItem.tagline && (
                <span className="text-[10px] text-[#A8A197] block font-light">
                  {currentItem.tagline}
                </span>
              )}
            </div>
          )}

          {/* Dots Indicator */}
          {items.length > 1 && (
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#11100E]/85 backdrop-blur-md border border-[rgba(201,164,92,0.25)] pointer-events-auto shadow-md">
              {items.map((it, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={it.id}
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`relative h-2 rounded-full transition-all duration-300 ${
                      isActive ? 'w-6 bg-[#C9A45C]' : 'w-2 bg-[#A8A197]/40 hover:bg-[#C9A45C]/60'
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Optional Rounded Thumbnail Reel ── */}
      {showThumbnails && items.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none px-1">
          {items.map((it, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={it.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden bg-[#11100E] border transition-all duration-300 p-2 ${
                  isActive
                    ? 'border-[#C9A45C] shadow-[0_0_15px_rgba(201,164,92,0.25)] scale-105'
                    : 'border-[rgba(201,164,92,0.15)] opacity-60 hover:opacity-100 hover:border-[rgba(201,164,92,0.4)]'
                }`}
              >
                <img
                  src={it.url}
                  alt={it.alt}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoundedGalleryView;

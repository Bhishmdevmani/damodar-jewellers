'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  CheckCircle2,
  GripVertical,
  Sparkles
} from 'lucide-react';
import './DollyGallery.css';

export interface DollyGalleryItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category?: string;
  image: string;
  metalPurity?: string;
  gemstones?: string;
  hallmark?: string;
  story?: string;
  badge?: string;
}

export interface DollyGalleryProps {
  items: DollyGalleryItem[];
  onInspect?: (item: DollyGalleryItem) => void;
  className?: string;
}

export function DollyGallery({ items, onInspect, className = '' }: DollyGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrubberTrackRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const maxProgress = Math.max(1, total - 1);

  const [activeFocalIndex, setActiveFocalIndex] = useState(0);
  const [isDraggingScrubber, setIsDraggingScrubber] = useState(false);
  const isTransitioning = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Reset index when category filter changes
  useEffect(() => {
    setActiveFocalIndex(0);
  }, [items]);

  // Smoothly dolly camera to target item index
  const dollyTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      setActiveFocalIndex(clamped);
    },
    [total]
  );

  const goToNext = useCallback(() => {
    if (activeFocalIndex < total - 1) {
      dollyTo(activeFocalIndex + 1);
    }
  }, [activeFocalIndex, total, dollyTo]);

  const goToPrev = useCallback(() => {
    if (activeFocalIndex > 0) {
      dollyTo(activeFocalIndex - 1);
    }
  }, [activeFocalIndex, dollyTo]);

  // WHEEL SCROLL HANDLING:
  // When cursor is over the Dolly Gallery, scrolling dollies through creations one by one.
  // When at the last image and scrolling down again, page scrolls down naturally!
  // When at the first image and scrolling up again, page scrolls up naturally!
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Ignore tiny jitter
      if (Math.abs(e.deltaY) < 12 && Math.abs(e.deltaX) < 12) return;

      const isScrollingDown = e.deltaY > 0 || e.deltaX > 0;
      const isScrollingUp = e.deltaY < 0 || e.deltaX < 0;

      // Scrolling DOWN and not at the last image yet:
      if (isScrollingDown && activeFocalIndex < total - 1) {
        e.preventDefault();
        e.stopPropagation();

        if (!isTransitioning.current) {
          isTransitioning.current = true;
          dollyTo(activeFocalIndex + 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 450);
        }
        return;
      }

      // Scrolling UP and not at the first image yet:
      if (isScrollingUp && activeFocalIndex > 0) {
        e.preventDefault();
        e.stopPropagation();

        if (!isTransitioning.current) {
          isTransitioning.current = true;
          dollyTo(activeFocalIndex - 1);
          setTimeout(() => {
            isTransitioning.current = false;
          }, 450);
        }
        return;
      }

      // If at boundary (last item scrolling down OR first item scrolling up):
      // Allow default browser page scroll!
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [activeFocalIndex, total, dollyTo]);

  // TOUCH SWIPE GESTURES
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const absY = Math.abs(diffY);
    const absX = Math.abs(diffX);

    if (absY > 30 || absX > 30) {
      const isForward = absX > absY ? diffX > 0 : diffY > 0;
      if (isForward && activeFocalIndex < total - 1) {
        dollyTo(activeFocalIndex + 1);
      } else if (!isForward && activeFocalIndex > 0) {
        dollyTo(activeFocalIndex - 1);
      }
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // KEYBOARD ARROW CONTROLS
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      // Only handle if gallery is currently in view
      if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.25) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          goToNext();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          goToPrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // SCRUBBER DRAG INTERACTION
  const updateFromScrubberPointer = useCallback(
    (clientY: number) => {
      if (!scrubberTrackRef.current) return;
      const rect = scrubberTrackRef.current.getBoundingClientRect();
      const relativeY = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const ratio = relativeY / rect.height;
      const targetIndex = Math.round(ratio * (total - 1));
      dollyTo(targetIndex);
    },
    [total, dollyTo]
  );

  const handleScrubberMouseDown = (e: React.MouseEvent) => {
    setIsDraggingScrubber(true);
    updateFromScrubberPointer(e.clientY);
  };

  useEffect(() => {
    if (!isDraggingScrubber) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateFromScrubberPointer(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDraggingScrubber(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingScrubber, updateFromScrubberPointer]);

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[activeFocalIndex] || items[0];
  const scrubberPercentage = (activeFocalIndex / maxProgress) * 100;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="3D Dolly Gallery. Scroll wheel over gallery or click next to dolly through masterpieces."
      className={`dolly-viewport relative w-full rounded-3xl overflow-hidden outline-none select-none ${className}`}
      style={{
        minHeight: '720px',
        height: '760px',
        width: '100%',
      }}
    >
      {/* Ambient Vignette & Spotlight Atmosphere */}
      <div className="absolute inset-0 dolly-ambient-glare z-10 pointer-events-none" />

      {/* TOP CAMERA CONTROLS BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-10 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#181714] border border-[rgba(201,164,92,0.3)] flex items-center justify-center shadow-md">
            <Camera className="w-4 h-4 text-[#C9A45C] animate-pulse" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-[#E9D5A0] font-light block">
              Atelier Dolly Camera
            </span>
            <span className="hidden sm:inline text-[11px] text-[#A8A197]/60 tracking-wider">
              Scroll or drag to dolly through 3D creations
            </span>
          </div>
        </div>

        {/* Top-Right Navigation Controls */}
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#141310]/85 backdrop-blur-md shadow-xl border border-[rgba(201,164,92,0.25)]">
          <button
            onClick={goToPrev}
            disabled={activeFocalIndex <= 0}
            aria-label="Previous piece"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#E9D5A0] hover:text-white hover:bg-[rgba(201,164,92,0.15)] disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 text-xs font-mono tracking-widest text-[#E9D5A0] select-none">
            {String(activeFocalIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <button
            onClick={goToNext}
            disabled={activeFocalIndex >= total - 1}
            aria-label="Next piece"
            className="w-7 h-7 rounded-full flex items-center justify-center text-[#E9D5A0] hover:text-white hover:bg-[rgba(201,164,92,0.15)] disabled:opacity-25 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D SPATIAL DOLLY WORLD: Perfectly Centered Depth Staggering */}
      <div className="dolly-world z-20">
        {items.map((item, index) => {
          const deltaIndex = index - activeFocalIndex;
          const isFocal = deltaIndex === 0;

          let x = 0;
          let y = 0;
          let z = 0;
          let scale = 1.0;
          let opacity = 1.0;
          let filter = 'none';

          if (isFocal) {
            // FOCAL CENTERSTAGE
            x = 0;
            y = 0;
            z = 0;
            scale = 1.0;
            opacity = 1.0;
            filter = 'brightness(1.0) blur(0px)';
          } else if (deltaIndex > 0) {
            // UPCOMING IN BACKGROUND DEPTH (Negative Z)
            const side = deltaIndex % 2 === 1 ? 1 : -1;
            x = side * (130 + (deltaIndex - 1) * 35);
            y = deltaIndex * 10;
            z = -deltaIndex * 300;
            scale = Math.max(0.68, 1 - deltaIndex * 0.1);
            opacity = Math.max(0.18, 1 - deltaIndex * 0.32);
            filter = `blur(${deltaIndex * 1.5}px) brightness(${Math.max(0.55, 1 - deltaIndex * 0.18)})`;
          } else {
            // DOLLIED PAST CAMERA (Positive Z, moving to foreground sides)
            const past = Math.abs(deltaIndex);
            const side = deltaIndex % 2 === 0 ? -1 : 1;
            x = side * (240 + (past - 1) * 60);
            y = -past * 15;
            z = Math.min(280, past * 220);
            scale = 1.05;
            opacity = Math.max(0, 1 - past * 1.25);
            filter = `blur(${past * 3}px)`;
          }

          const isClickable = opacity > 0.05;
          const zIndex = deltaIndex < 0 ? 50 + Math.abs(deltaIndex) * 10 : 40 - deltaIndex * 10;

          return (
            <div
              key={item.id}
              onClick={() => dollyTo(index)}
              className={`dolly-card ${
                isFocal ? 'cursor-default' : 'cursor-pointer hover:opacity-100'
              }`}
              style={{
                zIndex,
                width: 'min(86vw, 450px)',
                height: 'min(62vh, 490px)',
                transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) scale(${scale})`,
                opacity,
                filter,
                pointerEvents: isClickable ? 'auto' : 'none',
              }}
            >
              {/* Vitrine Display Card */}
              <div
                className={`relative w-full h-full rounded-3xl overflow-hidden bg-[#100F0D]/90 backdrop-blur-2xl flex flex-col items-center justify-between p-6 sm:p-7 transition-all duration-300 ${
                  isFocal
                    ? 'border border-[rgba(201,164,92,0.35)] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_35px_rgba(201,164,92,0.08)]'
                    : 'border border-[rgba(201,164,92,0.12)] shadow-[0_20px_60px_rgba(0,0,0,0.85)]'
                }`}
              >
                {/* Top Card Badge */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#C9A45C] font-mono">
                    {item.subtitle || 'Atelier Masterpiece'}
                  </span>
                  {item.hallmark && (
                    <span className="text-[9px] uppercase tracking-wider text-[#A8A197]/80 px-2 py-0.5 rounded-full bg-[rgba(201,164,92,0.08)] border border-[rgba(201,164,92,0.18)]">
                      {item.hallmark}
                    </span>
                  )}
                </div>

                {/* High-Resolution Jewellery Showcase Image */}
                <div className="relative w-full h-[68%] flex items-center justify-center p-2 group">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.95)] transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Card Bottom Meta */}
                <div className="w-full pt-3 border-t border-[rgba(201,164,92,0.12)] flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4
                      className="text-base font-light text-[#F5F0E7] truncate max-w-[240px] sm:max-w-[280px]"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-[#A8A197]/75 font-light truncate max-w-[240px]">
                      {item.metalPurity}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-medium text-[#C9A45C]">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RIGHT EDGE VERTICAL DEPTH SCRUBBER */}
      <div
        ref={scrubberTrackRef}
        onMouseDown={handleScrubberMouseDown}
        className="dolly-scrubber-track hidden sm:block"
        title="Drag up or down to scrub camera depth"
      >
        <div
          className="dolly-scrubber-handle"
          style={{ top: `${scrubberPercentage}%` }}
        >
          <GripVertical className="w-3.5 h-3.5 text-[#E9D5A0] opacity-80" />
        </div>
      </div>

      {/* FLOATING PROVENANCE & SPECIFICATIONS HUD (Bottom-Left) */}
      <div className="absolute left-6 sm:left-10 bottom-6 sm:bottom-8 z-30 max-w-md pointer-events-none">
        <div className="p-5 rounded-2xl bg-[#0F0E0C]/90 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.92)] pointer-events-auto border border-[rgba(201,164,92,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-[#C9A45C] font-mono">
              {currentItem.subtitle}
            </span>
            {currentItem.hallmark && (
              <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-[#A8A197] px-2 py-0.5 rounded-full bg-[rgba(201,164,92,0.08)] border border-[rgba(201,164,92,0.15)]">
                <CheckCircle2 className="w-2.5 h-2.5 text-[#C9A45C]" />
                {currentItem.hallmark}
              </span>
            )}
          </div>

          <h3
            className="text-lg sm:text-xl font-light text-[#F5F0E7] leading-tight mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {currentItem.title}
          </h3>

          <p className="text-xs text-[#A8A197] font-light leading-relaxed mb-4 line-clamp-2">
            {currentItem.gemstones} · {currentItem.metalPurity}
          </p>

          <div className="flex items-center gap-3 pt-2 border-t border-[rgba(201,164,92,0.12)]">
            <Link
              href={`/products/${currentItem.slug}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#E9D5A0] hover:text-white transition-colors"
            >
              <span>View Piece & Inquire</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A45C]" />
            </Link>

            {onInspect && (
              <button
                onClick={() => onInspect(currentItem)}
                className="inline-flex items-center gap-1.5 text-xs text-[#A8A197] hover:text-[#E9D5A0] transition-colors ml-auto px-3 py-1 rounded-md bg-black/50 border border-[rgba(201,164,92,0.2)] hover:border-[#C9A45C]/50"
              >
                <Maximize2 className="w-3 h-3 text-[#C9A45C]" />
                <span>Provenance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER DOT / FILMSTRIP NAVIGATION */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#12110E]/80 backdrop-blur-md border border-[rgba(201,164,92,0.18)]">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onClick={() => dollyTo(idx)}
            aria-label={`Dolly to item ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              activeFocalIndex === idx
                ? 'w-6 h-2 bg-[#C9A45C]'
                : 'w-2 h-2 bg-[#A8A197]/40 hover:bg-[#E9D5A0]/80'
            }`}
          />
        ))}
      </div>

      {/* BOTTOM PROGRESS LINE */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-[rgba(201,164,92,0.1)]">
        <div
          className="h-full bg-gradient-to-r from-[#C9A45C] to-[#E9D5A0] transition-all duration-300"
          style={{ width: `${scrubberPercentage}%` }}
        />
      </div>
    </div>
  );
}

export default DollyGallery;

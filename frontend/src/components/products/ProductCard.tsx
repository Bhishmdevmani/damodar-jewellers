'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '@/types';
import { PriceDisplay } from './PriceDisplay';
import { useCart } from '@/lib/cart/cart-context';
import { useToast } from '@/hooks';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      type: 'success',
      message: `Added ${product.name} to your bag`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast({
      type: 'info',
      message: !isWishlisted
        ? `Saved ${product.name} to wishlist`
        : `Removed ${product.name} from wishlist`,
    });
  };

  const availabilityText = {
    in_stock: 'In Stock',
    out_of_stock: 'Sold Out',
    made_to_order: 'Made to Order',
    coming_soon: 'Coming Soon',
  }[product.availability];

  return (
    <div
      className="group relative flex flex-col bg-[#11100E] border border-[rgba(201,164,92,0.14)] hover:border-[rgba(201,164,92,0.4)] transition-all duration-500 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual / Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-[#191713] to-[#0D0C0A] flex items-center justify-center p-6"
      >
        {/* Subtle Ambient Light Glow Behind Jewellery */}
        <div className="absolute inset-0 bg-radial-at-c from-[rgba(201,164,92,0.08)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Fallback / Procedural Graphic Canvas or Image */}
        <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
          {product.images && product.images[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              loading="lazy"
              onError={(e) => {
                // If local image not yet rendered, gracefully replace with artistic placeholder
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.jewellery-vector-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
          ) : null}

          {/* Luxury Vector / Stylized Fallback when image is missing or loading */}
          <div className="jewellery-vector-fallback hidden flex-col items-center justify-center text-center p-4">
            <div className="w-20 h-20 rounded-full border border-[#C9A45C]/30 flex items-center justify-center bg-[#C9A45C]/5 mb-3 group-hover:border-[#C9A45C]/60 transition-colors">
              <span className="text-2xl text-[#C9A45C]">✦</span>
            </div>
            <span className="text-xs uppercase tracking-widest text-[#A8A197]/80">
              {product.material || 'Fine Jewellery'}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.availability === 'made_to_order' && (
            <span className="bg-[#191713]/90 backdrop-blur-sm border border-[rgba(201,164,92,0.3)] text-[#C9A45C] text-[10px] uppercase tracking-widest px-2.5 py-1">
              Made to Order
            </span>
          )}
          {product.collection && (
            <span className="bg-[#080807]/80 backdrop-blur-sm text-[#A8A197] text-[10px] uppercase tracking-widest px-2 py-0.5">
              {product.collection}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-[#C9A45C] text-[#080807]'
              : 'bg-[#191713]/80 backdrop-blur-sm text-[#A8A197] hover:text-[#F5F0E7] hover:border-[#C9A45C]/40 border border-white/5'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#C9A45C] hover:bg-[#E9D5A0] text-[#080807] font-semibold text-xs tracking-wider uppercase py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors shadow-lg"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Add to Bag
          </button>
        </div>
      </Link>

      {/* Info Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-[#11100E]">
        <div>
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-[#A8A197]/70 uppercase tracking-widest mb-1">
            <span className="truncate pr-2">{product.material || 'Pure Gold'}</span>
            <span className={`shrink-0 ${product.availability === 'in_stock' ? 'text-emerald-400/80' : 'text-[#C9A45C]/80'}`}>
              {availabilityText}
            </span>
          </div>

          <Link href={`/products/${product.slug}`} className="block group/title">
            <h3
              className="text-sm sm:text-base text-[#F5F0E7] group-hover/title:text-[#C9A45C] transition-colors line-clamp-1 font-light tracking-wide mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="pt-2.5 border-t border-[rgba(201,164,92,0.1)] flex items-center justify-between gap-2">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} />
          
          <div className="flex items-center gap-1.5">
            {/* Quick Mobile Cart Action (visible on mobile, enhanced on hover) */}
            <button
              onClick={handleAddToCart}
              className="p-1.5 rounded-full bg-[#181714] border border-[rgba(201,164,92,0.25)] text-[#E9D5A0] hover:bg-[#C9A45C] hover:text-[#080807] transition-all touch-manipulation cursor-pointer sm:hidden"
              aria-label={`Add ${product.name} to bag`}
              title="Add to bag"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>

            <Link
              href={`/products/${product.slug}`}
              className="text-[11px] sm:text-xs uppercase tracking-wider text-[#A8A197] hover:text-[#C9A45C] flex items-center gap-1 transition-colors"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

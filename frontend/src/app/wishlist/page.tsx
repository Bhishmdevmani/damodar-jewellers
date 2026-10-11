'use client';

import { useWishlist } from '@/hooks';
import { demoProducts } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items } = useWishlist();

  const wishlistedProducts = demoProducts.filter((p) => items.includes(p.id));

  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      <div className="max-w-2xl mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
          Your Personal Vault
        </span>
        <h1
          className="text-display-md font-light text-[#F5F0E7] mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Saved Creations ({items.length})
        </h1>
        <p className="text-sm text-[#A8A197] font-light leading-relaxed">
          Curate and preserve pieces you adore for upcoming anniversaries, celebrations, or private atelier viewings.
        </p>
      </div>

      {wishlistedProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Vault is Waiting"
          description="Click the heart icon on any piece across our collections to save it to your personal curation."
          actionText="Browse Collections"
          actionHref="/collections"
        />
      ) : (
        <ProductGrid products={wishlistedProducts} columns={4} />
      )}
    </div>
  );
}

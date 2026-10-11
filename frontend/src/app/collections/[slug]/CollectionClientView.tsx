'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { demoProducts } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CollectionFilter } from '@/components/collections/CollectionFilter';
import type { Collection, ProductSearchParams } from '@/types';

export function CollectionClientView({ collection }: { collection: Collection }) {
  const [filters, setFilters] = useState<ProductSearchParams>({});

  const productsInCollection = demoProducts
    .filter((p) => p.collectionSlug === collection.slug)
    .filter((p) => {
      if (filters.material && p.material !== filters.material) return false;
      return true;
    })
    .sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price;
      if (filters.sort === 'price_desc') return b.price - a.price;
      if (filters.sort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* Breadcrumb / Back Link */}
      <div className="mb-8">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A197] hover:text-[#C9A45C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Collections</span>
        </Link>
      </div>

      {/* Editorial Collection Hero Banner */}
      <div className="p-8 sm:p-14 bg-gradient-to-r from-[#14120E] via-[#11100E] to-[#0A0907] border border-[rgba(201,164,92,0.22)] mb-12 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C9A45C] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Archive</span>
          </div>

          <h1
            className="text-display-md sm:text-display-lg font-light text-[#F5F0E7] mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {collection.name}
          </h1>

          <p className="text-sm sm:text-base text-[#A8A197] font-light leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>

      {/* Filters and Grid */}
      <CollectionFilter
        filters={filters}
        onFilterChange={setFilters}
        totalCount={productsInCollection.length}
      />

      <ProductGrid
        products={productsInCollection}
        columns={4}
        emptyTitle={`No designs found in ${collection.name}`}
        emptyDescription="Try selecting a different material filter or view all pieces."
      />
    </div>
  );
}

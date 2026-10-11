'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { demoCollections, demoProducts } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CollectionFilter } from '@/components/collections/CollectionFilter';
import type { ProductSearchParams } from '@/types';

export default function CollectionsPage() {
  const [filters, setFilters] = useState<ProductSearchParams>({});

  const filteredProducts = demoProducts.filter((product) => {
    if (filters.material && product.material !== filters.material) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sort === 'price_asc') return a.price - b.price;
    if (filters.sort === 'price_desc') return b.price - a.price;
    if (filters.sort === 'name_asc') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#080807] pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* Editorial Header */}
      <div className="max-w-2xl mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
          The Permanent Archive
        </span>
        <h1
          className="text-3xl sm:text-display-md lg:text-display-lg font-light text-[#F5F0E7] mb-4 sm:mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          High Jewellery <br />
          <span className="text-gold-gradient italic">Collections</span>
        </h1>
        <p className="text-sm sm:text-base text-[#A8A197] font-light leading-relaxed">
          From sovereign bridal suites to minimalist everyday gold chains, each collection embodies our commitment to sculptural proportions and uncompromising purity.
        </p>
      </div>

      {/* Collection Highlights Horizontal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16 sm:mb-20">
        {demoCollections.map((col, idx) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="group p-5 sm:p-6 bg-[#11100E] border border-[rgba(201,164,92,0.18)] hover:border-[#C9A45C] transition-all flex flex-col justify-between min-h-[200px] sm:min-h-[220px]"
          >
            <div>
              <span className="text-xs font-mono text-[#C9A45C]/60 block mb-2">0{idx + 1}</span>
              <h2
                className="text-lg sm:text-xl font-light text-[#F5F0E7] group-hover:text-[#C9A45C] transition-colors mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {col.name}
              </h2>
              <p className="text-xs text-[#A8A197] line-clamp-2">{col.description}</p>
            </div>
            <div className="text-xs text-[#C9A45C] flex items-center gap-1.5 uppercase tracking-wider pt-4">
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Filter and Products Section */}
      <div className="pt-10 border-t border-[rgba(201,164,92,0.15)]">
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-2xl font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            All Archive Creations
          </h2>
        </div>

        <CollectionFilter
          filters={filters}
          onFilterChange={setFilters}
          totalCount={filteredProducts.length}
        />

        <ProductGrid products={filteredProducts} columns={4} />
      </div>
    </div>
  );
}

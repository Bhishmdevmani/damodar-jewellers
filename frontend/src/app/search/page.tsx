'use client';

import { useState, useMemo } from 'react';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import { demoProducts } from '@/lib/demo-data';
import { ProductGrid } from '@/components/products/ProductGrid';
import { CollectionFilter } from '@/components/collections/CollectionFilter';
import type { ProductSearchParams } from '@/types';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<ProductSearchParams>({});

  const searchResults = useMemo(() => {
    return demoProducts.filter((product) => {
      // Query filter
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCol = product.collection.toLowerCase().includes(q);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCol && !matchesTags) {
          return false;
        }
      }

      // Material filter
      if (filters.material && product.material !== filters.material) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort === 'price_asc') return a.price - b.price;
      if (filters.sort === 'price_desc') return b.price - a.price;
      if (filters.sort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [query, filters]);

  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
          Catalogue Search
        </span>
        <h1
          className="text-display-md font-light text-[#F5F0E7] mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Discover Rare Creations
        </h1>

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by jewellery piece, gemstone, or collection..."
            className="w-full bg-[#11100E] border border-[rgba(201,164,92,0.3)] focus:border-[#C9A45C] text-[#F5F0E7] text-sm py-4 pl-12 pr-10 focus:outline-none placeholder:text-[#A8A197]/50"
          />
          <SearchIcon className="w-5 h-5 text-[#C9A45C] absolute left-4 top-1/2 -translate-y-1/2" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A8A197] hover:text-[#F5F0E7]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sorting Options */}
      <CollectionFilter
        filters={filters}
        onFilterChange={setFilters}
        totalCount={searchResults.length}
      />

      {/* Results Grid */}
      <ProductGrid
        products={searchResults}
        columns={4}
        emptyTitle={`No designs match "${query}"`}
        emptyDescription="Try searching for 'necklace', 'diamond', 'ring', or 'gold'."
      />
    </div>
  );
}

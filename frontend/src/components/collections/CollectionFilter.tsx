'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import type { ProductSearchParams } from '@/types';

interface CollectionFilterProps {
  filters: ProductSearchParams;
  onFilterChange: (filters: ProductSearchParams) => void;
  availableMaterials?: string[];
  totalCount?: number;
}

export function CollectionFilter({
  filters,
  onFilterChange,
  availableMaterials = ['Gold', 'Gold with Diamond', 'Gold with Kundan', 'Gold with Sapphire'],
  totalCount,
}: CollectionFilterProps) {
  const handleMaterialToggle = (material: string) => {
    onFilterChange({
      ...filters,
      material: filters.material === material ? undefined : material,
    });
  };

  const handleSortChange = (sort: ProductSearchParams['sort']) => {
    onFilterChange({
      ...filters,
      sort,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      collection: filters.collection,
      sort: undefined,
      material: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const hasActiveFilters = Boolean(filters.material || filters.sort || filters.minPrice || filters.maxPrice);

  return (
    <div className="bg-[#11100E] border border-[rgba(201,164,92,0.14)] p-4 sm:p-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Material Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider text-[#A8A197] flex items-center gap-1.5 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A45C]" />
            Material:
          </span>
          <button
            onClick={() => onFilterChange({ ...filters, material: undefined })}
            className={`text-xs px-3 py-1.5 border transition-all ${
              !filters.material
                ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#F5F0E7]'
                : 'border-white/10 text-[#A8A197] hover:border-white/20'
            }`}
          >
            All
          </button>
          {availableMaterials.map((mat) => (
            <button
              key={mat}
              onClick={() => handleMaterialToggle(mat)}
              className={`text-xs px-3 py-1.5 border transition-all ${
                filters.material === mat
                  ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#F5F0E7]'
                  : 'border-white/10 text-[#A8A197] hover:border-white/20'
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        {/* Right: Sort and Count */}
        <div className="flex items-center gap-4 self-end lg:self-auto">
          {totalCount !== undefined && (
            <span className="text-xs text-[#A8A197]">
              {totalCount} {totalCount === 1 ? 'Design' : 'Designs'}
            </span>
          )}

          <select
            value={filters.sort || ''}
            onChange={(e) => handleSortChange((e.target.value as ProductSearchParams['sort']) || undefined)}
            className="bg-[#191713] text-xs text-[#F5F0E7] border border-[rgba(201,164,92,0.2)] px-3 py-2 rounded-none focus:outline-none focus:border-[#C9A45C]"
          >
            <option value="">Sort by: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="newest">New Arrivals</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#C9A45C] hover:text-[#E9D5A0] flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

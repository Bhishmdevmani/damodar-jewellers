import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyTitle = 'No jewellery found',
  emptyDescription = 'Try adjusting your filters or search keywords to discover exquisite pieces.',
  columns = 4,
}: ProductGridProps) {
  const gridClasses = {
    2: 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6',
    3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6',
  }[columns];

  if (isLoading) {
    return (
      <div className={gridClasses}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title={emptyTitle}
        description={emptyDescription}
        actionText="View All Collections"
        actionHref="/collections"
      />
    );
  }

  return (
    <div className={gridClasses}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

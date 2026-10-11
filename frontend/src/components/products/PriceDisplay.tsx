import { formatPrice } from '@/lib/utils';
import type { CurrencyCode } from '@/types';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  currency?: CurrencyCode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = 'INR',
  className = '',
  size = 'md',
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-lg font-medium',
    xl: 'text-2xl font-light',
  };

  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span
        className={`tracking-wide text-[#E9D5A0] ${sizeClasses[size]}`}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {formatPrice(price, currency)}
      </span>
      {hasDiscount && (
        <span className="text-xs line-through text-[#A8A197]/70">
          {formatPrice(compareAtPrice, currency)}
        </span>
      )}
    </div>
  );
}

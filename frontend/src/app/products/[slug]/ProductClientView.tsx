'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { demoProducts } from '@/lib/demo-data';
import { ProductViewer3D, type JewelleryModelType } from '@/components/three/ProductViewer3D';
import { PriceDisplay } from '@/components/products/PriceDisplay';
import { ProductGrid } from '@/components/products/ProductGrid';
import { useCart } from '@/lib/cart/cart-context';
import { useToast } from '@/hooks';
import type { Product } from '@/types';

export function ProductClientView({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFinish, setSelectedFinish] = useState<'yellow_gold' | 'rose_gold' | 'white_gold'>('yellow_gold');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  // Determine which 3D model archetype to show
  let modelType: JewelleryModelType = 'ring';
  if (product.tags?.includes('necklace') || product.tags?.includes('chain')) {
    modelType = 'necklace';
  } else if (product.tags?.includes('bangles')) {
    modelType = 'bangles';
  }

  // Related products from the same collection
  const relatedProducts = demoProducts
    .filter((p) => p.collectionSlug === product.collectionSlug && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, { Finish: selectedFinish });
    toast({
      type: 'success',
      message: `Added ${quantity} × ${product.name} to your bag`,
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      type: 'info',
      message: !isWishlisted
        ? `Saved ${product.name} to wishlist`
        : `Removed ${product.name} from wishlist`,
    });
  };

  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link
          href={`/collections/${product.collectionSlug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A8A197] hover:text-[#C9A45C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {product.collection}</span>
        </Link>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
        {/* Left Column: Interactive 3D Viewer (7 cols) */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductViewer3D
            modelType={modelType}
            title={`3D View — ${product.name}`}
            showControls={true}
          />
        </div>

        {/* Right Column: Purchasing & Specifications (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C]">
              {product.collection}
            </span>
            <span className="text-xs px-2.5 py-1 bg-[#191713] border border-[rgba(201,164,92,0.25)] text-[#C9A45C] uppercase tracking-wider">
              {product.availability === 'in_stock' ? 'In Stock' : 'Made to Order'}
            </span>
          </div>

          <h1
            className="text-display-sm sm:text-display-md font-light text-[#F5F0E7] mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {product.name}
          </h1>

          <div className="mb-6">
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              currency={product.currency}
              size="xl"
            />
          </div>

          <p className="text-sm text-[#A8A197] leading-relaxed mb-8 font-light">
            {product.description}
          </p>

          {/* Precious Finish Selector */}
          <div className="mb-8 p-4 bg-[#11100E] border border-[rgba(201,164,92,0.15)]">
            <span className="text-xs uppercase tracking-widest text-[#A8A197] block mb-3">
              Selected Finish:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedFinish('yellow_gold')}
                className={`py-2 px-3 text-xs border transition-all text-center ${
                  selectedFinish === 'yellow_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197]'
                }`}
              >
                22K Gold
              </button>
              <button
                onClick={() => setSelectedFinish('rose_gold')}
                className={`py-2 px-3 text-xs border transition-all text-center ${
                  selectedFinish === 'rose_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197]'
                }`}
              >
                Rose Gold
              </button>
              <button
                onClick={() => setSelectedFinish('white_gold')}
                className={`py-2 px-3 text-xs border transition-all text-center ${
                  selectedFinish === 'white_gold'
                    ? 'border-[#C9A45C] bg-[#C9A45C]/15 text-[#E9D5A0]'
                    : 'border-white/10 text-[#A8A197]'
                }`}
              >
                Platinum
              </button>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-[rgba(201,164,92,0.25)] bg-[#191713]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-12 text-[#F5F0E7] hover:text-[#C9A45C] transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 text-center text-sm font-medium text-[#F5F0E7]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-12 text-[#F5F0E7] hover:text-[#C9A45C] transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 py-3.5 text-center flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            <button
              onClick={handleToggleWishlist}
              aria-label="Wishlist"
              className={`w-12 h-12 border flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'border-[#C9A45C] bg-[#C9A45C] text-[#080807]'
                  : 'border-[rgba(201,164,92,0.25)] bg-[#191713] text-[#A8A197] hover:text-[#F5F0E7]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Assurance Guarantees */}
          <div className="grid grid-cols-2 gap-4 py-6 border-t border-[rgba(201,164,92,0.12)] mb-8 text-xs text-[#A8A197]">
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5F0E7] block">Insured Delivery</span>
                <span>Armored logistics with signature receipt.</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <RotateCcw className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#F5F0E7] block">Complimentary Returns</span>
                <span>15-day exchange guarantee.</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="p-6 bg-[#11100E] border border-[rgba(201,164,92,0.14)]">
            <h3
              className="text-base font-light text-[#F5F0E7] mb-4 pb-2 border-b border-[rgba(201,164,92,0.1)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Artisan Specifications
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#A8A197]">Material</span>
                <span className="text-[#F5F0E7]">{product.material || 'Solid Gold'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A197]">Purity Standard</span>
                <span className="text-[#F5F0E7]">BIS Certified 916 / 750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A197]">Finish</span>
                <span className="text-[#F5F0E7]">Hand-polished mirror lustre</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A8A197]">Authenticity Certificate</span>
                <span className="text-[#C9A45C]">Included with every piece</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-[rgba(201,164,92,0.14)]">
          <h2
            className="text-2xl font-light text-[#F5F0E7] mb-8"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Complementary Creations
          </h2>
          <ProductGrid products={relatedProducts} columns={4} />
        </div>
      )}
    </div>
  );
}

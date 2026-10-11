'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { PriceDisplay } from '@/components/products/PriceDisplay';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/hooks';

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const { toast } = useToast();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'DAMODAR10') {
      setDiscountPercent(10);
      toast({
        type: 'success',
        message: 'Promotional code applied: 10% privilege discount',
      });
    } else {
      toast({
        type: 'error',
        message: 'Invalid promotional code. Try DAMODAR10',
      });
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const estimatedTotal = subtotal - discountAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#080807] pt-32 pb-24 px-6 flex items-center justify-center">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You have not added any exquisite jewellery creations to your bag yet."
          actionText="Explore Collections"
          actionHref="/collections"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080807] pt-28 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-[rgba(201,164,92,0.15)]">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] block mb-2">
            Order Review
          </span>
          <h1
            className="text-display-sm sm:text-display-md font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Shopping Bag ({items.reduce((acc, i) => acc + i.quantity, 0)})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs uppercase tracking-widest text-[#A8A197] hover:text-red-400 transition-colors"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Cart Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${JSON.stringify(item.selectedAttributes)}`}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-[#11100E] border border-[rgba(201,164,92,0.15)] gap-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-[#191713] border border-[rgba(201,164,92,0.15)] flex items-center justify-center shrink-0">
                  <span className="text-2xl text-[#C9A45C]">✦</span>
                </div>
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="text-base text-[#F5F0E7] hover:text-[#C9A45C] font-light transition-colors"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {item.product.name}
                  </Link>
                  <span className="block text-xs text-[#A8A197] mt-1">
                    {item.product.material}
                  </span>
                  {item.selectedAttributes?.Finish && (
                    <span className="inline-block text-[11px] uppercase tracking-wider text-[#C9A45C] mt-1">
                      Finish: {item.selectedAttributes.Finish}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity & Price Controls */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                {/* Quantity adjust */}
                <div className="flex items-center border border-[rgba(201,164,92,0.25)] bg-[#191713]">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 text-xs text-[#F5F0E7] hover:text-[#C9A45C]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs text-[#F5F0E7]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 text-xs text-[#F5F0E7] hover:text-[#C9A45C]"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <PriceDisplay
                    price={item.product.price * item.quantity}
                    currency={item.product.currency}
                    size="md"
                  />
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  aria-label="Remove item"
                  className="text-[#A8A197] hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout (4 cols) */}
        <div className="lg:col-span-4">
          <div className="p-8 bg-[#11100E] border border-[rgba(201,164,92,0.22)] sticky top-28">
            <h2
              className="text-xl font-light text-[#F5F0E7] mb-6 pb-4 border-b border-[rgba(201,164,92,0.12)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Order Summary
            </h2>

            <div className="space-y-4 text-xs mb-6">
              <div className="flex justify-between text-[#A8A197]">
                <span>Bag Subtotal</span>
                <span className="text-[#F5F0E7]">{formatPrice(subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-[#C9A45C]">
                  <span>Privilege Privilege ({discountPercent}%)</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#A8A197]">
                <span>Insured Armored Delivery</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="flex justify-between text-[#A8A197]">
                <span>Applicable Taxes & Duties</span>
                <span>Calculated at Checkout</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2 mb-6">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo Code (DAMODAR10)"
                className="flex-1 bg-[#191713] border border-[rgba(201,164,92,0.25)] text-xs px-3 py-2 text-[#F5F0E7] uppercase focus:outline-none focus:border-[#C9A45C]"
              />
              <button
                type="submit"
                className="px-4 py-2 border border-[#C9A45C] text-[#C9A45C] hover:bg-[#C9A45C]/10 text-xs uppercase tracking-wider"
              >
                Apply
              </button>
            </form>

            {/* Total */}
            <div className="pt-4 border-t border-[rgba(201,164,92,0.15)] flex justify-between items-baseline mb-8">
              <span className="text-sm font-light text-[#F5F0E7]">Estimated Total</span>
              <span className="text-2xl font-light text-[#E9D5A0]" style={{ fontFamily: 'var(--font-sans)' }}>
                {formatPrice(estimatedTotal)}
              </span>
            </div>

            <Link href="/checkout" className="btn-primary w-full py-4 text-center block mb-4">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2 inline" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#A8A197]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>256-bit Encrypted Luxury Transaction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

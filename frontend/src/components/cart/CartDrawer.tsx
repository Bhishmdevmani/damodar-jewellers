'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { state, items, subtotal, itemCount, toggleCart, updateQuantity, removeItem } =
    useCart();
  const isOpen = state.isOpen;

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        toggleCart(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping bag">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-over panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-screen max-w-md bg-[#0E0D0B] border-l border-[rgba(201,164,92,0.22)] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col justify-between"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {/* Header */}
              <div className="p-6 border-b border-[rgba(201,164,92,0.15)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#181714] border border-[rgba(201,164,92,0.3)] flex items-center justify-center text-[#C9A45C]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2
                      className="text-lg text-[#F5F0E7] font-light tracking-wide flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      <span>Shopping Bag</span>
                      <span className="text-xs font-mono text-[#C9A45C] px-2 py-0.5 rounded-full bg-[rgba(201,164,92,0.12)]">
                        {itemCount}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#A8A197]/80">
                      Complimentary Insured Delivery Across India
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleCart(false)}
                  className="p-2 text-[#A8A197] hover:text-[#F5F0E7] hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#161512] border border-[rgba(201,164,92,0.2)] flex items-center justify-center text-[#C9A45C]/60 shadow-inner">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3
                        className="text-xl text-[#F5F0E7] font-light"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        Your Bag is Empty
                      </h3>
                      <p className="text-xs text-[#A8A197] max-w-xs leading-relaxed">
                        Explore our handcrafted 22K gold, certified diamond, and bridal heritage collections.
                      </p>
                    </div>
                    <Link
                      href="/collections"
                      onClick={() => toggleCart(false)}
                      className="mt-2 py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8943F] text-[#080807] text-xs uppercase tracking-wider font-semibold hover:shadow-lg transition-all"
                    >
                      Discover Collections
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={`${item.product.id}-${JSON.stringify(item.selectedAttributes)}`}
                        className="p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.18)] flex gap-4 items-center group transition-colors hover:border-[rgba(201,164,92,0.35)]"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/60 border border-[rgba(201,164,92,0.15)] flex items-center justify-center shrink-0 p-1">
                          {item.product.images?.[0]?.url ? (
                            <img
                              src={
                                item.product.images.find((img) => img.isPrimary)?.url ||
                                item.product.images[0].url
                              }
                              alt={item.product.name}
                              className="w-full h-full object-contain filter drop-shadow-sm"
                            />
                          ) : (
                            <span className="text-[#C9A45C] text-lg">✦</span>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            onClick={() => toggleCart(false)}
                            className="text-sm text-[#F5F0E7] hover:text-[#C9A45C] font-light line-clamp-1 transition-colors"
                            style={{ fontFamily: 'var(--font-serif)' }}
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-[11px] text-[#A8A197] truncate">
                            {item.product.material}
                            {item.selectedAttributes?.Finish && ` · ${item.selectedAttributes.Finish}`}
                          </p>
                          <p className="text-sm font-semibold text-[#E9D5A0] font-mono">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>

                          {/* Controls */}
                          <div className="flex items-center justify-between pt-1">
                            {/* Quantity pill */}
                            <div className="flex items-center rounded-lg bg-[#1B1A16] border border-[rgba(201,164,92,0.2)]">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="p-1.5 text-[#A8A197] hover:text-white transition-colors cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-mono text-[#F5F0E7]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="p-1.5 text-[#A8A197] hover:text-white transition-colors cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 text-[#A8A197] hover:text-rose-400 transition-colors cursor-pointer"
                              aria-label={`Remove ${item.product.name} from bag`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[rgba(201,164,92,0.18)] bg-[#11100E] space-y-4">
                  {/* Trust indicator */}
                  <div className="flex items-center justify-between text-[11px] text-[#A8A197] font-mono pb-2 border-b border-[rgba(201,164,92,0.08)]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                      BIS 916 Hallmarked Certified
                    </span>
                    <span className="text-[#E9D5A0]">Free Shipping</span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#A8A197]">
                      Subtotal
                    </span>
                    <span className="text-lg font-semibold text-[#F5F0E7] font-mono">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="space-y-2.5">
                    <Link
                      href="/checkout"
                      onClick={() => toggleCart(false)}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] font-semibold text-xs uppercase tracking-[0.16em] shadow-[0_10px_30px_rgba(201,164,92,0.25)] hover:shadow-[0_15px_40px_rgba(201,164,92,0.4)] transition-all flex items-center justify-center gap-2 group"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/cart"
                      onClick={() => toggleCart(false)}
                      className="w-full py-2.5 px-6 rounded-xl bg-[#161512] hover:bg-[#1E1C18] border border-[rgba(201,164,92,0.25)] text-xs text-[#E9D5A0] font-medium tracking-wider text-center block transition-colors"
                    >
                      View Full Bag & Apply Coupons
                    </Link>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  ArrowRight,
  ShoppingBag,
  Truck,
  CreditCard,
  QrCode,
  Building,
  ArrowLeft,
  Tag,
  Check,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { formatPrice } from '@/lib/utils';
import { IS_DEMO_MODE } from '@/lib/config';
import { apiClient } from '@/lib/api/client';
import { useToast } from '@/hooks';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi NCR',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{
    id: string;
    total: number;
    itemsCount: number;
    deliveryAddress: string;
  } | null>(null);

  // Promo code discount
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    paymentMethod: 'upi',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'DAMODAR10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      toast({
        type: 'success',
        message: 'Coupon DAMODAR10 applied: 10% festive discount',
      });
    } else {
      toast({
        type: 'error',
        message: 'Invalid coupon code. Try DAMODAR10',
      });
    }
  };

  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        type: 'error',
        message: 'Your shopping bag is empty.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (IS_DEMO_MODE) {
        // Realistic validation & order simulation
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const demoOrderId = `DJ-${Math.floor(100000 + Math.random() * 900000)}`;
        setOrderConfirmed({
          id: demoOrderId,
          total: finalTotal,
          itemsCount: totalItemCount,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}`,
        });
        clearCart();
      } else {
        const res = await apiClient.createOrder(items);
        setOrderConfirmed({
          id: res.id,
          total: finalTotal,
          itemsCount: totalItemCount,
          deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.postalCode}`,
        });
        clearCart();
      }
    } catch (err) {
      console.error('Order creation failed:', err);
      toast({
        type: 'error',
        message: 'Unable to process order. Please verify your details and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========================================================
  // 1. ORDER CONFIRMATION RECEIPT SCREEN
  // ========================================================
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#070605] pt-32 pb-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full p-8 sm:p-12 rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.3)] text-center shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative overflow-hidden">
          {/* Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent" />

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-[#181714] border border-[#C9A45C]/50 flex items-center justify-center mx-auto mb-6 text-[#C9A45C] shadow-lg">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-xs font-mono text-[#E9D5A0] tracking-wider px-3 py-1 rounded-full bg-[rgba(201,164,92,0.12)] border border-[rgba(201,164,92,0.25)] inline-block mb-3">
            Order Reference #{orderConfirmed.id}
          </span>

          <h1
            className="text-2xl sm:text-3xl font-light text-[#F5F0E7] mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Thank You for Your Order
          </h1>

          <p className="text-sm text-[#A8A197] leading-relaxed mb-6 font-light max-w-md mx-auto">
            Your jewellery order has been placed successfully. A digital confirmation and tracking link have been dispatched to your email and mobile number.
          </p>

          {/* Receipt Breakdown */}
          <div className="rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.15)] p-5 mb-8 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center text-[#A8A197]">
              <span>Items Ordered</span>
              <span className="text-[#F5F0E7] font-medium">{orderConfirmed.itemsCount} piece(s)</span>
            </div>
            <div className="flex justify-between items-center text-[#A8A197]">
              <span>Delivery Destination</span>
              <span className="text-[#F5F0E7] font-medium truncate max-w-[240px] text-right">
                {orderConfirmed.deliveryAddress}
              </span>
            </div>
            <div className="flex justify-between items-center text-[#A8A197]">
              <span>Estimated Delivery</span>
              <span className="text-emerald-400 font-medium">3–5 Business Days (Insured)</span>
            </div>
            <div className="pt-2 border-t border-[rgba(201,164,92,0.1)] flex justify-between items-center text-sm font-semibold text-[#E9D5A0]">
              <span>Total Amount Paid</span>
              <span className="font-mono">{formatPrice(orderConfirmed.total)}</span>
            </div>
          </div>

          {IS_DEMO_MODE && (
            <div className="mb-6 p-3 rounded-xl bg-[rgba(201,164,92,0.06)] border border-[rgba(201,164,92,0.2)] text-[11px] text-[#A8A197] leading-relaxed">
              ✦ Demonstration Mode: This order was simulated for portfolio review. No real funds were deducted.
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/collections"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] font-semibold text-xs uppercase tracking-wider hover:shadow-lg transition-all text-center inline-flex items-center justify-center gap-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#151411] hover:bg-[#1C1B17] border border-[rgba(201,164,92,0.25)] text-xs text-[#E9D5A0] font-medium tracking-wider transition-colors text-center"
            >
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. EMPTY BAG ON CHECKOUT
  // ========================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#070605] pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.25)] text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#181714] border border-[#C9A45C]/30 flex items-center justify-center mx-auto mb-5 text-[#C9A45C]/70">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1
            className="text-2xl font-light text-[#F5F0E7] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs text-[#A8A197] leading-relaxed mb-6 font-light">
            Before proceeding to checkout, please select the fine jewellery pieces you wish to acquire.
          </p>
          <Link
            href="/collections"
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] font-semibold text-xs uppercase tracking-wider hover:shadow-lg transition-all inline-flex items-center justify-center gap-2"
          >
            <span>Browse Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ========================================================
  // 3. MAIN CHECKOUT WORKFLOW
  // ========================================================
  return (
    <div className="min-h-screen bg-[#070605] text-[#F5F0E7] pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-8 lg:px-16 max-w-[1440px] mx-auto">
      {/* Top Breadcrumb & Progress Stepper */}
      <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-[rgba(201,164,92,0.12)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-[#A8A197] hover:text-[#E9D5A0] transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C9A45C] group-hover:-translate-x-1 transition-transform" />
            <span>Return to Shopping Bag</span>
          </Link>
          <h1
            className="text-2xl sm:text-3xl font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Checkout & Delivery
          </h1>
        </div>

        {/* 3-Step Breadcrumb Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          <Link href="/cart" className="text-[#A8A197] hover:text-[#E9D5A0] transition-colors shrink-0">
            1. Bag
          </Link>
          <span className="text-[#A8A197]/40 shrink-0">/</span>
          <span className="text-[#E9D5A0] font-semibold flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(201,164,92,0.12)] border border-[rgba(201,164,92,0.25)] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A45C]" />
            2. Delivery & Payment
          </span>
          <span className="text-[#A8A197]/40 shrink-0">/</span>
          <span className="text-[#A8A197]/60 shrink-0">3. Confirmation</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: SHIPPING & PAYMENT FORM (7 COLS)             */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Section 1: Contact Information */}
            <div className="rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.2)] p-5 sm:p-8 shadow-xl">
              <h2
                className="text-lg font-light text-[#F5F0E7] mb-4 pb-3 border-b border-[rgba(201,164,92,0.12)] flex items-center justify-between"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <span>1. Contact Details</span>
                <span className="text-xs font-mono text-[#A8A197]">Order Confirmation</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/50 text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none transition-all"
                  />
                  <span className="text-[11px] text-[#A8A197]/70 mt-1 block">
                    Your invoice and BIS certification receipt will be sent here.
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Mobile Number *
                  </label>
                  <div className="flex rounded-xl overflow-hidden border border-[rgba(201,164,92,0.25)] focus-within:border-[#C9A45C] focus-within:ring-1 focus-within:ring-[#C9A45C]/50 transition-all">
                    <div className="px-3 py-3 bg-[#181714] border-r border-[rgba(201,164,92,0.2)] text-xs text-[#E9D5A0] font-mono flex items-center gap-1">
                      <span>🇮🇳</span>
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="98765 43210"
                      className="w-full px-3.5 py-3 bg-[#141310] text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none font-mono"
                    />
                  </div>
                  <span className="text-[11px] text-[#A8A197]/70 mt-1 block">
                    Required for courier delivery updates.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Destination */}
            <div className="rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.2)] p-6 sm:p-8 shadow-xl">
              <h2
                className="text-lg font-light text-[#F5F0E7] mb-4 pb-3 border-b border-[rgba(201,164,92,0.12)] flex items-center justify-between"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <span>2. Delivery Address</span>
                <span className="text-xs font-mono text-[#A8A197]">Insured Transit</span>
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Gayatri"
                      className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Devi"
                      className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Street Address (Flat / House / Building) *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. 14, Royal Palm Residences, Link Road"
                    className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Apartment, Suite, Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="e.g. Tower B, Near Heritage Square"
                    className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none transition-all cursor-pointer"
                    >
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s} className="bg-[#11100E] text-[#F5F0E7]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400050"
                      className="w-full px-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none font-mono transition-all"
                    />
                  </div>
                </div>

                {/* Insured Delivery Indicator */}
                <div className="p-4 rounded-xl bg-[#151411] border border-[rgba(201,164,92,0.22)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#C9A45C] shrink-0" />
                    <div>
                      <p className="text-xs text-[#F5F0E7] font-medium">
                        Complimentary Insured Express Delivery
                      </p>
                      <p className="text-[11px] text-[#A8A197]">
                        Delivered in 3–5 business days in tamper-evident sealed presentation box.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    Free
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Options */}
            <div className="rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.2)] p-6 sm:p-8 shadow-xl">
              <h2
                className="text-lg font-light text-[#F5F0E7] mb-4 pb-3 border-b border-[rgba(201,164,92,0.12)] flex items-center justify-between"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                <span>3. Payment Method</span>
                <span className="text-xs font-mono text-[#A8A197] flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#C9A45C]" />
                  256-Bit SSL
                </span>
              </h2>

              <div className="space-y-3">
                {/* Option: UPI */}
                <label className="flex items-center justify-between p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] hover:border-[#C9A45C] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                      className="accent-[#C9A45C] w-4 h-4"
                    />
                    <QrCode className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-sm text-[#F5F0E7] font-medium block">
                        UPI / QR (Google Pay, PhonePe, Paytm)
                      </span>
                      <span className="text-[11px] text-[#A8A197]">
                        Instant zero-fee payment via any UPI app
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-[#E9D5A0] font-mono">Popular</span>
                </label>

                {/* Option: Credit / Debit Card */}
                <label className="flex items-center justify-between p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] hover:border-[#C9A45C] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="accent-[#C9A45C] w-4 h-4"
                    />
                    <CreditCard className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-sm text-[#F5F0E7] font-medium block">
                        Credit / Debit Cards
                      </span>
                      <span className="text-[11px] text-[#A8A197]">
                        Visa, MasterCard, RuPay, American Express
                      </span>
                    </div>
                  </div>
                </label>

                {/* Option: Net Banking */}
                <label className="flex items-center justify-between p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] hover:border-[#C9A45C] cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="netbanking"
                      checked={formData.paymentMethod === 'netbanking'}
                      onChange={handleInputChange}
                      className="accent-[#C9A45C] w-4 h-4"
                    />
                    <Building className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <span className="text-sm text-[#F5F0E7] font-medium block">
                        Net Banking
                      </span>
                      <span className="text-[11px] text-[#A8A197]">
                        All major Indian banks supported
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] font-semibold text-sm uppercase tracking-[0.16em] shadow-[0_12px_36px_rgba(201,164,92,0.32)] hover:shadow-[0_16px_45px_rgba(201,164,92,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Complete Order ({formatPrice(finalTotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#A8A197]/70 mt-3 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
                <span>Encrypted checkout. Your payment and address details are fully protected.</span>
              </p>
            </div>
          </form>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: STICKY ORDER SUMMARY (5 COLS)              */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="rounded-2xl bg-[#0E0D0B] border border-[rgba(201,164,92,0.22)] p-5 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(201,164,92,0.15)]">
              <h2
                className="text-lg font-light text-[#F5F0E7]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Order Summary ({totalItemCount})
              </h2>
              <Link
                href="/cart"
                className="text-xs text-[#E9D5A0] hover:underline font-mono"
              >
                Edit Bag
              </Link>
            </div>

            {/* Product items list */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => {
                const primaryImage =
                  item.product.images?.find((img) => img.isPrimary)?.url ||
                  item.product.images?.[0]?.url;

                return (
                  <div
                    key={`${item.product.id}-${JSON.stringify(item.selectedAttributes)}`}
                    className="flex items-center gap-3.5 pb-3 border-b border-[rgba(201,164,92,0.08)] last:border-b-0"
                  >
                    <div className="w-16 h-16 rounded-xl bg-black/60 border border-[rgba(201,164,92,0.2)] flex items-center justify-center shrink-0 p-1 relative overflow-hidden">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-[#C9A45C]">✦</span>
                      )}
                      {item.quantity > 1 && (
                        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#C9A45C] text-[#080807] text-[10px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-light text-[#F5F0E7] line-clamp-1"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-[11px] text-[#A8A197] truncate">
                        {item.product.material}
                        {item.selectedAttributes?.Finish && ` · ${item.selectedAttributes.Finish}`}
                      </p>
                      <p className="text-xs text-[#A8A197] font-mono">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-[#E9D5A0] font-mono shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#C9A45C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code (DAMODAR10)"
                    disabled={couponApplied}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.22)] focus:border-[#C9A45C] text-xs text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#1B1A16] hover:bg-[#25231E] border border-[rgba(201,164,92,0.3)] text-xs text-[#E9D5A0] font-medium transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {couponApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {couponApplied && (
                <span className="text-[11px] text-emerald-400 font-mono mt-1.5 flex items-center gap-1">
                  <Check className="w-3 h-3" /> 10% Privilege discount applied!
                </span>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="pt-4 border-t border-[rgba(201,164,92,0.15)] space-y-2.5 text-xs">
              <div className="flex justify-between text-[#A8A197]">
                <span>Bag Subtotal</span>
                <span className="font-mono text-[#F5F0E7]">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-[#A8A197]">
                <span>Insured Nationwide Delivery</span>
                <span className="text-emerald-400 font-mono font-medium">Free</span>
              </div>

              <div className="flex justify-between text-[#A8A197]">
                <span>BIS 916 Hallmarking Certification</span>
                <span className="text-emerald-400 font-mono font-medium">Included</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Festive Privilege Discount (10%)</span>
                  <span className="font-mono">- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[rgba(201,164,92,0.2)] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-light text-[#F5F0E7] block">Total Amount</span>
                  <span className="text-[11px] text-[#A8A197]/70">Including all applicable taxes</span>
                </div>
                <span className="text-xl font-semibold text-[#E9D5A0] font-mono">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Trust Assurance Block */}
            <div className="pt-4 border-t border-[rgba(201,164,92,0.12)] space-y-2 text-[11px] text-[#A8A197]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                <span>100% Certified BIS 916 Hallmarked Gold & Natural Diamonds</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                <span>Transit insurance covered up to the moment of delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                <span>Signature luxury packaging with tamper-evident seal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

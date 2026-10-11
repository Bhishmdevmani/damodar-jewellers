'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Filter,
  ShoppingBag,
  Heart,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { demoProducts, demoCollections } from '@/lib/demo-data';
import { RoundedGalleryView, type GalleryMediaItem } from '@/components/ui/RoundedGalleryView';
import { PriceDisplay } from '@/components/products/PriceDisplay';
import { useCart } from '@/lib/cart/cart-context';
import { useToast } from '@/hooks';
import type { Product } from '@/types';

// Featured spotlight items for top rounded gallery reel
const SPOTLIGHT_MEDIA: GalleryMediaItem[] = [
  {
    id: 'spot-1',
    url: '/images/gallery/necklace-royal.jpg',
    alt: 'Celestial Royal Sapphire Necklace',
    title: 'The Celestial Royal Sapphire Necklace',
    badge: 'Signature Haute Creation',
    tagline: '22K Solid Gold with Ceylon Sapphire & Diamond Halo',
  },
  {
    id: 'spot-2',
    url: '/images/gallery/diamond-ring.jpg',
    alt: 'Eternal Diamond Solitaire Ring',
    title: 'The Eternal Diamond Solitaire Ring',
    badge: 'GIA Certified Solitaire',
    tagline: '2.10ct Center Solitaire with Micro-Pavé Knife-Edge Band',
  },
  {
    id: 'spot-3',
    url: '/images/gallery/gold-bangles.jpg',
    alt: 'Heritage Gold Filigree Bangles',
    title: 'Heritage Gold Filigree Bangles',
    badge: 'Ancestral Temple Craft',
    tagline: 'Pair of 22K Solid Gold Bangles with Burmese Rubies',
  },
  {
    id: 'spot-4',
    url: '/images/gallery/kundan-choker.jpg',
    alt: 'Maharani Kundan & Pearl Bridal Choker',
    title: 'The Maharani Kundan & Pearl Choker',
    badge: 'Royal Bridal Suite',
    tagline: 'Uncut Polki Diamonds & Natural Basra Seed Pearls',
  },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'featured' | 'price_asc' | 'price_desc' | 'name_asc'>('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  const { addItem } = useCart();
  const { toast } = useToast();

  const handleToggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !wishlist[product.id];
    setWishlist((prev) => ({ ...prev, [product.id]: nextState }));
    toast({
      type: nextState ? 'success' : 'info',
      message: nextState
        ? `Added "${product.name}" to your wishlist`
        : `Removed "${product.name}" from wishlist`,
    });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      type: 'success',
      message: `Added "${product.name}" to your shopping bag`,
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return demoProducts.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchTag = product.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && product.collectionSlug !== selectedCategory) {
        return false;
      }

      // Material filter
      if (selectedMaterial !== 'all') {
        if (!product.material?.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
      }

      // Availability filter
      if (selectedAvailability !== 'all' && product.availability !== selectedAvailability) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (priceSort === 'price_asc') return a.price - b.price;
      if (priceSort === 'price_desc') return b.price - a.price;
      if (priceSort === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [selectedCategory, selectedMaterial, selectedAvailability, priceSort, searchQuery]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedAvailability('all');
    setPriceSort('featured');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#080807] pt-28 lg:pt-32 pb-24 px-6 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* EDITORIAL HEADER & PROVENANCE */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C9A45C]/30 bg-[#C9A45C]/5 mb-4 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#E9D5A0] font-medium">
              High Jewellery Acquisitions & Pricing Catalog
            </span>
          </div>

          <h1
            className="text-display-md sm:text-display-lg font-light text-[#F5F0E7] leading-tight mb-4"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            The Permanent <br />
            <span className="text-gold-gradient italic">Product Archive.</span>
          </h1>

          <p className="text-base text-[#A8A197] font-light leading-relaxed">
            Every creation is consolidated here with verified transparent pricing, carat specifications, hallmark certificates, and direct acquisition options.
          </p>
        </div>

        {/* Hallmark Assurance Badges */}
        <div className="flex flex-wrap items-center gap-6 border-l border-[rgba(201,164,92,0.2)] pl-6">
          <div>
            <span className="block text-xl font-light text-[#E9D5A0] font-serif">BIS 916</span>
            <span className="text-[10px] uppercase tracking-wider text-[#A8A197]">Solid Gold Purity</span>
          </div>
          <div>
            <span className="block text-xl font-light text-[#E9D5A0] font-serif">100% GIA</span>
            <span className="text-[10px] uppercase tracking-wider text-[#A8A197]">Graded Diamonds</span>
          </div>
          <div>
            <span className="block text-xl font-light text-[#E9D5A0] font-serif">Direct</span>
            <span className="text-[10px] uppercase tracking-wider text-[#A8A197]">Atelier Pricing</span>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* FEATURED SPOTLIGHT MEDIA REEL (Using RoundedGalleryView) ─────────────── */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C9A45C] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spotlight Media Inspection Reel</span>
          </span>
          <span className="text-xs text-[#A8A197] font-mono">
            {SPOTLIGHT_MEDIA.length} Featured Archival Highlights
          </span>
        </div>

        <RoundedGalleryView
          items={SPOTLIGHT_MEDIA}
          aspectRatio="wide"
          roundedSize="3xl"
          showThumbnails={true}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE FILTERS & SORTING SUITE ─────────────────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.18)] mb-12 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-6 border-b border-[rgba(201,164,92,0.1)]">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A197]" />
            <input
              type="text"
              placeholder="Search by name, gemstone, motif, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#080807] border border-[rgba(201,164,92,0.2)] text-xs text-[#F5F0E7] placeholder-[#A8A197]/50 focus:border-[#C9A45C] focus:outline-none transition-colors"
            />
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#A8A197] whitespace-nowrap">Sort by:</span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="px-4 py-2 rounded-full bg-[#080807] border border-[rgba(201,164,92,0.2)] text-xs text-[#E9D5A0] focus:border-[#C9A45C] focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured Archive</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#A8A197] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span>Category:</span>
            </span>

            {[
              { key: 'all', label: 'All Categories' },
              ...demoCollections.map((col) => ({ key: col.slug, label: col.name })),
            ].map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-1.5 text-xs rounded-full border transition-all ${
                    isSelected
                      ? 'border-[#C9A45C] bg-[#C9A45C]/20 text-[#E9D5A0] font-medium'
                      : 'border-white/10 text-[#A8A197] hover:text-[#F5F0E7] hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#C9A45C]">
              {filteredProducts.length} Creations Available
            </span>
            {(selectedCategory !== 'all' || selectedMaterial !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#A8A197] hover:text-[#E9D5A0] underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* CONSOLIDATED PRODUCTS GRID (WITH PRICING & CART ACTIONS) ───────────────── */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#11100E] border border-[rgba(201,164,92,0.15)] my-12">
          <Sparkles className="w-8 h-8 text-[#C9A45C] mx-auto mb-4" />
          <h3 className="text-xl font-light text-[#F5F0E7] mb-2 font-serif">
            No creations match your filter criteria
          </h3>
          <p className="text-xs text-[#A8A197] mb-6">
            Try adjusting your search query, material filter, or view all collections.
          </p>
          <button onClick={clearFilters} className="btn-primary py-2.5 px-6 text-xs rounded-full">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => {
            const isWishlisted = !!wishlist[product.id];
            const primaryImage = product.images?.[0]?.url || '/images/gallery/necklace-royal.jpg';

            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between bg-gradient-to-b from-[#14120E] via-[#0E0D0B] to-[#0A0907] border border-[rgba(201,164,92,0.18)] hover:border-[rgba(201,164,92,0.55)] rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_15px_35px_rgba(0,0,0,0.7)]"
              >
                {/* Visual Image Stage */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full overflow-hidden bg-[#0A0908] p-6 flex items-center justify-center block"
                >
                  <img
                    src={primaryImage}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out group-hover:scale-108"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#14120E]/90 border border-[rgba(201,164,92,0.25)] text-[#E9D5A0]">
                      {product.availability === 'in_stock' ? 'In Stock' : 'Made to Order'}
                    </span>

                    <button
                      onClick={(e) => handleToggleWishlist(product, e)}
                      aria-label="Save to Wishlist"
                      className={`p-2 rounded-full border transition-all pointer-events-auto ${
                        isWishlisted
                          ? 'border-[#C9A45C] bg-[#C9A45C]/20 text-[#C9A45C]'
                          : 'border-[rgba(201,164,92,0.2)] bg-[#11100E]/80 text-[#A8A197] hover:text-[#E9D5A0] hover:border-[#C9A45C]'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#C9A45C]' : ''}`} />
                    </button>
                  </div>
                </Link>

                {/* Details & Pricing */}
                <div className="p-5 flex flex-col justify-between flex-1 border-t border-[rgba(201,164,92,0.1)]">
                  <div className="mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-[#C9A45C] block mb-1">
                      {product.collection}
                    </span>
                    <Link href={`/products/${product.slug}`}>
                      <h3
                        className="text-base font-light text-[#F5F0E7] group-hover:text-[#E9D5A0] transition-colors mb-1.5 leading-snug line-clamp-1"
                        style={{ fontFamily: 'var(--font-serif)' }}
                      >
                        {product.name}
                      </h3>
                    </Link>
                    <span className="text-xs text-[#A8A197] block line-clamp-1 font-light">
                      {product.material || 'Solid 22K Gold'}
                    </span>
                  </div>

                  {/* Pricing and Cart Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(201,164,92,0.08)]">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-[#A8A197]/70 block">
                        Verified Price
                      </span>
                      <PriceDisplay
                        price={product.price}
                        currency={product.currency}
                        size="md"
                      />
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="p-2.5 rounded-full border border-[rgba(201,164,92,0.3)] bg-[#C9A45C]/10 hover:bg-[#C9A45C] hover:text-[#080807] text-[#E9D5A0] transition-all"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────── */}
      {/* BOTTOM ASSURANCE GUARANTEES */}
      {/* ───────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 mt-20 border-t border-[rgba(201,164,92,0.15)]">
        <div className="p-6 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.15)] flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#C9A45C] flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-[#F5F0E7] mb-1 font-serif">
              100% Certified BIS 916 Hallmark
            </h4>
            <p className="text-xs text-[#A8A197] leading-relaxed font-light">
              Every gold creation undergoes government spectroscopic laser assaying with official hallmark stamps.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.15)] flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-[#C9A45C] flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-[#F5F0E7] mb-1 font-serif">
              GIA & IGI Diamond Grading
            </h4>
            <p className="text-xs text-[#A8A197] leading-relaxed font-light">
              Natural diamonds are accompanied by individual laboratory grading dossiers detailing clarity, cut, and color.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.15)] flex items-start gap-4">
          <RotateCcw className="w-6 h-6 text-[#C9A45C] flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-sm font-medium text-[#F5F0E7] mb-1 font-serif">
              Lifetime Care & Exchange
            </h4>
            <p className="text-xs text-[#A8A197] leading-relaxed font-light">
              Complimentary lifetime ultrasonic cleaning, annual prong inspection, and transparent exchange guarantee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

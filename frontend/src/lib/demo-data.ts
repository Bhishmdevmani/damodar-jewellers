// ============================================================================
// DAMODAR JEWELLERS — Demo Data
// ============================================================================
// Clearly identified demonstration data used when no API is configured.
// All prices are fictional demo values. No real inventory claims.

import type { Product, Collection } from '@/types';

export const DEMO_BADGE = '✦ Demo Mode — Sample Data';

export const demoCollections: Collection[] = [
  {
    id: 'col-1',
    slug: 'bridal-jewellery',
    name: 'Bridal Jewellery',
    description: 'Exquisite pieces for life\'s most cherished celebrations. Each design is crafted to complement the beauty of the occasion.',
    image: {
      id: 'col-img-1',
      url: '/images/collections/bridal.webp',
      alt: 'Bridal jewellery collection — gold necklace sets and bridal designs',
    },
    productCount: 12,
  },
  {
    id: 'col-2',
    slug: 'gold-essentials',
    name: 'Gold Essentials',
    description: 'Timeless gold designs for everyday elegance. Classic pieces that transcend trends.',
    image: {
      id: 'col-img-2',
      url: '/images/collections/gold.webp',
      alt: 'Gold essentials collection — refined gold jewellery',
    },
    productCount: 18,
  },
  {
    id: 'col-3',
    slug: 'diamond-elegance',
    name: 'Diamond Elegance',
    description: 'Brilliant diamonds set in exceptional craftsmanship. Each piece tells a story of precision and beauty.',
    image: {
      id: 'col-img-3',
      url: '/images/collections/diamond.webp',
      alt: 'Diamond elegance collection — diamond jewellery designs',
    },
    productCount: 10,
  },
  {
    id: 'col-4',
    slug: 'everyday-classics',
    name: 'Everyday Classics',
    description: 'Refined pieces for your daily signature style. Understated luxury for every moment.',
    image: {
      id: 'col-img-4',
      url: '/images/collections/everyday.webp',
      alt: 'Everyday classics collection — daily wear jewellery',
    },
    productCount: 24,
  },
];

export const demoProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'celestial-gold-necklace',
    name: 'Celestial Gold Necklace',
    description: 'A stunning gold necklace featuring intricate celestial-inspired motifs. Crafted with precision and finished to a brilliant lustre.',
    price: 85000,
    currency: 'INR',
    images: [
      { id: 'img-1a', url: '/images/products/necklace-1.webp', alt: 'Celestial Gold Necklace — front view', isPrimary: true },
      { id: 'img-1b', url: '/images/products/necklace-1-detail.webp', alt: 'Celestial Gold Necklace — detail view' },
    ],
    collection: 'Bridal Jewellery',
    collectionSlug: 'bridal-jewellery',
    availability: 'in_stock',
    material: 'Gold',
    tags: ['necklace', 'gold', 'bridal', 'wedding'],
  },
  {
    id: 'prod-2',
    slug: 'eternal-diamond-ring',
    name: 'Eternal Diamond Ring',
    description: 'An elegant diamond ring with a timeless design. The centrepiece diamond is set in a refined gold band.',
    price: 125000,
    currency: 'INR',
    images: [
      { id: 'img-2a', url: '/images/products/ring-1.webp', alt: 'Eternal Diamond Ring — front view', isPrimary: true },
      { id: 'img-2b', url: '/images/products/ring-1-side.webp', alt: 'Eternal Diamond Ring — side view' },
    ],
    collection: 'Diamond Elegance',
    collectionSlug: 'diamond-elegance',
    availability: 'in_stock',
    material: 'Gold with Diamond',
    tags: ['ring', 'diamond', 'engagement'],
  },
  {
    id: 'prod-3',
    slug: 'heritage-gold-bangles',
    name: 'Heritage Gold Bangles',
    description: 'A pair of handcrafted gold bangles inspired by traditional motifs. Each bangle features detailed engravings.',
    price: 65000,
    currency: 'INR',
    images: [
      { id: 'img-3a', url: '/images/products/bangles-1.webp', alt: 'Heritage Gold Bangles — pair view', isPrimary: true },
    ],
    collection: 'Gold Essentials',
    collectionSlug: 'gold-essentials',
    availability: 'in_stock',
    material: 'Gold',
    tags: ['bangles', 'gold', 'traditional'],
  },
  {
    id: 'prod-4',
    slug: 'aurora-diamond-earrings',
    name: 'Aurora Diamond Earrings',
    description: 'Delicate diamond earrings with a modern drop design. Perfect for both everyday elegance and special occasions.',
    price: 42000,
    currency: 'INR',
    images: [
      { id: 'img-4a', url: '/images/products/earrings-1.webp', alt: 'Aurora Diamond Earrings — pair view', isPrimary: true },
    ],
    collection: 'Diamond Elegance',
    collectionSlug: 'diamond-elegance',
    availability: 'in_stock',
    material: 'Gold with Diamond',
    tags: ['earrings', 'diamond', 'drop'],
  },
  {
    id: 'prod-5',
    slug: 'minimalist-gold-chain',
    name: 'Minimalist Gold Chain',
    description: 'A refined, lightweight gold chain for everyday wear. Simple design that pairs beautifully with any pendant.',
    price: 28000,
    currency: 'INR',
    images: [
      { id: 'img-5a', url: '/images/products/chain-1.webp', alt: 'Minimalist Gold Chain', isPrimary: true },
    ],
    collection: 'Everyday Classics',
    collectionSlug: 'everyday-classics',
    availability: 'in_stock',
    material: 'Gold',
    tags: ['chain', 'gold', 'everyday', 'minimal'],
  },
  {
    id: 'prod-6',
    slug: 'bridal-kundan-set',
    name: 'Bridal Kundan Set',
    description: 'A complete bridal jewellery set featuring traditional Kundan work. Includes necklace, earrings, and tikka.',
    price: 195000,
    currency: 'INR',
    images: [
      { id: 'img-6a', url: '/images/products/bridal-set-1.webp', alt: 'Bridal Kundan Set — full set view', isPrimary: true },
    ],
    collection: 'Bridal Jewellery',
    collectionSlug: 'bridal-jewellery',
    availability: 'made_to_order',
    material: 'Gold with Kundan',
    tags: ['bridal', 'set', 'kundan', 'wedding', 'necklace', 'earrings'],
  },
  {
    id: 'prod-7',
    slug: 'sapphire-pendant',
    name: 'Sapphire Pendant',
    description: 'A pendant featuring a deep blue sapphire surrounded by a halo of smaller stones, set in polished gold.',
    price: 55000,
    currency: 'INR',
    images: [
      { id: 'img-7a', url: '/images/products/pendant-1.webp', alt: 'Sapphire Pendant — front view', isPrimary: true },
    ],
    collection: 'Diamond Elegance',
    collectionSlug: 'diamond-elegance',
    availability: 'in_stock',
    material: 'Gold with Sapphire',
    tags: ['pendant', 'sapphire', 'gemstone'],
  },
  {
    id: 'prod-8',
    slug: 'classic-gold-studs',
    name: 'Classic Gold Studs',
    description: 'Timeless gold stud earrings with a polished, contemporary finish. A versatile addition to any jewellery collection.',
    price: 15000,
    currency: 'INR',
    images: [
      { id: 'img-8a', url: '/images/products/studs-1.webp', alt: 'Classic Gold Studs — pair view', isPrimary: true },
    ],
    collection: 'Everyday Classics',
    collectionSlug: 'everyday-classics',
    availability: 'in_stock',
    material: 'Gold',
    tags: ['studs', 'earrings', 'gold', 'everyday'],
  },
];

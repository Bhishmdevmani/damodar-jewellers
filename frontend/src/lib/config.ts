// ============================================================================
// DAMODAR JEWELLERS — Site Configuration
// ============================================================================
// All brand information is configurable. Do not invent business details.

import type { SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  brandName: 'DAMODAR JEWELLERS',
  tagline: 'Crafted for Your Forever.',
  secondaryMessage: 'Every Detail Tells a Story.',
  // Contact details are placeholders — replace with actual business information
  contactEmail: undefined,
  contactPhone: undefined,
  address: undefined,
  socialLinks: {
    instagram: undefined,
    facebook: undefined,
    twitter: undefined,
    pinterest: undefined,
    youtube: undefined,
  },
};

/** Design tokens */
export const designTokens = {
  colors: {
    background: '#080807',
    surface: '#11100E',
    surfaceRaised: '#191713',
    gold: '#C9A45C',
    goldLight: '#E9D5A0',
    ivory: '#F5F0E7',
    muted: '#A8A197',
    border: 'rgba(201,164,92,0.22)',
  },
};

/** Navigation items */
export const mainNavItems = [
  { label: 'Collections', href: '/collections' },
  { label: 'Bridal', href: '/collections/bridal-jewellery' },
  { label: 'Gold', href: '/collections/gold-essentials' },
  { label: 'Diamonds', href: '/collections/diamond-elegance' },
  { label: 'Our Story', href: '/about' },
] as const;

/** Collection themes */
export const collectionThemes = [
  {
    slug: 'bridal-jewellery',
    name: 'Bridal Jewellery',
    description: 'Exquisite pieces for life\'s most cherished celebrations.',
    gradient: 'from-amber-900/30 to-yellow-900/20',
  },
  {
    slug: 'gold-essentials',
    name: 'Gold Essentials',
    description: 'Timeless gold designs for everyday elegance.',
    gradient: 'from-yellow-800/30 to-orange-900/20',
  },
  {
    slug: 'diamond-elegance',
    name: 'Diamond Elegance',
    description: 'Brilliant diamonds set in exceptional craftsmanship.',
    gradient: 'from-slate-700/30 to-zinc-800/20',
  },
  {
    slug: 'everyday-classics',
    name: 'Everyday Classics',
    description: 'Refined pieces for your daily signature style.',
    gradient: 'from-stone-700/30 to-neutral-800/20',
  },
] as const;

/** API base URL */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/** Whether the app is running in demo mode (no API configured) */
export const IS_DEMO_MODE = !API_BASE_URL;

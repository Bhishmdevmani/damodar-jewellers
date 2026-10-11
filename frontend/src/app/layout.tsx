import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/lib/cart/cart-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { DemoBanner } from '@/components/ui/DemoBanner';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#080807',
};

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'DAMODAR JEWELLERS — Crafted for Your Forever',
    template: '%s | DAMODAR JEWELLERS',
  },
  description:
    'Exceptional craftsmanship. Timeless brilliance. Discover premium gold, diamond, and bridal jewellery at Damodar Jewellers.',
  keywords: [
    'jewellery',
    'gold jewellery',
    'diamond jewellery',
    'bridal jewellery',
    'Damodar Jewellers',
    'premium jewellery',
    'necklaces',
    'rings',
    'bangles',
    'earrings',
  ],
  openGraph: {
    title: 'DAMODAR JEWELLERS — Crafted for Your Forever',
    description:
      'Exceptional craftsmanship. Timeless brilliance. Discover premium gold, diamond, and bridal jewellery.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'DAMODAR JEWELLERS',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-[#080807] text-[#F5F0E7]"
      >
        <CartProvider>
          <Suspense fallback={<div className="h-16 lg:h-20" />}>
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}

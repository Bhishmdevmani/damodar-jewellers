'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '@/lib/config';

const footerLinks = {
  shop: [
    { label: 'All Collections', href: '/collections' },
    { label: 'Bridal Jewellery', href: '/collections/bridal-jewellery' },
    { label: 'Gold Essentials', href: '/collections/gold-essentials' },
    { label: 'Diamond Elegance', href: '/collections/diamond-elegance' },
    { label: 'Everyday Classics', href: '/collections/everyday-classics' },
  ],
  customerService: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping', href: '/policies/shipping' },
    { label: 'Returns', href: '/policies/returns' },
    { label: 'FAQ', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms of Service', href: '/policies/terms' },
    { label: 'Our Story', href: '/about' },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null;
  }

  return (
    <footer
      className="relative border-t border-[rgba(201,164,92,0.12)]"
      style={{ backgroundColor: 'var(--color-surface)', fontFamily: 'var(--font-sans)' }}
    >
      {/* Main footer content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span
                className="text-2xl tracking-[0.15em] text-gold-gradient"
                style={{ fontFamily: 'var(--font-serif)', fontWeight: 300 }}
              >
                DAMODAR
              </span>
            </Link>
            <p className="text-sm text-[#A8A197] leading-relaxed max-w-xs">
              {siteConfig.tagline}
            </p>
            <p className="text-xs text-[#A8A197]/60 mt-2 italic" style={{ fontFamily: 'var(--font-serif)' }}>
              {siteConfig.secondaryMessage}
            </p>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-xs tracking-wider text-[#C9A45C] mb-5 font-semibold">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A8A197] hover:text-[#F5F0E7] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="text-xs tracking-wider text-[#C9A45C] mb-5 font-semibold">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A8A197] hover:text-[#F5F0E7] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-xs tracking-wider text-[#C9A45C] mb-5 mt-8 font-semibold">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#A8A197] hover:text-[#F5F0E7] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xs tracking-wider text-[#C9A45C] mb-5 font-semibold">
              Stay Updated
            </h3>
            <p className="text-sm text-[#A8A197] mb-4 leading-relaxed">
              Receive updates on new collections and exclusive offers.
            </p>

            {subscribed ? (
              <p className="text-sm text-[#C9A45C]">Thank you for subscribing.</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 bg-[#080807] border border-[rgba(201,164,92,0.22)] text-[#F5F0E7] text-sm placeholder:text-[#A8A197]/50 focus:outline-none focus:border-[#C9A45C] transition-colors"
                />
                <button
                  type="submit"
                  className="w-full btn-primary text-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(201,164,92,0.08)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#A8A197]/60">
            © 2026 {siteConfig.brandName}. All rights reserved.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-[#A8A197] hover:text-[#C9A45C] transition-colors group"
            aria-label="Return to top"
          >
            <span className="tracking-[0.1em] uppercase">Back to Top</span>
            <ArrowUp
              size={14}
              className="transform group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}

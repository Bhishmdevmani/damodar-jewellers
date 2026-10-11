'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/cart/cart-context';
import { useAuth } from '@/hooks/useAuth';
import { siteConfig } from '@/lib/config';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Products', href: '/products' },
  { label: 'Bridal', href: '/collections/bridal-jewellery' },
  { label: 'Gold', href: '/collections/gold-essentials' },
  { label: 'Diamonds', href: '/collections/diamond-elegance' },
  { label: 'Our Story', href: '/about' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setIsMobileOpen(false);
  }, []);

  if (pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#080807]/90 backdrop-blur-xl border-b border-[rgba(201,164,92,0.18)] shadow-[0_12px_35px_rgba(0,0,0,0.65)] py-0'
            : 'bg-gradient-to-b from-[#080807]/80 to-transparent backdrop-blur-[2px] py-1',
        )}
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 group flex items-center gap-2"
              aria-label={`${siteConfig.brandName} — Home`}
            >
              <span
                className="font-editorial text-xl lg:text-2xl tracking-[0.18em] text-gold-gradient group-hover:opacity-90 transition-opacity"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                DAMODAR
              </span>
              <span className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] text-[#A8A197]/70 border-l border-[rgba(201,164,92,0.3)] pl-2">
                Jewellers
              </span>
            </Link>

            {/* Desktop Navigation with Animated Framer Motion Pill */}
            <nav
              className="hidden lg:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredLink(item.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={cn(
                      'relative px-4 py-2 text-xs tracking-[0.14em] uppercase transition-colors duration-300 font-light',
                      isActive ? 'text-[#E9D5A0] font-normal' : 'text-[#A8A197] hover:text-[#F5F0E7]',
                    )}
                  >
                    {/* Framer Motion Indicator */}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    {hoveredLink === item.href && !isActive && (
                      <motion.span
                        layoutId="hoverNavIndicator"
                        className="absolute inset-0 rounded-full bg-[rgba(201,164,92,0.08)] pointer-events-none"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <Link
                href="/search"
                className="p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.5} />
              </Link>

              <Link
                href="/wishlist"
                className="p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />
              </Link>

              <Link
                href={isAuthenticated ? '/account' : '/auth'}
                className="hidden sm:flex items-center gap-1.5 p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all group"
                aria-label={isAuthenticated ? `Account (${user?.name})` : 'Sign In / Register'}
                title={isAuthenticated ? `Patron Portal: ${user?.name}` : 'Sign In / Register'}
              >
                <div className="relative">
                  <User size={19} strokeWidth={1.5} />
                  {isAuthenticated && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#C9A45C] ring-2 ring-[#080807]" />
                  )}
                </div>
                {isAuthenticated && user && (
                  <span className="hidden md:inline text-[11px] font-mono tracking-wider text-[#E9D5A0] truncate max-w-[70px]">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all cursor-pointer"
                aria-label={`Shopping bag (${itemCount} items)`}
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C9A45C] text-[#080807] text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 text-[#A8A197] hover:text-[#F5F0E7] transition-colors cursor-pointer ml-0.5"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-expanded={isMobileOpen}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-[#0E0D0B] border-l border-[rgba(201,164,92,0.2)] p-6 flex flex-col justify-between shadow-2xl overflow-y-auto"
              onKeyDown={handleKeyDown}
            >
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-[rgba(201,164,92,0.15)] mb-6">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-lg tracking-[0.16em] text-gold-gradient"
                      style={{ fontFamily: 'var(--font-serif)' }}
                    >
                      DAMODAR
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#A8A197]/60 border-l border-[rgba(201,164,92,0.3)] pl-2">
                      Jewellers
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1.5 text-[#A8A197] hover:text-[#F5F0E7] rounded-full hover:bg-white/5 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'text-sm uppercase tracking-widest py-3 px-2 rounded-lg border-b border-[rgba(201,164,92,0.06)] transition-all flex items-center justify-between',
                        pathname === item.href
                          ? 'text-[#E9D5A0] bg-[rgba(201,164,92,0.08)] font-medium pl-3'
                          : 'text-[#A8A197] hover:text-[#F5F0E7] hover:pl-3',
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="text-xs text-[#C9A45C]/50">→</span>
                    </Link>
                  ))}
                </nav>

                {/* Quick Boutique Assistance link */}
                <div className="mt-8 p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.15)]">
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A45C] block mb-1 font-mono">
                    Private Concierge
                  </span>
                  <p className="text-xs text-[#A8A197] mb-2 font-light">
                    Mon–Sat: 10:30 AM – 7:30 PM IST
                  </p>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileOpen(false)}
                    className="text-xs text-[#E9D5A0] hover:underline flex items-center gap-1"
                  >
                    <span>Book Boutique Appointment</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* 4-Item Mobile Quick Navigation */}
              <div className="pt-5 mt-6 border-t border-[rgba(201,164,92,0.15)] grid grid-cols-4 gap-1 text-center">
                <Link
                  href="/search"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors py-1"
                >
                  <Search size={16} />
                  <span>Search</span>
                </Link>

                <Link
                  href="/wishlist"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors py-1"
                >
                  <Heart size={16} />
                  <span>Vault</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    toggleCart(true);
                  }}
                  className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors cursor-pointer py-1"
                >
                  <ShoppingBag size={16} />
                  <span>Bag ({itemCount})</span>
                </button>

                <Link
                  href={isAuthenticated ? '/account' : '/auth'}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors py-1"
                >
                  <User size={16} className={isAuthenticated ? 'text-[#C9A45C]' : ''} />
                  <span>{isAuthenticated ? 'Portal' : 'Sign In'}</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;

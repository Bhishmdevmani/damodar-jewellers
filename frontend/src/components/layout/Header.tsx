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
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                href="/search"
                className="p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={19} strokeWidth={1.5} />
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

              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all"
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />
              </Link>

              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 text-[#A8A197] hover:text-[#E9D5A0] hover:bg-[#C9A45C]/10 rounded-full transition-all"
                aria-label={`Shopping bag (${itemCount} items)`}
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#C9A45C] text-[#080807] text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 text-[#A8A197] hover:text-[#F5F0E7] transition-colors"
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
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 right-0 w-full max-w-xs bg-[#0E0D0B] border-l border-[rgba(201,164,92,0.2)] p-6 flex flex-col justify-between shadow-2xl"
              onKeyDown={handleKeyDown}
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-[rgba(201,164,92,0.15)] mb-8">
                  <span
                    className="text-lg tracking-[0.15em] text-gold-gradient"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    DAMODAR
                  </span>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-1 text-[#A8A197] hover:text-[#F5F0E7]"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-base uppercase tracking-widest py-2 border-b border-[rgba(201,164,92,0.08)] transition-colors',
                        pathname === item.href ? 'text-[#E9D5A0]' : 'text-[#A8A197] hover:text-[#F5F0E7]',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="pt-6 border-t border-[rgba(201,164,92,0.15)] grid grid-cols-3 gap-2 text-center">
                <Link
                  href="/search"
                  className="flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors"
                >
                  <Search size={16} /> Search
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileOpen(false);
                    toggleCart(true);
                  }}
                  className="flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors cursor-pointer"
                >
                  <ShoppingBag size={16} /> Bag ({itemCount})
                </button>
                <Link
                  href={isAuthenticated ? '/account' : '/auth'}
                  onClick={() => setIsMobileOpen(false)}
                  className="flex flex-col items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors"
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

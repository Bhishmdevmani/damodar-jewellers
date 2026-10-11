// ============================================================================
// DAMODAR JEWELLERS — Custom Hooks
// ============================================================================

'use client';

export { useCart } from '@/lib/cart/cart-context';
export { useAuth, getStoredPatron, setStoredPatron, type PatronUser } from './useAuth';

import { useState, useEffect, useRef, useCallback } from 'react';
import { prefersReducedMotion, isWebGLSupported } from '@/lib/utils';

/** Hook to detect if component is mounted (avoid SSR issues) */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

/** Hook for reduced motion preference */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reduced;
}

/** Hook for WebGL support detection */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    setSupported(isWebGLSupported());
  }, []);

  return supported;
}

/** Hook for responsive breakpoints */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Hook for scroll position */
export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scrollY;
}

/** Hook for intersection observer */
export function useInView(
  options?: IntersectionObserverInit,
): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1, ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

/** Hook for mouse/pointer position (normalized -1 to 1) */
export function usePointerPosition(): { x: number; y: number } {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: PointerEvent) => {
      setPos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  return pos;
}

/** Toast notification system */
interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastListeners: ((toasts: ToastItem[]) => void)[] = [];
let toastState: ToastItem[] = [];

function notifyToastListeners() {
  toastListeners.forEach((listener) => listener([...toastState]));
}

export function showToast(message: string, type: ToastItem['type'] = 'info', duration = 4000) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  toastState = [...toastState, { id, message, type }];
  notifyToastListeners();

  setTimeout(() => {
    toastState = toastState.filter((t) => t.id !== id);
    notifyToastListeners();
  }, duration);
}

export function useToast() {
  return {
    toast: ({ message, type = 'info', duration }: { message: string; type?: ToastItem['type']; duration?: number }) => {
      showToast(message, type, duration);
    },
  };
}

export function useToasts(): ToastItem[] {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  }, []);

  return toasts;
}

/** Wishlist hook (client-side localStorage) */
export function useWishlist() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('damodar_wishlist');
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);

  const persist = useCallback((updated: string[]) => {
    setItems(updated);
    try {
      localStorage.setItem('damodar_wishlist', JSON.stringify(updated));
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback((productId: string) => {
    setItems((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const isWishlisted = useCallback(
    (productId: string) => items.includes(productId),
    [items],
  );

  return { items, toggle, isWishlisted, count: items.length };
}

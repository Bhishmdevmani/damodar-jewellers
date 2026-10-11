'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PatronUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vipTier: string;
  authMethod: 'google' | 'email' | 'mobile';
  avatarUrl?: string;
  joinedAt: string;
}

const STORAGE_KEY = 'damodar_patron_session';
const AUTH_EVENT_NAME = 'damodar_auth_changed';

export function getStoredPatron(): PatronUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredPatron(patron: PatronUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (patron) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patron));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent(AUTH_EVENT_NAME, { detail: patron }));
  } catch {
    // Ignore storage errors
  }
}

export function useAuth() {
  const [user, setUser] = useState<PatronUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setUser(getStoredPatron());
    setIsLoading(false);

    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent<PatronUser | null>;
      setUser(customEvent.detail ?? getStoredPatron());
    };

    window.addEventListener(AUTH_EVENT_NAME, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_EVENT_NAME, handleAuthChange);
    };
  }, []);

  const loginWithEmail = useCallback(async (email: string, password: string): Promise<PatronUser> => {
    setIsLoading(true);
    // Simulate luxury authentication latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const patronName = email.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = patronName.charAt(0).toUpperCase() + patronName.slice(1);

    const newPatron: PatronUser = {
      id: `patron-${Date.now().toString(36)}`,
      name: formattedName || 'Valued Patron',
      email: email.trim().toLowerCase(),
      vipTier: 'Founding Atelier Tier',
      authMethod: 'email',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setStoredPatron(newPatron);
    setUser(newPatron);
    setIsLoading(false);
    return newPatron;
  }, []);

  const loginWithMobile = useCallback(async (phone: string, otp: string): Promise<PatronUser> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPatron: PatronUser = {
      id: `patron-${Date.now().toString(36)}`,
      name: 'Valued Patron',
      email: `patron.${phone.replace(/\D/g, '').slice(-4)}@damodarjewellers.com`,
      phone: phone.trim(),
      vipTier: 'Royal Privilege Member',
      authMethod: 'mobile',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setStoredPatron(newPatron);
    setUser(newPatron);
    setIsLoading(false);
    return newPatron;
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<PatronUser> => {
    setIsLoading(true);
    // Simulate Google OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 900));

    const newPatron: PatronUser = {
      id: `patron-g-${Date.now().toString(36)}`,
      name: 'Ananya Sharma',
      email: 'ananya.sharma@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      vipTier: 'High Joaillerie Collector',
      authMethod: 'google',
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    };

    setStoredPatron(newPatron);
    setUser(newPatron);
    setIsLoading(false);
    return newPatron;
  }, []);

  const register = useCallback(
    async (name: string, email: string, phone: string, password: string): Promise<PatronUser> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newPatron: PatronUser = {
        id: `patron-${Date.now().toString(36)}`,
        name: name.trim() || 'Valued Patron',
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        vipTier: 'Founding Atelier Tier',
        authMethod: 'email',
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      };

      setStoredPatron(newPatron);
      setUser(newPatron);
      setIsLoading(false);
      return newPatron;
    },
    []
  );

  const logout = useCallback(() => {
    setStoredPatron(null);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithEmail,
    loginWithMobile,
    loginWithGoogle,
    register,
    logout,
  };
}

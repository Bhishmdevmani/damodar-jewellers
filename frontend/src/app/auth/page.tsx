import { Suspense } from 'react';
import type { Metadata } from 'next';
import AuthPageClient from './AuthPageClient';

export const metadata: Metadata = {
  title: 'Client Account — Sign In & Register | Damodar Jewellers',
  description:
    'Sign in or create an account with Damodar Jewellers to view orders, save favourite jewellery pieces, and access certified BIS 916 purchases.',
};

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080807] flex items-center justify-center text-xs tracking-widest text-[#C9A45C]">Loading...</div>}>
      <AuthPageClient />
    </Suspense>
  );
}

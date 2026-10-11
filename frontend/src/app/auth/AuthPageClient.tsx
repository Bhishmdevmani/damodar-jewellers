'use client';

import { useSearchParams } from 'next/navigation';
import AuthScreen from '@/components/auth/AuthScreen';

export default function AuthPageClient() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const redirectTo = searchParams.get('redirect') || '/account';

  return <AuthScreen initialMode={initialMode} redirectTo={redirectTo} />;
}

import type { Metadata } from 'next';
import AuthScreen from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Sign In | Damodar Jewellers',
  description: 'Sign in with Email, Mobile OTP, or Google to access your Damodar Jewellers account and order history.',
};

export default function LoginPage() {
  return <AuthScreen initialMode="signin" redirectTo="/account" />;
}

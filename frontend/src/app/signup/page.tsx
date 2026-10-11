import type { Metadata } from 'next';
import AuthScreen from '@/components/auth/AuthScreen';

export const metadata: Metadata = {
  title: 'Create Account | Damodar Jewellers',
  description: 'Create an account with Email, Mobile OTP, or Google to save jewellery designs, track orders, and receive updates.',
};

export default function SignUpPage() {
  return <AuthScreen initialMode="signup" redirectTo="/account" />;
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  Award,
  Crown,
  Headphones
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/hooks';

export interface AuthScreenProps {
  initialMode?: 'signin' | 'signup';
  redirectTo?: string;
}

type AuthMethod = 'email' | 'mobile';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
];

const SHOWCASE_PIECES = [
  {
    id: 'necklace',
    title: 'The Royal Sapphire Necklace',
    subtitle: 'Heritage Bridal Collection',
    image: '/images/gallery/necklace-royal.jpg',
    purity: '22K Solid Gold · Ceylon Sapphire 3.85ct',
    hallmark: 'BIS Hallmarked 916',
    story: 'Meticulously handcrafted in 22K hallmarked gold with a royal blue Ceylon sapphire, celebrating traditional Indian jewellery heritage.',
  },
  {
    id: 'choker',
    title: 'The Maharani Kundan Choker',
    subtitle: 'Imperial Polki Collection',
    image: '/images/gallery/kundan-choker.jpg',
    purity: '22K Gold · Uncut Polki Diamonds',
    hallmark: 'BIS 916 · Certified Natural Pearls',
    story: 'Pure gold foil Kundan setting accented with fine uncut polki stones and delicate seed pearl drops, crafted for weddings and auspicious occasions.',
  },
  {
    id: 'ring',
    title: 'The Eternal Solitaire Ring',
    subtitle: 'Classic Diamond Collection',
    image: '/images/gallery/diamond-ring.jpg',
    purity: '18K Yellow Gold · 2.10ct Solitaire',
    hallmark: 'GIA Certified Diamond',
    story: 'A brilliant 2.10-carat solitaire diamond set in an elevated six-prong crown with pavé diamonds along the knife-edge band.',
  },
];

// Unified Button Design System (<= 4 cohesive variants)
const BTN_PRIMARY =
  'w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] font-semibold text-sm shadow-[0_8px_24px_rgba(201,164,92,0.25)] hover:shadow-[0_12px_32px_rgba(201,164,92,0.38)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer';

const BTN_SECONDARY =
  'w-full py-3 px-6 rounded-xl bg-[#141310] hover:bg-[#1A1916] border border-[rgba(201,164,92,0.28)] hover:border-[#C9A45C] text-sm text-[#F5F0E7] font-medium flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 cursor-pointer';

const BTN_TAB_ACTIVE =
  'flex-1 py-2.5 px-4 text-sm rounded-xl font-semibold bg-gradient-to-r from-[#C9A45C] via-[#E9D5A0] to-[#B8943F] text-[#080807] shadow-md transition-all duration-300 cursor-pointer text-center';

const BTN_TAB_INACTIVE =
  'flex-1 py-2.5 px-4 text-sm rounded-xl font-medium text-[#A8A197] hover:text-[#F5F0E7] transition-all duration-300 cursor-pointer text-center';

const BTN_LINK =
  'text-xs text-[#E9D5A0] hover:text-white underline font-medium transition-colors cursor-pointer inline-flex items-center gap-1';

const BTN_ICON =
  'p-2 text-[#A8A197] hover:text-[#E9D5A0] transition-colors rounded-xl cursor-pointer';

export function AuthScreen({ initialMode = 'signin', redirectTo = '/account' }: AuthScreenProps) {
  const router = useRouter();
  const { loginWithEmail, loginWithMobile, loginWithGoogle, register, isLoading } = useAuth();

  // Mode: Sign In or Sign Up
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  // Auth Channel: Email/Gmail or Mobile Number
  const [method, setMethod] = useState<AuthMethod>('email');
  // Selected vitrine piece on left
  const [activePieceIdx, setActivePieceIdx] = useState(0);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [conciergeOptIn, setConciergeOptIn] = useState(true);

  // OTP flow for Mobile Number
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpCountdown, setOtpCountdown] = useState(30);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Feedback states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Auto-rotate showcase pieces every 7s
  useEffect(() => {
    const timer = setInterval(() => {
      setActivePieceIdx((prev) => (prev + 1) % SHOWCASE_PIECES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpSent, otpCountdown]);


  // Password strength calculation for sign up
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Enter Password', color: 'bg-neutral-800' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score === 1) return { score: 25, label: 'Basic', color: 'bg-rose-500' };
    if (score === 2) return { score: 50, label: 'Moderate', color: 'bg-amber-500' };
    if (score === 3) return { score: 75, label: 'Strong', color: 'bg-[#C9A45C]' };
    return { score: 100, label: 'Very Strong', color: 'bg-emerald-400' };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Handle Google Login
  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      showToast(`Welcome back, ${user.name}.`, 'success');
      router.push(redirectTo);
    } catch {
      setErrorMsg('Google authentication failed. Please try again.');
    }
  };

  // Handle Email & Password Submit
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid Gmail or email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setErrorMsg('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please accept the Terms of Service and Privacy Policy.');
        return;
      }

      try {
        const user = await register(name, email, phone, password);
        showToast(`Account created successfully. Welcome, ${user.name}.`, 'success');
        router.push(redirectTo);
      } catch {
        setErrorMsg('Registration could not be completed. Please try again.');
      }
    } else {
      // Sign In
      try {
        const user = await loginWithEmail(email, password);
        showToast(`Welcome back, ${user.name}.`, 'success');
        router.push(redirectTo);
      } catch {
        setErrorMsg('Invalid email or password. Please verify your credentials.');
      }
    }
  };

  // Handle Mobile Send OTP
  const handleSendMobileOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpSent(true);
    setOtpCountdown(30);
    setOtpDigits(['', '', '', '', '', '']);
    showToast(`Verification code sent to ${countryCode} ${phone}`, 'info');
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Verify
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredCode = otpDigits.join('');
    if (enteredCode.length < 6) {
      setErrorMsg('Please enter the full 6-digit verification code.');
      return;
    }

    try {
      const fullPhone = `${countryCode} ${phone}`;
      const user = await loginWithMobile(fullPhone, enteredCode);
      showToast(`Phone verified. Welcome, ${user.name}.`, 'success');
      router.push(redirectTo);
    } catch {
      setErrorMsg('Verification code was incorrect or has expired.');
    }
  };

  const handleResendOtp = () => {
    if (otpCountdown > 0) return;
    setIsResendingOtp(true);
    setTimeout(() => {
      setIsResendingOtp(false);
      setOtpCountdown(30);
      showToast(`New verification code sent to ${countryCode} ${phone}`, 'info');
    }, 600);
  };

  // Forgot password submit
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setForgotSent(true);
    showToast(`Password recovery link sent to ${forgotEmail}`, 'success');
  };

  const activePiece = SHOWCASE_PIECES[activePieceIdx];

  return (
    <div className="relative min-h-screen bg-[#070605] text-[#F5F0E7] flex flex-col justify-between selection:bg-[#C9A45C]/30 selection:text-[#E9D5A0] overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(201,164,92,0.16),transparent_70%)]" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-[radial-gradient(circle,rgba(201,164,92,0.06),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#040403] via-[#070605] to-transparent" />
      </div>

      {/* ======================================================== */}
      {/* 1. HEADER                                                */}
      {/* Issue 4 Fix: Title Case brand name to eliminate 17 chars all-caps */}
      {/* ======================================================== */}
      <header className="relative z-20 w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-4 flex items-center justify-between border-b border-[rgba(201,164,92,0.12)]">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-xs text-[#A8A197] hover:text-[#E9D5A0] transition-colors py-2 px-3 rounded-xl hover:bg-white/[0.03] group"
        >
          <ArrowLeft className="w-4 h-4 text-[#C9A45C] group-hover:-translate-x-1 transition-transform" />
          <span className="font-light">Return to Store</span>
        </Link>

        {/* Brand Title: Sentence/Title Case to resolve Issue 4 */}
        <Link href="/" className="flex flex-col items-center group">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#C9A45C] text-xs">✦</span>
            <span
              className="text-xl tracking-[0.14em] text-gold-gradient font-light"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Damodar Jewellers
            </span>
            <span className="text-[#C9A45C] text-xs">✦</span>
          </div>
          <span className="text-xs text-[#A8A197]/80 tracking-wider font-mono">
            Fine Jewellery · Established 1974
          </span>
        </Link>

        {/* Balanced Header Spacer */}
        <div className="w-28 hidden sm:block" />
      </header>

      {/* ======================================================== */}
      {/* 2. MAIN SPLIT-PANEL STAGE                                */}
      {/* ======================================================== */}
      <main className="relative z-20 flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-8 lg:px-16 py-8 sm:py-12 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ======================================================== */}
          {/* LEFT PANEL: SHOWCASE PIECES (5 COLS)                     */}
          {/* Issue 2 Fix: uses rounded-2xl to consolidate corner radii */}
          {/* ======================================================== */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between rounded-2xl p-10 bg-gradient-to-b from-[#12110E] via-[#0E0D0B] to-[#080807] border border-[rgba(201,164,92,0.28)] shadow-[0_35px_100px_rgba(0,0,0,0.95)] relative overflow-hidden min-h-[720px]">
            {/* Interior Spotlight */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle,rgba(201,164,92,0.14),transparent_65%)] pointer-events-none" />

            {/* Showcase Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-xs text-[#C9A45C] font-mono mb-3">
                <Crown className="w-4 h-4 text-[#C9A45C]" />
                <span>Featured Collection</span>
              </div>

              <h2
                className="text-xl font-light text-[#F5F0E7] leading-tight mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {activePiece.title}
              </h2>
              <p className="text-xs text-[#A8A197] font-light leading-relaxed">
                {activePiece.purity} · {activePiece.hallmark}
              </p>
            </div>

            {/* Center Masterpiece Image */}
            <div className="relative z-10 my-6 flex flex-col items-center">
              <div className="relative w-full aspect-square max-h-[340px] rounded-xl overflow-hidden bg-black/50 border border-[rgba(201,164,92,0.18)] flex items-center justify-center p-6 shadow-2xl group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,164,92,0.1),transparent_70%)] pointer-events-none" />
                <img
                  key={activePiece.id}
                  src={activePiece.image}
                  alt={activePiece.title}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_24px_45px_rgba(0,0,0,0.98)] transition-all duration-700 ease-out transform group-hover:scale-105"
                />
              </div>

              {/* Thumbnail Selector Dots */}
              <div className="flex items-center gap-2.5 mt-4" role="tablist" aria-label="Featured Jewellery Pieces">
                {SHOWCASE_PIECES.map((piece, idx) => (
                  <button
                    key={piece.id}
                    onClick={() => setActivePieceIdx(idx)}
                    role="tab"
                    aria-selected={activePieceIdx === idx}
                    aria-label={`Showcase piece ${idx + 1}: ${piece.title}`}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      activePieceIdx === idx
                        ? 'w-7 h-2 bg-[#C9A45C]'
                        : 'w-2 h-2 bg-[#A8A197]/30 hover:bg-[#E9D5A0]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Heritage Story & Trust Markers */}
            <div className="relative z-10 pt-5 border-t border-[rgba(201,164,92,0.15)] space-y-3">
              <p className="text-xs text-[#D1CCC4] font-light italic leading-relaxed">
                "{activePiece.story}"
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-[#A8A197] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                  <span>Secure Account</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A8A197] font-mono">
                  <Award className="w-3.5 h-3.5 text-[#C9A45C] shrink-0" />
                  <span>Insured Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: AUTHENTICATION FORM (7 COLS)                */}
          {/* Issue 2 Fix: uses rounded-2xl to consolidate corner radii */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-center rounded-2xl p-6 sm:p-10 md:p-12 bg-[#0E0D0B]/95 backdrop-blur-2xl border border-[rgba(201,164,92,0.28)] shadow-[0_35px_100px_rgba(0,0,0,0.98)] relative overflow-hidden">
            {/* Top Glowing Edge Bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent opacity-75" />

            {/* Segmented Mode Selector: Issue 3 Fix uses unified BTN_TAB_ACTIVE/INACTIVE */}
            <div className="relative mb-8 p-1.5 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.22)] flex items-center" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => {
                  setMode('signin');
                  setErrorMsg(null);
                  setOtpSent(false);
                }}
                className={mode === 'signin' ? BTN_TAB_ACTIVE : BTN_TAB_INACTIVE}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => {
                  setMode('signup');
                  setErrorMsg(null);
                  setOtpSent(false);
                }}
                className={mode === 'signup' ? BTN_TAB_ACTIVE : BTN_TAB_INACTIVE}
              >
                Create Account
              </button>
            </div>

            {/* Heading & Subtitle: Issue 1 uses standard text-2xl and text-xs */}
            <div className="mb-6">
              <span className="text-xs text-[#C9A45C] block mb-1 font-mono tracking-wider">
                {mode === 'signin' ? 'Welcome Back' : 'New Registration'}
              </span>
              <h1
                className="text-2xl font-light text-[#F5F0E7] mb-2 leading-tight"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {mode === 'signin' ? 'Sign In to Your Account' : 'Welcome to Damodar Jewellers'}
              </h1>
              <p className="text-xs text-[#A8A197] font-light leading-relaxed">
                {mode === 'signin'
                  ? 'Access your orders, saved jewellery pieces, and exclusive collection previews.'
                  : 'Create an account to track orders, save wishlist items, and receive personalized jewellery updates.'}
              </p>
            </div>

            {/* Error Notification: Issue 2 Fix uses rounded-xl */}
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-center gap-3 animate-shake" role="alert">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* METHOD 1: GOOGLE AUTHENTICATION                          */}
            {/* Issue 3 Fix: uses unified BTN_SECONDARY                  */}
            {/* ======================================================== */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className={BTN_SECONDARY}
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {mode === 'signin' ? 'Continue with Google' : 'Sign Up with Google'}
                </span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(201,164,92,0.15)]" />
              </div>
              <span className="relative px-4 text-xs text-[#A8A197]/80 bg-[#0E0D0B] flex items-center gap-2 font-mono">
                <span>✦</span>
                <span>Or continue with</span>
                <span>✦</span>
              </span>
            </div>

            {/* Channel Switch: Email/Gmail vs Mobile Number */}
            <div className="flex items-center gap-4 mb-6 border-b border-[rgba(201,164,92,0.15)] pb-3" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={method === 'email'}
                onClick={() => {
                  setMethod('email');
                  setErrorMsg(null);
                  setOtpSent(false);
                }}
                className={`flex items-center gap-2 pb-2 text-xs transition-colors relative cursor-pointer ${
                  method === 'email'
                    ? 'text-[#E9D5A0] font-medium'
                    : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Email Address</span>
                {method === 'email' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A45C]" />
                )}
              </button>

              <span className="text-[#A8A197]/30 text-xs">·</span>

              <button
                type="button"
                role="tab"
                aria-selected={method === 'mobile'}
                onClick={() => {
                  setMethod('mobile');
                  setErrorMsg(null);
                  setOtpSent(false);
                }}
                className={`flex items-center gap-2 pb-2 text-xs transition-colors relative cursor-pointer ${
                  method === 'mobile'
                    ? 'text-[#E9D5A0] font-medium'
                    : 'text-[#A8A197]/70 hover:text-[#F5F0E7]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>Mobile Number (OTP)</span>
                {method === 'mobile' && (
                  <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A45C]" />
                )}
              </button>
            </div>

            {/* ======================================================== */}
            {/* METHOD 2: EMAIL / GMAIL & PASSWORD FORM                  */}
            {/* ======================================================== */}
            {method === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#C9A45C]/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Gayatri Devi"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/50 text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C9A45C]/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/50 text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Mobile Phone (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      Mobile Number (For order updates)
                    </label>
                    <div className="relative flex rounded-xl overflow-hidden border border-[rgba(201,164,92,0.25)] focus-within:border-[#C9A45C] focus-within:ring-1 focus-within:ring-[#C9A45C]/50 transition-all">
                      <div className="px-3.5 py-3 bg-[#181714] border-r border-[rgba(201,164,92,0.2)] text-xs text-[#E9D5A0] font-mono flex items-center gap-1.5">
                        <span>🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full pl-4 pr-4 py-3 bg-[#141310] text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-[#C9A45C] font-mono">
                      Password *
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setForgotModalOpen(true)}
                        className={BTN_LINK}
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#C9A45C]/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/50 text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${BTN_ICON}`}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Gauge on Sign Up */}
                  {mode === 'signup' && password && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-[#A8A197] font-mono">
                        <span>Password Strength</span>
                        <span className="text-[#E9D5A0] font-medium">{passwordStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#181714] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password (Sign Up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-[#C9A45C]/70 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.25)] focus:border-[#C9A45C] focus:ring-1 focus:ring-[#C9A45C]/50 text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${BTN_ICON}`}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Checkboxes */}
                {mode === 'signin' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded-md bg-[#141310] border-[rgba(201,164,92,0.4)] text-[#C9A45C] focus:ring-0 accent-[#C9A45C]"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-[#A8A197] select-none cursor-pointer font-light">
                      Remember this device for 30 days
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded-md bg-[#141310] border-[rgba(201,164,92,0.4)] text-[#C9A45C] focus:ring-0 accent-[#C9A45C] mt-0.5"
                      />
                      <label htmlFor="agreeTerms" className="text-xs text-[#A8A197] leading-relaxed select-none cursor-pointer font-light">
                        I accept the{' '}
                        <Link href="/policies/terms" className="text-[#E9D5A0] underline hover:text-white">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/policies/privacy" className="text-[#E9D5A0] underline hover:text-white">
                          Privacy Policy
                        </Link>
                        .
                      </label>
                    </div>

                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="conciergeOptIn"
                        checked={conciergeOptIn}
                        onChange={(e) => setConciergeOptIn(e.target.checked)}
                        className="w-4 h-4 rounded-md bg-[#141310] border-[rgba(201,164,92,0.4)] text-[#C9A45C] focus:ring-0 accent-[#C9A45C] mt-0.5"
                      />
                      <label htmlFor="conciergeOptIn" className="text-xs text-[#A8A197] leading-relaxed select-none cursor-pointer font-light">
                        Receive updates on new collections and festive offers via WhatsApp & SMS.
                      </label>
                    </div>
                  </div>
                )}

                {/* Submit Action: Issue 3 Fix uses unified BTN_PRIMARY */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={BTN_PRIMARY}
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-[#080807]" />
                    ) : (
                      <>
                        <span>{mode === 'signin' ? 'Sign In to Account' : 'Create Account'}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* METHOD 3: MOBILE NUMBER WITH OTP WORKFLOW                */}
            {/* ======================================================== */}
            {method === 'mobile' && (
              <div>
                {!otpSent ? (
                  /* Mobile Input Step */
                  <form onSubmit={handleSendMobileOtp} className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex rounded-xl overflow-hidden border border-[rgba(201,164,92,0.28)] focus-within:border-[#C9A45C] focus-within:ring-1 focus-within:ring-[#C9A45C]/50 transition-all">
                        {/* Country Code Dropdown */}
                        <div className="relative bg-[#181714] border-r border-[rgba(201,164,92,0.2)]">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            aria-label="Country Code"
                            className="appearance-none bg-transparent pl-3 pr-7 py-3 text-xs text-[#E9D5A0] font-mono outline-none cursor-pointer"
                          >
                            {COUNTRY_CODES.map((c) => (
                              <option key={`${c.country}-${c.code}`} value={c.code} className="bg-[#11100E] text-[#F5F0E7]">
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3 h-3 text-[#C9A45C] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Number Input */}
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          aria-label="Mobile Number"
                          className="w-full px-4 py-3 bg-[#141310] text-sm text-[#F5F0E7] placeholder-[#A8A197]/40 outline-none font-mono"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-[#A8A197] leading-relaxed font-light">
                      We will send a 6-digit verification code to your mobile number.
                    </p>

                    {/* Issue 3 Fix: uses unified BTN_PRIMARY */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={BTN_PRIMARY}
                      >
                        <span>Send Verification Code</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </form>
                ) : (
                  /* 6-Digit OTP Verification Step */
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.2)] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#A8A197] block font-mono">
                          Code sent to
                        </span>
                        <span className="text-sm text-[#E9D5A0] font-mono font-medium">
                          {countryCode} {phone}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className={BTN_LINK}
                      >
                        Change Number
                      </button>
                    </div>

                    {/* 6 Digit Input Boxes */}
                    <div>
                      <label className="block text-xs text-[#C9A45C] font-mono mb-3 text-center">
                        Enter 6-Digit Verification Code
                      </label>
                      <div className="flex items-center justify-center gap-2 sm:gap-3" role="group" aria-label="One-time password">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={`otp-${idx}`}
                            ref={(el) => {
                              otpInputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            aria-label={`Digit ${idx + 1}`}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-11 sm:w-12 h-14 sm:h-16 text-center text-xl font-mono font-semibold rounded-xl bg-[#161512] border border-[rgba(201,164,92,0.3)] focus:border-[#E9D5A0] focus:ring-2 focus:ring-[#C9A45C]/40 text-[#F5F0E7] outline-none transition-all shadow-inner"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend Timer & Demo Code Hint */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#A8A197] pt-1">
                      <span className="text-xs font-mono text-[#A8A197]/70">
                        Demo Code: <strong className="text-[#E9D5A0]">916916</strong>
                      </span>

                      {otpCountdown > 0 ? (
                        <span className="text-xs font-mono text-[#C9A45C]">
                          Resend code in 00:{String(otpCountdown).padStart(2, '0')}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResendingOtp}
                          className={BTN_LINK}
                        >
                          <RefreshCw className={`w-3 h-3 ${isResendingOtp ? 'animate-spin' : ''}`} />
                          <span>Resend OTP Code</span>
                        </button>
                      )}
                    </div>

                    {/* Submit Button: Issue 3 Fix uses unified BTN_PRIMARY */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={BTN_PRIMARY}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-[#080807]" />
                      ) : (
                        <>
                          <span>Verify & Sign In</span>
                          <CheckCircle2 className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Switch Mode Prompt on Bottom: Issue 3 Fix uses unified BTN_LINK */}
            <div className="mt-8 pt-6 border-t border-[rgba(201,164,92,0.15)] text-center">
              <p className="text-xs text-[#A8A197] font-light">
                {mode === 'signin' ? (
                  <>
                    New to Damodar Jewellers?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrorMsg(null);
                      }}
                      className={BTN_LINK}
                    >
                      Create an account
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrorMsg(null);
                      }}
                      className={BTN_LINK}
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* 3. FOOTER                                                */}
      {/* ======================================================== */}
      <footer className="relative z-20 w-full max-w-[1520px] mx-auto px-6 sm:px-10 lg:px-16 py-6 border-t border-[rgba(201,164,92,0.1)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8A197]/80 font-light">
        <div className="flex items-center gap-4 sm:gap-6">
          <span>© 1974–2026 Damodar Jewellers. All Rights Reserved.</span>
          <span className="hidden md:inline text-[#C9A45C]/40">·</span>
          <span className="hidden md:inline">BIS 916 Hallmarked Gold & Certified Diamonds.</span>
        </div>

        <div className="flex items-center gap-6 text-[#A8A197]">
          <Link href="/policies/privacy" className="hover:text-[#E9D5A0] transition-colors py-1">
            Privacy Policy
          </Link>
          <Link href="/policies/terms" className="hover:text-[#E9D5A0] transition-colors py-1">
            Terms of Service
          </Link>
          <Link href="/contact" className="hover:text-[#E9D5A0] transition-colors py-1 flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Customer Support</span>
          </Link>
        </div>
      </footer>

      {/* ======================================================== */}
      {/* 4. FORGOT PASSWORD MODAL                                 */}
      {/* Issue 2 Fix uses rounded-2xl; Issue 3 Fix uses BTN_PRIMARY & BTN_SECONDARY */}
      {/* ======================================================== */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="forgot-modal-title">
          <div className="relative w-full max-w-md rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.3)] p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setForgotModalOpen(false);
                setForgotSent(false);
              }}
              aria-label="Close modal"
              className={`absolute top-5 right-5 ${BTN_ICON}`}
            >
              ✕
            </button>

            <div className="w-10 h-10 rounded-full bg-[#1A1915] border border-[#C9A45C]/40 flex items-center justify-center mb-4">
              <KeyRound className="w-5 h-5 text-[#C9A45C]" />
            </div>

            <h3
              id="forgot-modal-title"
              className="text-xl font-light text-[#F5F0E7] mb-2"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Reset Password
            </h3>

            {!forgotSent ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-[#A8A197] font-light leading-relaxed">
                  Enter your registered email address. We will send you a link to reset your password.
                </p>

                <div>
                  <label className="block text-xs text-[#C9A45C] font-mono mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#151411] border border-[rgba(201,164,92,0.22)] focus:border-[#C9A45C] text-sm text-[#F5F0E7] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className={BTN_LINK}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={BTN_PRIMARY}
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 pt-2">
                <p className="text-xs text-[#E9D5A0] leading-relaxed">
                  A password reset link has been sent to <strong>{forgotEmail}</strong>. Please check your email inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSent(false);
                  }}
                  className={BTN_SECONDARY}
                >
                  Return to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AuthScreen;

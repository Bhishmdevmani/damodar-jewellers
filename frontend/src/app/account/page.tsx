'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Package,
  MapPin,
  Shield,
  LogOut,
  Sparkles,
  ArrowRight,
  Gem,
  Award,
  Phone,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/auth/AuthScreen';
import { IS_DEMO_MODE } from '@/lib/config';

export default function AccountPage() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080807] flex items-center justify-center text-xs uppercase tracking-widest text-[#C9A45C]">
        Connecting to Atelier Cryptographic Vault...
      </div>
    );
  }

  // If NOT logged in, render the master AuthScreen directly on /account!
  if (!isAuthenticated || !user) {
    return <AuthScreen initialMode="signin" redirectTo="/account" />;
  }

  // When Authenticated: Display the Patron Portal
  return (
    <div className="min-h-screen bg-[#080807] pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto text-[#F5F0E7]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6 border-b border-[rgba(201,164,92,0.15)] pb-6 sm:pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#C9A45C] font-mono">
              Authenticated Patron Portal
            </span>
          </div>

          <h1
            className="text-2xl sm:text-display-md font-light text-[#F5F0E7]"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Welcome, {user.name}
          </h1>

          <p className="text-xs text-[#A8A197] font-light mt-1">
            Tier: <span className="text-[#E9D5A0] font-normal">{user.vipTier}</span> · Member since {user.joinedAt}
          </p>
        </div>

        <button
          onClick={logout}
          className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#161512] border border-[rgba(201,164,92,0.25)] hover:border-[#C9A45C] text-xs uppercase tracking-wider text-[#A8A197] hover:text-[#E9D5A0] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patron VIP Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181613] via-[#12110E] to-[#0D0C0A] border border-[rgba(201,164,92,0.3)] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(201,164,92,0.15),transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#C9A45C] font-mono">
                Damodar Atelier Privileges
              </span>
              <Award className="w-5 h-5 text-[#C9A45C]" />
            </div>

            <div className="text-xl font-light text-[#F5F0E7] mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
              {user.name}
            </div>

            <p className="text-xs text-[#A8A197] font-mono mb-4">{user.email}</p>

            <div className="pt-3 border-t border-[rgba(201,164,92,0.15)] flex items-center justify-between text-[11px]">
              <span className="text-[#A8A197]">Vault Security:</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <Shield className="w-3 h-3" /> Encrypted
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.18)] space-y-1.5">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-3.5 text-xs uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all ${
                activeTab === 'orders'
                  ? 'bg-[rgba(201,164,92,0.12)] text-[#E9D5A0] font-medium border border-[rgba(201,164,92,0.3)]'
                  : 'text-[#A8A197] hover:text-[#F5F0E7] hover:bg-white/[0.02]'
              }`}
            >
              <Package className="w-4 h-4 text-[#C9A45C]" />
              <span>Acquisition History</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-3.5 text-xs uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all ${
                activeTab === 'profile'
                  ? 'bg-[rgba(201,164,92,0.12)] text-[#E9D5A0] font-medium border border-[rgba(201,164,92,0.3)]'
                  : 'text-[#A8A197] hover:text-[#F5F0E7] hover:bg-white/[0.02]'
              }`}
            >
              <User className="w-4 h-4 text-[#C9A45C]" />
              <span>Patron Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-4 py-3.5 text-xs uppercase tracking-wider rounded-xl flex items-center gap-3 transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[rgba(201,164,92,0.12)] text-[#E9D5A0] font-medium border border-[rgba(201,164,92,0.3)]'
                  : 'text-[#A8A197] hover:text-[#F5F0E7] hover:bg-white/[0.02]'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#C9A45C]" />
              <span>Armored Delivery Vaults</span>
            </button>
          </div>
        </div>

        {/* Tab Content (8 cols) */}
        <div className="lg:col-span-8 p-5 sm:p-8 lg:p-10 rounded-2xl bg-[#11100E] border border-[rgba(201,164,92,0.18)] shadow-xl">
          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[rgba(201,164,92,0.12)]">
                <h2
                  className="text-xl font-light text-[#F5F0E7]"
                  style={{ fontFamily: 'var(--font-serif)' }}
                >
                  Acquisition Records & Orders
                </h2>
                <span className="text-xs font-mono text-[#C9A45C]">0 Active Orders</span>
              </div>

              <div className="p-8 text-center rounded-2xl border border-dashed border-[rgba(201,164,92,0.2)] bg-[#141310]/50">
                <Gem className="w-10 h-10 text-[#C9A45C] mx-auto mb-3 animate-pulse" />
                <h3 className="text-lg font-light text-[#F5F0E7] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  Your Atelier Vault is Ready
                </h3>
                <p className="text-xs text-[#A8A197] max-w-md mx-auto mb-6 leading-relaxed">
                  As a valued patron, your future acquisitions, insured transit logs, and digital BIS 916 certificates will synchronize here in real time.
                </p>
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2 py-3 px-6 rounded-full bg-gradient-to-r from-[#C9A45C] to-[#B8943F] text-[#080807] font-semibold text-xs uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  <span>Explore High Jewellery Vitrines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h2
                className="text-xl font-light text-[#F5F0E7] mb-6 pb-4 border-b border-[rgba(201,164,92,0.12)]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Patron Credentials & Registry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs mb-8">
                <div className="p-4 rounded-xl bg-[#161512] border border-[rgba(201,164,92,0.15)]">
                  <span className="block text-[#A8A197] uppercase tracking-wider mb-1 font-mono text-[10px]">
                    Full Patron Name
                  </span>
                  <span className="text-sm text-[#F5F0E7] font-medium">{user.name}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#161512] border border-[rgba(201,164,92,0.15)]">
                  <span className="block text-[#A8A197] uppercase tracking-wider mb-1 font-mono text-[10px]">
                    Email / Gmail
                  </span>
                  <span className="text-sm text-[#F5F0E7] font-medium">{user.email}</span>
                </div>

                <div className="p-4 rounded-xl bg-[#161512] border border-[rgba(201,164,92,0.15)]">
                  <span className="block text-[#A8A197] uppercase tracking-wider mb-1 font-mono text-[10px]">
                    Mobile Contact
                  </span>
                  <span className="text-sm text-[#F5F0E7] font-medium">
                    {user.phone || '+91 · Handset on file'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#161512] border border-[rgba(201,164,92,0.15)]">
                  <span className="block text-[#A8A197] uppercase tracking-wider mb-1 font-mono text-[10px]">
                    Authentication Method
                  </span>
                  <span className="text-sm text-[#C9A45C] uppercase tracking-wider font-mono">
                    {user.authMethod} Secured
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#141310] border border-[rgba(201,164,92,0.15)] flex items-start gap-4">
                <Lock className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm text-[#F5F0E7] font-medium mb-1">
                    Confidential Patron Security
                  </h4>
                  <p className="text-xs text-[#A8A197] leading-relaxed">
                    Your patron credentials are encrypted and governed under strict client confidentiality protocols. For private bespoke appointments, your assigned atelier liaison will contact your verified handset.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2
                className="text-xl font-light text-[#F5F0E7] mb-6 pb-4 border-b border-[rgba(201,164,92,0.12)]"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Registered Armored Delivery Vaults
              </h2>

              <div className="p-6 rounded-2xl border border-[rgba(201,164,92,0.2)] bg-[#161512] relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#C9A45C] uppercase tracking-wider font-mono">
                    Primary Insured Destination
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(201,164,92,0.1)] text-[#E9D5A0] border border-[rgba(201,164,92,0.2)]">
                    Default
                  </span>
                </div>

                <p className="text-sm text-[#F5F0E7] font-light leading-relaxed mb-4">
                  Private Residence, Sector 14 <br />
                  Connaught Place, New Delhi 110001
                </p>

                <p className="text-xs text-[#A8A197] font-light">
                  Direct liaison contact: <span className="text-[#E9D5A0]">{user.phone || '+91 98765 43210'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'bridal_consultation',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#080807] pt-24 sm:pt-28 pb-16 sm:pb-24 px-4 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
      <div className="max-w-2xl mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A45C] block mb-3">
          Concierge & Atelier
        </span>
        <h1
          className="text-2xl sm:text-display-md font-light text-[#F5F0E7] mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Consult With Our Artisans
        </h1>
        <p className="text-sm sm:text-base text-[#A8A197] font-light leading-relaxed">
          Schedule a private appointment with our gemologists, discuss bespoke bridal suites, or inquire regarding existing orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7">
          {submitted ? (
            <div className="p-6 sm:p-10 bg-[#11100E] border border-[rgba(201,164,92,0.3)] text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3
                className="text-2xl font-light text-[#F5F0E7] mb-2"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Inquiry Received
              </h3>
              <p className="text-xs text-[#A8A197] leading-relaxed max-w-sm mx-auto mb-6">
                Our bespoke concierge will review your preferences and contact you within one business day with appointment details.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-secondary text-xs"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 sm:p-8 bg-[#11100E] border border-[rgba(201,164,92,0.18)] space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A197] mb-2">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#191713] border border-[rgba(201,164,92,0.25)] text-sm px-4 py-3 text-[#F5F0E7] focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A197] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#191713] border border-[rgba(201,164,92,0.25)] text-sm px-4 py-3 text-[#F5F0E7] focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A197] mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#191713] border border-[rgba(201,164,92,0.25)] text-sm px-4 py-3 text-[#F5F0E7] focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#A8A197] mb-2">
                    Appointment Purpose
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full bg-[#191713] border border-[rgba(201,164,92,0.25)] text-sm px-4 py-3 text-[#F5F0E7] focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="bridal_consultation">Bridal Suite Consultation</option>
                    <option value="bespoke_commission">Bespoke Custom Commission</option>
                    <option value="sizing_appraisal">Sizing & Gemstone Appraisal</option>
                    <option value="general">General Atelier Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A8A197] mb-2">
                  Preferred Date & Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Share details regarding your timeline, metal preference, or inspiration..."
                  className="w-full bg-[#191713] border border-[rgba(201,164,92,0.25)] text-sm px-4 py-3 text-[#F5F0E7] focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-center">
                <span>Request Private Consultation</span>
              </button>
            </form>
          )}
        </div>

        {/* Boutique Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-8 bg-[#11100E] border border-[rgba(201,164,92,0.18)]">
            <h3
              className="text-xl font-light text-[#F5F0E7] mb-6 pb-4 border-b border-[rgba(201,164,92,0.1)]"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Private Boutiques
            </h3>

            <div className="space-y-6 text-xs text-[#A8A197]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F0E7] font-medium block">Flagship Atelier</span>
                  <span>{siteConfig.address || 'Heritage Quarter, Fine Jewellery District, India'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F0E7] font-medium block">Concierge Email</span>
                  <span>{siteConfig.contactEmail || 'concierge@damodarjewellers.com'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F0E7] font-medium block">Atelier Direct</span>
                  <span>{siteConfig.contactPhone || '+91 (0) 11 4000 8000'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F5F0E7] font-medium block">Private Hours</span>
                  <span>Monday – Saturday: 11:00 AM – 8:00 PM IST (By Prior Appointment)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

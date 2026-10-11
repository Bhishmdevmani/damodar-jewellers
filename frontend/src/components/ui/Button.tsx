import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans tracking-[0.1em] uppercase transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C9A45C]';

    const variants = {
      primary:
        'bg-gradient-to-r from-[#C9A45C] to-[#B8943F] text-[#080807] font-semibold hover:shadow-[0_0_25px_rgba(201,164,92,0.35)] hover:-translate-y-0.5 active:translate-y-0',
      secondary:
        'bg-[#191713] text-[#F5F0E7] border border-[rgba(201,164,92,0.3)] hover:border-[#C9A45C] hover:bg-[#23201a]',
      outline:
        'bg-transparent text-[#C9A45C] border border-[#C9A45C]/40 hover:border-[#C9A45C] hover:bg-[rgba(201,164,92,0.08)]',
      ghost:
        'bg-transparent text-[#A8A197] hover:text-[#F5F0E7] hover:bg-white/[0.04]',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-[0.8125rem] px-6 py-3 gap-2',
      lg: 'text-sm px-8 py-4 gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            aria-hidden="true"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

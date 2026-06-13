// =============================================================================
// Button Component — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Atomic UI bileşeni, tek sorumluluk
// =============================================================================

import React from 'react';
import { cn } from '@/utils/helpers';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 hover:shadow-indigo-500/40 active:from-indigo-800 active:to-purple-800',
  secondary:
    'bg-slate-800 text-slate-100 shadow-md hover:bg-slate-700 active:bg-slate-900 border border-slate-700',
  outline:
    'border-2 border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-400 active:bg-indigo-500/20',
  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:from-red-700 hover:to-rose-700 active:from-red-800 active:to-rose-800',
  ghost:
    'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 active:bg-slate-800',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base font-semibold rounded-xl gap-2.5',
};

/**
 * Button — Tekrar kullanılabilir buton bileşeni.
 * Varyantlar: primary, secondary, outline, danger, ghost
 * Boyutlar: sm, md, lg
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'transform active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

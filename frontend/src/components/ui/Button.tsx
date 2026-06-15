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
    'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/20 hover:from-sky-600 hover:to-indigo-600 hover:shadow-sky-500/30 active:from-sky-700 active:to-indigo-700',
  secondary:
    'bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 border border-slate-200',
  outline:
    'border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 active:bg-indigo-100',
  danger:
    'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-md shadow-rose-500/20 hover:from-rose-600 hover:to-red-600 active:from-rose-700 active:to-red-700',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200',
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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
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

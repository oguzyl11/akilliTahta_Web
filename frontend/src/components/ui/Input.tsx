// =============================================================================
// Input Component — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Atomic UI bileşeni
// =============================================================================

'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/utils/helpers';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-4 py-3 text-sm',
  lg: 'px-5 py-4 text-base',
};

/**
 * Input — Form giriş alanı.
 * Label, hata mesajı, helper text, ikon desteği.
 * Şifre alanı için göster/gizle toggle.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      type = 'text',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword && showPassword ? 'text' : type}
            className={cn(
              'w-full rounded-xl border bg-slate-800/50 text-slate-100 placeholder-slate-500',
              'backdrop-blur-sm',
              'transition-all duration-200 ease-out',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
              'hover:border-slate-500',
              error
                ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500'
                : 'border-slate-700/50',
              leftIcon ? 'pl-10' : '',
              isPassword || rightIcon ? 'pr-10' : '',
              sizeStyles[inputSize],
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
          {!isPassword && rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// =============================================================================
// Spinner Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface PageLoaderProps {
  message?: string;
}

const sizeStyles = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

/**
 * Spinner — Yükleme göstergesi.
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-600 border-t-indigo-500',
        sizeStyles[size],
        className
      )}
    />
  );
}

/**
 * PageLoader — Tam sayfa yükleme göstergesi.
 * Dashboard ve sayfa geçişlerinde kullanılır.
 */
export function PageLoader({ message = 'Yükleniyor...' }: PageLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-transparent border-b-purple-500 animate-spin animate-reverse" style={{ animationDuration: '1.5s' }} />
      </div>
      <p className="text-sm text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}

/**
 * SkeletonLine — İçerik yükleme iskeleti.
 */
export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-4 rounded-lg bg-gradient-to-r from-slate-700/50 via-slate-600/30 to-slate-700/50',
        'animate-pulse',
        className
      )}
    />
  );
}

/**
 * SkeletonCard — Kart yükleme iskeleti.
 */
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-6 space-y-4">
      <SkeletonLine className="w-1/3 h-5" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-2/3" />
      <div className="flex gap-2 pt-2">
        <SkeletonLine className="w-20 h-8 rounded-full" />
        <SkeletonLine className="w-20 h-8 rounded-full" />
      </div>
    </div>
  );
}

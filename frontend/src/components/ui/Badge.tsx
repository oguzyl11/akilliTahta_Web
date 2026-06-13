// =============================================================================
// Badge Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  danger: 'bg-red-500/15 text-red-400 border-red-500/20',
  info: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
};

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-emerald-400',
  warning: 'bg-amber-400',
  danger: 'bg-red-400',
  info: 'bg-sky-400',
  neutral: 'bg-slate-400',
};

/**
 * Badge — Durum göstergesi.
 * Kullanım: Ödev durumu, kullanıcı rolü, render durumu vb.
 */
export function Badge({ children, variant = 'neutral', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}

// =============================================================================
// Card Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card — İçerik kartı bileşeni.
 * Glassmorphism efekti ile modern görünüm.
 */
export function Card({
  children,
  className,
  hover = false,
  gradient = false,
  padding = 'md',
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700/50',
        'bg-slate-800/40 backdrop-blur-xl',
        'shadow-xl shadow-black/10',
        hover && 'transition-all duration-300 hover:border-indigo-500/30 hover:shadow-indigo-500/5 hover:translate-y-[-2px]',
        gradient && 'bg-gradient-to-br from-slate-800/60 to-slate-900/60',
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * CardHeader — Kart başlık alanı.
 */
export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

/**
 * CardContent — Kart içerik alanı.
 */
export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn(className)}>{children}</div>;
}

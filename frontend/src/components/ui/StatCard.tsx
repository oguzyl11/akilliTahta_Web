// =============================================================================
// StatCard Component — Premium Dashboard UI
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  color?: 'indigo' | 'emerald' | 'amber' | 'rose';
  delay?: number;
}

const colorStyles = {
  indigo: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'stat-card-indigo',
    shadow: 'shadow-indigo-500/10'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'stat-card-emerald',
    shadow: 'shadow-emerald-500/10'
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'stat-card-amber',
    shadow: 'shadow-amber-500/10'
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'stat-card-rose',
    shadow: 'shadow-rose-500/10'
  }
};

export function StatCard({ title, value, icon: Icon, trend, color = 'indigo', delay = 0 }: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        'bg-slate-800/80 backdrop-blur-xl border border-slate-700/50',
        'shadow-xl transition-all duration-300',
        styles.border,
        `hover:${styles.shadow}`
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-100">{value}</h3>
        </div>
        <div className={cn('p-3 rounded-xl', styles.bg)}>
          <Icon size={24} className={styles.text} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md',
              trend.isPositive === true
                ? 'text-emerald-400 bg-emerald-400/10'
                : trend.isPositive === false
                ? 'text-rose-400 bg-rose-400/10'
                : 'text-slate-400 bg-slate-400/10'
            )}
          >
            {trend.isPositive === true ? (
              <TrendingUp size={14} />
            ) : trend.isPositive === false ? (
              <TrendingDown size={14} />
            ) : (
              <Minus size={14} />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
          <span className="text-xs text-slate-500">{trend.label}</span>
        </div>
      )}

      {/* Glow effect in background */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none bg-current" style={{ color: `var(--color-${color}-500)` }} />
    </motion.div>
  );
}

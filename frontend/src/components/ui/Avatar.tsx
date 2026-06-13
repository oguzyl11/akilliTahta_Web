// =============================================================================
// Avatar Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import { cn, getInitials } from '@/utils/helpers';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const gradientColors = [
  'from-indigo-500 to-purple-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-sky-500 to-blue-500',
  'from-violet-500 to-fuchsia-500',
];

/**
 * Avatar — Kullanıcı profil görseli.
 * Fotoğraf yoksa initials ile gradient arka plan gösterir.
 */
export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = getInitials(name);

  // İsimden tutarlı renk seçimi (aynı isim = aynı renk)
  const colorIndex = name.charCodeAt(0) % gradientColors.length;
  const gradientClass = gradientColors[colorIndex];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover ring-2 ring-slate-700/50',
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white',
        'bg-gradient-to-br ring-2 ring-slate-700/50',
        gradientClass,
        sizeStyles[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  );
}

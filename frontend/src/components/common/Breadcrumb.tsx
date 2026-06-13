// =============================================================================
// Breadcrumb Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumb — Sayfa yol göstergesi.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        href="/"
        className="text-slate-500 hover:text-slate-300 transition-colors p-1"
      >
        <Home size={14} />
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-slate-600" />
            {isLast || !item.href ? (
              <span className="text-slate-300 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

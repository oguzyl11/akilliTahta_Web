// =============================================================================
// PageHeader Component — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from '@/types';

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  action?: React.ReactNode;
}

/**
 * PageHeader — Sayfa başlık alanı.
 * Breadcrumb, başlık, açıklama ve action butonu.
 */
export function PageHeader({ title, description, breadcrumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-6 lg:mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-3">
          <Breadcrumb items={breadcrumbs} />
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-100 tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-sm text-slate-400 max-w-xl">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

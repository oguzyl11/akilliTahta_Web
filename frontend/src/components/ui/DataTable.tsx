// =============================================================================
// DataTable Component — Premium UI
// =============================================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import type { PaginationMeta } from '@/types';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  meta?: PaginationMeta;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onSearch?: (search: string) => void;
  searchValue?: string;
  emptyMessage?: string;
  keyExtractor: (item: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  meta,
  isLoading = false,
  onPageChange,
  onSearch,
  searchValue = '',
  emptyMessage = 'Veri bulunamadı.',
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden flex flex-col w-full h-full">
      {/* Search Bar */}
      {onSearch !== undefined && (
        <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/30">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <Input
              type="text"
              placeholder="Ara..."
              className="pl-10 bg-slate-800/50 border-slate-700/50"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs tracking-wider sticky top-0 z-10">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={cn('px-6 py-4 font-medium', col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50 relative">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center text-indigo-400">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <span className="text-sm font-medium text-slate-400">Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="text-slate-500">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              <AnimatePresence>
                {data.map((item, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    key={keyExtractor(item)}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    {columns.map((col, i) => (
                      <td key={i} className={cn('px-6 py-4', col.className)}>
                        {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.lastPage > 1 && (
        <div className="p-4 border-t border-slate-700/50 flex items-center justify-between bg-slate-900/30">
          <p className="text-xs text-slate-400">
            Toplam <span className="font-medium text-slate-200">{meta.total}</span> kayıttan{' '}
            <span className="font-medium text-slate-200">
              {(meta.page - 1) * meta.perPage + 1}-
              {Math.min(meta.page * meta.perPage, meta.total)}
            </span>{' '}
            arası gösteriliyor.
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-2 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center px-3 text-sm font-medium text-slate-300 bg-slate-800 rounded-md border border-slate-700">
              {meta.page} / {meta.lastPage}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(meta.page + 1)}
              disabled={meta.page >= meta.lastPage}
              className="px-2 border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

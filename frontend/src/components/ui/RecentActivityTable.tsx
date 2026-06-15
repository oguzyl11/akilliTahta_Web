// =============================================================================
// RecentActivityTable Component — Premium Dashboard UI
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { Avatar, Badge } from '@/components/ui';

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
    role?: string;
  };
  action: string;
  target: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'danger';
}

interface RecentActivityTableProps {
  title?: string;
  data: ActivityItem[];
  delay?: number;
}

export function RecentActivityTable({ title = 'Son İşlemler', data, delay = 0 }: RecentActivityTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-md shadow-slate-200/50"
    >
      <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
          Tümünü Gör
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Kullanıcı</th>
              <th className="px-6 py-4 font-medium">İşlem</th>
              <th className="px-6 py-4 font-medium">Hedef</th>
              <th className="px-6 py-4 font-medium">Durum</th>
              <th className="px-6 py-4 font-medium text-right">Zaman</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <motion.tr
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: delay + 0.1 + index * 0.05 }}
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.user.name} src={item.user.avatarUrl} size="sm" />
                    <div>
                      <p className="font-medium text-slate-800">{item.user.name}</p>
                      {item.user.role && <p className="text-[10px] text-slate-500">{item.user.role}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{item.action}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.target}</td>
                <td className="px-6 py-4">
                  <Badge variant={item.status}>
                    {item.status === 'success' ? 'Tamamlandı' :
                     item.status === 'warning' ? 'Bekliyor' :
                     item.status === 'danger' ? 'Hata' : 'Bilgi'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right text-slate-400 text-xs">{item.time}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 && (
          <div className="p-8 text-center text-slate-500 bg-white">
            Henüz bir aktivite bulunmuyor.
          </div>
        )}
      </div>
    </motion.div>
  );
}

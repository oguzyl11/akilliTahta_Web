// =============================================================================
// Admin Users Page — Sistem Geneli Kullanıcılar
// MOD-20: Kurum yöneticileri ve süper adminlerin yönetimi
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, UserPlus, Shield } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Yöneticileri</h1>
          <p className="text-slate-500 mt-1 text-sm">Platformdaki Kurum Yöneticileri ve Süper Adminleri yönetin.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <Input placeholder="Yönetici ara..." leftIcon={<Search size={18} />} />
          <Button leftIcon={<UserPlus size={18} />} className="bg-indigo-600 hover:bg-indigo-700">Yönetici Ekle</Button>
        </motion.div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <ShieldAlert size={48} className="text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700 mb-2">Gelişmiş Yönetici Modülü Hazırlanıyor</h2>
        <p className="text-slate-500 max-w-md">
          Bu alan, sistemin genel güvenlik ayarları ve üst düzey yetkilendirme işlemleri için tasarlanmaktadır. Yakında aktif edilecektir.
        </p>
      </div>
    </div>
  );
}

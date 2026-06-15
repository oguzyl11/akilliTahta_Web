// =============================================================================
// Admin Tenants Page — Kurum Yönetimi
// MOD-18: Sisteme kayıtlı kurumların (okulların) yönetimi
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Search, MoreVertical, ShieldCheck } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function AdminTenantsPage() {
  const mockTenants = [
    { id: '1', name: 'Atatürk Anadolu Lisesi', domain: 'aal.akillitahta.com', status: 'active', students: 850, expires: '2027-06-15' },
    { id: '2', name: 'Cumhuriyet Fen Lisesi', domain: 'cfl.akillitahta.com', status: 'active', students: 420, expires: '2026-09-01' },
    { id: '3', name: 'Özel Başarı Koleji', domain: 'basari.akillitahta.com', status: 'suspended', students: 1200, expires: '2026-01-01' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-slate-800">Kurum Yönetimi</h1>
          <p className="text-slate-500 mt-1 text-sm">Sistemi kullanan tüm okulları ve lisans durumlarını izleyin.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <Input placeholder="Kurum ara..." leftIcon={<Search size={18} />} />
          <Button leftIcon={<Plus size={18} />}>Yeni Kurum</Button>
        </motion.div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
            <tr>
              <th className="px-6 py-4">Kurum Adı</th>
              <th className="px-6 py-4">Alt Alan Adı</th>
              <th className="px-6 py-4">Öğrenci Kapasitesi</th>
              <th className="px-6 py-4">Lisans Bitiş</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockTenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Building2 size={16} /></div>
                  {tenant.name}
                </td>
                <td className="px-6 py-4">{tenant.domain}</td>
                <td className="px-6 py-4 font-medium">{tenant.students}</td>
                <td className="px-6 py-4">{tenant.expires}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold ${tenant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {tenant.status === 'active' ? 'Aktif' : 'Askıda'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-indigo-600 p-2"><MoreVertical size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

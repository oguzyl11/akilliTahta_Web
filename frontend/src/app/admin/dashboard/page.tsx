// =============================================================================
// Admin Dashboard — Süper Admin Paneli
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { StatCard, RecentActivityTable, AreaChart } from '@/components/ui';
import { Server, Building2, BookOpen, Users } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuthStore();

  const mockActivities = [
    {
      id: '1',
      user: { name: 'Sistem Yöneticisi', role: 'SUPER_ADMIN' },
      action: 'Yeni kurum eklendi',
      target: 'Atatürk Lisesi',
      time: '15 dk önce',
      status: 'success' as const,
    },
    {
      id: '2',
      user: { name: 'Sistem Yöneticisi', role: 'SUPER_ADMIN' },
      action: 'PDF işleme hatası',
      target: 'Fizik 11. Sınıf',
      time: '1 saat önce',
      status: 'danger' as const,
    },
    {
      id: '3',
      user: { name: 'Sistem Yöneticisi', role: 'SUPER_ADMIN' },
      action: 'Lisans güncellendi',
      target: 'Demo Eğitim Kurumu',
      time: '2 saat önce',
      status: 'info' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-100">Sistem Yönetimi</h1>
          <p className="text-slate-400 mt-1 text-sm">Tüm kurumlar ve sistem sağlığı.</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Kayıtlı Kurumlar"
          value="12"
          icon={Building2}
          color="indigo"
          trend={{ value: 2, label: 'Bu ay eklenen', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Sistem Kullanıcıları"
          value="15,420"
          icon={Users}
          color="emerald"
          trend={{ value: 1250, label: 'Bu ay artış', isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Merkezi İçerikler"
          value="1,245"
          icon={BookOpen}
          color="amber"
          trend={{ value: 45, label: 'Yeni işlenen PDF', isPositive: true }}
          delay={0.3}
        />
        <StatCard
          title="Sunucu Sağlığı"
          value="%99.9"
          icon={Server}
          color="rose"
          delay={0.4}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <Server className="text-rose-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-200">Sistem Yükü ve API Trafiği</h3>
              <p className="text-sm text-slate-400">Son 7 günlük kaynak kullanımı</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <AreaChart 
              height={300}
              data={{
                labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                datasets: [
                  {
                    label: 'CPU Kullanımı (%)',
                    data: [45, 52, 38, 65, 48, 35, 40],
                    borderColor: '#f43f5e',
                    backgroundColor: 'rgba(244, 63, 94, 0.1)',
                    fill: true,
                  },
                  {
                    label: 'Bellek Kullanımı (%)',
                    data: [60, 62, 58, 75, 65, 55, 58],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivityTable title="Sistem Logları" data={mockActivities} delay={0.6} />
        </div>
      </div>
    </div>
  );
}

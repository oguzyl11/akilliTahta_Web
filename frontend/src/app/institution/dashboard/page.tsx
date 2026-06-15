// =============================================================================
// Institution Dashboard — Kurum Yöneticisi Paneli
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { StatCard, RecentActivityTable, BarChart } from '@/components/ui';
import { Users, School, BookOpen, Activity } from 'lucide-react';

export default function InstitutionDashboard() {
  const { user } = useAuthStore();

  const mockActivities = [
    {
      id: '1',
      user: { name: 'Ahmet Yılmaz', role: 'Öğretmen' },
      action: 'Yeni ödev atadı',
      target: 'Matematik 8-A',
      time: '10 dk önce',
      status: 'success' as const,
    },
    {
      id: '2',
      user: { name: 'Ayşe Demir', role: 'Öğrenci' },
      action: 'Testi tamamladı',
      target: 'Fen Bilimleri - Ünite 2',
      time: '25 dk önce',
      status: 'info' as const,
    },
    {
      id: '3',
      user: { name: 'Mehmet Kaya', role: 'Veli' },
      action: 'Mesaj gönderdi',
      target: 'Sistem Yöneticisi',
      time: '1 saat önce',
      status: 'warning' as const,
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
          <h1 className="text-2xl font-bold text-slate-800">Hoş Geldiniz, {user?.name}</h1>
          <p className="text-slate-500 mt-1 text-sm">Kurumunuzun genel durumu ve istatistikleri.</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Toplam Öğrenci"
          value="1,245"
          icon={Users}
          color="indigo"
          trend={{ value: 12, label: 'Geçen aya göre', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Aktif Sınıflar"
          value="48"
          icon={School}
          color="emerald"
          trend={{ value: 4, label: 'Geçen aya göre', isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Toplam İçerik"
          value="356"
          icon={BookOpen}
          color="amber"
          trend={{ value: 0, label: 'Değişim yok', isPositive: null }}
          delay={0.3}
        />
        <StatCard
          title="Sistem Aktivitesi"
          value="%92"
          icon={Activity}
          color="rose"
          trend={{ value: 2, label: 'Geçen haftaya göre', isPositive: false }}
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
          className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
              <Activity className="text-indigo-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Kullanım Grafikleri</h3>
              <p className="text-sm text-slate-500">Son 6 aydaki sistem aktivitesi ve içerik kullanımı</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <BarChart 
              height={300}
              data={{
                labels: ['Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub'],
                datasets: [
                  {
                    label: 'Aktif Kullanıcılar',
                    data: [850, 920, 1050, 1100, 1150, 1245],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)', // indigo-500
                  },
                  {
                    label: 'Okunan İçerik',
                    data: [420, 500, 580, 610, 680, 750],
                    backgroundColor: 'rgba(168, 85, 247, 0.8)', // purple-500
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivityTable data={mockActivities} delay={0.6} />
        </div>
      </div>
    </div>
  );
}

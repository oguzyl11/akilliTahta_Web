// =============================================================================
// Student Dashboard — Öğrenci Paneli
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { StatCard, RecentActivityTable, AreaChart } from '@/components/ui';
import { BookOpen, Target, Award, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuthStore();

  const mockActivities = [
    {
      id: '1',
      user: { name: 'Ahmet Yılmaz', role: 'Öğretmen' },
      action: 'Ödev atadı',
      target: 'Matematik Bölüm 2',
      time: '2 saat önce',
      status: 'warning' as const,
    },
    {
      id: '2',
      user: { name: 'Sistem', role: '' },
      action: 'Rozet kazandın!',
      target: 'Haftanın Çalışkanı',
      time: 'Dün',
      status: 'success' as const,
    },
    {
      id: '3',
      user: { name: 'Ahmet Yılmaz', role: 'Öğretmen' },
      action: 'Ödev notlandırıldı',
      target: 'Matematik Bölüm 1 (95 Puan)',
      time: 'Dün',
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
          <h1 className="text-2xl font-bold text-slate-100">Merhaba, {user?.name} 🎯</h1>
          <p className="text-slate-400 mt-1 text-sm">Öğrenme yolculuğuna kaldığın yerden devam et.</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Okunan Kitap"
          value="12"
          icon={BookOpen}
          color="indigo"
          trend={{ value: 2, label: 'Bu hafta', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Tamamlanan Ödev"
          value="45"
          icon={Target}
          color="emerald"
          trend={{ value: 5, label: 'Bu hafta', isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Kazanılan Rozet"
          value="8"
          icon={Award}
          color="amber"
          delay={0.3}
        />
        <StatCard
          title="Çalışma Süresi"
          value="24s"
          icon={Clock}
          color="rose"
          trend={{ value: 10, label: 'Geçen haftaya göre', isPositive: true }}
          delay={0.4}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* İlerleme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex flex-col min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Target className="text-indigo-400" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-200">Öğrenme İlerlemen</h3>
              <p className="text-sm text-slate-400">Son 6 aydaki başarı oranları</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <AreaChart 
              height={300}
              data={{
                labels: ['Eyl', 'Eki', 'Kas', 'Ara', 'Oca', 'Şub'],
                datasets: [
                  {
                    label: 'Matematik',
                    data: [65, 72, 75, 80, 85, 90],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                  },
                  {
                    label: 'Fizik',
                    data: [55, 60, 68, 70, 75, 82],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivityTable title="Bildirimler" data={mockActivities} delay={0.6} />
        </div>
      </div>
    </div>
  );
}

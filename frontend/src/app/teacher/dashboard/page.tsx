// =============================================================================
// Teacher Dashboard — Öğretmen Paneli
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { StatCard, RecentActivityTable, BarChart } from '@/components/ui';
import { Users, ClipboardList, BookOpen, MessageSquare } from 'lucide-react';

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  const mockActivities = [
    {
      id: '1',
      user: { name: 'Ali Veli', role: 'Öğrenci' },
      action: 'Ödev teslim etti',
      target: 'Matematik Bölüm 1',
      time: '5 dk önce',
      status: 'success' as const,
    },
    {
      id: '2',
      user: { name: 'Ayşe Demir', role: 'Öğrenci' },
      action: 'Soru sordu',
      target: 'Fizik Sayfa 45',
      time: '20 dk önce',
      status: 'warning' as const,
    },
    {
      id: '3',
      user: { name: 'Mehmet Yılmaz', role: 'Öğrenci' },
      action: 'Ödevi gecikti',
      target: 'Tarih Bölüm 3',
      time: '1 saat önce',
      status: 'danger' as const,
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
          <h1 className="text-2xl font-bold text-slate-800">Merhaba, {user?.name}</h1>
          <p className="text-slate-500 mt-1 text-sm">Bugünkü ders programınız ve sınıf durumunuz.</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Sınıflarım"
          value="4"
          icon={Users}
          color="indigo"
          delay={0.1}
        />
        <StatCard
          title="Bekleyen Ödevler"
          value="12"
          icon={ClipboardList}
          color="amber"
          trend={{ value: 3, label: 'Dünden beri artış', isPositive: false }}
          delay={0.2}
        />
        <StatCard
          title="İşlenen Kitaplar"
          value="8"
          icon={BookOpen}
          color="emerald"
          delay={0.3}
        />
        <StatCard
          title="Okunmamış Mesaj"
          value="5"
          icon={MessageSquare}
          color="rose"
          delay={0.4}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sınıf Durumu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
              <ClipboardList className="text-emerald-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-800">Sınıf Başarı Grafikleri</h3>
              <p className="text-sm text-slate-500">Şubelere göre ödev teslim oranları</p>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <BarChart 
              height={300}
              data={{
                labels: ['11-A', '11-B', '11-C', '12-A', '12-B'],
                datasets: [
                  {
                    label: 'Tamamlanan',
                    data: [85, 70, 90, 65, 80],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
                  },
                  {
                    label: 'Bekleyen',
                    data: [15, 30, 10, 35, 20],
                    backgroundColor: 'rgba(245, 158, 11, 0.8)', // amber-500
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivityTable title="Öğrenci Hareketleri" data={mockActivities} delay={0.6} />
        </div>
      </div>
    </div>
  );
}

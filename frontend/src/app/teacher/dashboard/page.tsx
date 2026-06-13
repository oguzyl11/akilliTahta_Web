// =============================================================================
// Teacher Dashboard — Öğretmen Paneli
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { StatCard, RecentActivityTable } from '@/components/ui';
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
          <h1 className="text-2xl font-bold text-slate-100">Merhaba, {user?.name}</h1>
          <p className="text-slate-400 mt-1 text-sm">Bugünkü ders programınız ve sınıf durumunuz.</p>
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
        {/* Sınıf Durumu (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[400px]"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <ClipboardList className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-200">Sınıf Başarı Grafikleri</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
              Öğrencilerin ödev tamamlama ve test başarı oranları Chart.js ile eklenecektir.
            </p>
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

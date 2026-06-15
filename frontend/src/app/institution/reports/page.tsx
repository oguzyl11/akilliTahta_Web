// =============================================================================
// Institution Reports Page — Kurum İstatistikleri ve Raporlar
// MOD-16: Kurum bazlı genel raporlamalar
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, Users, BookOpen } from 'lucide-react';
import { AreaChart, BarChart, Button, StatCard } from '@/components/ui';

export default function InstitutionReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Kurumsal Raporlar</h1>
          <p className="text-slate-500 mt-1 text-sm">Okulunuzun genel başarı durumunu ve sistem kullanım oranlarını inceleyin.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Tüm Raporu İndir
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Aktif Sistem Kullanımı"
          value="%94"
          icon={Users}
          color="indigo"
          trend={{ value: 2, label: 'Geçen aya göre', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Ortalama Sınıf Başarısı"
          value="82.5"
          icon={BarChart3}
          color="emerald"
          trend={{ value: 4.1, label: 'Geçen aya göre', isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Tüketilen İçerik"
          value="12.4 TB"
          icon={BookOpen}
          color="amber"
          trend={{ value: 1.2, label: 'Artış', isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aktivite Trendi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">Sistem Kullanım Aktivitesi</h3>
            <p className="text-sm text-slate-500">Günlük platforma giriş yapan öğrenci sayısı</p>
          </div>
          
          <div className="flex-1 w-full">
            <AreaChart 
              height={300}
              data={{
                labels: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
                datasets: [
                  {
                    label: 'Aktif Öğrenci',
                    data: [1100, 1150, 1200, 1080, 1245, 800, 850],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Başarı Dağılımı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">Derslere Göre Kurum Ortalaması</h3>
            <p className="text-sm text-slate-500">Temel derslerde okulun genel ortalaması</p>
          </div>
          
          <div className="flex-1 w-full">
            <BarChart 
              height={300}
              data={{
                labels: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Edebiyat'],
                datasets: [
                  {
                    label: 'Ortalama (%)',
                    data: [75, 68, 82, 85, 90],
                    backgroundColor: 'rgba(168, 85, 247, 0.8)', // purple-500
                  }
                ]
              }} 
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

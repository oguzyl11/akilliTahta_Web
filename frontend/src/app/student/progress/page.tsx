// =============================================================================
// Student Progress Page — Öğrenci Gelişim Analizleri
// MOD-05: Grafikler ve detaylı başarı analitikleri
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, BrainCircuit } from 'lucide-react';
import { AreaChart, BarChart, StatCard } from '@/components/ui';

export default function StudentProgressPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">İlerleme Analizi</h1>
          <p className="text-slate-500 mt-1 text-sm">Gelişimini detaylı olarak incele ve hedeflerini takip et.</p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Genel Başarı Oranı"
          value="%82"
          icon={TrendingUp}
          color="indigo"
          trend={{ value: 5, label: 'Geçen aya göre', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Hedef Tamamlama"
          value="18/20"
          icon={Target}
          color="emerald"
          trend={{ value: 2, label: 'Kalan hedef', isPositive: false }}
          delay={0.2}
        />
        <StatCard
          title="Kazanılan Rozet"
          value="12"
          icon={Award}
          color="amber"
          trend={{ value: 3, label: 'Bu ay', isPositive: true }}
          delay={0.3}
        />
        <StatCard
          title="Odak Süresi"
          value="45s"
          icon={BrainCircuit}
          color="rose"
          trend={{ value: 12, label: 'Geçen haftaya göre', isPositive: true }}
          delay={0.4}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ders Bazlı Başarı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">Ders Bazlı Başarı Ortalaması</h3>
            <p className="text-sm text-slate-500">Tüm derslerindeki güncel not ortalamaların</p>
          </div>
          
          <div className="flex-1 w-full">
            <BarChart 
              height={300}
              data={{
                labels: ['Matematik', 'Fizik', 'Kimya', 'Biyoloji', 'Türkçe', 'Tarih'],
                datasets: [
                  {
                    label: 'Ortalama Puan',
                    data: [85, 75, 92, 88, 70, 95],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)', // indigo-500
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Aylık Gelişim */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">Aylık Gelişim Trendi</h3>
            <p className="text-sm text-slate-500">Sayısal derslerdeki son 6 aylık performans değişimi</p>
          </div>
          
          <div className="flex-1 w-full">
            <AreaChart 
              height={300}
              data={{
                labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
                datasets: [
                  {
                    label: 'Matematik',
                    data: [65, 70, 75, 82, 80, 85],
                    borderColor: '#6366f1', // indigo
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                  },
                  {
                    label: 'Fizik',
                    data: [55, 62, 60, 68, 72, 75],
                    borderColor: '#10b981', // emerald
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
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

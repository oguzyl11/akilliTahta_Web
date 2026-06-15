// =============================================================================
// Teacher Reports Page — Sınıf ve Öğrenci Raporları
// MOD-09: Grafiksel sınıf başarı raporları
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, BarChart3, TrendingUp, Users } from 'lucide-react';
import { AreaChart, BarChart, Button, StatCard } from '@/components/ui';

export default function TeacherReportsPage() {
  const [selectedClass, setSelectedClass] = useState('12-A Sayısal');
  const classes = ['12-A Sayısal', '11-A Sayısal', '11-B Sayısal', '12-B Eşit Ağırlık'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Başarı Raporları</h1>
          <p className="text-slate-500 mt-1 text-sm">Sınıflarınızın dönemsel gelişimini analiz edin.</p>
        </motion.div>

        {/* Toolbar */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {classes.slice(0, 2).map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedClass === cls ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {cls}
              </button>
            ))}
            <div className="px-4 py-2 text-sm font-medium text-slate-400">...</div>
          </div>
          <Button variant="outline" leftIcon={<Download size={18} />}>
            Raporu İndir
          </Button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Sınıf Ortalaması"
          value="85.4"
          icon={TrendingUp}
          color="indigo"
          trend={{ value: 2.1, label: 'Geçen aya göre', isPositive: true }}
          delay={0.1}
        />
        <StatCard
          title="Tamamlanan Ödevler"
          value="%92"
          icon={BarChart3}
          color="emerald"
          trend={{ value: 5, label: 'Geçen aya göre', isPositive: true }}
          delay={0.2}
        />
        <StatCard
          title="Zayıf Öğrenci Sayısı"
          value="3"
          icon={Users}
          color="amber"
          trend={{ value: 1, label: 'Azalış', isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aylık Başarı Trendi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">{selectedClass} Başarı Trendi</h3>
            <p className="text-sm text-slate-500">Aylık bazda sınıfın genel ortalaması</p>
          </div>
          
          <div className="flex-1 w-full">
            <AreaChart 
              height={300}
              data={{
                labels: ['Eylül', 'Ekim', 'Kasım', 'Aralık', 'Ocak', 'Şubat'],
                datasets: [
                  {
                    label: 'Sınıf Ortalaması',
                    data: [70, 75, 78, 82, 80, 85.4],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                  }
                ]
              }} 
            />
          </div>
        </motion.div>

        {/* Konu Başarısı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-md shadow-slate-200/50 flex flex-col min-h-[400px]"
        >
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800">Konu Bazlı Analiz</h3>
            <p className="text-sm text-slate-500">Matematik dersi alt konu başarı oranları</p>
          </div>
          
          <div className="flex-1 w-full">
            <BarChart 
              height={300}
              data={{
                labels: ['Türev', 'İntegral', 'Logaritma', 'Diziler', 'Trigonometri'],
                datasets: [
                  {
                    label: 'Doğru Oranı (%)',
                    data: [82, 75, 90, 85, 65],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald-500
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

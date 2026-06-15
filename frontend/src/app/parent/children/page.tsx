// =============================================================================
// Parent Children Page — Çocuklarım
// MOD-23: Veli için öğrencilerin genel durum takibi
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, Clock, Activity, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ParentChildrenPage() {
  const children = [
    { 
      id: '1', 
      name: 'Ege Yılmaz', 
      grade: '11-A', 
      school: 'Atatürk Anadolu Lisesi', 
      average: 85, 
      homeworkStatus: 'Eksik Ödev Yok',
      recentActivity: 'Matematik testini bitirdi' 
    },
    { 
      id: '2', 
      name: 'Defne Yılmaz', 
      grade: '8-C', 
      school: 'Cumhuriyet Ortaokulu', 
      average: 92, 
      homeworkStatus: '1 Bekleyen Ödev',
      recentActivity: 'Fen Bilimleri kitabını okuyor' 
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Çocuklarım</h1>
        <p className="text-slate-500 mt-1 text-sm">Öğrencilerinizin akademik başarılarını ve güncel durumlarını takip edin.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child, idx) => (
          <motion.div 
            key={child.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden group"
          >
            {/* Header / Avatar Area */}
            <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-6 flex items-center gap-4 text-white">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-inner">
                {child.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{child.name}</h2>
                <p className="text-white/80 text-sm flex items-center gap-1">
                  {child.grade} • {child.school}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <TrendingUp size={16} /> Genel Ortalama
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{child.average}</div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
                    <BookOpen size={16} /> Ödev Durumu
                  </div>
                  <div className={`text-sm font-bold ${child.homeworkStatus.includes('Yok') ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {child.homeworkStatus}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Activity size={16} className="text-indigo-500" /> Son Aktivite
                  </div>
                  <span className="text-xs text-slate-400">1 saat önce</span>
                </div>
                <p className="text-slate-700 text-sm">{child.recentActivity}</p>
              </div>

              <Button fullWidth variant="outline" className="group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200">
                Detaylı Raporu İncele <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Parent Academy Page — Veli Akademisi
// MOD-25: Veli eğitim materyalleri
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ParentAcademyPage() {
  const videos = [
    { id: '1', title: 'Dijital Çağda Ebeveynlik', duration: '12:45', category: 'Seminer', color: 'from-sky-400 to-indigo-500' },
    { id: '2', title: 'Sınav Kaygısı İle Başa Çıkma', duration: '24:10', category: 'Rehberlik', color: 'from-rose-400 to-orange-500' },
    { id: '3', title: 'Verimli Ders Çalışma Teknikleri', duration: '18:30', category: 'Rehberlik', color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="text-indigo-500" /> Veli Akademisi
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Rehberlik servisimiz tarafından hazırlanan eğitim videoları.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <motion.div 
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/90 border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Thumbnail Placeholder */}
            <div className={`h-40 bg-gradient-to-br ${video.color} relative flex items-center justify-center cursor-pointer overflow-hidden`}>
              <PlayCircle size={48} className="text-white/80 group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md text-white text-xs font-medium">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1 block">{video.category}</span>
              <h3 className="font-bold text-slate-800">{video.title}</h3>
              <Button variant="outline" fullWidth className="mt-4">Şimdi İzle</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

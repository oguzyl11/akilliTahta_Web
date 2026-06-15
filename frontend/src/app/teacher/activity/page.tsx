// =============================================================================
// Teacher Activity Page — Sınıf İçi Etkileşim ve Aktivite
// MOD-10: Öğrencilerin son hareketlerini tablo halinde izleme
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Activity, Filter, Eye } from 'lucide-react';
import { Input, Button } from '@/components/ui';

interface StudentActivity {
  id: string;
  studentName: string;
  className: string;
  actionType: 'login' | 'read' | 'assignment' | 'question';
  detail: string;
  time: string;
  colorClass: string;
}

const mockActivities: StudentActivity[] = [
  { id: '1', studentName: 'Ali Yılmaz', className: '12-A', actionType: 'assignment', detail: 'Türev Ödevini Tamamladı (95 Puan)', time: '10 dk önce', colorClass: 'text-emerald-600 bg-emerald-50' },
  { id: '2', studentName: 'Zeynep Kaya', className: '11-B', actionType: 'read', detail: 'Fizik Kitabı Sayfa 45\'i okuyor', time: '15 dk önce', colorClass: 'text-sky-600 bg-sky-50' },
  { id: '3', studentName: 'Mehmet Demir', className: '12-A', actionType: 'question', detail: 'İntegral 3. soru için yardım istedi', time: '1 saat önce', colorClass: 'text-amber-600 bg-amber-50' },
  { id: '4', studentName: 'Ayşe Çelik', className: '11-A', actionType: 'login', detail: 'Sisteme giriş yaptı', time: '2 saat önce', colorClass: 'text-slate-600 bg-slate-100' },
  { id: '5', studentName: 'Kaan Yılmaz', className: '12-B', actionType: 'assignment', detail: 'Geometri Ödevini geciktirdi', time: '3 saat önce', colorClass: 'text-rose-600 bg-rose-50' },
];

export default function TeacherActivityPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Öğrenci Aktiviteleri</h1>
          <p className="text-slate-500 mt-1 text-sm">Sınıflarınızdaki öğrencilerin anlık hareketlerini takip edin.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="w-full sm:w-64">
            <Input 
              placeholder="Öğrenci ara..." 
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" leftIcon={<Filter size={18} />}>
            Filtrele
          </Button>
        </motion.div>
      </div>

      {/* Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Öğrenci</th>
                <th className="px-6 py-4">Sınıf</th>
                <th className="px-6 py-4">Aktivite Tipi</th>
                <th className="px-6 py-4">Detay</th>
                <th className="px-6 py-4">Zaman</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockActivities.filter(a => a.studentName.toLowerCase().includes(searchTerm.toLowerCase())).map((activity, idx) => (
                <motion.tr 
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">{activity.studentName}</td>
                  <td className="px-6 py-4">{activity.className}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${activity.colorClass}`}>
                      {activity.actionType.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">{activity.detail}</td>
                  <td className="px-6 py-4 text-slate-400">{activity.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-indigo-50">
                      <Eye size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

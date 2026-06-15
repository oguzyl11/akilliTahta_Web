// =============================================================================
// Student Assignments Page — Öğrenci Ödevleri
// MOD-04: Ödev listesi, filtreleme ve durum takibi
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  score?: number;
}

const mockAssignments: Assignment[] = [
  { id: '1', title: 'Türev Uygulamaları Testi', subject: 'Matematik', teacher: 'Ahmet Yılmaz', dueDate: '2026-06-18', status: 'pending' },
  { id: '2', title: 'Elektrik Devreleri', subject: 'Fizik', teacher: 'Ayşe Demir', dueDate: '2026-06-16', status: 'pending' },
  { id: '3', title: 'Organik Kimyaya Giriş', subject: 'Kimya', teacher: 'Mehmet Kaya', dueDate: '2026-06-10', status: 'overdue' },
  { id: '4', title: 'Divan Edebiyatı Özellikleri', subject: 'Edebiyat', teacher: 'Fatma Çelik', dueDate: '2026-06-05', status: 'completed', score: 85 },
  { id: '5', title: 'İntegral Soru Çözümleri', subject: 'Matematik', teacher: 'Ahmet Yılmaz', dueDate: '2026-06-01', status: 'completed', score: 92 },
];

export default function StudentAssignmentsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  const filteredAssignments = mockAssignments.filter((a) => {
    if (activeTab === 'pending') return a.status === 'pending' || a.status === 'overdue';
    return a.status === 'completed';
  });

  const getStatusIcon = (status: Assignment['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={20} />;
      case 'overdue': return <AlertCircle className="text-rose-500" size={20} />;
      case 'completed': return <CheckCircle className="text-emerald-500" size={20} />;
    }
  };

  const getStatusBadge = (status: Assignment['status']) => {
    switch (status) {
      case 'pending': 
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-200">Devam Ediyor</span>;
      case 'overdue': 
        return <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">Gecikti</span>;
      case 'completed': 
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">Tamamlandı</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Ödevlerim</h1>
          <p className="text-slate-500 mt-1 text-sm">Bekleyen ve tamamlanmış tüm görevlerini takip et.</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex p-1 bg-slate-200/50 rounded-xl w-full sm:w-fit"
      >
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'pending' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Bekleyenler
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            activeTab === 'completed' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Tamamlananlar
        </button>
      </motion.div>

      {/* List */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredAssignments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredAssignments.map((assignment, index) => (
              <motion.div 
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                {/* Sol: İkon & Bilgi */}
                <div className="flex items-start sm:items-center gap-4">
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    assignment.status === 'completed' ? 'bg-emerald-50' : 
                    assignment.status === 'overdue' ? 'bg-rose-50' : 'bg-amber-50'
                  }`}>
                    {getStatusIcon(assignment.status)}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                      {assignment.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <FileText size={14} className="text-slate-400" />
                        {assignment.subject}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                      <span>{assignment.teacher}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block" />
                      <span className={`flex items-center gap-1 ${assignment.status === 'overdue' ? 'text-rose-500 font-medium' : ''}`}>
                        <Calendar size={14} />
                        Son Tarih: {new Date(assignment.dueDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sağ: Durum & Aksiyon */}
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0 border-slate-100">
                  <div className="flex items-center gap-4">
                    {getStatusBadge(assignment.status)}
                    {assignment.score !== undefined && (
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Puan</div>
                        <div className="text-lg font-bold text-emerald-600">{assignment.score}</div>
                      </div>
                    )}
                  </div>
                  
                  <button className="p-2 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-lg transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Harika İş!</h3>
            <p className="text-slate-500 max-w-sm">
              Şu anda listelenecek ödeviniz bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Teacher Classrooms Page — Sınıflarım
// MOD-07: Sınıf listesi ve genel başarı metrikleri
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Target, ChevronRight } from 'lucide-react';

interface Classroom {
  id: string;
  name: string;
  studentCount: number;
  averageScore: number;
  assignedBooks: number;
  color: string;
}

const mockClassrooms: Classroom[] = [
  { id: '1', name: '11-A Sayısal', studentCount: 24, averageScore: 85, assignedBooks: 4, color: 'from-sky-400 to-indigo-500' },
  { id: '2', name: '11-B Sayısal', studentCount: 22, averageScore: 78, assignedBooks: 4, color: 'from-emerald-400 to-teal-500' },
  { id: '3', name: '12-A Sayısal', studentCount: 26, averageScore: 92, assignedBooks: 6, color: 'from-amber-400 to-orange-500' },
  { id: '4', name: '12-B Eşit Ağırlık', studentCount: 20, averageScore: 75, assignedBooks: 3, color: 'from-rose-400 to-pink-500' },
];

export default function TeacherClassroomsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sınıflarım</h1>
          <p className="text-slate-500 mt-1 text-sm">Derse girdiğiniz sınıfları ve genel durumlarını yönetin.</p>
        </div>
      </motion.div>

      {/* Classrooms Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {mockClassrooms.map((cls) => (
          <motion.div 
            key={cls.id} 
            variants={itemVariants}
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            {/* Üst Kısım (Gradient & İsim) */}
            <div className={`h-24 bg-gradient-to-r ${cls.color} p-5 flex flex-col justify-end relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-white font-bold text-2xl relative z-10">{cls.name}</h3>
            </div>

            {/* İçerik */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <Users size={14} />
                    Öğrenci
                  </div>
                  <span className="text-lg font-semibold text-slate-800">{cls.studentCount}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                    <BookOpen size={14} />
                    Kitap
                  </div>
                  <span className="text-lg font-semibold text-slate-800">{cls.assignedBooks}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-1">
                    <Target size={14} />
                    Sınıf Başarısı
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cls.averageScore > 80 ? 'bg-emerald-500' : cls.averageScore > 60 ? 'bg-indigo-500' : 'bg-amber-500'}`} 
                        style={{ width: `${cls.averageScore}%` }} 
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700">%{cls.averageScore}</span>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

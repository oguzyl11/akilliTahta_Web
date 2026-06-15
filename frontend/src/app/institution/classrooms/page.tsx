// =============================================================================
// Institution Classrooms Page — Şube ve Sınıf Yönetimi
// MOD-13: Sınıf kapasiteleri ve öğretmen atamaları
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Search, MoreVertical, School, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/services/api';

interface Classroom {
  id: string | number;
  name: string;
  grade_level: number;
  branch: string;
  teacher?: { name: string };
  students_count: number;
}

export default function InstitutionClassroomsPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await api.get('/classrooms');
        if (response.data?.status === 'success') {
          setClassrooms(response.data.data);
        }
      } catch (error) {
        console.error('Sınıflar yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Sınıf ve Şube Yönetimi</h1>
          <p className="text-slate-500 mt-1 text-sm">Kurumdaki tüm şubeleri ve kapasitelerini kontrol edin.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="w-full sm:w-64">
            <Input placeholder="Sınıf ara..." leftIcon={<Search size={18} />} />
          </div>
          <Button leftIcon={<Plus size={18} />}>Yeni Sınıf</Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : classrooms.length > 0 ? (
          classrooms.map((cls, idx) => (
            <motion.div 
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <School size={24} />
                </div>
                <button className="text-slate-400 hover:text-slate-600 p-1">
                  <MoreVertical size={18} />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">{cls.name}</h3>
              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5">
                 Sınıf Öğretmeni: <span className="font-medium text-slate-700">{cls.teacher?.name || 'Atanmadı'}</span>
              </p>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1"><Users size={14} /> Mevcut / Kapasite</span>
                  <span className="font-semibold text-slate-700">{cls.students_count} / 30</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cls.students_count >= 30 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min((cls.students_count / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            Sınıf bulunamadı. Yeni bir sınıf ekleyebilirsiniz.
          </div>
        )}
      </div>
    </div>
  );
}

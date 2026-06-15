// =============================================================================
// Teacher Assignments Page — Öğretmen Ödev Yönetimi
// MOD-08: Ödev oluşturma, listeleme ve notlandırma durumu
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Users, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/services/api';

interface AssignmentTask {
  id: string | number;
  title: string;
  classroom: { name: string; students_count: number };
  book: { title: string };
  created_at: string;
  due_date: string;
  submissions_count: number;
  status: 'active' | 'grading' | 'completed';
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await api.get('/assignments');
        if (response.data?.status === 'success') {
          setAssignments(response.data.data);
        }
      } catch (error) {
        console.error('Ödevler yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (a.classroom?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: AssignmentTask['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold border border-emerald-200">Devam Ediyor</span>;
      case 'grading':
        return <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold border border-amber-200">Notlandırılacak</span>;
      case 'completed':
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">Tamamlandı</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Ödev Yönetimi</h1>
          <p className="text-slate-500 mt-1 text-sm">Sınıflarınıza atadığınız ödevleri takip edin ve notlandırın.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="w-full sm:w-64">
            <Input 
              placeholder="Ödev veya sınıf ara..." 
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button leftIcon={<Plus size={18} />} className="bg-indigo-600 hover:bg-indigo-700">
            Yeni Ödev Ata
          </Button>
        </motion.div>
      </div>

      {/* Assignment List */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : filteredAssignments.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredAssignments.map((assignment, index) => {
              const totalStudents = assignment.classroom?.students_count || 1;
              const completed = assignment.submissions_count || 0;
              const ratio = Math.min(completed / totalStudents, 1);

              return (
                <motion.div 
                  key={assignment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-5 hover:bg-slate-50 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Sol Bilgi */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                      {getStatusBadge(assignment.status)}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-700 font-medium">
                        <Users size={14} className="text-indigo-500" />
                        {assignment.classroom?.name || 'Sınıf Yok'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} />
                        {assignment.book?.title || 'Kitap Yok'}
                      </div>
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <Calendar size={14} />
                        Son Tarih: {new Date(assignment.due_date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>

                  {/* Sağ İstatistik & Aksiyon */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:border-l lg:border-slate-100 lg:pl-6">
                    
                    {/* Progress Ring */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                          <circle 
                            cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                            strokeDasharray={`${2 * Math.PI * 20}`} 
                            strokeDashoffset={`${2 * Math.PI * 20 * (1 - ratio)}`}
                            className={completed >= totalStudents ? 'text-emerald-500' : 'text-indigo-500'} 
                          />
                        </svg>
                        <span className="absolute text-xs font-bold text-slate-700">
                          {Math.round(ratio * 100)}%
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Teslim Durumu</div>
                        <div className="text-sm font-bold text-slate-800">
                          {completed} <span className="text-slate-400 font-normal">/ {totalStudents}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {assignment.status === 'grading' ? (
                        <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white" leftIcon={<CheckCircle size={16} />}>
                          Notlandır
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full sm:w-auto">Detaylar</Button>
                      )}
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Ödev Bulunamadı</h3>
            <p className="text-slate-500 max-w-sm">
              Henüz bir ödev atamadınız veya aramanıza uygun sonuç yok.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Student Assignments Page — Öğrenci Ödevlerim
// MOD-04: Öğrencinin bekleyen ve tamamlanan ödevleri
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle, FileText, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import api from '@/services/api';

interface AssignmentTask {
  id: string | number;
  title: string;
  book: { title: string };
  teacher: { name: string };
  due_date: string;
  status: 'active' | 'grading' | 'completed';
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentTask[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
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

  const pendingAssignments = assignments.filter(a => a.status === 'active' || a.status === 'grading');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  const displayAssignments = activeTab === 'pending' ? pendingAssignments : completedAssignments;

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800">Ödevlerim</h1>
        <p className="text-slate-500 mt-1 text-sm">Öğretmenlerinin atadığı ödevleri zamanında tamamla.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'pending' 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Bekleyenler ({pendingAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === 'completed' 
              ? 'bg-white text-emerald-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Tamamlananlar ({completedAssignments.length})
        </button>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {displayAssignments.length > 0 ? (
                displayAssignments.map((assignment) => {
                  const overdue = activeTab === 'pending' && isOverdue(assignment.due_date);
                  
                  return (
                    <div 
                      key={assignment.id}
                      className={`bg-white/90 backdrop-blur-md border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md ${
                        overdue ? 'border-rose-200 shadow-rose-100/50' : 'border-slate-200 shadow-sm'
                      }`}
                    >
                      {/* Sol Bilgi */}
                      <div className="flex gap-4">
                        <div className={`mt-1 flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${
                          activeTab === 'completed' ? 'bg-emerald-50 text-emerald-500' :
                          overdue ? 'bg-rose-50 text-rose-500' : 'bg-indigo-50 text-indigo-500'
                        }`}>
                          {activeTab === 'completed' ? <CheckCircle size={24} /> : overdue ? <AlertCircle size={24} /> : <FileText size={24} />}
                        </div>
                        
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">{assignment.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 font-medium text-slate-600">
                              <BookOpen size={14} className="text-indigo-400" /> {assignment.book?.title}
                            </span>
                            <span className="flex items-center gap-1.5">
                              Öğretmen: {assignment.teacher?.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sağ Tarih ve Aksiyon */}
                      <div className="flex items-center gap-4 md:gap-8 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                        <div className={`flex items-center gap-2 text-sm font-semibold ${
                          activeTab === 'completed' ? 'text-emerald-600' :
                          overdue ? 'text-rose-600' : 'text-amber-600'
                        }`}>
                          {activeTab === 'completed' ? (
                            <><CheckCircle size={16} /> Tamamlandı</>
                          ) : overdue ? (
                            <><AlertCircle size={16} /> Gecikti</>
                          ) : (
                            <><Clock size={16} /> Son Gün: {new Date(assignment.due_date).toLocaleDateString('tr-TR')}</>
                          )}
                        </div>

                        {activeTab === 'pending' && (
                          <Button 
                            className={overdue ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}
                          >
                            Ödeve Git <ChevronRight size={16} className="ml-1" />
                          </Button>
                        )}
                        {activeTab === 'completed' && (
                          <Button variant="outline">
                            Sonucu İncele
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-2xl">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {activeTab === 'pending' ? 'Harika İş Çıkardın!' : 'Henüz Ödev Yok'}
                  </h3>
                  <p className="text-slate-500">
                    {activeTab === 'pending' 
                      ? 'Şu anda bekleyen hiçbir ödevin yok.' 
                      : 'Henüz tamamladığın bir ödev bulunmuyor.'}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

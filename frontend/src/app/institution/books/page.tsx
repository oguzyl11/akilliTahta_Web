// =============================================================================
// Institution Books Page — Kütüphane Yönetimi
// MOD-14: Kurum kitap arşivi
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Search, Filter, MoreVertical } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function InstitutionBooksPage() {
  const mockBooks = [
    { id: '1', title: 'Matematik Soru Bankası', subject: 'Matematik', grade: '11. Sınıf', size: '15 MB', status: 'published', color: 'from-sky-400 to-indigo-500' },
    { id: '2', title: 'Fizik Konu Anlatımı', subject: 'Fizik', grade: '11. Sınıf', size: '22 MB', status: 'published', color: 'from-emerald-400 to-teal-500' },
    { id: '3', title: 'Kimya Denemeleri', subject: 'Kimya', grade: '12. Sınıf', size: '8 MB', status: 'draft', color: 'from-amber-400 to-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">İçerik Kütüphanesi</h1>
          <p className="text-slate-500 mt-1 text-sm">Kurumunuza atanmış tüm dijital yayınlar.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="w-full sm:w-64">
            <Input placeholder="Kitap ara..." leftIcon={<Search size={18} />} />
          </div>
          <Button leftIcon={<Upload size={18} />} className="bg-indigo-600 hover:bg-indigo-700">Yeni Yükle</Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockBooks.map((book, idx) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`h-40 bg-gradient-to-br ${book.color} relative p-4 flex flex-col justify-between`}>
              <div className="flex justify-between items-start">
                <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                  {book.grade}
                </span>
                <button className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{book.title}</h3>
                <p className="text-white/80 text-sm mt-1">{book.subject}</p>
              </div>
            </div>

            <div className="p-4 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Boyut: {book.size}</span>
                {book.status === 'published' ? (
                  <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-medium text-xs">Yayında</span>
                ) : (
                  <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-600 font-medium text-xs">Taslak</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button fullWidth variant="outline" size="sm">Önizle</Button>
                <Button fullWidth size="sm">Düzenle</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

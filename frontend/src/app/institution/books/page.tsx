// =============================================================================
// Institution Books Page — Kütüphane Yönetimi
// MOD-14: Kurum kitap arşivi
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Search, Filter, MoreVertical, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/services/api';

interface Book {
  id: string | number;
  title: string;
  subject: string;
  grade_level: number;
  pdf_size_bytes: number;
  render_status: string;
}

export default function InstitutionBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        if (response.data?.status === 'success') {
          setBooks(response.data.data);
        }
      } catch (error) {
        console.error('Kitaplar yüklenemedi:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : books.length > 0 ? (
          books.map((book, idx) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-400 to-purple-500 relative p-4 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                    {book.grade_level ? `${book.grade_level}. Sınıf` : 'Genel'}
                  </span>
                  <button className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-white/80 text-sm mt-1">{book.subject || 'Ders Seçilmedi'}</p>
                </div>
              </div>

              <div className="p-4 flex flex-col justify-between gap-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Boyut: {formatBytes(book.pdf_size_bytes)}</span>
                  {book.render_status === 'completed' ? (
                    <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 font-medium text-xs">Yayında</span>
                  ) : book.render_status === 'processing' ? (
                    <span className="px-2 py-1 rounded-md bg-sky-50 text-sky-600 font-medium text-xs">İşleniyor</span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-600 font-medium text-xs">Beklemede</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button fullWidth variant="outline" size="sm">Önizle</Button>
                  <Button fullWidth size="sm">Düzenle</Button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            Henüz kitap yüklenmemiş.
          </div>
        )}
      </div>
    </div>
  );
}

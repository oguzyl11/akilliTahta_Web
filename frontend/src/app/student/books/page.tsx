// =============================================================================
// Student Books Page — Öğrenci Kitaplık
// MOD-03: Kütüphane listeleme, ilerleme çubukları ve etkileşim
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, PlayCircle, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface Book {
  id: string;
  title: string;
  subject: string;
  grade: string;
  progress: number;
  coverColor: string; // Gradient için
}

const mockBooks: Book[] = [
  { id: '1', title: 'Matematik Soru Bankası', subject: 'Matematik', grade: '11. Sınıf', progress: 45, coverColor: 'from-sky-400 to-indigo-500' },
  { id: '2', title: 'Fizik Konu Anlatımı', subject: 'Fizik', grade: '11. Sınıf', progress: 12, coverColor: 'from-emerald-400 to-teal-500' },
  { id: '3', title: 'Kimya Denemeleri', subject: 'Kimya', grade: '11. Sınıf', progress: 85, coverColor: 'from-amber-400 to-orange-500' },
  { id: '4', title: 'Biyoloji Yaprak Test', subject: 'Biyoloji', grade: '11. Sınıf', progress: 100, coverColor: 'from-purple-400 to-fuchsia-500' },
  { id: '5', title: 'Türk Dili ve Edebiyatı', subject: 'Edebiyat', grade: '11. Sınıf', progress: 5, coverColor: 'from-rose-400 to-pink-500' },
  { id: '6', title: 'Tarih Soru Bankası', subject: 'Tarih', grade: '11. Sınıf', progress: 0, coverColor: 'from-slate-400 to-slate-600' },
];

export default function StudentBooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  // Filtreleme mantığı
  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'All' || book.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ['All', ...Array.from(new Set(mockBooks.map(b => b.subject)))];

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Kitaplarım</h1>
          <p className="text-slate-500 mt-1 text-sm">Sana atanan tüm interaktif kitaplar ve içerikler.</p>
        </motion.div>

        {/* Araç Çubuğu (Toolbar) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="w-full sm:w-64">
            <Input 
              placeholder="Kitap ara..." 
              leftIcon={<Search size={18} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {subjects.map(subject => (
              <button
                key={subject}
                onClick={() => setFilterSubject(subject)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  filterSubject === subject 
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {subject === 'All' ? 'Tümü' : subject}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Kitap Izgarası */}
      {filteredBooks.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredBooks.map((book) => (
            <motion.div 
              key={book.id} 
              variants={itemVariants}
              className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              {/* Kitap Kapağı (Gradient) */}
              <div className={`h-40 bg-gradient-to-br ${book.coverColor} relative p-4 flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                    {book.grade}
                  </span>
                  {book.progress === 100 && (
                    <span className="px-2 py-1 bg-emerald-500/80 backdrop-blur-sm rounded-lg text-white text-xs font-semibold flex items-center gap-1">
                      <CheckCircle size={12} />
                      Tamamlandı
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight line-clamp-2">{book.title}</h3>
                  <p className="text-white/80 text-sm mt-1">{book.subject}</p>
                </div>
                
                {/* Oku İkonu Hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 text-indigo-600 rounded-full p-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <PlayCircle size={28} />
                  </div>
                </div>
              </div>

              {/* Alt Bilgi & İlerleme */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Okuma İlerlemesi</span>
                    <span className={book.progress === 100 ? 'text-emerald-600' : 'text-indigo-600'}>
                      %{book.progress}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${book.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                </div>

                <Button 
                  fullWidth 
                  variant={book.progress === 0 ? 'default' : book.progress === 100 ? 'outline' : 'default'}
                  className={book.progress > 0 && book.progress < 100 ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                >
                  {book.progress === 0 ? 'Kitabı Aç' : book.progress === 100 ? 'Tekrar İncele' : 'Kaldığın Yerden Devam'}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Boş Durum */
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="bg-white/80 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">Kitap Bulunamadı</h3>
          <p className="text-slate-500 max-w-sm">
            "{searchTerm}" aramasına uygun kitap bulunamadı. Lütfen filtreleri temizleyip tekrar deneyin.
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => { setSearchTerm(''); setFilterSubject('All'); }}
          >
            Filtreleri Temizle
          </Button>
        </motion.div>
      )}
    </div>
  );
}

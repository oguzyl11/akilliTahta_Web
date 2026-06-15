// =============================================================================
// Student Books Page — Öğrenci Kitaplık
// MOD-03: Kütüphane listeleme, ilerleme çubukları ve etkileşim
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, PlayCircle, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import api from '@/services/api';

interface Book {
  id: string | number;
  title: string;
  subject: string;
  grade_level: number;
}

export default function StudentBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          className="w-full md:w-64"
        >
          <Input 
            placeholder="Kitap ara..." 
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>
      </div>

      {/* Kitap Izgarası */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center p-12">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map((book, idx) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
            >
              {/* Book Cover / Gradient */}
              <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 relative flex items-center justify-center cursor-pointer group-hover:opacity-90 transition-opacity">
                <BookOpen size={48} className="text-white/30" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle size={48} className="text-white drop-shadow-lg" />
                </div>
              </div>

              {/* Book Details */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">{book.subject || 'Genel'}</span>
                </div>
                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-4">{book.title}</h3>

                {/* Progress Bar (Mock for now until we have reading progress API) */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Okuma İlerlemesi</span>
                    <span className="font-medium">%0</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `0%` }}
                    />
                  </div>
                </div>

                <Button fullWidth className="mt-6 bg-indigo-600 hover:bg-indigo-700">
                  Okumaya Başla
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-slate-500">
            Size atanmış herhangi bir kitap bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}

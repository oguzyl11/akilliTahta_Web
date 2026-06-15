// =============================================================================
// Admin Books Page — Merkezi Kitap Havuzu
// MOD-19: Tüm kurumların erişebileceği ana kütüphane
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Upload, Search, Edit2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function AdminBooksPage() {
  const mockBooks = [
    { id: '1', title: 'AYT Matematik Soru Bankası', publisher: 'Örnek Yayınları', size: '45 MB', access: 'Global' },
    { id: '2', title: 'TYT Türkçe Konu Anlatımı', publisher: 'Örnek Yayınları', size: '32 MB', access: 'Global' },
    { id: '3', title: 'AAL Fizik Föyleri', publisher: 'Atatürk Anadolu Lisesi', size: '12 MB', access: 'Özel (1 Kurum)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-slate-800">Merkezi Kütüphane</h1>
          <p className="text-slate-500 mt-1 text-sm">Sistemdeki tüm yayın ve materyalleri yönetin.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
          <Input placeholder="Kitap veya yayıncı ara..." leftIcon={<Search size={18} />} />
          <Button leftIcon={<Upload size={18} />}>Merkezi Yükleme</Button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockBooks.map((book) => (
          <div key={book.id} className="bg-white/90 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight">{book.title}</h3>
              <p className="text-sm text-slate-500">{book.publisher}</p>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>{book.size}</span>
              <span className={book.access === 'Global' ? 'text-emerald-500' : 'text-indigo-500'}>{book.access}</span>
            </div>
            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <Button fullWidth variant="outline" size="sm" leftIcon={<Edit2 size={16} />}>Düzenle</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

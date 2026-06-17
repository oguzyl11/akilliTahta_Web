// =============================================================================
// Institution Books Page — Kütüphane Yönetimi
// MOD-14: Kurum kitap arşivi
// =============================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Upload, Search, Filter, MoreVertical, Loader2, X, FileUp } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface Book {
  id: string | number;
  title: string;
  subject: string;
  grade_level: number;
  pdf_size_bytes: number;
  render_status: string;
  pdf_url?: string;
}

export default function InstitutionBooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadGrade, setUploadGrade] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [previewBookUrl, setPreviewBookUrl] = useState<string | null>(null);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return toast.error('Lütfen bir PDF dosyası seçin.');
    if (!uploadTitle.trim()) return toast.error('Lütfen kitap adını girin.');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', uploadTitle.trim());
    if (uploadSubject.trim()) formData.append('subject', uploadSubject.trim());
    if (uploadGrade.trim()) formData.append('grade_level', uploadGrade.trim());
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/books/upload', formData, {
        timeout: 120000, // 2 dakika — büyük dosyalar için
      });
      
      toast.success('Kitap başarıyla yüklendi!');
      setIsUploadModalOpen(false);
      setUploadTitle(''); setUploadSubject(''); setUploadGrade(''); setSelectedFile(null);
      // Listeyi yenile
      const booksRes = await api.get('/books');
      if (booksRes.data?.status === 'success') {
        setBooks(booksRes.data.data);
      }
    } catch (error: any) {
      console.error('Yükleme hatası (detay):', JSON.stringify(error, null, 2));
      // api.ts interceptor'ından gelen yapı: { message, errors, statusCode, response }
      const msg = error?.message || 'Dosya yüklenirken bir hata oluştu.';
      const validationErrors = error?.errors;
      if (validationErrors && typeof validationErrors === 'object') {
        const firstError = Object.values(validationErrors).flat()[0] as string;
        toast.error(firstError || msg);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsUploading(false);
    }
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
          <Button variant="outline" leftIcon={<Filter size={18} />}>Filtrele</Button>
          <Button 
            leftIcon={<Upload size={18} />} 
            className="bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Yeni PDF Yükle
          </Button>
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
                  <Button 
                    fullWidth 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000';
                      setPreviewBookUrl(`${baseUrl}/storage/${book.pdf_url}`);
                    }}
                  >
                    Önizle
                  </Button>
                  <Button 
                    fullWidth 
                    size="sm"
                    onClick={() => router.push(`/institution/editor?bookId=${book.id}`)}
                  >
                    Düzenle
                  </Button>
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
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
                <h3 className="font-bold text-lg flex items-center gap-2"><BookOpen size={20} /> Yeni PDF Kitap Yükle</h3>
                <button onClick={() => setIsUploadModalOpen(false)} className="hover:bg-white/20 p-1.5 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUpload} className="p-6 space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kitap Adı *</label>
                    <Input 
                      placeholder="Örn: 11. Sınıf Fizik Konu Anlatımı" 
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ders Seçimi</label>
                      <Input 
                        placeholder="Örn: Fizik" 
                        value={uploadSubject}
                        onChange={(e) => setUploadSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Sınıf Seviyesi</label>
                      <Input 
                        type="number"
                        placeholder="Örn: 11" 
                        value={uploadGrade}
                        onChange={(e) => setUploadGrade(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">PDF Dosyası *</label>
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="application/pdf"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      />
                      <FileUp size={32} className={selectedFile ? "text-emerald-500 mb-3" : "text-indigo-400 mb-3"} />
                      {selectedFile ? (
                        <div>
                          <p className="font-semibold text-slate-800">{selectedFile.name}</p>
                          <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium text-slate-700">Dosya seçmek için tıklayın</p>
                          <p className="text-xs text-slate-500 mt-1">Sadece PDF dosyaları, maks. 200MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="w-full" onClick={() => setIsUploadModalOpen(false)}>İptal</Button>
                  <Button type="submit" className="w-full bg-indigo-600" disabled={isUploading}>
                    {isUploading ? <><Loader2 size={18} className="animate-spin mr-2" /> Yükleniyor...</> : 'Yükle ve İşle'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PDF Önizleme Modalı */}
      <AnimatePresence>
        {previewBookUrl && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="bg-slate-800 p-4 flex justify-between items-center text-white shrink-0">
                <h3 className="font-bold text-lg flex items-center gap-2"><BookOpen size={20} /> PDF Önizleme</h3>
                <button onClick={() => setPreviewBookUrl(null)} className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 w-full bg-slate-200">
                <iframe 
                  src={previewBookUrl} 
                  className="w-full h-full border-none"
                  title="PDF Preview"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

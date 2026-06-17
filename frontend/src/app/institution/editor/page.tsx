// =============================================================================
// Institution Editor Page — İnteraktif PDF Editörü
// MOD-15: Kitap sayfalarına hotspot, video ve soru ekleme
// =============================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, HelpCircle, Link as LinkIcon, Save, X, Loader2, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui';
import api from '@/services/api';
import toast from 'react-hot-toast';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// react-pdf uses pdfjs-dist which requires browser APIs (DOMMatrix, canvas, etc.)
// Dynamic import prevents SSR evaluation
const Document = dynamic(
  () => import('react-pdf').then((mod) => {
    mod.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${mod.pdfjs.version}/build/pdf.worker.min.mjs`;
    return mod.Document;
  }),
  { ssr: false, loading: () => <Loader2 className="animate-spin text-slate-400" /> }
);
const PDFPage = dynamic(
  () => import('react-pdf').then((mod) => mod.Page),
  { ssr: false }
);

interface Hotspot {
  id: string | number;
  type: 'video' | 'question' | 'link';
  x: number; // Yüzde olarak (0-100)
  y: number; // Yüzde olarak
  width: number; // Yüzde olarak
  height: number; // Yüzde olarak
}

interface BookPage {
  id: number;
  page_number: number;
  image_url: string;
  hotspots: Hotspot[];
}

import { useSearchParams } from 'next/navigation';

export default function InstitutionEditorPage() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId') || 'latest';

  const [pages, setPages] = useState<BookPage[]>([]);
  const [activePage, setActivePage] = useState<BookPage | null>(null);
  const [bookData, setBookData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Çizim state'leri
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Modal state'i
  const [showModal, setShowModal] = useState(false);
  const [hotspotType, setHotspotType] = useState<'video' | 'question' | 'link'>('video');

  useEffect(() => {
    // Veritabanındaki kitabı çekiyoruz
    const fetchEditorData = async () => {
      try {
        const response = await api.get(`/editor/books/${bookId}/pages`);
        if (response.data?.status === 'success') {
          setPages(response.data.data.pages);
          setBookData(response.data.data.book);
          if (response.data.data.pages.length > 0) {
            setActivePage(response.data.data.pages[0]);
          }
        }
      } catch (error) {
        console.error('Editör verileri yüklenemedi:', error);
        toast.error('Editör verileri çekilemedi.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEditorData();
  }, [bookId]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setIsDrawing(true);
    setStartPos({ x, y });
    setCurrentBox({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !imageRef.current || !currentBox) return;
    const rect = imageRef.current.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    const x = Math.min(startPos.x, currentX);
    const y = Math.min(startPos.y, currentY);
    const w = Math.abs(currentX - startPos.x);
    const h = Math.abs(currentY - startPos.y);

    setCurrentBox({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Çok küçük bir alan çizildiyse iptal et
    if (currentBox && (currentBox.w < 2 || currentBox.h < 2)) {
      setCurrentBox(null);
      return;
    }

    setShowModal(true);
  };

  const saveHotspot = async () => {
    if (!currentBox || !activePage) return;

    try {
      const payload = {
        type: hotspotType,
        x: currentBox.x,
        y: currentBox.y,
        width: currentBox.w,
        height: currentBox.h
      };

      const response = await api.post(`/editor/pages/${activePage.id}/hotspots`, payload);
      if (response.data?.status === 'success') {
        toast.success('Hotspot başarıyla eklendi!');
        
        // Sayfanın hotspot listesini güncelle
        const newHotspot = response.data.data;
        setActivePage(prev => prev ? {...prev, hotspots: [...prev.hotspots, newHotspot]} : null);
        
        // Modal'ı kapat ve çizimi temizle
        setShowModal(false);
        setCurrentBox(null);
      }
    } catch (error) {
      toast.error('Hotspot eklenirken hata oluştu.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  const pdfUrl = bookData ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${bookData.pdf_url}` : null;

  return (
    <div className="flex h-[calc(100vh-120px)] -mx-4 -mt-2">
      {/* Sol Panel: Thumbnails */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto flex flex-col p-4 gap-4">
        <h2 className="font-bold text-slate-800 text-sm mb-2">Sayfalar</h2>
        {pages.map((page) => (
          <div 
            key={page.id}
            onClick={() => { setActivePage(page); setCurrentBox(null); }}
            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              activePage?.id === page.id ? 'border-indigo-500 shadow-md scale-105' : 'border-transparent hover:border-slate-300'
            }`}
          >
            <div className="relative pt-[141%] bg-slate-200 flex items-center justify-center overflow-hidden">
              {pdfUrl ? (
                <div className="absolute inset-0 origin-top flex items-start justify-center scale-[0.3]">
                  <Document file={pdfUrl}>
                    <PDFPage pageNumber={page.page_number} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
                  </Document>
                </div>
              ) : (
                <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400" />
              )}
              <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-1 z-10">
                Sayfa {page.page_number}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orta Panel: Editör Canvas */}
      <div className="flex-1 bg-slate-100 overflow-auto relative p-8 flex justify-center items-start">
        {activePage ? (
          <div className="relative shadow-2xl bg-white max-w-full">
            {/* Araç İpuçları */}
            <div className="absolute -top-12 left-0 right-0 text-center text-slate-500 text-sm font-medium">
              Sürükle bırak yaparak hotspot alanı çizin
            </div>

            {/* Görsel ve Etkileşim Katmanı */}
            <div 
              className="relative cursor-crosshair select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div 
                ref={imageRef}
                className="max-h-[80vh] w-auto pointer-events-none relative shadow-md bg-white flex items-center justify-center min-w-[400px] min-h-[500px]"
              >
                {pdfUrl ? (
                  <Document file={pdfUrl} loading={<Loader2 className="animate-spin text-slate-400" />}>
                    <PDFPage 
                      pageNumber={activePage.page_number} 
                      height={typeof window !== 'undefined' ? window.innerHeight * 0.8 : 700}
                      renderTextLayer={false} 
                      renderAnnotationLayer={false} 
                    />
                  </Document>
                ) : (
                  <div className="text-slate-400 p-20">PDF Bulunamadı</div>
                )}
              </div>

              {/* Varolan Hotspotlar */}
              {activePage.hotspots.map((hs) => (
                <div
                  key={hs.id}
                  className={`absolute border-2 flex items-center justify-center bg-white/20 backdrop-blur-[2px] transition-all hover:bg-white/40 ${
                    hs.type === 'video' ? 'border-rose-500 text-rose-600' :
                    hs.type === 'question' ? 'border-indigo-500 text-indigo-600' :
                    'border-emerald-500 text-emerald-600'
                  }`}
                  style={{
                    left: `${hs.x}%`,
                    top: `${hs.y}%`,
                    width: `${hs.width}%`,
                    height: `${hs.height}%`
                  }}
                >
                  {hs.type === 'video' && <PlayCircle size={24} className="drop-shadow-md" />}
                  {hs.type === 'question' && <HelpCircle size={24} className="drop-shadow-md" />}
                  {hs.type === 'link' && <LinkIcon size={24} className="drop-shadow-md" />}
                </div>
              ))}

              {/* Çizilen (Aktif) Hotspot Kutusu */}
              {currentBox && (
                <div
                  className="absolute border-2 border-dashed border-sky-500 bg-sky-500/20 pointer-events-none"
                  style={{
                    left: `${currentBox.x}%`,
                    top: `${currentBox.y}%`,
                    width: `${currentBox.w}%`,
                    height: `${currentBox.h}%`
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="m-auto text-slate-400 flex flex-col items-center">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <p>Seçili sayfa yok.</p>
          </div>
        )}
      </div>

      {/* Hotspot Modal */}
      <AnimatePresence>
        {showModal && currentBox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Hotspot Ekle</h3>
                <button onClick={() => { setShowModal(false); setCurrentBox(null); }} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <p className="text-sm text-slate-500">Seçtiğiniz alana tıklandığında ne olacağını seçin:</p>
                
                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={() => setHotspotType('video')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'video' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <PlayCircle size={28} className="mb-2" />
                    <span className="text-xs font-bold">Video</span>
                  </button>
                  <button 
                    onClick={() => setHotspotType('question')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'question' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <HelpCircle size={28} className="mb-2" />
                    <span className="text-xs font-bold">Soru</span>
                  </button>
                  <button 
                    onClick={() => setHotspotType('link')}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'link' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <LinkIcon size={28} className="mb-2" />
                    <span className="text-xs font-bold">Link</span>
                  </button>
                </div>

                <Button fullWidth onClick={saveHotspot} leftIcon={<Save size={18} />}>
                  Kaydet
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

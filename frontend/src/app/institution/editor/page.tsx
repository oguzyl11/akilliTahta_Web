// =============================================================================
// Institution Editor Page — İnteraktif PDF Editörü
// MOD-15: Kitap sayfalarına hotspot, video ve soru ekleme
// =============================================================================

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, HelpCircle, Link as LinkIcon, Save, X, Loader2, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
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
  payload?: any;
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
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Çizim state'leri
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Modal state'i
  const [showModal, setShowModal] = useState(false);
  const [hotspotType, setHotspotType] = useState<'video' | 'question' | 'link'>('video');
  const [hotspotPayload, setHotspotPayload] = useState<any>({});

  // Görüntüleme state'i
  const [viewingHotspot, setViewingHotspot] = useState<Hotspot | null>(null);

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

          // PDF'i authenticated API üzerinden blob olarak çek
          const bookInfo = response.data.data.book;
          if (bookInfo?.id) {
            try {
              const pdfResponse = await api.get(`/books/${bookInfo.id}/pdf`, {
                responseType: 'blob'
              });
              const blobUrl = URL.createObjectURL(pdfResponse.data);
              setPdfBlobUrl(blobUrl);
            } catch (pdfError) {
              console.error('PDF yüklenemedi:', pdfError);
              toast.error('PDF dosyası yüklenemedi.');
            }
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

    // Cleanup: blob URL'i serbest bırak
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
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
        height: currentBox.h,
        payload: hotspotPayload
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

  const currentIndex = pages.findIndex(p => p.id === activePage?.id);
  const handlePrevPage = () => {
    if (currentIndex > 0) setActivePage(pages[currentIndex - 1]);
    setCurrentBox(null);
  };
  const handleNextPage = () => {
    if (currentIndex < pages.length - 1) setActivePage(pages[currentIndex + 1]);
    setCurrentBox(null);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  const pdfUrl = pdfBlobUrl;

  return (
    <div className="flex h-[calc(100vh-120px)] -mx-4 -mt-2 relative">
      {/* Orta Panel: Editör Canvas */}
      <div className="flex-1 bg-slate-100 overflow-auto relative p-8 flex justify-center items-start pb-24">
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
                  onClick={(e) => { e.stopPropagation(); setViewingHotspot(hs); }}
                  className={`absolute border-2 flex items-center justify-center cursor-pointer bg-white/20 backdrop-blur-[2px] transition-all hover:bg-white/40 ${
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

      {/* Sayfalama (Pagination) Kontrolleri */}
      {pages.length > 0 && activePage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-2xl border border-slate-200 flex items-center gap-6 z-40">
          <button 
            onClick={handlePrevPage}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={24} className="text-slate-700" />
          </button>
          
          <div className="text-sm font-bold text-slate-600 min-w-[120px] text-center">
            Sayfa {activePage.page_number} <span className="font-normal text-slate-400">/ {pages.length}</span>
          </div>

          <button 
            onClick={handleNextPage}
            disabled={currentIndex === pages.length - 1}
            className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={24} className="text-slate-700" />
          </button>
        </div>
      )}

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
                    onClick={() => { setHotspotType('video'); setHotspotPayload({}); }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'video' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <PlayCircle size={28} className="mb-2" />
                    <span className="text-xs font-bold">Video</span>
                  </button>
                  <button 
                    onClick={() => { setHotspotType('question'); setHotspotPayload({}); }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'question' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <HelpCircle size={28} className="mb-2" />
                    <span className="text-xs font-bold">Soru</span>
                  </button>
                  <button 
                    onClick={() => { setHotspotType('link'); setHotspotPayload({}); }}
                    className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${hotspotType === 'link' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                  >
                    <LinkIcon size={28} className="mb-2" />
                    <span className="text-xs font-bold">Link</span>
                  </button>
                </div>

                {hotspotType === 'video' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Video URL (YouTube vb.)</label>
                    <input 
                      type="url" 
                      className="w-full p-3 border rounded-xl" 
                      placeholder="https://..."
                      value={hotspotPayload.url || ''}
                      onChange={e => setHotspotPayload({...hotspotPayload, url: e.target.value})}
                    />
                  </div>
                )}

                {hotspotType === 'link' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Hedef URL</label>
                    <input 
                      type="url" 
                      className="w-full p-3 border rounded-xl" 
                      placeholder="https://..."
                      value={hotspotPayload.url || ''}
                      onChange={e => setHotspotPayload({...hotspotPayload, url: e.target.value})}
                    />
                  </div>
                )}

                {hotspotType === 'question' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Doğru Cevap</label>
                      <div className="flex gap-2">
                        {['A', 'B', 'C', 'D', 'E'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setHotspotPayload({...hotspotPayload, answer: opt})}
                            className={`w-10 h-10 rounded-full font-bold transition-all ${hotspotPayload.answer === opt ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Çözüm / Açıklama (Opsiyonel)</label>
                      <textarea 
                        className="w-full p-3 border rounded-xl" 
                        rows={3}
                        placeholder="Öğrenci soruyu yanlış yaparsa bu açıklama gösterilebilir..."
                        value={hotspotPayload.solution || ''}
                        onChange={e => setHotspotPayload({...hotspotPayload, solution: e.target.value})}
                      />
                    </div>
                  </div>
                )}

                <Button fullWidth onClick={saveHotspot} leftIcon={<Save size={18} />}>
                  Kaydet
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hotspot Görüntüleme Modalı */}
      <AnimatePresence>
        {viewingHotspot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setViewingHotspot(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className={`p-4 text-white flex justify-between items-center ${
                viewingHotspot.type === 'video' ? 'bg-rose-500' :
                viewingHotspot.type === 'question' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  {viewingHotspot.type === 'video' && <PlayCircle size={20} />}
                  {viewingHotspot.type === 'question' && <HelpCircle size={20} />}
                  {viewingHotspot.type === 'link' && <LinkIcon size={20} />}
                  Hotspot Detayı
                </h3>
                <button onClick={() => setViewingHotspot(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {viewingHotspot.type === 'video' && (
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Video URL</p>
                    <a href={viewingHotspot.payload?.url} target="_blank" rel="noreferrer" className="text-rose-600 font-medium break-all hover:underline">
                      {viewingHotspot.payload?.url || 'URL belirtilmemiş'}
                    </a>
                  </div>
                )}
                {viewingHotspot.type === 'link' && (
                  <div>
                    <p className="text-sm font-semibold text-slate-500 mb-1">Bağlantı</p>
                    <a href={viewingHotspot.payload?.url} target="_blank" rel="noreferrer" className="text-emerald-600 font-medium break-all hover:underline">
                      {viewingHotspot.payload?.url || 'URL belirtilmemiş'}
                    </a>
                  </div>
                )}
                {viewingHotspot.type === 'question' && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1">Doğru Cevap</p>
                      <div className="inline-flex w-12 h-12 bg-indigo-100 text-indigo-700 rounded-full items-center justify-center font-bold text-xl">
                        {viewingHotspot.payload?.answer || '?'}
                      </div>
                    </div>
                    {viewingHotspot.payload?.solution && (
                      <div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Çözüm Açıklaması</p>
                        <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm border border-slate-100">
                          {viewingHotspot.payload.solution}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

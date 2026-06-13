// =============================================================================
// Editor Page — Dijital Eğitim Platformu İçerik Editörü Ana Ekranı
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui';
import { Edit3, ArrowLeft, Save, FileCheck2 } from 'lucide-react';
import { PdfUploader } from '@/components/features/editor/PdfUploader';
import { CanvasEditor, Hotspot } from '@/components/features/editor/CanvasEditor';
import { HotspotPropertiesPanel } from '@/components/features/editor/HotspotPropertiesPanel';
import toast from 'react-hot-toast';

type EditorStage = 'UPLOAD' | 'EDIT';

export default function EditorPage() {
  const [stage, setStage] = useState<EditorStage>('UPLOAD');
  const [file, setFile] = useState<File | null>(null);
  
  // Çizilen Alanların State'i
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);

  const handleUploadSuccess = (uploadedFile: File) => {
    setFile(uploadedFile);
    setStage('EDIT');
    toast.success('PDF başarıyla yüklendi. Çizime başlayabilirsiniz.');
  };

  const handleReset = () => {
    if (hotspots.length > 0) {
      if (!window.confirm('Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin misiniz?')) {
        return;
      }
    }
    setFile(null);
    setHotspots([]);
    setSelectedHotspotId(null);
    setStage('UPLOAD');
  };

  const handleSave = () => {
    // Burada ileride Backend (Python FastAPI) endpoint'ine veri gönderilecek
    console.log('Kaydedilecek Dosya:', file?.name);
    console.log('Çizilen Alanlar (Hotspots):', hotspots);
    toast.success(`${hotspots.length} adet etkileşim alanı başarıyla kaydedildi!`);
  };

  const handleDeleteHotspot = (id: string) => {
    setHotspots((prev) => prev.filter((h) => h.id !== id));
    if (selectedHotspotId === id) {
      setSelectedHotspotId(null);
    }
  };

  const selectedHotspot = hotspots.find((h) => h.id === selectedHotspotId) || null;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end flex-shrink-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Edit3 className="text-indigo-500" />
            İçerik Editörü
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {stage === 'UPLOAD' 
              ? 'Ders materyallerinizi PDF formatında yükleyin.' 
              : 'Sayfa üzerinde fare ile sürükleyerek tıklanabilir alanlar çizin.'}
          </p>
        </motion.div>

        {stage === 'EDIT' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex gap-3"
          >
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <ArrowLeft size={16} />
              Yeni Dosya
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save size={16} />
              Kaydet
            </Button>
          </motion.div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative bg-slate-900/50 rounded-3xl border border-slate-700/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 'UPLOAD' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center p-6"
            >
              <PdfUploader onUploadSuccess={handleUploadSuccess} />
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex"
            >
              {/* Canvas Editor */}
              <div className="flex-1 p-4">
                {/* Gelecekte Python servisi PDF'i WebP resimlerine çevirdiğinde arka plan resmi olarak buraya verilecek */}
                <CanvasEditor
                  hotspots={hotspots}
                  onHotspotsChange={setHotspots}
                  selectedId={selectedHotspotId}
                  onSelect={setSelectedHotspotId}
                />
              </div>

              {/* Properties Panel (Eğer bir dosya seçildiyse) */}
              <HotspotPropertiesPanel
                hotspot={selectedHotspot}
                onChange={(updated) => {
                  setHotspots((prev) => prev.map((h) => h.id === updated.id ? updated : h));
                }}
                onDelete={handleDeleteHotspot}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      {stage === 'EDIT' && (
        <div className="flex-shrink-0 flex items-center justify-between text-xs text-slate-500 px-2">
          <div className="flex items-center gap-2">
            <FileCheck2 size={14} className="text-emerald-500" />
            <span className="text-slate-300 font-medium">{file?.name}</span>
          </div>
          <div>
            Toplam <span className="font-medium text-indigo-400">{hotspots.length}</span> etkileşim alanı tanımlandı.
          </div>
        </div>
      )}
    </div>
  );
}

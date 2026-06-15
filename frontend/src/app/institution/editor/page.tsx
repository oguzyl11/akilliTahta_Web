// =============================================================================
// Institution Editor Page — İçerik Editörü 
// MOD-15: PDF zenginleştirme editörü için placeholder
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui';

export default function InstitutionEditorPage() {
  return (
    <div className="h-[calc(100vh-120px)] w-full bg-white/50 backdrop-blur-sm border border-slate-200 border-dashed rounded-3xl flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
          <Edit3 size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">İnteraktif İçerik Editörü</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Bu alan, yüklediğiniz PDF kitaplarını interaktif hale getireceğiniz (videolar, testler ve hotspotlar ekleyeceğiniz) gelişmiş bir Canvas editörüne dönüştürülecektir. Çok yakında!
        </p>
        <Button leftIcon={<Sparkles size={18} />} className="bg-indigo-600 hover:bg-indigo-700 mx-auto" disabled>
          Editörü Başlat
        </Button>
      </motion.div>
    </div>
  );
}

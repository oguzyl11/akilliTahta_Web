// =============================================================================
// HotspotPropertiesPanel Component — İçerik Editörü
// =============================================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Button, Select } from '@/components/ui';
import { Settings2, Trash2, Link as LinkIcon, HelpCircle, Video, FileText } from 'lucide-react';
import type { Hotspot } from './CanvasEditor';

interface HotspotPropertiesPanelProps {
  hotspot: Hotspot | null;
  onChange: (updated: Hotspot) => void;
  onDelete: (id: string) => void;
}

const hotspotTypes = [
  { value: 'QUESTION', label: 'Soru (Test)', icon: HelpCircle },
  { value: 'VIDEO', label: 'Video Bağlantısı', icon: Video },
  { value: 'NOTE', label: 'Bilgi Notu', icon: FileText },
  { value: 'LINK', label: 'Dış Bağlantı', icon: LinkIcon },
];

export function HotspotPropertiesPanel({ hotspot, onChange, onDelete }: HotspotPropertiesPanelProps) {
  if (!hotspot) {
    return (
      <div className="w-80 h-full bg-slate-800/80 backdrop-blur-xl border-l border-slate-700/50 p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4 text-slate-500 shadow-inner">
          <Settings2 size={32} />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">Özellikler</h3>
        <p className="text-sm text-slate-500">
          Düzenlemek için sayfadaki bir alanı seçin veya farenizle yeni bir alan çizin.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hotspot.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="w-80 h-full bg-slate-800/80 backdrop-blur-xl border-l border-slate-700/50 flex flex-col"
      >
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-900/30">
          <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
            <Settings2 size={18} className="text-indigo-400" />
            Alan Özellikleri
          </h3>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
            ID: {hotspot.id.substring(0, 8)}
          </span>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-5 scrollbar-thin">
          {/* Tür Seçimi */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-3">Etkileşim Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {hotspotTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = hotspot.type === type.value || (!hotspot.type && type.value === 'NOTE');
                
                return (
                  <button
                    key={type.value}
                    onClick={() => onChange({ ...hotspot, type: type.value as any })}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-700/50" />

          {/* Temel Ayarlar */}
          <div className="space-y-4">
            <Input
              label="Alan Etiketi (Opsiyonel)"
              placeholder="Örn: Soru 1"
              value={hotspot.label || ''}
              onChange={(e) => onChange({ ...hotspot, label: e.target.value })}
            />

            {/* Türüne göre dinamik alanlar */}
            {hotspot.type === 'QUESTION' && (
              <Select
                label="Bağlı Soru (Soru Bankasından)"
                options={[
                  { value: '', label: 'Soru Seçiniz...' },
                  { value: 'q1', label: 'Matematik 1. Soru' },
                  { value: 'q2', label: 'Matematik 2. Soru' },
                ]}
                value=""
                onChange={() => {}}
              />
            )}

            {hotspot.type === 'VIDEO' && (
              <Input
                label="Video URL (YouTube vb.)"
                placeholder="https://..."
              />
            )}

            {hotspot.type === 'NOTE' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Açıklama / Not</label>
                <textarea 
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none h-24"
                  placeholder="Kullanıcı bu alana tıkladığında görünecek not..."
                />
              </div>
            )}
          </div>

          <div className="h-px bg-slate-700/50" />

          {/* Boyutlar & Pozisyon (Salt Okunur / Debug) */}
          <div className="grid grid-cols-2 gap-3 opacity-60 pointer-events-none">
            <Input label="X Konumu" value={Math.round(hotspot.x)} readOnly />
            <Input label="Y Konumu" value={Math.round(hotspot.y)} readOnly />
            <Input label="Genişlik" value={Math.round(hotspot.width)} readOnly />
            <Input label="Yükseklik" value={Math.round(hotspot.height)} readOnly />
          </div>
        </div>

        {/* Alt İşlemler */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-900/30">
          <Button 
            variant="outline" 
            className="w-full gap-2 border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
            onClick={() => onDelete(hotspot.id)}
          >
            <Trash2 size={16} />
            Alanı Sil
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

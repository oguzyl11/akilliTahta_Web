// =============================================================================
// Admin Settings Page — Global Sistem Ayarları
// MOD-22: Global parametreler
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Database, Globe } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Global Ayarlar</h1>
        <p className="text-slate-500 mt-1 text-sm">Platformun temel çalışma prensiplerini belirleyin.</p>
      </motion.div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Globe size={20} className="text-indigo-500" /> API Konfigürasyonu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Base URL" defaultValue="https://api.akillitahta.com/v1" />
          <Input label="WebSocket Server" defaultValue="wss://ws.akillitahta.com" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 pt-4 border-t border-slate-100">
          <Database size={20} className="text-emerald-500" /> Depolama Limitleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Maksimum PDF Boyutu (MB)" defaultValue="200" type="number" />
          <Input label="Kurum Başına Depolama (GB)" defaultValue="500" type="number" />
        </div>

        <div className="pt-6 border-t border-slate-100 flex justify-end">
          <Button leftIcon={<Save size={18} />}>Değişiklikleri Kaydet</Button>
        </div>
      </div>
    </div>
  );
}

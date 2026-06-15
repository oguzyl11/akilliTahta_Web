// =============================================================================
// Admin System Page — Sistem Metrikleri
// MOD-21: Sunucu sağlığı ve loglar
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Server, Activity, HardDrive, Cpu } from 'lucide-react';
import { StatCard } from '@/components/ui';

export default function AdminSystemPage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Sistem Durumu</h1>
        <p className="text-slate-500 mt-1 text-sm">Sunucu kaynakları, veritabanı durumu ve servis metrikleri.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="CPU Kullanımı" value="%24" icon={Cpu} color="indigo" />
        <StatCard title="RAM Durumu" value="12 GB / 32 GB" icon={HardDrive} color="emerald" />
        <StatCard title="Ağ Trafiği" value="450 Mbps" icon={Activity} color="amber" />
        <StatCard title="Veritabanı Yükü" value="Orta" icon={Server} color="rose" />
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-slate-400 font-mono text-sm ml-2">server-logs.sh</span>
        </div>
        <div className="font-mono text-xs text-emerald-400 space-y-1">
          <p>[INFO] 18:20:01 - POST /api/v1/auth/login 200 OK</p>
          <p>[INFO] 18:20:05 - GET /api/v1/dashboard/stats 200 OK</p>
          <p className="text-slate-500">[DEBUG] 18:21:12 - Cache refreshed for class_stats:42</p>
          <p>[INFO] 18:22:00 - Websocket connected: client_102</p>
        </div>
      </div>
    </div>
  );
}

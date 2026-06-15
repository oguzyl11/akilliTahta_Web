// =============================================================================
// Parent Notifications Page — Bildirimler
// MOD-24: Veli için sistem ve okul bildirimleri
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertCircle, FileText, CheckCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui';

export default function ParentNotificationsPage() {
  const notifications = [
    { id: '1', type: 'alert', title: 'Ödev Gecikmesi', message: 'Ege Yılmaz Matematik ödevini zamanında teslim etmedi.', time: '2 saat önce', isRead: false },
    { id: '2', type: 'info', title: 'Yeni Kitap Atandı', message: 'Defne Yılmaz için Fen Bilimleri okuma kitabı atandı.', time: 'Dün', isRead: true },
    { id: '3', type: 'event', title: 'Veli Toplantısı', message: '11-A Sınıfı veli toplantısı 20 Haziran saat 14:00\'te yapılacaktır.', time: '2 gün önce', isRead: true },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'alert': return <AlertCircle className="text-rose-500" />;
      case 'info': return <FileText className="text-sky-500" />;
      case 'event': return <Calendar className="text-indigo-500" />;
      default: return <Bell className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-end justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-slate-800">Bildirimler</h1>
          <p className="text-slate-500 mt-1 text-sm">Okuldan ve öğretmenlerden gelen önemli güncellemeler.</p>
        </motion.div>
        <Button variant="outline" size="sm" leftIcon={<CheckCircle size={16} />}>Tümünü Okundu İşaretle</Button>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {notifications.map((note, idx) => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-5 flex gap-4 transition-colors hover:bg-slate-50 ${!note.isRead ? 'bg-indigo-50/30' : ''}`}
            >
              <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${
                note.type === 'alert' ? 'bg-rose-50' : 
                note.type === 'info' ? 'bg-sky-50' : 'bg-indigo-50'
              }`}>
                {getIcon(note.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${!note.isRead ? 'text-slate-800' : 'text-slate-600'}`}>{note.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{note.time}</span>
                </div>
                <p className={`text-sm ${!note.isRead ? 'text-slate-600' : 'text-slate-500'}`}>{note.message}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

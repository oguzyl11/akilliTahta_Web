// =============================================================================
// Institution Settings Page — Kurumsal Ayarlar
// MOD-17: Logo, tema ve kurumsal bilgiler
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Building2, PaintBucket, ShieldCheck, Save, Upload } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import toast from 'react-hot-toast';

export default function InstitutionSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: 'Demo Eğitim Kurumu',
    email: 'info@demo.edu.tr',
    phone: '+90 555 123 4567',
    primaryColor: '#4f46e5', // indigo-600
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Kurumsal ayarlar kaydedildi!');
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800">Kurumsal Ayarlar</h1>
        <p className="text-slate-500 mt-1 text-sm">Okul bilgileri ve marka özelleştirmelerini yönetin.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sol Menü / Bilgi Alanı */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 space-y-4"
        >
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5">
            <h3 className="font-semibold text-indigo-800 flex items-center gap-2 mb-2">
              <ShieldCheck size={18} />
              Premium Lisans
            </h3>
            <p className="text-sm text-indigo-600/80 mb-4">
              Lisansınızın bitiş tarihine <strong>245 gün</strong> kaldı. 500 öğrenci kapasitesinin 425'i dolu.
            </p>
            <Button variant="outline" className="w-full bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50">
              Lisansı Yenile
            </Button>
          </div>
        </motion.div>

        {/* Ayar Formu */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Genel Bilgiler */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-sky-500" />
              Genel Bilgiler
            </h3>
            <form className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 mb-6">
                {/* Logo Upload Mock */}
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
                  <Upload size={24} className="mb-1" />
                  <span className="text-[10px] font-medium">Logo Yükle</span>
                </div>
                <div className="flex-1 space-y-4">
                  <Input 
                    label="Kurum Adı"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="İletişim E-posta"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <Input 
                  label="İletişim Telefon"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </form>
          </div>

          {/* Marka Özelleştirme */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <PaintBucket size={20} className="text-pink-500" />
              Marka ve Tema Özelleştirme
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Ana Kurum Rengi (Öğrencilerde görünür)</label>
                <div className="flex items-center gap-4">
                  <input 
                    type="color" 
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                    className="w-12 h-12 rounded-xl border border-slate-200 p-1 cursor-pointer"
                  />
                  <div className="flex-1">
                    <Input value={formData.primaryColor} readOnly />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
              <Button onClick={handleSave} isLoading={isLoading} leftIcon={<Save size={18} />}>
                Ayarları Kaydet
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// =============================================================================
// Student Profile Page — Öğrenci Profil
// MOD-06: Hesap ayarları, bildirim tercihleri ve güvenlik
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Bell, Camera, Shield, Save } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  // Mock form state
  const [formData, setFormData] = useState({
    name: user?.name || 'Örnek Öğrenci',
    email: user?.email || 'ogrenci@demo.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock save delay
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Profil bilgileriniz güncellendi!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-slate-800">Profil Ayarları</h1>
        <p className="text-slate-500 mt-1 text-sm">Hesap bilgilerini ve tercihlerini buradan yönetebilirsin.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon: Avatar & Özet */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          {/* Avatar Kartı */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4 group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/25">
                {formData.name.charAt(0)}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{formData.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.role === 'STUDENT' ? 'Öğrenci' : 'Kullanıcı'}</p>
            <div className="w-full pt-4 border-t border-slate-100 flex justify-center gap-4 text-sm text-slate-600">
              <div className="flex flex-col items-center">
                <span className="font-bold text-slate-800">11-A</span>
                <span className="text-xs">Sınıf</span>
              </div>
              <div className="w-px h-8 bg-slate-200" />
              <div className="flex flex-col items-center">
                <span className="font-bold text-slate-800">324</span>
                <span className="text-xs">Okul No</span>
              </div>
            </div>
          </div>

          {/* Güvenlik Özeti */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-emerald-500" size={24} />
              <h3 className="font-semibold text-emerald-800">Hesap Güvenli</h3>
            </div>
            <p className="text-sm text-emerald-600/80">
              Son şifre değişikliği: 2 ay önce
            </p>
          </div>
        </motion.div>

        {/* Sağ Kolon: Formlar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Kişisel Bilgiler */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-500" />
              Kişisel Bilgiler
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Ad Soyad"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  leftIcon={<User size={18} />}
                />
                <Input 
                  label="E-posta Adresi"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  leftIcon={<Mail size={18} />}
                  disabled // E-posta okul tarafından belirlenir (genellikle)
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={handleSave} isLoading={isLoading} leftIcon={<Save size={18} />}>
                  Değişiklikleri Kaydet
                </Button>
              </div>
            </form>
          </div>

          {/* Şifre Değiştirme */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Lock size={20} className="text-rose-500" />
              Şifre Değiştir
            </h3>
            <form className="space-y-4">
              <Input 
                label="Mevcut Şifre"
                type="password"
                placeholder="••••••••"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Yeni Şifre"
                  type="password"
                  placeholder="••••••••"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                />
                <Input 
                  label="Yeni Şifre (Tekrar)"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={(e) => { e.preventDefault(); toast.success('Şifre güncellendi!'); }}>
                  Şifreyi Güncelle
                </Button>
              </div>
            </form>
          </div>

          {/* Bildirim Tercihleri */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-amber-500" />
              Bildirim Tercihleri
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Yeni Ödev Bildirimleri', desc: 'Öğretmen yeni ödev atadığında bana e-posta gönder.' },
                { title: 'Sistem Duyuruları', desc: 'Sistem güncellemeleri ve bakım çalışmalarından haberdar ol.' },
                { title: 'Başarı ve Rozetler', desc: 'Yeni bir rozet kazandığımda bildirim al.' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="mt-0.5">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

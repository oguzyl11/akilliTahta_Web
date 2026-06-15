// =============================================================================
// Parent Profile Page — Veli Profil
// MOD-26: Veli iletişim ve hesap bilgileri
// =============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Phone } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

export default function ParentProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-2xl font-bold text-slate-800">Profil Ayarları</h1>
        <p className="text-slate-500 mt-1 text-sm">İletişim bilgilerinizi güncel tutun.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-6 shadow-sm"
      >
        <form className="space-y-4">
          <Input 
            label="Ad Soyad"
            defaultValue={user?.name || 'Örnek Veli'}
            leftIcon={<User size={18} />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="E-posta Adresi"
              type="email"
              defaultValue={user?.email || 'veli@demo.com'}
              leftIcon={<Mail size={18} />}
            />
            <Input 
              label="Telefon Numarası"
              type="tel"
              defaultValue="0555 123 4567"
              leftIcon={<Phone size={18} />}
            />
          </div>
          <div className="pt-4 flex justify-end border-t border-slate-100">
            <Button leftIcon={<Save size={18} />}>Kaydet</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

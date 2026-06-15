// =============================================================================
// Forgot Password Page — Dijital Eğitim Platformu
// MOD-02: Şifre sıfırlama — token 60 dakika geçerli
// =============================================================================

'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import authService from '@/services/authService';
import { BookOpen, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('E-posta adresi gereklidir.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword({ email });
      setIsSent(true);
      toast.success('Şifre sıfırlama bağlantısı gönderildi!');
    } catch {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-slate-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-50" />
      <div className="absolute inset-0 bg-dot-pattern opacity-40" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25 animate-pulse-glow">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Dijital Eğitim</h1>
            <p className="text-[10px] text-slate-500">Platformu</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-indigo-500/5 animate-slide-up bg-white/80">
          {isSent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">E-posta Gönderildi</h2>
              <p className="text-sm text-slate-600 mb-6">
                <strong className="text-slate-800">{email}</strong> adresine şifre sıfırlama 
                bağlantısı gönderdik. Bağlantı <strong className="text-indigo-600">60 dakika</strong> geçerlidir.
              </p>
              <Link href="/login">
                <Button variant="outline" leftIcon={<ArrowLeft size={16} />}>
                  Giriş Sayfasına Dön
                </Button>
              </Link>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Şifremi Unuttum</h2>
                <p className="text-sm text-slate-500">
                  E-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="E-posta Adresi"
                  type="email"
                  placeholder="ornek@okul.edu.tr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={error}
                  leftIcon={<Mail size={18} />}
                  autoFocus
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                >
                  Sıfırlama Bağlantısı Gönder
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                >
                  <ArrowLeft size={14} />
                  Giriş sayfasına dön
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

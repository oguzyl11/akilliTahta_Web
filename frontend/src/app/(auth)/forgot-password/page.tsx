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
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <BookOpen size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Dijital Eğitim</h1>
            <p className="text-[10px] text-indigo-300/70">Platformu</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/20 animate-slide-up">
          {isSent ? (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">E-posta Gönderildi</h2>
              <p className="text-sm text-slate-400 mb-6">
                <strong className="text-slate-300">{email}</strong> adresine şifre sıfırlama 
                bağlantısı gönderdik. Bağlantı <strong className="text-indigo-400">60 dakika</strong> geçerlidir.
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
                <h2 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h2>
                <p className="text-sm text-slate-400">
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
                  className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
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

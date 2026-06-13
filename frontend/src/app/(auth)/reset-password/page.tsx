// =============================================================================
// Reset Password Page — Dijital Eğitim Platformu
// MOD-02: Şifre sıfırlama (token doğrulama)
// =============================================================================

'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, PageLoader } from '@/components/ui';
import authService from '@/services/authService';
import { BookOpen, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Eğer URL'de token veya email yoksa
  if (!token || !email) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
          <Lock size={32} className="text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Geçersiz Bağlantı</h2>
        <p className="text-sm text-slate-400 mb-6">
          Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş olabilir. Lütfen yeni bir bağlantı talep edin.
        </p>
        <Link href="/forgot-password">
          <Button fullWidth>Yeni Bağlantı İste</Button>
        </Link>
      </div>
    );
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'Şifre gereklidir.';
    } else if (password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır.';
    }

    if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = 'Şifreler eşleşmiyor.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        email: email as string,
        token: token as string,
        password,
        password_confirmation: passwordConfirmation,
      });
      setIsSuccess(true);
      toast.success('Şifreniz başarıyla sıfırlandı.');
    } catch {
      toast.error('Şifre sıfırlama başarısız oldu. Bağlantının süresi dolmuş olabilir.');
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Şifreniz Sıfırlandı</h2>
        <p className="text-sm text-slate-400 mb-6">
          Yeni şifrenizle hesabınıza güvenle giriş yapabilirsiniz.
        </p>
        <Link href="/login">
          <Button fullWidth rightIcon={<ArrowRight size={18} />}>
            Giriş Yap
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Yeni Şifre Oluştur</h2>
        <p className="text-sm text-slate-400">
          Lütfen hesabınız için yeni bir şifre belirleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Yeni Şifre"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          error={errors.password}
          leftIcon={<Lock size={18} />}
          autoFocus
        />

        <Input
          label="Yeni Şifre (Tekrar)"
          type="password"
          placeholder="••••••••"
          value={passwordConfirmation}
          onChange={(e) => {
            setPasswordConfirmation(e.target.value);
            if (errors.passwordConfirmation) setErrors((prev) => ({ ...prev, passwordConfirmation: '' }));
          }}
          error={errors.passwordConfirmation}
          leftIcon={<Lock size={18} />}
        />

        <Button
          type="submit"
          fullWidth
          size="lg"
          isLoading={isLoading}
        >
          Şifreyi Güncelle
        </Button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
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
          <Suspense fallback={<PageLoader message="Bağlantı kontrol ediliyor..." />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

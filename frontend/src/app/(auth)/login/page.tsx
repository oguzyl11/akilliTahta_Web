// =============================================================================
// Login Page — Dijital Eğitim Platformu
// MOD-02: Multi-role authentication, kuruma özel branding
// Premium dark UI with glassmorphism
// =============================================================================

'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { BookOpen, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  /** Form doğrulama — ENGINEERING_STANDARDS: Guard clause */
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!email.trim()) {
      errors.email = 'E-posta adresi gereklidir.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Geçerli bir e-posta adresi giriniz.';
    }

    if (!password) {
      errors.password = 'Şifre gereklidir.';
    } else if (password.length < 6) {
      errors.password = 'Şifre en az 6 karakter olmalıdır.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /** Form gönderimi */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      const dashboardPath = await login({ email, password, rememberMe });
      toast.success('Giriş başarılı! Yönlendiriliyorsunuz...');
      router.push(dashboardPath);
    } catch {
      toast.error('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />

        {/* Floating decorative orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-sky-500/6 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-pulse-glow">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Dijital Eğitim</h1>
              <p className="text-xs text-indigo-300/70">Platformu</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              <span className="text-white">Eğitimi </span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                dijitalleştirin
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              PDF kitaplarınızı interaktif içeriğe dönüştürün. Ödev oluşturun, 
              öğrenci performansını takip edin ve velileri bilgilendirin.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="mt-12 space-y-4 stagger-children">
            {[
              { icon: '📚', text: 'Interaktif PDF kitaplar ve içerik editörü' },
              { icon: '📝', text: 'Otomatik puanlama ile ödev sistemi' },
              { icon: '📊', text: 'Detaylı analitik ve performans raporları' },
              { icon: '🏫', text: 'Çok kiracılı okul yönetim altyapısı' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 rounded-xl glass glass-hover transition-all duration-300"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Dijital Eğitim</h1>
              <p className="text-[10px] text-indigo-300/70">Platformu</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass rounded-3xl p-8 shadow-2xl shadow-black/20 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Hoş Geldiniz</h2>
              <p className="text-sm text-slate-400">
                Hesabınıza giriş yaparak devam edin
              </p>
            </div>

            {/* API Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="E-posta Adresi"
                type="email"
                placeholder="ornek@okul.edu.tr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationErrors.email) {
                    setValidationErrors((prev) => ({ ...prev, email: '' }));
                  }
                }}
                error={validationErrors.email}
                leftIcon={<Mail size={18} />}
                autoComplete="email"
                autoFocus
              />

              <Input
                label="Şifre"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                error={validationErrors.password}
                leftIcon={<Lock size={18} />}
                autoComplete="current-password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    Beni hatırla
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Şifremi unuttum
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight size={18} />}
              >
                Giriş Yap
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-slate-500 bg-[#1e293b]/80">
                  Demo Hesapları
                </span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'Öğrenci', email: 'ogrenci@demo.com', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400' },
                { role: 'Öğretmen', email: 'ogretmen@demo.com', color: 'from-sky-500/10 to-blue-500/10 border-sky-500/20 text-sky-400' },
                { role: 'Veli', email: 'veli@demo.com', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400' },
                { role: 'Yönetici', email: 'admin@demo.com', color: 'from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 text-purple-400' },
              ].map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword('demo1234');
                    clearError();
                    setValidationErrors({});
                  }}
                  className={`px-3 py-2 rounded-xl bg-gradient-to-r ${demo.color} border text-xs font-medium hover:scale-[1.02] transition-all duration-200`}
                >
                  {demo.role}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            © 2025 Dijital Eğitim Platformu. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}

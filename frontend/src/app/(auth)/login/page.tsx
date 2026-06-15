// =============================================================================
// Login Page — Dijital Eğitim Platformu
// MOD-02: Multi-role authentication, kuruma özel branding
// Premium Light UI with student-friendly vibrant design
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
    <div className="min-h-screen flex bg-slate-50">
      {/* Left — Branding Section */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-white shadow-2xl shadow-indigo-500/5">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />

        {/* Floating decorative orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25 animate-pulse-glow">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Dijital Eğitim</h1>
              <p className="text-xs text-slate-500">Platformu</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="space-y-6 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              <span className="text-slate-800">Eğitimi </span>
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                dijitalleştirin
              </span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 shadow-sm transition-all duration-300 hover:shadow-md hover:bg-white/90"
              >
                <span className="text-xl">{feature.icon}</span>
                <span className="text-sm font-medium text-slate-700">{feature.text}</span>
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/25">
              <BookOpen size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Dijital Eğitim</h1>
              <p className="text-[10px] text-slate-500">Platformu</p>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass rounded-3xl p-8 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Hoş Geldiniz</h2>
              <p className="text-sm text-slate-500">
                Hesabınıza giriş yaparak devam edin
              </p>
            </div>

            {/* API Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 animate-fade-in">
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
                    className="w-4 h-4 rounded border-slate-300 bg-white text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
                    Beni hatırla
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
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
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-slate-500 bg-white">
                  Demo Hesapları
                </span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'Öğrenci', email: 'ogrenci@demo.com', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200 text-emerald-700 hover:bg-emerald-50' },
                { role: 'Öğretmen', email: 'ogretmen@demo.com', color: 'from-sky-500/10 to-blue-500/10 border-sky-200 text-sky-700 hover:bg-sky-50' },
                { role: 'Kurum Yöneticisi', email: 'yonetici@demo.com', color: 'from-amber-500/10 to-orange-500/10 border-amber-200 text-amber-700 hover:bg-amber-50' },
                { role: 'Süper Admin', email: 'admin@akillitahta.com', color: 'from-purple-500/10 to-fuchsia-500/10 border-purple-200 text-purple-700 hover:bg-purple-50' },
              ].map((demo) => (
                 <button
                  key={demo.role}
                  type="button"
                  onClick={() => {
                    setEmail(demo.email);
                    setPassword('12345678');
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
          <p className="text-center text-xs text-slate-500 mt-6">
            © 2025 Dijital Eğitim Platformu. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Navbar Component — Dijital Eğitim Platformu
// =============================================================================

'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/helpers';
import { useAuthStore } from '@/stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Badge } from '@/components/ui';
import { Bell, Search, Menu, X, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { ROLE_LABELS } from '@/utils/constants';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

/**
 * Navbar — Üst navigasyon çubuğu.
 * Arama, bildirimler, profil dropdown.
 */
export function Navbar({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left — Mobile menu & Search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 w-72 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-400/30 transition-all shadow-sm shadow-black/5">
            <Search size={16} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Ara..."
              className="bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none w-full"
            />
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white rounded border border-slate-200 shadow-sm">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right — Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <Bell size={20} />
              {/* Unread indicator */}
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl shadow-black/10 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-semibold text-slate-800">Bildirimler</h3>
                    <Badge variant="info">3 yeni</Badge>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {/* Sample notifications */}
                    {[
                      { title: 'Yeni ödev atandı', body: 'Matematik - Bölüm 3 ödevi atandı.', time: '5 dk önce', unread: true },
                      { title: 'Test sonucu', body: 'Fen Bilimleri testinden 85 puan aldınız.', time: '1 saat önce', unread: true },
                      { title: 'Kitap eklendi', body: 'Türkçe 8. Sınıf kitabı kütüphanenize eklendi.', time: '3 saat önce', unread: false },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className={cn(
                          'px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors',
                          notif.unread && 'bg-indigo-50/50'
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {notif.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{notif.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{notif.body}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 text-center border-t border-slate-100 bg-slate-50/50">
                    <button className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors">
                      Tümünü görüntüle
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Separator */}
          <div className="w-px h-8 bg-slate-200 mx-1" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500">{roleLabel}</p>
              </div>
              <ChevronDown
                size={14}
                className={cn(
                  'text-slate-400 transition-transform duration-200',
                  isProfileOpen && 'rotate-180'
                )}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl shadow-black/10 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <p className="text-sm font-medium text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                      <User size={16} className="text-slate-400" />
                      Profil
                    </button>
                    <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors">
                      <Settings size={16} className="text-slate-400" />
                      Ayarlar
                    </button>
                  </div>
                  <div className="border-t border-slate-100 py-1">
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} />
                      Çıkış Yap
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

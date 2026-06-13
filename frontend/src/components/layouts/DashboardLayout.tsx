// =============================================================================
// Dashboard Layout — Dijital Eğitim Platformu
// Ortak layout: Sidebar + Navbar + Main content area
// Tüm rol panelleri bu layout'u kullanır (DRY)
// =============================================================================

'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/helpers';
import { Sidebar } from '@/components/common/Sidebar';
import { Navbar } from '@/components/common/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout — Sidebar + Navbar + Content.
 * Responsive: Mobilde sidebar drawer, masaüstünde sabit.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0e1a] bg-mesh-gradient">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'transition-all duration-300 ease-out',
          'ml-0 lg:ml-[260px]' // sidebar genişliği
        )}
      >
        <Navbar
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isMobileMenuOpen={isMobileMenuOpen}
        />

        <main className="p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

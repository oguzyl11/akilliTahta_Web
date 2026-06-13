// =============================================================================
// Auth Layout — Dijital Eğitim Platformu
// =============================================================================

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-auth-gradient bg-grid-pattern">
      {children}
    </div>
  );
}

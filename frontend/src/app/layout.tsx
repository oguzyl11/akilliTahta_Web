// =============================================================================
// Root Layout — Dijital Eğitim Platformu
// =============================================================================

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Dijital Eğitim Platformu',
    template: '%s | Dijital Eğitim Platformu',
  },
  description:
    'Çok kiracılı eğitim yönetim sistemi — PDF kitapları interaktif içeriğe dönüştürün, ödev oluşturun, öğrenci takibi yapın.',
  keywords: ['eğitim', 'dijital', 'platform', 'öğrenci', 'öğretmen', 'okul'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-[#0a0e1a] text-slate-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

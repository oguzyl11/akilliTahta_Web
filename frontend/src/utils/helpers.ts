// =============================================================================
// Utility Helpers — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS 1.1 DRY: Ortak fonksiyonlar burada
// =============================================================================

import { clsx, type ClassValue } from 'clsx';

/**
 * Tailwind CSS sınıflarını birleştirir ve çakışmaları çözer.
 * DRY prensibi: Tüm bileşenlerde tekrarlanan sınıf birleştirme işlemi tek yerde.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Tarihi Türkçe formatta döner.
 * @example formatDate('2025-06-13') → '13 Haziran 2025'
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Tarihi kısa formatta döner.
 * @example formatDateShort('2025-06-13') → '13.06.2025'
 */
export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR');
}

/**
 * Göreli zaman gösterimi.
 * @example formatRelativeTime('2025-06-12T10:00:00') → '1 gün önce'
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Az önce';
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays < 30) return `${diffDays} gün önce`;
  return formatDate(dateString);
}

/**
 * Dosya boyutunu okunabilir formata çevirir.
 * @example formatFileSize(52428800) → '50 MB'
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Yüzde hesaplar ve formatlar.
 * Sıfır bölme hatasını önlemek için toplam 0 ise 0 döner.
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Subdomain'den tenant bilgisini çıkarır.
 * @example extractSubdomain('okul1.platform.com') → 'okul1'
 */
export function extractSubdomain(hostname: string): string | null {
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    return parts[0];
  }
  return null;
}

/**
 * İlk harfleri büyük yapar (avatar fallback için).
 * @example getInitials('Ali Yılmaz') → 'AY'
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce fonksiyonu.
 * ENGINEERING_STANDARDS: Performans için input'larda debounce kullanılır.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), waitMs);
  };
}

/**
 * Slug oluşturur (URL-friendly).
 * @example slugify('Matematik Ödevi 1') → 'matematik-odevi-1'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// =============================================================================
// Constants — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS 5.5: Magic Number Yasağı — tüm sabitler burada
// =============================================================================

/** API Yapılandırması */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:6001';

/** Dosya Sınırları */
export const MAX_PDF_SIZE_MB = 200;
export const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;
export const MAX_AVATAR_SIZE_MB = 5;
export const MAX_AVATAR_SIZE_BYTES = MAX_AVATAR_SIZE_MB * 1024 * 1024;
export const ALLOWED_PDF_TYPES = ['application/pdf'];
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Sayfalama */
export const DEFAULT_PAGE_SIZE = 15;
export const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const;

/** Auth */
export const TOKEN_STORAGE_KEY = 'dep_auth_token';
export const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 dakika
export const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 60;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_DURATION_MINUTES = 15;

/** Cache Süreleri (ms) */
export const CACHE_TTL_SHORT = 60 * 1000;       // 1 dakika
export const CACHE_TTL_MEDIUM = 5 * 60 * 1000;  // 5 dakika
export const CACHE_TTL_LONG = 30 * 60 * 1000;   // 30 dakika

/** PDF Render */
export const PDF_RENDER_DPI = 150;
export const PDF_RENDER_FORMAT = 'webp';

/** Responsive Breakpoints — WEB_PLATFORM_REQUIREMENTS MOD-14 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1280,
  desktop: 1280,
} as const;

/** Hotspot Minimum Boyutları — MOD-14: min 44x44px akıllı tahta */
export const MIN_HOTSPOT_SIZE_PX = 44;

/** Debounce Süreleri */
export const DEBOUNCE_SEARCH_MS = 300;
export const DEBOUNCE_RESIZE_MS = 150;

/** Rol Etiketleri (Türkçe) */
export const ROLE_LABELS: Record<string, string> = {
  STUDENT: 'Öğrenci',
  TEACHER: 'Öğretmen',
  PARENT: 'Veli',
  INSTITUTION_ADMIN: 'Kurum Yöneticisi',
  SUPER_ADMIN: 'Süper Admin',
} as const;

/** Rol bazlı yönlendirme yolları */
export const ROLE_DASHBOARD_PATHS: Record<string, string> = {
  STUDENT: '/student/dashboard',
  TEACHER: '/teacher/dashboard',
  PARENT: '/parent/dashboard',
  INSTITUTION_ADMIN: '/institution/dashboard',
  SUPER_ADMIN: '/admin/dashboard',
} as const;

/** Sidebar Menü Yapılandırması (rol bazlı) */
export const SIDEBAR_MENUS: Record<string, Array<{ label: string; href: string; icon: string }>> = {
  STUDENT: [
    { label: 'Ana Sayfa', href: '/student/dashboard', icon: 'LayoutDashboard' },
    { label: 'Kitaplarım', href: '/student/books', icon: 'BookOpen' },
    { label: 'Ödevlerim', href: '/student/assignments', icon: 'ClipboardList' },
    { label: 'İlerleme', href: '/student/progress', icon: 'TrendingUp' },
    { label: 'Profil', href: '/student/profile', icon: 'UserCircle' },
  ],
  TEACHER: [
    { label: 'Ana Sayfa', href: '/teacher/dashboard', icon: 'LayoutDashboard' },
    { label: 'Sınıflarım', href: '/teacher/classrooms', icon: 'Users' },
    { label: 'Ödevler', href: '/teacher/assignments', icon: 'ClipboardList' },
    { label: 'Raporlar', href: '/teacher/reports', icon: 'BarChart3' },
    { label: 'Aktivite', href: '/teacher/activity', icon: 'Activity' },
    { label: 'Profil', href: '/teacher/profile', icon: 'UserCircle' },
  ],
  PARENT: [
    { label: 'Ana Sayfa', href: '/parent/dashboard', icon: 'LayoutDashboard' },
    { label: 'Çocuklarım', href: '/parent/children', icon: 'Users' },
    { label: 'Bildirimler', href: '/parent/notifications', icon: 'Bell' },
    { label: 'Veli Akademisi', href: '/parent/academy', icon: 'GraduationCap' },
    { label: 'Profil', href: '/parent/profile', icon: 'UserCircle' },
  ],
  INSTITUTION_ADMIN: [
    { label: 'Dashboard', href: '/institution/dashboard', icon: 'LayoutDashboard' },
    { label: 'Kullanıcılar', href: '/institution/users', icon: 'Users' },
    { label: 'Sınıflar', href: '/institution/classrooms', icon: 'School' },
    { label: 'Kitaplar', href: '/institution/books', icon: 'BookOpen' },
    { label: 'İçerik Editörü', href: '/institution/editor', icon: 'Edit3' },
    { label: 'Raporlar', href: '/institution/reports', icon: 'BarChart3' },
    { label: 'Ayarlar', href: '/institution/settings', icon: 'Settings' },
  ],
  SUPER_ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label: 'Kurumlar', href: '/admin/tenants', icon: 'Building2' },
    { label: 'Kitaplar', href: '/admin/books', icon: 'BookOpen' },
    { label: 'Kullanıcılar', href: '/admin/users', icon: 'Users' },
    { label: 'Sistem', href: '/admin/system', icon: 'Server' },
    { label: 'Ayarlar', href: '/admin/settings', icon: 'Settings' },
  ],
} as const;

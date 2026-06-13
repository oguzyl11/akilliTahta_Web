// =============================================================================
// Common Type Definitions — Dijital Eğitim Platformu
// =============================================================================

/** API standart başarılı yanıt formatı — ENGINEERING_STANDARDS 6.3 */
export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
}

/** Sayfalama meta bilgisi */
export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

/** API hata yanıtı */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/** Genel liste filtre parametreleri */
export interface ListParams {
  page?: number;
  perPage?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Sidebar menü öğesi */
export interface MenuItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: MenuItem[];
}

/** Bildirim */
export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  data: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
}

/** Breadcrumb öğesi */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Select option */
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

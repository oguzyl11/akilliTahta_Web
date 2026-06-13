// =============================================================================
// Auth Type Definitions — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: TypeScript tipleri types/ klasöründe tanımlanır
// =============================================================================

/** Kullanıcı rolleri — WEB_PLATFORM_REQUIREMENTS MOD-02 */
export type UserRole =
  | 'STUDENT'
  | 'TEACHER'
  | 'PARENT'
  | 'INSTITUTION_ADMIN'
  | 'SUPER_ADMIN';

/** Kullanıcı temel bilgileri */
export interface User {
  id: number;
  tenantId: number | null;
  name: string;
  email: string;
  role: UserRole;
  emailVerifiedAt: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Kiracı (Kurum) bilgileri — multi-tenant */
export interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  logoUrl: string | null;
  primaryColor: string;
  licenseType: 'basic' | 'standard' | 'premium';
  userLimit: number;
  isActive: boolean;
}

/** Login isteği */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Login yanıtı */
export interface AuthResponse {
  user: User;
  token: string;
  tenant: Tenant | null;
}

/** Token yenileme yanıtı */
export interface TokenResponse {
  token: string;
  expiresAt: string;
}

/** Şifre sıfırlama isteği */
export interface ForgotPasswordRequest {
  email: string;
}

/** Şifre sıfırlama (token ile) */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  passwordConfirmation: string;
}

/** Profil güncelleme */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatarUrl?: string;
}

/** Şifre değiştirme */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

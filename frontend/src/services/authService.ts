// =============================================================================
// Auth Service — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Service katmanı — iş mantığı burada yaşar
// Single Responsibility: Yalnızca auth API çağrılarından sorumlu
// =============================================================================

import api from './api';
import type {
  AuthResponse,
  LoginCredentials,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  User,
  Tenant,
} from '@/types';

/**
 * Auth Service — Kimlik doğrulama API çağrıları.
 * Interface Segregation: Yalnızca auth ile ilgili metotlar.
 */
const authService = {
  /**
   * Kullanıcı girişi yapar.
   * @param credentials E-posta ve şifre
   * @returns Kullanıcı bilgileri ve JWT token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  /**
   * Oturumu sonlandırır ve token'ı iptal eder.
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  /**
   * JWT token'ı yeniler.
   */
  async refreshToken(): Promise<{ token: string }> {
    const { data } = await api.post<{ token: string }>('/auth/refresh');
    return data;
  },

  /**
   * Şifre sıfırlama e-postası gönderir.
   * Token 60 dakika geçerlidir (WEB_PLATFORM_REQUIREMENTS MOD-02).
   */
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await api.post('/auth/forgot-password', request);
  },

  /**
   * Token ile şifre sıfırlama işlemi.
   */
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await api.post('/auth/reset-password', request);
  },

  /**
   * Mevcut kullanıcı profilini getirir.
   */
  async getProfile(): Promise<User> {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data.user;
  },

  /**
   * Subdomain'e göre tenant bilgisini getirir.
   * Kuruma özel branding (logo, renk) için kullanılır.
   */
  async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    try {
      const { data } = await api.get<{ data: Tenant }>(`/tenants/by-subdomain/${subdomain}`);
      return data.data;
    } catch {
      return null;
    }
  },
};

export default authService;

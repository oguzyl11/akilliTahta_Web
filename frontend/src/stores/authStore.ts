// =============================================================================
// Auth Store — Zustand State Management
// ENGINEERING_STANDARDS: KISS — minimal state, tek sorumluluk
// =============================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Tenant, LoginCredentials } from '@/types';
import { TOKEN_STORAGE_KEY, ROLE_DASHBOARD_PATHS } from '@/utils/constants';
import authService from '@/services/authService';

interface AuthState {
  // State
  user: User | null;
  tenant: Tenant | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<string>;
  logout: () => Promise<void>;
  setTenant: (tenant: Tenant | null) => void;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

/**
 * Auth Store — Kimlik doğrulama durumu.
 * Persist middleware ile token localStorage'da saklanır.
 * KISS: Minimum state, açık action'lar.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      tenant: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      /**
       * Login — Kullanıcı girişi yapar ve role göre yönlendirme yolu döner.
       * @returns Dashboard yolu (ROLE_DASHBOARD_PATHS)
       */
      login: async (credentials: LoginCredentials): Promise<string> => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);

          // Token'ı localStorage'a kaydet (interceptor kullanır)
          if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
          }

          set({
            user: response.user,
            tenant: response.tenant,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          // Rol bazlı yönlendirme yolu döner
          return ROLE_DASHBOARD_PATHS[response.user.role] || '/';
        } catch (err) {
          const message = (err as { message?: string })?.message || 'Giriş başarısız.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      /**
       * Logout — Oturumu sonlandırır, state'i temizler.
       */
      logout: async (): Promise<void> => {
        try {
          if (get().isAuthenticated) {
            await authService.logout();
          }
        } catch {
          // Logout API hatası olsa bile state temizlenir
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
          set({
            user: null,
            tenant: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      /**
       * Tenant bilgisini ayarlar (subdomain algılama sonrası).
       */
      setTenant: (tenant: Tenant | null) => {
        set({ tenant });
      },

      /**
       * Hata mesajını temizler.
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Mevcut token ile auth durumunu doğrular.
       */
      checkAuth: async (): Promise<void> => {
        const token = get().token;
        if (!token) return;

        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          // Token geçersiz — temizle
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'dep-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// =============================================================================
// useAuth Hook — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Custom hooks — hooks/ klasöründe
// =============================================================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';
import { ROLE_DASHBOARD_PATHS } from '@/utils/constants';

interface UseAuthOptions {
  /** Bu hook'un çalıştığı sayfada gerekli olan roller */
  requiredRoles?: UserRole[];
  /** Auth gerekmiyorsa true (login sayfası gibi) */
  guestOnly?: boolean;
}

/**
 * Auth hook — Kimlik doğrulama durumunu yönetir.
 * Route koruması ve rol kontrolü sağlar.
 *
 * @example
 * // Sadece öğretmen erişebilir
 * const { user } = useAuth({ requiredRoles: ['TEACHER'] });
 *
 * @example
 * // Login sayfası — authenticated kullanıcı dashboard'a yönlendirilir
 * useAuth({ guestOnly: true });
 */
export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, tenant, logout, checkAuth } = useAuthStore();
  const { requiredRoles, guestOnly } = options;

  useEffect(() => {
    // Auth durumunu doğrula
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isLoading) return;

    // Guest-only sayfalar (login) — authenticated ise dashboard'a yönlendir
    if (guestOnly && isAuthenticated && user) {
      const dashboardPath = ROLE_DASHBOARD_PATHS[user.role] || '/';
      router.replace(dashboardPath);
      return;
    }

    // Protected sayfalar — authenticated değilse login'e yönlendir
    if (!guestOnly && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Rol kontrolü — yetkisiz ise kendi dashboard'una yönlendir
    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      const dashboardPath = ROLE_DASHBOARD_PATHS[user.role] || '/';
      router.replace(dashboardPath);
    }
  }, [isAuthenticated, isLoading, user, guestOnly, requiredRoles, router]);

  return {
    user,
    tenant,
    isAuthenticated,
    isLoading,
    logout,
  };
}

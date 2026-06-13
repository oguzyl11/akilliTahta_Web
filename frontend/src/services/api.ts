// =============================================================================
// Axios API Instance — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Service katmanı — API çağrıları izole edilir
// =============================================================================

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/utils/constants';
import type { ApiError } from '@/types';

/**
 * Merkezi Axios instance.
 * Tüm API çağrıları bu instance üzerinden yapılır.
 * DRY: Token ekleme, hata yakalama tek yerde yönetilir.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor — Her istekte Authorization header'ı ekler.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor — Hata yakalama ve token yenileme.
 * 401 durumunda kullanıcıyı logout eder.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    // 401 Unauthorized — Token geçersiz veya süresi dolmuş
    if (status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = '/login';
    }

    // Hata mesajını standartlaştır
    const apiError: ApiError = {
      message: error.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.',
      errors: error.response?.data?.errors,
      statusCode: status,
    };

    return Promise.reject(apiError);
  }
);

export default api;

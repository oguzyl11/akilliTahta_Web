// =============================================================================
// User Service — Dijital Eğitim Platformu
// =============================================================================

import api from './api';
import type { User, ApiResponse } from '@/types';

export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

const userService = {
  /**
   * Kullanıcı listesini getirir (Sayfalama, arama, filtreleme destekli)
   */
  async getUsers(params?: GetUsersParams): Promise<ApiResponse<User[]>> {
    const { data } = await api.get<ApiResponse<User[]>>('/users', { params });
    return data;
  },

  /**
   * Tek bir kullanıcı detayını getirir
   */
  async getUser(id: number): Promise<{ data: User }> {
    const { data } = await api.get<{ data: User }>(`/users/${id}`);
    return data;
  },

  /**
   * Yeni kullanıcı oluşturur
   */
  async createUser(userData: CreateUserData): Promise<{ data: User; message: string }> {
    const { data } = await api.post<{ data: User; message: string }>('/users', userData);
    return data;
  },

  /**
   * Kullanıcı bilgilerini günceller
   */
  async updateUser(id: number, userData: UpdateUserData): Promise<{ data: User; message: string }> {
    const { data } = await api.put<{ data: User; message: string }>(`/users/${id}`, userData);
    return data;
  },

  /**
   * Kullanıcıyı siler (Soft Delete)
   */
  async deleteUser(id: number): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/users/${id}`);
    return data;
  },
};

export default userService;

// =============================================================================
// User Hooks — Dijital Eğitim Platformu
// =============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, { GetUsersParams, CreateUserData, UpdateUserData } from '@/services/userService';
import toast from 'react-hot-toast';

export const USER_KEYS = {
  all: ['users'] as const,
  lists: () => [...USER_KEYS.all, 'list'] as const,
  list: (filters: GetUsersParams) => [...USER_KEYS.lists(), filters] as const,
  details: () => [...USER_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...USER_KEYS.details(), id] as const,
};

export function useUsers(filters: GetUsersParams) {
  return useQuery({
    queryKey: USER_KEYS.list(filters),
    queryFn: () => userService.getUsers(filters),
    placeholderData: (previousData) => previousData, // keep previous data while fetching
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      toast.success('Kullanıcı başarıyla oluşturuldu');
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Kullanıcı oluşturulurken bir hata oluştu';
      toast.error(message);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) => userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      toast.success('Kullanıcı başarıyla güncellendi');
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(variables.id) });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Kullanıcı güncellenirken bir hata oluştu';
      toast.error(message);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('Kullanıcı başarıyla silindi');
      queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu';
      toast.error(message);
    },
  });
}

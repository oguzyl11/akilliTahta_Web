// =============================================================================
// UserFormModal Component — Dijital Eğitim Platformu
// =============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Select } from '@/components/ui';
import type { User } from '@/types';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null; // Null ise Ekleme modunda
}

const roleOptions = [
  { value: 'TEACHER', label: 'Öğretmen' },
  { value: 'STUDENT', label: 'Öğrenci' },
  { value: 'PARENT', label: 'Veli' },
  { value: 'INSTITUTION_ADMIN', label: 'Kurum Yöneticisi' },
];

export function UserFormModal({ isOpen, onClose, user }: UserFormModalProps) {
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const isLoading = createUserMutation.isPending || updateUserMutation.isPending;

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Şifreyi boş bırakıyoruz (sadece güncellemek istenirse girilir)
        role: user.role,
      });
    } else if (!user && isOpen) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      const dataToUpdate: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) {
        dataToUpdate.password = formData.password;
      }

      updateUserMutation.mutate(
        { id: user!.id, data: dataToUpdate },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createUserMutation.mutate(formData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Ad Soyad"
          name="name"
          placeholder="Örn: Ali Yılmaz"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <Input
          label="E-posta Adresi"
          type="email"
          name="email"
          placeholder="Örn: ali@example.com"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <Input
          label={isEditing ? 'Şifre (Değiştirmek istemiyorsanız boş bırakın)' : 'Şifre'}
          type="password"
          name="password"
          placeholder="En az 8 karakter"
          required={!isEditing}
          minLength={8}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />

        <Select
          label="Kullanıcı Rolü"
          options={roleOptions}
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: String(value) })}
        />

        <div className="pt-4 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            İptal
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

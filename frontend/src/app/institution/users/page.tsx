// =============================================================================
// Institution Users Page — Kullanıcı Yönetimi Ana Ekranı
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DataTable, Column } from '@/components/ui';
import { Button, Badge, Avatar } from '@/components/ui';
import { UserPlus, Edit2, Trash2, ShieldAlert } from 'lucide-react';
import { useUsers, useDeleteUser } from '@/hooks/useUsers';
import { UserFormModal } from '@/components/features/users/UserFormModal';
import { ROLE_LABELS } from '@/utils/constants';
import type { User } from '@/types';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: response, isLoading, isFetching } = useUsers({
    page,
    per_page: 10,
    search: search.length >= 3 ? search : undefined, // En az 3 harf girilince ara
  });

  const deleteUserMutation = useDeleteUser();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`${user.name} isimli kullanıcıyı silmek istediğinize emin misiniz?`)) {
      deleteUserMutation.mutate(user.id);
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'Kullanıcı',
      cell: (user) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          <div>
            <p className="font-medium text-slate-200">{user.name}</p>
            <p className="text-[10px] text-slate-500">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Rol',
      cell: (user) => {
        const isStaff = user.role === 'INSTITUTION_ADMIN' || user.role === 'SUPER_ADMIN';
        return (
          <Badge variant={isStaff ? 'primary' : user.role === 'TEACHER' ? 'info' : 'default'}>
            {ROLE_LABELS[user.role] || user.role}
          </Badge>
        );
      },
    },
    {
      header: 'Durum',
      cell: () => <Badge variant="success">Aktif</Badge>,
    },
    {
      header: 'İşlemler',
      className: 'text-right',
      cell: (user) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => handleEdit(user)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
            title="Düzenle"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(user)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
            title="Sil"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="text-indigo-500" />
            Kullanıcı Yönetimi
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Kurumunuzdaki öğrenci, öğretmen ve yöneticileri yönetin.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button onClick={handleCreate} className="gap-2">
            <UserPlus size={18} />
            Yeni Kullanıcı
          </Button>
        </motion.div>
      </div>

      {/* Main Table Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1"
      >
        <DataTable
          columns={columns}
          data={response?.data || []}
          meta={response?.meta}
          isLoading={isLoading || isFetching}
          searchValue={search}
          onSearch={(val) => {
            setSearch(val);
            setPage(1); // arama değişince ilk sayfaya dön
          }}
          onPageChange={setPage}
          keyExtractor={(user) => user.id}
          emptyMessage="Kriterlere uygun kullanıcı bulunamadı."
        />
      </motion.div>

      {/* Modal */}
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}

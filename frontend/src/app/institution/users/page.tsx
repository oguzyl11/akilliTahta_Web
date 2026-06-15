// =============================================================================
// Institution Users Page — Kullanıcı Yönetimi
// MOD-12: Öğrenci ve Öğretmenlerin yönetimi
// =============================================================================

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, UserX, UserCheck, MoreVertical, Shield } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER';
  status: 'active' | 'inactive';
  departmentOrClass: string;
}

const mockUsers: UserData[] = [
  { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet@demo.com', role: 'TEACHER', status: 'active', departmentOrClass: 'Matematik' },
  { id: '2', name: 'Zeynep Kaya', email: 'zeynep@demo.com', role: 'STUDENT', status: 'active', departmentOrClass: '11-A' },
  { id: '3', name: 'Mehmet Demir', email: 'mehmet@demo.com', role: 'STUDENT', status: 'active', departmentOrClass: '12-B' },
  { id: '4', name: 'Ayşe Çelik', email: 'ayse@demo.com', role: 'TEACHER', status: 'inactive', departmentOrClass: 'Fizik' },
];

export default function InstitutionUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | 'STUDENT' | 'TEACHER'>('ALL');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-slate-800">Kullanıcı Yönetimi</h1>
          <p className="text-slate-500 mt-1 text-sm">Kurumunuza ait öğretmen ve öğrencileri yönetin.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button className="bg-indigo-600 hover:bg-indigo-700" leftIcon={<Plus size={18} />}>
            Yeni Kullanıcı Ekle
          </Button>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-96">
          <Input 
            placeholder="İsim veya e-posta ara..." 
            leftIcon={<Search size={18} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
          {['ALL', 'TEACHER', 'STUDENT'].map(role => (
            <button
              key={role}
              onClick={() => setFilterRole(role as any)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterRole === role ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {role === 'ALL' ? 'Tümü' : role === 'TEACHER' ? 'Öğretmenler' : 'Öğrenciler'}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Kullanıcı</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Sınıf/Branş</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user, idx) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        user.role === 'TEACHER' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center gap-1.5 font-medium ${user.role === 'TEACHER' ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      <Shield size={14} />
                      {user.role === 'TEACHER' ? 'Öğretmen' : 'Öğrenci'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{user.departmentOrClass}</td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-semibold w-fit">
                        <UserCheck size={14} /> Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-1 rounded-md text-xs font-semibold w-fit">
                        <UserX size={14} /> Pasif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Sidebar Component — Dijital Eğitim Platformu
// ENGINEERING_STANDARDS: Rol bazlı menü yapısı
// =============================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/helpers';
import { useAuthStore } from '@/stores/authStore';
import { SIDEBAR_MENUS, ROLE_LABELS } from '@/utils/constants';
import { Avatar } from '@/components/ui';
import {
  LayoutDashboard, BookOpen, ClipboardList, TrendingUp, UserCircle,
  Users, BarChart3, Activity, Bell, GraduationCap, School, Edit3,
  Settings, Building2, Server, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';

/** İkon adından bileşen eşleme */
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard, BookOpen, ClipboardList, TrendingUp, UserCircle,
  Users, BarChart3, Activity, Bell, GraduationCap, School, Edit3,
  Settings, Building2, Server,
};

/**
 * Sidebar — Rol bazlı navigasyon menüsü.
 * Collapsible, active state, responsive.
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, tenant, logout } = useAuthStore();

  if (!user) return null;

  const menuItems = SIDEBAR_MENUS[user.role] || [];
  const roleLabel = ROLE_LABELS[user.role] || user.role;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40',
        'flex flex-col',
        'bg-slate-900/95 backdrop-blur-xl border-r border-slate-700/50',
        'transition-all duration-300 ease-out',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo & Tenant */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-700/50">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <BookOpen size={18} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-slate-100 truncate">
              {tenant?.name || 'Dijital Eğitim'}
            </h1>
            <p className="text-[10px] text-slate-500 truncate">{roleLabel}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
        {menuItems.map((item) => {
          const IconComponent = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl',
                'transition-all duration-200 group',
                'text-sm font-medium',
                isActive
                  ? 'bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/5'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
                isCollapsed && 'justify-center px-0'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent
                size={20}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Collapse Toggle */}
      <div className="border-t border-slate-700/50 p-3 space-y-2">
        {/* User */}
        <div
          className={cn(
            'flex items-center gap-3 p-2 rounded-xl',
            'hover:bg-slate-800/50 transition-colors cursor-pointer',
            isCollapsed && 'justify-center'
          )}
        >
          <Avatar name={user.name} src={user.avatarUrl} size="sm" />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-xl',
            'text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/10',
            'transition-all duration-200',
            isCollapsed && 'justify-center px-0'
          )}
          title="Çıkış Yap"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Çıkış Yap</span>}
        </button>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-xl',
            'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50',
            'transition-all duration-200'
          )}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

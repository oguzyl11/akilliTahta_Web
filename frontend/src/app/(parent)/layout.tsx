// Parent Layout
'use client';
import React from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui';

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth({ requiredRoles: ['PARENT'] });
  if (isLoading) return <PageLoader message="Yükleniyor..." />;
  return <DashboardLayout>{children}</DashboardLayout>;
}

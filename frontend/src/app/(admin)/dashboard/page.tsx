// =============================================================================
// Super Admin Dashboard — Sistem genel görünümü
// =============================================================================

'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardHeader, CardContent, Badge, Button } from '@/components/ui';
import {
  Building2, Users, BookOpen, Server,
  TrendingUp, Plus, Activity, Shield,
  ChevronRight, CheckCircle2, AlertTriangle,
} from 'lucide-react';

function StatCard({
  icon: Icon, label, value, change, colorClass,
}: {
  icon: React.ElementType; label: string; value: string; change?: string; colorClass: string;
}) {
  return (
    <Card hover className={colorClass}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp size={12} />{change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-white/5"><Icon size={22} className="text-slate-300" /></div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Sistem Yönetimi"
        description="Tüm kurumlar, kullanıcılar ve sistem durumu."
        action={
          <Button leftIcon={<Plus size={18} />}>
            Yeni Kurum Ekle
          </Button>
        }
      />

      {/* System KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard icon={Building2} label="Toplam Kurum" value="12" change="+2 bu ay" colorClass="stat-card-indigo" />
        <StatCard icon={Users} label="Toplam Kullanıcı" value="3,847" change="+156 bu ay" colorClass="stat-card-emerald" />
        <StatCard icon={BookOpen} label="Toplam Kitap" value="187" change="+15 yeni" colorClass="stat-card-amber" />
        <StatCard icon={Server} label="Sistem Uptime" value="99.9%" colorClass="stat-card-rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kurumlar */}
        <div className="lg:col-span-2">
          <Card gradient>
            <CardHeader action={<Button variant="ghost" size="sm">Tümü <ChevronRight size={14} /></Button>}>
              <h2 className="text-lg font-semibold text-slate-100">Kurumlar</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Atatürk İlkokulu', subdomain: 'ataturk', users: 450, license: 'Premium', active: true },
                  { name: 'Fatih Koleji', subdomain: 'fatih', users: 320, license: 'Standard', active: true },
                  { name: 'Mimar Sinan Ortaokulu', subdomain: 'msinan', users: 280, license: 'Premium', active: true },
                  { name: 'Bilgi Koleji', subdomain: 'bilgi', users: 180, license: 'Basic', active: false },
                ].map((tenant, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-200">{tenant.name}</p>
                        <Badge variant={tenant.active ? 'success' : 'danger'} dot>
                          {tenant.active ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">{tenant.subdomain}.platform.com • {tenant.users} kullanıcı</p>
                    </div>
                    <Badge variant={tenant.license === 'Premium' ? 'info' : tenant.license === 'Standard' ? 'warning' : 'neutral'}>
                      {tenant.license}
                    </Badge>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sistem Durumu */}
        <div className="space-y-6">
          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Sistem Durumu</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { service: 'API Server', status: 'online', icon: CheckCircle2 },
                  { service: 'PostgreSQL', status: 'online', icon: CheckCircle2 },
                  { service: 'Redis Cache', status: 'online', icon: CheckCircle2 },
                  { service: 'PDF Service', status: 'online', icon: CheckCircle2 },
                  { service: 'Queue Worker', status: 'warning', icon: AlertTriangle },
                ].map((svc, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <svc.icon
                        size={14}
                        className={svc.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}
                      />
                      <span className="text-sm text-slate-300">{svc.service}</span>
                    </div>
                    <Badge variant={svc.status === 'online' ? 'success' : 'warning'} dot>
                      {svc.status === 'online' ? 'Çalışıyor' : 'Uyarı'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Son İşlemler</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { text: 'Yeni kurum eklendi: Fatih Koleji', time: '1 saat önce' },
                  { text: '15 kitap toplu yüklendi', time: '3 saat önce' },
                  { text: 'Sistem güncellendi v2.1.0', time: 'Dün' },
                ].map((log, i) => (
                  <div key={i} className="flex items-start gap-2 py-1">
                    <Activity size={12} className="text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-300">{log.text}</p>
                      <p className="text-[10px] text-slate-500">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Institution Dashboard — MOD-10: Kurum / Yönetim Paneli
// KPI: Aktif kullanıcı, ödev tamamlama oranı, sınıf başarı ortalaması
// =============================================================================

'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardHeader, CardContent, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
  Users, BookOpen, School, TrendingUp,
  Download, BarChart3, UserPlus, ChevronRight,
} from 'lucide-react';

function KpiCard({
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

export default function InstitutionDashboard() {
  const { user, tenant } = useAuthStore();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={tenant?.name || 'Kurum Yönetimi'}
        description="Kurumunuzun genel performans ve istatistiklerini görüntüleyin."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Download size={16} />}>
              Rapor İndir
            </Button>
            <Button size="sm" leftIcon={<UserPlus size={16} />}>
              Kullanıcı Ekle
            </Button>
          </div>
        }
      />

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <KpiCard icon={Users} label="Aktif Kullanıcı" value="458" change="+24 bu ay" colorClass="stat-card-indigo" />
        <KpiCard icon={School} label="Sınıf Sayısı" value="16" colorClass="stat-card-emerald" />
        <KpiCard icon={BookOpen} label="Toplam Kitap" value="42" change="+3 yeni" colorClass="stat-card-amber" />
        <KpiCard icon={BarChart3} label="Ödev Tamamlama" value="87%" change="+5% artış" colorClass="stat-card-rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sınıf Karşılaştırma */}
        <div className="lg:col-span-2">
          <Card gradient>
            <CardHeader action={<Button variant="ghost" size="sm">Detay <ChevronRight size={14} /></Button>}>
              <h2 className="text-lg font-semibold text-slate-100">Sınıf Başarı Karşılaştırması</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: '8-A', avg: 82, students: 32, color: 'from-indigo-500 to-purple-500' },
                  { name: '8-B', avg: 75, students: 30, color: 'from-sky-500 to-blue-500' },
                  { name: '7-A', avg: 79, students: 34, color: 'from-emerald-500 to-teal-500' },
                  { name: '7-B', avg: 72, students: 28, color: 'from-amber-500 to-orange-500' },
                  { name: '7-C', avg: 71, students: 31, color: 'from-pink-500 to-rose-500' },
                  { name: '6-A', avg: 88, students: 33, color: 'from-violet-500 to-fuchsia-500' },
                ].map((cls, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-10 text-sm font-medium text-slate-300">{cls.name}</span>
                    <div className="flex-1 h-3 rounded-full bg-slate-700/50 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${cls.color} transition-all duration-700`}
                        style={{ width: `${cls.avg}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm font-bold text-white text-right">{cls.avg}%</span>
                    <span className="w-16 text-xs text-slate-500 text-right">{cls.students} öğr.</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hızlı İşlemler */}
        <div>
          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Hızlı İşlemler</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { label: 'Toplu Kullanıcı Yükle', icon: Users, desc: 'Excel/CSV ile' },
                  { label: 'Kitap Yükle', icon: BookOpen, desc: 'PDF yükleme' },
                  { label: 'Sınıf Oluştur', icon: School, desc: 'Yeni şube ekle' },
                  { label: 'Rapor Oluştur', icon: BarChart3, desc: 'PDF/Excel dışa aktar' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-700/30 hover:border-indigo-500/20 hover:bg-white/5 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                      <action.icon size={18} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.desc}</p>
                    </div>
                    <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

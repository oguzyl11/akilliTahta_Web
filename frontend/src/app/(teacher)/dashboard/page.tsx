// =============================================================================
// Teacher Dashboard — Dijital Eğitim Platformu
// MOD-08: Sınıf yönetimi, ödev takibi, analiz
// =============================================================================

'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardHeader, CardContent, Badge, Button } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
  Users, ClipboardList, BarChart3, BookOpen,
  Plus, TrendingUp, ChevronRight, Clock, CheckCircle2,
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

export default function TeacherDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Hoş Geldiniz, ${user?.name || 'Öğretmen'} 👋`}
        description="Sınıflarınız ve ödev takibiniz burada."
        action={
          <Button leftIcon={<Plus size={18} />}>
            Yeni Ödev Oluştur
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard icon={Users} label="Toplam Öğrenci" value="127" change="+8 bu ay" colorClass="stat-card-indigo" />
        <StatCard icon={ClipboardList} label="Aktif Ödev" value="5" colorClass="stat-card-amber" />
        <StatCard icon={CheckCircle2} label="Teslim Edilen" value="89%" change="+3% artış" colorClass="stat-card-emerald" />
        <StatCard icon={BarChart3} label="Sınıf Ortalaması" value="78.5" colorClass="stat-card-rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sınıflarım */}
        <div className="lg:col-span-2">
          <Card gradient>
            <CardHeader action={<Button variant="ghost" size="sm">Tümü <ChevronRight size={14} /></Button>}>
              <h2 className="text-lg font-semibold text-slate-100">Sınıflarım</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: '8-A', students: 32, avg: 82, trend: 'up' },
                  { name: '8-B', students: 30, avg: 75, trend: 'down' },
                  { name: '7-A', students: 34, avg: 79, trend: 'up' },
                  { name: '7-C', students: 31, avg: 71, trend: 'stable' },
                ].map((cls, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-700/30 hover:border-indigo-500/20 hover:bg-white/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-white">{cls.name}</h3>
                      <Badge variant={cls.trend === 'up' ? 'success' : cls.trend === 'down' ? 'danger' : 'neutral'}>
                        {cls.avg}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Users size={12} /> {cls.students} öğrenci</span>
                      <span className="flex items-center gap-1"><BookOpen size={12} /> 3 kitap</span>
                    </div>
                    {/* Mini progress */}
                    <div className="mt-3 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        style={{ width: `${cls.avg}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Son Ödevler */}
        <div>
          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Son Ödevler</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Bölüm 3 Testi', class: '8-A', submitted: 28, total: 32, due: '2 gün' },
                  { title: 'Fen Projesi', class: '7-A', submitted: 20, total: 34, due: '5 gün' },
                  { title: 'Okuma Ödevi', class: '8-B', submitted: 30, total: 30, due: 'Bitti' },
                ].map((hw, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-700/30 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{hw.title}</p>
                        <p className="text-xs text-slate-500">{hw.class}</p>
                      </div>
                      <Badge variant={hw.due === 'Bitti' ? 'success' : 'warning'} dot>
                        {hw.due}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${(hw.submitted / hw.total) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{hw.submitted}/{hw.total}</span>
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

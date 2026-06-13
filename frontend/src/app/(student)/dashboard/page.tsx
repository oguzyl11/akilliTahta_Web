// =============================================================================
// Student Dashboard — Dijital Eğitim Platformu
// MOD-07: Ana sayfa — Atanmış kitaplar, son okunan, aktif ödevler
// =============================================================================

'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
  BookOpen, ClipboardList, TrendingUp, Clock,
  ChevronRight, Play, CheckCircle2, AlertCircle,
} from 'lucide-react';

/** İstatistik kartı bileşeni — DRY: Tüm dashboardlarda kullanılır */
function StatCard({
  icon: Icon,
  label,
  value,
  change,
  colorClass,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  colorClass: string;
}) {
  return (
    <Card hover className={colorClass}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              {change}
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-white/5">
          <Icon size={22} className="text-slate-300" />
        </div>
      </div>
    </Card>
  );
}

export default function StudentDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Merhaba, ${user?.name || 'Öğrenci'} 👋`}
        description="Bugün neler yapacağına bir göz at."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        <StatCard
          icon={BookOpen}
          label="Kitaplarım"
          value="8"
          change="2 yeni eklendi"
          colorClass="stat-card-indigo"
        />
        <StatCard
          icon={ClipboardList}
          label="Aktif Ödevler"
          value="3"
          colorClass="stat-card-amber"
        />
        <StatCard
          icon={CheckCircle2}
          label="Tamamlanan"
          value="24"
          change="+5 bu hafta"
          colorClass="stat-card-emerald"
        />
        <StatCard
          icon={Clock}
          label="Bu Hafta"
          value="12 saat"
          colorClass="stat-card-rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Son Okunan Kitaplar */}
        <div className="lg:col-span-2">
          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Son Okunan Kitaplar</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Matematik 8. Sınıf', subject: 'Matematik', page: 'Sayfa 45/120', progress: 37 },
                  { title: 'Fen Bilimleri', subject: 'Fen', page: 'Sayfa 78/200', progress: 39 },
                  { title: 'Türkçe Dilbilgisi', subject: 'Türkçe', page: 'Sayfa 12/80', progress: 15 },
                ].map((book, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={20} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{book.subject} • {book.page}</p>
                      {/* Progress bar */}
                      <div className="mt-2 h-1.5 rounded-full bg-slate-700/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aktif Ödevler */}
        <div>
          <Card gradient>
            <CardHeader>
              <h2 className="text-lg font-semibold text-slate-100">Aktif Ödevler</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Bölüm 3 Testi', due: '2 gün kaldı', status: 'warning' as const },
                  { title: 'Fen Deneyi Raporu', due: '5 gün kaldı', status: 'info' as const },
                  { title: 'Yazım Kuralları', due: 'Bugün son gün!', status: 'danger' as const },
                ].map((assignment, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-700/30 hover:border-indigo-500/20 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-slate-200">{assignment.title}</p>
                      <Badge variant={assignment.status} dot>
                        {assignment.due}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Play size={12} className="text-indigo-400" />
                      <span className="text-xs text-indigo-400 font-medium">Başla</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Son Aktiviteler */}
      <div className="mt-6">
        <Card gradient>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">Son Aktiviteler</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { icon: CheckCircle2, text: 'Matematik testini %85 ile tamamladın', time: '2 saat önce', color: 'text-emerald-400' },
                { icon: BookOpen, text: 'Fen Bilimleri kitabında 5 sayfa okudun', time: '4 saat önce', color: 'text-sky-400' },
                { icon: Play, text: 'Türkçe video dersini izledin', time: 'Dün', color: 'text-purple-400' },
                { icon: AlertCircle, text: 'Yeni ödev atandı: Bölüm 3 Testi', time: 'Dün', color: 'text-amber-400' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <activity.icon size={16} className={activity.color} />
                  <span className="text-sm text-slate-300 flex-1">{activity.text}</span>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

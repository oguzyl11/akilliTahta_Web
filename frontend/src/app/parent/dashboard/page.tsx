// =============================================================================
// Parent Dashboard — MOD-09: Veli Paneli
// =============================================================================

'use client';

import React from 'react';
import { PageHeader } from '@/components/common';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import {
  Users, TrendingUp, BookOpen, ClipboardList,
  CheckCircle2, AlertCircle, ChevronRight,
} from 'lucide-react';

export default function ParentDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={`Hoş Geldiniz, ${user?.name || 'Veli'} 👋`}
        description="Çocuklarınızın eğitim durumunu takip edin."
      />

      {/* Çocuklar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 stagger-children">
        {[
          {
            name: 'Ali Yılmaz', class: '8-A', avg: 82, trend: '+5%',
            assignments: { done: 12, total: 14 },
            recentTest: { name: 'Matematik Bölüm 3', score: 85 },
          },
          {
            name: 'Ayşe Yılmaz', class: '6-B', avg: 91, trend: '+3%',
            assignments: { done: 10, total: 10 },
            recentTest: { name: 'Fen Bilimleri', score: 92 },
          },
        ].map((child, i) => (
          <Card key={i} hover gradient className="cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-indigo-500/20">
                {child.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{child.name}</h3>
                  <ChevronRight size={18} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-sm text-slate-400">{child.class} sınıfı</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-white">{child.avg}%</p>
                    <p className="text-[10px] text-slate-500">Ortalama</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-emerald-400">{child.assignments.done}/{child.assignments.total}</p>
                    <p className="text-[10px] text-slate-500">Ödev</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-white/5">
                    <p className="text-lg font-bold text-sky-400">{child.recentTest.score}</p>
                    <p className="text-[10px] text-slate-500">Son Test</p>
                  </div>
                </div>

                {/* Trend */}
                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400">{child.trend} bu ay</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bildirimler */}
      <Card gradient>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-100">Son Bildirimler</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { icon: CheckCircle2, text: 'Ali, Matematik testini %85 ile tamamladı.', time: '2 saat önce', type: 'success' as const },
              { icon: AlertCircle, text: 'Ayşe\'nin Fen ödevi yarın son gün.', time: '5 saat önce', type: 'warning' as const },
              { icon: BookOpen, text: 'Öğretmen raporu: Ali\'nin bu ayki gelişim raporu hazır.', time: 'Dün', type: 'info' as const },
            ].map((notif, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                <div className={`p-2 rounded-lg ${notif.type === 'success' ? 'bg-emerald-500/15' : notif.type === 'warning' ? 'bg-amber-500/15' : 'bg-sky-500/15'}`}>
                  <notif.icon size={16} className={notif.type === 'success' ? 'text-emerald-400' : notif.type === 'warning' ? 'text-amber-400' : 'text-sky-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200">{notif.text}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{notif.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

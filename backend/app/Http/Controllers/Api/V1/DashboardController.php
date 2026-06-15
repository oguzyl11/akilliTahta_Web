<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Dashboard üst istatistik kartları için rol tabanlı veri döndür.
     */
    public function stats(Request $request)
    {
        $user = Auth::user();
        $stats = [];

        switch ($user->role) {
            case 'INSTITUTION_ADMIN':
                $stats = [
                    [
                        'title' => 'Toplam Öğrenci',
                        'value' => Student::count(),
                        'icon' => 'Users',
                        'color' => 'indigo',
                        'trend' => ['value' => 5, 'label' => 'Geçen aya göre', 'isPositive' => true]
                    ],
                    [
                        'title' => 'Aktif Öğretmen',
                        'value' => User::where('role', 'TEACHER')->count(),
                        'icon' => 'GraduationCap',
                        'color' => 'emerald',
                        'trend' => ['value' => 2, 'label' => 'Yeni katılan', 'isPositive' => true]
                    ],
                    [
                        'title' => 'Toplam Sınıf',
                        'value' => Classroom::count(),
                        'icon' => 'School',
                        'color' => 'amber',
                        'trend' => null
                    ],
                ];
                break;
            case 'TEACHER':
                $classCount = Classroom::where('teacher_id', $user->id)->count();
                $stats = [
                    [
                        'title' => 'Sınıflarım',
                        'value' => $classCount,
                        'icon' => 'Users',
                        'color' => 'indigo',
                        'trend' => null
                    ],
                    // Şimdilik mock veriler eklenebilir, asıl sorgular karmaşıklaştıkça doldurulur
                    [
                        'title' => 'Bekleyen Ödev Değerlendirmesi',
                        'value' => 12,
                        'icon' => 'CheckCircle',
                        'color' => 'amber',
                        'trend' => null
                    ]
                ];
                break;
            default:
                // Öğrenci veya Veli için temel stats
                $stats = [
                    [
                        'title' => 'Genel Ortalama',
                        'value' => 85,
                        'icon' => 'TrendingUp',
                        'color' => 'indigo',
                        'trend' => ['value' => 3, 'label' => 'Artış', 'isPositive' => true]
                    ]
                ];
                break;
        }

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}

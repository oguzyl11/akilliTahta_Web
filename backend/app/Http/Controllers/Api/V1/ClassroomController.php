<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClassroomController extends Controller
{
    /**
     * Sınıfları listele (Rol tabanlı).
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Öğretmense sadece kendi sınıflarını görsün
        if ($user->role === 'TEACHER') {
            $classrooms = Classroom::with('teacher')
                ->withCount('students')
                ->where('teacher_id', $user->id)
                ->get();
        } else {
            // Admin veya Kurum Yöneticisi ise tüm sınıfları görsün
            $classrooms = Classroom::with('teacher')
                ->withCount('students')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $classrooms
        ]);
    }

    /**
     * Yeni sınıf oluştur.
     */
    public function store(Request $request)
    {
        // Yetki kontrolü: Sadece INSTITUTION_ADMIN veya SUPER_ADMIN sınıf oluşturabilir
        if (!in_array(Auth::user()->role, ['INSTITUTION_ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'grade_level' => 'required|integer|min:1|max:12',
            'branch' => 'required|string|max:10',
            'teacher_id' => 'nullable|exists:users,id',
            'academic_year' => 'required|string|max:9', // Örn: 2026-2027
        ]);

        $classroom = Classroom::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Sınıf başarıyla oluşturuldu.',
            'data' => $classroom
        ], 201);
    }
}

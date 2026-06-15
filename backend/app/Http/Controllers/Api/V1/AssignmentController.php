<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    /**
     * Ödevleri Listele
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        if ($user->role === 'TEACHER') {
            // Öğretmen kendi verdiği ödevleri görür
            $assignments = Assignment::with(['classroom' => function ($query) {
                $query->withCount('students');
            }, 'book'])
                ->withCount('submissions')
                ->where('teacher_id', $user->id)
                ->orderBy('due_date', 'asc')
                ->get();
        } elseif ($user->role === 'STUDENT') {
            // Öğrenci kendi sınıfına atanan ödevleri görür
            $student = Student::where('user_id', $user->id)->first();
            
            if (!$student) {
                return response()->json(['status' => 'success', 'data' => []]);
            }

            // TODO: İleride submissions ilişkisi ile "completed" statüsü eklenecek
            $assignments = Assignment::with(['classroom', 'book', 'teacher'])
                ->where('classroom_id', $student->classroom_id)
                ->where('status', 'active')
                ->orderBy('due_date', 'asc')
                ->get();
        } else {
            // Adminler vs. tüm ödevleri görebilir
            $assignments = Assignment::with(['classroom', 'book', 'teacher'])
                ->where('tenant_id', $user->tenant_id)
                ->orderBy('due_date', 'desc')
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $assignments
        ]);
    }

    /**
     * Öğretmen Yeni Ödev Oluşturur
     */
    public function store(Request $request)
    {
        if (Auth::user()->role !== 'TEACHER') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'book_id' => 'required|exists:books,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'required|date|after:today',
        ]);

        $assignment = Assignment::create(array_merge($validated, [
            'teacher_id' => Auth::id(),
            'status' => 'active',
            'tenant_id' => Auth::user()->tenant_id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Ödev başarıyla oluşturuldu.',
            'data' => $assignment
        ], 201);
    }
}

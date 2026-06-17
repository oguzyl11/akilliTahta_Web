<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class BookController extends Controller
{
    /**
     * Kitapları Listele (Rol Tabanlı)
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Book::where('tenant_id', $user->tenant_id);

        // Öğrenci ise sadece yayında/tamamlanmış olanları görsün
        if ($user->role === 'STUDENT') {
            $query->where('render_status', 'completed');
        }

        $books = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $books
        ]);
    }

    /**
     * PDF Yükleme — Basitleştirilmiş (S3/PDF Service bağımlılığı kaldırıldı)
     * Dosyayı local public diske kaydeder, veritabanına yazar.
     */
    public function upload(Request $request)
    {
        // Manuel validation ile hata mesajlarını kontrol edelim
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string',
            'grade_level' => 'nullable|integer',
            'file' => 'required|file|mimes:pdf|max:204800', // max 200MB
        ], [
            'title.required' => 'Kitap adı zorunludur.',
            'file.required' => 'PDF dosyası zorunludur.',
            'file.mimes' => 'Sadece PDF dosyaları yüklenebilir.',
            'file.max' => 'Dosya boyutu en fazla 200MB olabilir.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Doğrulama hatası.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $file = $request->file('file');
        
        if (!$file || !$file->isValid()) {
            return response()->json([
                'message' => 'Dosya yüklenemedi veya bozuk. PHP upload_max_filesize limitini kontrol edin.'
            ], 422);
        }

        try {
            // 1. Dosyayı local (public) diske yükle
            $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file->getClientOriginalName());
            $path = $file->storeAs('books/originals', $fileName, 'public');
            
            // 2. Veritabanına Kaydet
            $book = Book::create([
                'tenant_id' => $user->tenant_id,
                'title' => $request->input('title'),
                'subject' => $request->input('subject'),
                'grade_level' => $request->input('grade_level'),
                'pdf_url' => $path,
                'pdf_size_bytes' => $file->getSize(),
                'render_status' => 'pending',
                'created_by' => $user->id,
            ]);

            Log::info('Book uploaded successfully', ['book_id' => $book->id, 'path' => $path]);

            return response()->json([
                'status' => 'success',
                'message' => 'Kitap başarıyla yüklendi!',
                'data' => $book
            ], 201);

        } catch (\Exception $e) {
            Log::error('Book Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Dosya yüklenirken bir sunucu hatası oluştu: ' . $e->getMessage()
            ], 500);
        }
    }
}

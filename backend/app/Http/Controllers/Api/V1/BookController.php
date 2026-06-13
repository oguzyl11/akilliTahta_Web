<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BookController extends Controller
{
    /**
     * PDF Yükleme ve Python Pipeline'ı Tetikleme
     */
    public function upload(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'nullable|string',
            'grade_level' => 'nullable|integer',
            'file' => 'required|mimes:pdf|max:204800', // max 200MB
        ]);

        $user = $request->user();
        $file = $request->file('file');
        
        try {
            // 1. Dosyayı MinIO'ya (S3) Yükle
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('books/originals', $fileName, 's3');
            
            // 2. Veritabanına Kaydet
            $book = Book::create([
                'tenant_id' => $user->tenant_id,
                'title' => $request->title,
                'subject' => $request->subject,
                'grade_level' => $request->grade_level,
                'pdf_url' => $path,
                'pdf_size_bytes' => $file->getSize(),
                'render_status' => 'pending',
                'created_by' => $user->id,
            ]);

            // 3. Python Servisini Tetikle
            $pdfServiceUrl = env('PDF_SERVICE_URL', 'http://pdf-service:8001') . '/api/v1/pdf/process';
            
            $response = Http::timeout(5)->post($pdfServiceUrl, [
                'book_id' => $book->id,
                'file_path' => $path,
                'tenant_id' => $user->tenant_id,
            ]);

            if ($response->successful()) {
                $book->update(['render_status' => 'processing']);
            } else {
                Log::error('PDF Service Call Failed: ' . $response->body());
                $book->update(['render_status' => 'failed']);
            }

            return response()->json([
                'message' => 'Kitap başarıyla yüklendi ve işleme alındı.',
                'data' => $book
            ], 202);

        } catch (\Exception $e) {
            Log::error('Book Upload Error: ' . $e->getMessage());
            return response()->json(['message' => 'Dosya yüklenirken bir hata oluştu.'], 500);
        }
    }
}

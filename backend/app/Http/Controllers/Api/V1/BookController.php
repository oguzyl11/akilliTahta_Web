<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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
                'render_status' => 'completed',
                'created_by' => $user->id,
            ]);

            // PDF dosyasını parse edip gerçek sayfa sayısını bulalım
            $parser = new \Smalot\PdfParser\Parser();
            $pdf = $parser->parseFile($file->getPathname());
            $pageCount = count($pdf->getPages());

            // Bulunan sayfa sayısı kadar veritabanına sayfa kaydı oluşturalım
            for ($i = 1; $i <= $pageCount; $i++) {
                $svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1131'><rect width='800' height='1131' fill='%23e2e8f0'/><text x='400' y='565' font-size='60' fill='%23475569' text-anchor='middle'>Sayfa {$i} Yükleniyor...</text></svg>";
                
                \App\Models\BookPage::create([
                    'book_id' => $book->id,
                    'page_number' => $i,
                    'image_url' => "data:image/svg+xml," . $svg,
                    'image_width' => 800,
                    'image_height' => 1131,
                    'text_coords' => [],
                ]);
            }

            // Kitabın sayfa sayısını güncelle
            $book->update(['page_count' => $pageCount]);

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

    /**
     * PDF dosyasını CORS uyumlu olarak sun.
     * php artisan serve statik dosyalar için middleware çalıştırmadığından
     * bu endpoint üzerinden PDF sunuyoruz.
     */
    public function servePdf(Request $request, $bookId)
    {
        $user = $request->user();

        $query = Book::where('tenant_id', $user->tenant_id);

        if ($bookId === 'latest') {
            $book = $query->latest()->first();
        } else {
            $book = $query->where('id', $bookId)->first();
        }

        if (!$book || !$book->pdf_url) {
            return response()->json(['message' => 'PDF bulunamadı.'], 404);
        }

        $disk = Storage::disk('public');

        if (!$disk->exists($book->pdf_url)) {
            return response()->json(['message' => 'PDF dosyası sunucuda bulunamadı.'], 404);
        }

        return response($disk->get($book->pdf_url), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . basename($book->pdf_url) . '"',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}

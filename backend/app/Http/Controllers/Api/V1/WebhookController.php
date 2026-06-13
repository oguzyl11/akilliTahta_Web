<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class WebhookController extends Controller
{
    /**
     * Python PDF servisinden gelen işlem sonucunu alır.
     */
    public function pdfProcessed(Request $request)
    {
        $request->validate([
            'book_id' => 'required|integer|exists:books,id',
            'status' => 'required|string|in:COMPLETED,FAILED',
        ]);

        $book = Book::findOrFail($request->book_id);

        try {
            DB::beginTransaction();

            if ($request->status === 'FAILED') {
                $book->update([
                    'render_status' => 'failed',
                    // İleride error_message alanı books tablosuna eklenebilir, şu an yok
                ]);
            } else {
                // COMPLETED
                $book->update([
                    'render_status' => 'completed',
                    'page_count' => $request->total_pages ?? 0,
                ]);

                // Gelen sayfaları BookPage olarak kaydet
                if ($request->has('pages')) {
                    foreach ($request->pages as $pageData) {
                        BookPage::create([
                            'book_id' => $book->id,
                            'page_number' => $pageData['page_number'],
                            'image_url' => $pageData['image_url'],
                            // İleride pdfplumber'dan gelen text koordinatları da buraya JSON olarak konabilir
                            // Şimdilik sadece extract edilen text metni varsa kullanabiliriz
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Webhook received successfully']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Webhook Error for Book ' . $request->book_id . ': ' . $e->getMessage());
            return response()->json(['message' => 'Internal server error processing webhook'], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookPage;
use App\Models\Hotspot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EditorController extends Controller
{
    /**
     * Kitabın sayfalarını ve varolan hotspotları döndürür.
     */
    public function getPages($bookId)
    {
        // Yetki Kontrolü: Yalnızca öğretmenler, adminler vs.
        $user = Auth::user();
        if (!in_array($user->role, ['TEACHER', 'INSTITUTION_ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = Book::where('tenant_id', $user->tenant_id);
        
        if ($bookId === 'latest') {
            $book = $query->latest()->firstOrFail();
        } else {
            $book = $query->where('id', $bookId)->firstOrFail();
        }

        $pages = BookPage::where('book_id', $book->id)
            ->with('hotspots') // Hotspot.questions da istenirse: 'hotspots.questions'
            ->orderBy('page_number', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'book' => $book,
                'pages' => $pages
            ]
        ]);
    }

    /**
     * İlgili sayfaya yeni bir Hotspot (video, soru, link) ekler.
     */
    public function storeHotspot(Request $request, $pageId)
    {
        $user = Auth::user();
        if (!in_array($user->role, ['TEACHER', 'INSTITUTION_ADMIN', 'SUPER_ADMIN'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $page = BookPage::where('id', $pageId)->firstOrFail();
        
        // Güvenlik: Kitabın bizim tenant'ımıza ait olduğundan emin olalım
        $book = Book::where('id', $page->book_id)->where('tenant_id', $user->tenant_id)->firstOrFail();

        $validated = $request->validate([
            'type' => 'required|string|in:video,question,popup,link',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'width' => 'required|numeric',
            'height' => 'required|numeric',
            'payload' => 'nullable|array',
            'order_index' => 'nullable|integer',
        ]);

        $hotspot = Hotspot::create(array_merge($validated, [
            'book_page_id' => $page->id
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Hotspot başarıyla kaydedildi.',
            'data' => $hotspot
        ], 201);
    }
}

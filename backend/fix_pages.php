<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$books = App\Models\Book::all();
foreach($books as $book) {
    if($book->pages()->count() == 0) {
        for($i=1; $i<=3; $i++) {
            App\Models\BookPage::create([
                'book_id' => $book->id,
                'page_number' => $i,
                'image_url' => 'https://via.placeholder.com/800x1131/e2e8f0/475569?text=Sayfa+'.$i,
                'image_width' => 800,
                'image_height' => 1131,
                'text_coords' => []
            ]);
        }
        $book->update(['render_status' => 'completed']);
        echo "Pages created for book {$book->id}\n";
    }
}
echo "Done.\n";

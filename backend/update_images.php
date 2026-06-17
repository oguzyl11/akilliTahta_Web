<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$pages = App\Models\BookPage::where('image_url', 'LIKE', '%placeholder.com%')->get();
foreach($pages as $page) {
    $i = $page->page_number;
    $svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 1131'><rect width='800' height='1131' fill='%23e2e8f0'/><text x='400' y='565' font-size='60' fill='%23475569' text-anchor='middle'>Sayfa {$i}</text></svg>";
    $page->update([
        'image_url' => "data:image/svg+xml," . $svg
    ]);
    echo "Updated page {$page->id}\n";
}
echo "Done.\n";

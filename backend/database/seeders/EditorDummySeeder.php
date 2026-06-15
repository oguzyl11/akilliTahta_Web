<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\BookPage;
use App\Models\Tenant;
use Illuminate\Database\Seeder;

class EditorDummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // İlk Tenant'ı al
        $tenant = Tenant::first();
        if (!$tenant) {
            $this->command->error('Lütfen önce DatabaseSeeder çalıştırıp Tenant oluşturun.');
            return;
        }

        // Örnek bir editör kitabı oluşturalım
        $book = Book::create([
            'tenant_id' => $tenant->id,
            'title' => 'İnteraktif Fizik Kitabı (Örnek)',
            'subject' => 'Fizik',
            'grade_level' => 11,
            'pdf_url' => 'mock/fizik.pdf',
            'pdf_size_bytes' => 10485760, // 10 MB
            'render_status' => 'completed',
        ]);

        // 3 sayfa ekleyelim (Dummy resimlerle)
        // placeholder.com veya statik bir renkli resim URL'si
        $dummyImages = [
            'https://via.placeholder.com/800x1131/e2e8f0/475569?text=Fizik+Sayfa+1',
            'https://via.placeholder.com/800x1131/e2e8f0/475569?text=Fizik+Sayfa+2',
            'https://via.placeholder.com/800x1131/e2e8f0/475569?text=Fizik+Sayfa+3',
        ];

        foreach ($dummyImages as $index => $imageUrl) {
            BookPage::create([
                'book_id' => $book->id,
                'page_number' => $index + 1,
                'image_url' => $imageUrl,
                'image_width' => 800,
                'image_height' => 1131,
                'text_coords' => [],
            ]);
        }

        $this->command->info('Editor Dummy verileri başarıyla oluşturuldu.');
    }
}

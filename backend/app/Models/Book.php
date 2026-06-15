<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'tenant_id',
        'title',
        'subject',
        'grade_level',
        'cover_url',
        'pdf_url',
        'pdf_size_bytes',
        'version',
        'render_status', // pending, processing, completed, failed
        'page_count',
        'created_by'
    ];

    /**
     * Get the pages for the book.
     */
    public function pages()
    {
        return $this->hasMany(BookPage::class)->orderBy('page_number');
    }
}

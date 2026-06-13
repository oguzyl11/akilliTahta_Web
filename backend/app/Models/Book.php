<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'title',
        'subject',
        'grade_level',
        'cover_url',
        'pdf_url',
        'pdf_size_bytes',
        'version',
        'render_status',
        'page_count',
        'created_by',
    ];

    /**
     * Get the pages of the book.
     */
    public function pages()
    {
        return $this->hasMany(BookPage::class);
    }

    /**
     * Get the user who created the book.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_id',
        'page_number',
        'image_url',
        'image_width',
        'image_height',
        'text_coords',
    ];

    protected $casts = [
        'text_coords' => 'array',
    ];

    /**
     * Get the book that owns the page.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the hotspots for the page.
     */
    public function hotspots()
    {
        return $this->hasMany(Hotspot::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotspot extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_page_id',
        'type', // video, question, popup, link
        'x',
        'y',
        'width',
        'height',
        'payload',
        'order_index',
    ];

    protected $casts = [
        'payload' => 'array',
        'x' => 'decimal:4',
        'y' => 'decimal:4',
        'width' => 'decimal:4',
        'height' => 'decimal:4',
    ];

    /**
     * Get the page that owns the hotspot.
     */
    public function page()
    {
        return $this->belongsTo(BookPage::class, 'book_page_id');
    }

    /**
     * Get the questions for the hotspot.
     */
    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}

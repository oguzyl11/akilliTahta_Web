<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotspot_id',
        'type', // multiple_choice, true_false, fill_blank, match
        'body',
        'options',
        'correct_answer',
        'explanation',
        'points',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_answer' => 'array',
    ];

    /**
     * Get the hotspot that owns the question.
     */
    public function hotspot()
    {
        return $this->belongsTo(Hotspot::class);
    }
}

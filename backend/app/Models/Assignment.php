<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assignment extends Model
{
    use HasFactory, BelongsToTenant, SoftDeletes;

    protected $fillable = [
        'classroom_id',
        'teacher_id',
        'book_id',
        'title',
        'description',
        'due_date',
        'status', // draft, active, closed
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    /**
     * Get the classroom this assignment belongs to.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

    /**
     * Get the teacher who created the assignment.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the book associated with the assignment.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    /**
     * Get the submissions for the assignment.
     */
    public function submissions()
    {
        return $this->hasMany(AssignmentSubmission::class);
    }
}

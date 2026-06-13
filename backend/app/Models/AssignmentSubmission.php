<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'assignment_id',
        'student_id',
        'status', // not_started, in_progress, submitted
        'score',
        'max_score',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
        'max_score' => 'decimal:2',
    ];

    /**
     * Get the assignment.
     */
    public function assignment()
    {
        return $this->belongsTo(Assignment::class);
    }

    /**
     * Get the student who submitted.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the answers for this submission.
     */
    public function answers()
    {
        return $this->hasMany(QuestionAnswer::class, 'submission_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestionAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'submission_id',
        'question_id',
        'student_id',
        'given_answer',
        'is_correct',
        'time_spent_seconds',
    ];

    protected $casts = [
        'given_answer' => 'array',
        'is_correct' => 'boolean',
    ];

    /**
     * Get the submission this answer belongs to.
     */
    public function submission()
    {
        return $this->belongsTo(AssignmentSubmission::class, 'submission_id');
    }

    /**
     * Get the question this answer is for.
     */
    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    /**
     * Get the student who answered.
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

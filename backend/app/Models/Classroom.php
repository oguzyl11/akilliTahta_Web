<?php

namespace App\Models;

use App\Models\Traits\BelongsToTenant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory, BelongsToTenant;

    protected $fillable = [
        'name',
        'grade_level',
        'branch',
        'teacher_id',
        'academic_year',
    ];

    /**
     * Get the teacher that manages the classroom.
     */
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    /**
     * Get the students in the classroom.
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }
}

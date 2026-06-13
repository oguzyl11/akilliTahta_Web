<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'subdomain',
        'logo_url',
        'primary_color',
        'license_type',
        'user_limit',
        'is_active',
    ];

    /**
     * Get the users for the tenant.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
    
    /**
     * Get the classrooms for the tenant.
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}

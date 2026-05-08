<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'priority',
        'user_id'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

    // Accessor pour formater la date
    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('d/m/Y');
    }

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
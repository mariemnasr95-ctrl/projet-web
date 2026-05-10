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
        'user_id',
        'favorite'
    ];

    protected $casts = [
        'created_at' => 'datetime:Y-m-d',
    ];

   
    public function getFormattedDateAttribute()
    {
        return $this->created_at->format('d/m/Y');
    }

   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['title', 'description', 'status', 'ends_at'])]
class Vote extends Model
{
    protected $casts = [
        'ends_at' => 'datetime',
    ];

    public function responses(): HasMany
    {
        return $this->hasMany(VoteResponse::class);
    }
}

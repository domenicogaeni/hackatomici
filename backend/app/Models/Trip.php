<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);

    }

    public function tripPoints()
    {
        return $this->hasMany(TripPoint::class);
    }
}

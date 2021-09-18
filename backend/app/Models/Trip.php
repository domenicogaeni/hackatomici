<?php

namespace App\Models;

class Trip extends BaseModel
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

<?php

namespace App\Models;

class TripPoint extends BaseModel
{
    public function trip()
    {
        return $this->belongsTo(Trip::class);

    }
}

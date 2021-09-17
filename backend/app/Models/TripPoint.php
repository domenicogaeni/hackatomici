<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripPoint extends Model
{
    public function trip()
    {
        return $this->belongsTo(Trip::class);

    }
}

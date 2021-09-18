<?php

namespace App\Models;

class FavouritePlace extends BaseModel
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

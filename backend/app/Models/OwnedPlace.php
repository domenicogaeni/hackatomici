<?php

namespace App\Models;

class OwnedPlace extends BaseModel
{
    public function user()
    {
        return $this->belongsTo(User::class);

    }
}

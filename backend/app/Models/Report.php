<?php

namespace App\Models;

class Report extends BaseModel
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(UserVote::class);
    }
}

<?php

namespace App\Models;

class UserVote extends BaseModel
{
    protected $table = 'users_votes';

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}

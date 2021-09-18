<?php

namespace App\Models;

class UserVote extends BaseModel
{
    protected $table = 'users_votes';

    public const UP = 'up';
    public const DOWN = 'down';

    public function setVoteAttribute($value)
    {
        $this->attributes['vote'] = $value === self::UP ? 1 : -1;
    }

    /** Relationships. */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function report()
    {
        return $this->belongsTo(Report::class);
    }
}

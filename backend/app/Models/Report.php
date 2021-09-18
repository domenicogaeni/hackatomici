<?php

namespace App\Models;

class Report extends BaseModel
{
    public const WHITE = 'white';
    public const YELLOW = 'yellow';
    public const ORANGE = 'orange';
    public const RED = 'red';

    public const COMMUNITY = 'community';
    public const VERIFIED = 'verified';

    protected array $fillable = [
        'title',
        'description',
        'level',
        'from',
        'to',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(UserVote::class);
    }
}

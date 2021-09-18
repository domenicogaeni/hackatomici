<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;

class Report extends BaseModel
{
    public const WHITE = 'white';
    public const YELLOW = 'yellow';
    public const ORANGE = 'orange';
    public const RED = 'red';

    public const COMMUNITY = 'community';
    public const VERIFIED = 'verified';

    protected $appends = ['vote'];

    protected $fillable = [
        'title',
        'description',
        'level',
        'from',
        'to',
    ];

    public function getVoteAttribute()
    {
        return DB::table('users_votes')
            ->where('report_id', $this->id)
            ->sum('vote');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function votes()
    {
        return $this->hasMany(UserVote::class);
    }
}

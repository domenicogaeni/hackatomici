<?php

namespace App\Models;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Report extends BaseModel
{
    public const WHITE = 'white';
    public const YELLOW = 'yellow';
    public const ORANGE = 'orange';
    public const RED = 'red';

    public const COMMUNITY = 'community';
    public const VERIFIED = 'verified';

    protected $appends = ['score', 'vote'];

    protected $fillable = [
        'title',
        'description',
        'level',
        'from',
        'to',
    ];

    public function getScoreAttribute()
    {
        return (int)DB::table('users_votes')
            ->where('report_id', $this->id)
            ->sum('vote');
    }

    public function getVoteAttribute()
    {
        $myVote = DB::table('users_votes')
            ->where('report_id', $this->id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if (!$myVote) {
            return null;
        }

        return match ($myVote->vote) {
            1 => 'up',
            -1 => 'down',
            default => null,
        };
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

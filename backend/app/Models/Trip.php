<?php

namespace App\Models;

use App\Helpers\ReportHelper;

class Trip extends BaseModel
{
    protected $fillable = [
        'name',
        'description',
        'from',
        'to'
    ];

    protected $appends = ['level'];

    public function getLevelAttribute()
    {
        $level = Report::WHITE;

        $tripPoints = TripPoint::where('trip_id', $this->id)->get();
        foreach ($tripPoints as $tripPoint) {
            $reports = ReportHelper::getReportsForPlaceId($tripPoint->place_id, $tripPoint->from, $tripPoint->to);
            foreach ($reports as $report) {
                if (Report::LEVEL_MAPPING[$report['level']] > Report::LEVEL_MAPPING[$level]) {
                    $level = $report['level'];
                }
                if ($level == Report::RED) {
                    break;
                }
            }
            if ($level == Report::RED) {
                break;
            }
        }

        return $level;
    }

    public function user()
    {
        return $this->belongsTo(User::class);

    }

    public function tripPoints()
    {
        return $this->hasMany(TripPoint::class);
    }
}

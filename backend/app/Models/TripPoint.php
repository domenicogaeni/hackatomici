<?php

namespace App\Models;

use App\Helpers\PlaceApiHelper;
use App\Helpers\ReportHelper;

class TripPoint extends BaseModel
{
    protected $appends = ['name', 'level'];
    protected $hidden = ['trip_id', 'parent_id', 'created_at', 'updated_at'];

    public function getNameAttribute()
    {
        return PlaceApiHelper::placeDetails($this->place_id)->name;
    }

    public function getLevelAttribute()
    {
        $level = Report::WHITE;
        
        $reports = ReportHelper::getReportsForPlaceId($this->place_id, $this->from, $this->to);
        foreach ($reports as $report) {
            if (Report::LEVEL_MAPPING[$report['level']] > Report::LEVEL_MAPPING[$level]) {
                $level = $report['level'];
            }
            if ($level == Report::RED) {
                break;
            }
        }

        return $level;
    }

    public function trip()
    {
        return $this->belongsTo(Trip::class);

    }
}

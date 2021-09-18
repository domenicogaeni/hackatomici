<?php

namespace App\Helpers;

use App\Models\Report;
use Illuminate\Database\Eloquent\Builder;

class ReportHelper
{
    public static function getReportsForPlaceId($placeId, $dateFrom, $dateTo)
    {
        $reports = [];
        // Per il singolo posto
        $placeReports = Report::where('place_id', $placeId)
            ->where('from', '<=', $dateFrom)
            ->where(function (Builder $query) use ($dateTo) {
                $query->where('to', '>=', $dateTo)
                    ->orWhereNull('to');
            })
            ->get()
            ->toArray();
        $reports = array_merge($reports, $placeReports);

        // Per i padri
        foreach (PlaceApiHelper::getAddressComponentsPlaceIds($placeId) as $componentPlaceId) {
            if($componentPlaceId == $placeId) {
                continue;
            }
            $placeReports = Report::where('place_id', $componentPlaceId)
                ->where('from', '<=', $dateFrom)
                ->where(function (Builder $query) use ($dateTo) {
                    $query->where('to', '>=', $dateTo)
                        ->orWhereNull('to');
                })
                ->get()
                ->toArray();
            $reports = array_merge($reports, $placeReports);
        }

        return $reports;
    }
}

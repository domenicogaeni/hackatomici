<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Helpers\PlaceApiHelper;
use App\Helpers\ReportHelper;
use App\Models\Report;
use App\Models\UserVote;
use App\Utils\DateUtils;
use Exception;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ReportController extends BaseController
{
    public static function getValidationRules()
    {
        return array_merge(parent::getValidationRules(), [
            'new' => [
                'title' => 'required|string',
                'description' => 'required|string',
                'level' => ['required', Rule::in([
                    Report::WHITE,
                    Report::YELLOW,
                    Report::ORANGE,
                    Report::RED
                ])],
                'from' => 'required|date',
                'to' => 'date|nullable',
            ],
            'voteReport' => [
                'vote' => ['required', Rule::in([
                    UserVote::UP,
                    UserVote::DOWN
                ])]
            ],
            'getForPlace' => [
                'from' => 'date',
                'to' => 'date',
            ]
        ]);
    }

    public function new(Request $request, $placeId)
    {
        $fillable = $request->only(['title', 'description', 'level', 'from', 'to']);
        $currentUser = Auth::user();
        $report = new Report();
        $report->fill($fillable);
        $report->place_id = $placeId;
        $report->user_id = $currentUser->id;
        $report->type = $currentUser->institution_place_id ? Report::VERIFIED : Report::COMMUNITY;

        $report->save();

        if ($report->type == Report::VERIFIED) {
            // device_id degli user che sono iscritti alle notifiche per questo luogo
            $deviceIds = DB::table('users')
                ->whereIn('id', function (Builder $query) use ($placeId) {
                    $query->select('user_id')
                        ->from('notifications_subscriptions')
                        ->where('place_id', $placeId)
                        ->distinct();
                })->distinct()->pluck('device_id');

            $place = PlaceApiHelper::placeDetails($placeId);

            // Mando tutte le notifiche
            foreach ($deviceIds as $deviceId) {
                NotificationHelper::send("Nuova segnalazione per {$place->name}", $report->title, $deviceId);
            }
        }

        return [];
    }

    public function voteReport(Request $request, $reportId)
    {
        $user = Auth::user();

        // Check that report is insert by community.
        $isInsertByCommunity = Report::where('type', Report::COMMUNITY)->findOrFail($reportId);
        if (!$isInsertByCommunity) {
            throw new Exception('report not votable.', 500);
        }

        // Check if user already vote.
        $vote = UserVote::where('user_id', $user->id)->where('report_id', $reportId)->first();
        if (!$vote) {
            $vote = new UserVote();
            $vote->user_id = $user->id;
            $vote->report_id = $reportId;
        }
        $vote->vote = $request->input('vote');

        $vote->save();

        return [];
    }

    public function deleteVote($reportId)
    {
        $user = Auth::user();

        $vote = UserVote::where('user_id', $user->id)->where('report_id', $reportId)->first();
        if (!$vote) {
            throw new Exception('not existing vote.', 500);
        }

        $vote->delete();

        return [];
    }

    public function getForPlace(Request $request, $placeId)
    {
        $dateFrom = $request->get('from') ?: DateUtils::today();
        $dateTo = $request->get('to') ?: $dateFrom;

        return ReportHelper::getReportsForPlaceId($placeId, $dateFrom, $dateTo);
    }
}

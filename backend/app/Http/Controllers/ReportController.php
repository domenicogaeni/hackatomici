<?php

namespace App\Http\Controllers;

use App\Helpers\PlaceApiHelper;
use App\Helpers\ReportHelper;
use App\Models\Report;
use App\Models\UserVote;
use App\Utils\DateUtils;
use Exception;
use Illuminate\Database\Eloquent\Builder;
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
                'to' => 'filled|date',
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
            // TODO: Notifiche alle persone che hanno questo place nei preferiti

            // TODO: Notifiche alle persone che hanno i sotto-luoghi di questo place nei preferiti

        }
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
    }

    public function deleteVote($reportId)
    {
        $user = Auth::user();

        $vote = UserVote::where('user_id', $user->id)->where('report_id', $reportId)->first();
        if (!$vote) {
            throw new Exception('not existing vote.', 500);
        }

        $vote->delete();
    }

    public function getForPlace(Request $request, $placeId)
    {
        $dateFrom = $request->get('from') ?: DateUtils::today();
        $dateTo = $request->get('to') ?: $dateFrom;

        return ReportHelper::getReportsForPlaceId($placeId, $dateFrom, $dateTo);
    }
}

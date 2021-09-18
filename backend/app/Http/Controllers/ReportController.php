<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $report->refresh();

        // TODO: Mandare le notifiche alle persone coinvolte in questa comunicazione. 
    }
}

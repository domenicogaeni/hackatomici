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
                'place_id' => 'required|string',
                'title' => 'required|string',
                'descriprion' => 'required|string',
                'level' => ['required', Rule::in([
                    Report::WHITE,
                    Report::YELLOW,
                    Report::ORANGE,
                    Report::RED
                ])],
                'from' => 'required|datetime',
                'to' => 'fillable|datetime',
            ],
        ]);
    }

    public function new(Request $request)
    {        
    }
}

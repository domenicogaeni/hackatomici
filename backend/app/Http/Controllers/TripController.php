<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripController extends BaseController
{
    public static function getValidationRules()
    {
        return array_merge(parent::getValidationRules(), [
            'new' => [
                'name' => 'required|string',
                'description' => 'filled|string',
                'from' => 'required|date',
                'to' => 'required|date',
            ],
            'edit' => [
                'name' => 'string',
                'description' => 'string',
                'from' => 'date',
                'to' => 'date',
            ],
        ]);
    }

    public function new(Request $request)
    {
        $currentUser = Auth::user();
        $fillable = $request->only(['name', 'description', 'from', 'to']);

        $trip = new Trip();
        $trip->user_id = $currentUser->id;
        $trip->fill($fillable);

        $trip->save();

        return [];
    }

    public function edit(Request $request, $tripId)
    {
        $currentUser = Auth::user();
        $fillable = $request->only(['name', 'description', 'from', 'to']);

        $trip = Trip::where('user_id', $currentUser->id)->findOrFail($tripId);
        $trip->fill($fillable);

        $trip->save();

        return [];
    }

    public function delete($tripId)
    {
        $currentUser = Auth::user();

        $trip = Trip::where('user_id', $currentUser->id)->findOrFail($tripId);

        TripPoint::where('trip_id', $trip->id)->delete();
        $trip->delete();

        return [];
    }

    public function getList()
    {
        return Trip::where('user_id', Auth::user()->id)->get();
    }
}

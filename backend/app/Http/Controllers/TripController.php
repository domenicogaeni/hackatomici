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
            'addStop' => [
                'place_id' => 'required|string',
                'from' => 'required|date',
                'to' => 'required|date',
                'points' => 'array',                                                
            ],            
            'editStop' => [
                'place_id' => 'required|string',
                'from' => 'required|date',
                'to' => 'required|date',
                'points' => 'array',                                                  
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

    public function addStop(Request $request, $tripId)
    {
        $stop = $request->all();
        $currentUser = Auth::user();
     
        Trip::where('user_id', $currentUser->id)->findOrFail($tripId);

        $singleStop = new TripPoint();
        $singleStop->trip_id = $tripId;
        $singleStop->place_id = $stop['place_id'];
        $singleStop->from = $stop['from'];
        $singleStop->to = $stop['to'];
        $singleStop->save();
        $singleStop->refresh();

        if (isset($stop['points'])) {
            array_map(function ($point) use($tripId, $singleStop) {
                $singlePoint = new TripPoint();
                $singlePoint->trip_id = $tripId;
                $singlePoint->place_id = $point;
                $singlePoint->parent_id = $singleStop->id;
                $singlePoint->from = $singleStop->from;
                $singlePoint->to = $singleStop->to;
                $singlePoint->save();
            }, $stop['points']);
        }   
    }

    public function editStop(Request $request, $tripId, $stopId)
    {
        $currentUser = Auth::user();
     
        Trip::where('user_id', $currentUser->id)->findOrFail($tripId);
        TripPoint::where('trip_id', $tripId)->whereNull('parent_id')->findOrFail($stopId);
        
        $this->deleteStop($tripId, $stopId);
        $this->addStop($request, $tripId);        
    }

    public function deleteStop($tripId, $stopId)
    {
        $currentUser = Auth::user();
     
        Trip::where('user_id', $currentUser->id)->findOrFail($tripId);
        $tripPoint = TripPoint::where('trip_id', $tripId)->findOrFail($stopId);
        
        TripPoint::where('trip_id', $tripId)->where('parent_id', $stopId)->delete();
        $tripPoint->delete();       
    }
}
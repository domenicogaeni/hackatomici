<?php

namespace App\Http\Controllers;


use App\Models\FavouritePlace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavouritePlaceController extends BaseController
{
    public static function getValidationRules()
    {
        return array_merge(parent::getValidationRules(), [
            'add' => [
                'places_ids' => 'required|array',
            ],
        ]);
    }

    public function getList()
    {
        return FavouritePlace::where('user_id', Auth::user()->id)
            ->get();
    }

    public function add(Request $request)
    {
        $placesIds = $request->get('places_ids');

        foreach ($placesIds as $placeId) {
            $favouritePlace = new FavouritePlace();
            $favouritePlace->user_id = Auth::user()->id;
            $favouritePlace->place_id = $placeId;
            $favouritePlace->save();
        }

        return [];
    }

    public function delete(Request $request, $id)
    {
        $favouritePlace = FavouritePlace::where('user_id', Auth::user()->id)
            ->findOrFail($id);

        $favouritePlace->delete();

        return [];
    }
}

<?php

namespace App\Http\Controllers;


use App\Helpers\NotificationHelper;
use App\Helpers\PlaceApiHelper;
use App\Models\FavouritePlace;
use Exception;
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
        $placesIds = FavouritePlace::where('user_id', Auth::user()->id)
            ->pluck('place_id');

        $list = [];
        foreach ($placesIds as $placeId) {
            $list[] = PlaceApiHelper::placeDetails($placeId);
        }

        return $list;
    }

    public function add(Request $request)
    {
        $placesIds = $request->get('places_ids');

        foreach ($placesIds as $placeId) {
            if (!FavouritePlace::where('user_id', Auth::user()->id)->where('place_id', $placeId)->exists()) {
                $favouritePlace = new FavouritePlace();
                $favouritePlace->user_id = Auth::user()->id;
                $favouritePlace->place_id = $placeId;
                $favouritePlace->save();
                $favouritePlace->refresh();

                NotificationHelper::subscribeToPlaceAndHisParents(Auth::user()->id, $placeId, $favouritePlace->id);
            }
        }

        return [];
    }

    public function delete(Request $request, $placeId)
    {
        $favouritePlace = FavouritePlace::where('user_id', Auth::user()->id)
            ->where('place_id', $placeId)
            ->first();
        if (!$favouritePlace) {
            throw new Exception('place_id not found in favourites');
        }

        NotificationHelper::unsubscribeFromPlaceAndHisParents(Auth::user()->id, $favouritePlace->place_id, $favouritePlace->id);
        $favouritePlace->delete();

        return [];
    }
}

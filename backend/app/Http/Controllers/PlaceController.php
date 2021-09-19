<?php

namespace App\Http\Controllers;

use App\Helpers\PlaceApiHelper;
use App\Models\FavouritePlace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PlaceController extends BaseController
{
    public function get(Request $request, $placeId)
    {
        $place = PlaceApiHelper::placeDetails($placeId);

        $place->favourite = FavouritePlace::where('user_id', Auth::user()->id)
            ->where('place_id', $placeId)
            ->exists();

        return $place;
    }
}

<?php

namespace App\Http\Controllers;

use App\Helpers\PlaceApiHelper;
use Illuminate\Http\Request;

class PlaceController extends BaseController
{
    public function get(Request $request, $placeId)
    {
        return PlaceApiHelper::placeDetails($placeId);
    }
}

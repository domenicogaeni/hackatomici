<?php

namespace App\Helpers;

use App\Models\CachedPlace;
use Illuminate\Support\Facades\DB;
use SKAgarwal\GoogleApi\PlacesApi;

class PlaceApiHelper
{
    public const RECOGNIZED_TYPES = [
        'locality',
        'administrative_area_level_2',
        'administrative_area_level_1',
        'country'
    ];

    public static function placesApiInstance()
    {
        return new PlacesApi(env('GOOGLE_API_TOKEN'));
    }

    public static function placeDetails($placeId)
    {
        $place = CachedPlace::find($placeId);

        if (!$place) {
            $response = self::placesApiInstance()->placeDetails($placeId, ['language' => 'it']);
            // TODO: Se non trovo niente?

            $place = new CachedPlace();
            $place->place_id = $placeId;
            $place->type = self::getType($response['result']['types']);
            $place->name = $response['result']['name'];
            $place->latitude = $response['result']['geometry']['location']['lat'];
            $place->longitude = $response['result']['geometry']['location']['lng'];
            $place->locality = self::getAddressComponent($response['result']['address_components'], 'locality');
            $place->administrative_area_level_2 = self::getAddressComponent($response['result']['address_components'], 'administrative_area_level_2');
            $place->administrative_area_level_1 = self::getAddressComponent($response['result']['address_components'], 'administrative_area_level_1');
            $place->country = self::getAddressComponent($response['result']['address_components'], 'country');
            $place->save();
        }

        return $place;
    }

    public static function findPlace($input)
    {
        DB::enableQueryLog();
        $place = CachedPlace::whereRaw("LOWER(name) LIKE '%" . addslashes(strtolower($input)) . "%'")
            ->first();

        if (!$place) {
            $response = self::placesApiInstance()->findPlace($input, 'textquery', ['language' => 'it']);
            // TODO: Se non trovo niente? O se ne trovo più di uno?

            $place = self::placeDetails($response['candidates'][0]['place_id']);
        }

        return $place;
    }

    public static function getAddressComponentsPlaceIds($placeId)
    {
        $placeDetail = self::placeDetails($placeId);
        $addressComponents = [];

        foreach (self::RECOGNIZED_TYPES as $type) {
            if ($placeDetail->{$type}) {
                $place = self::findPlace($placeDetail->{$type});
                $addressComponents[] = $place->place_id;
            }
        }

        return $addressComponents;
    }

    private static function getType($types)
    {
        foreach (self::RECOGNIZED_TYPES as $recognizedType) {
            if (in_array($recognizedType, $types)) {
                return $recognizedType;
            }
        }
        return 'point_of_interest';
    }

    private static function getAddressComponent($addressComponents, $type)
    {
        foreach ($addressComponents as $addressComponent) {
            if (in_array($type, $addressComponent['types'])) {
                return $addressComponent['long_name'];
            }
        }
        return null;
    }
}

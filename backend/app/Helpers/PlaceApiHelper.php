<?php

namespace App\Helpers;

use App\Models\CachedPlace;
use SKAgarwal\GoogleApi\PlacesApi;

class PlaceApiHelper
{
    public const RECOGNIZED_TYPES = [
        'locality',
        'administrative_area_level_2',
        'administrative_area_level_1',
        'country'
    ];

    public static function getPlacesApiInstance()
    {
        return new PlacesApi(env('GOOGLE_API_TOKEN'));
    }

    public static function placeDetails($placeId)
    {
        $place = CachedPlace::find($placeId);

        if (!$place) {
            $response = self::getPlacesApiInstance()->placeDetails($placeId);
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

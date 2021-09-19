<?php

namespace App\Helpers;

use App\Models\NotificationSubscription;
use Exception;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;

class NotificationHelper
{
    // Function to send notificatio to specific device id.
    public static function send($title, $description, $deviceToken)
    {
        $messaging = app('firebase.messaging');

        try {
            $message = CloudMessage::withTarget('token', $deviceToken)
                ->withNotification(Notification::create($title, $description));
            $messaging->send($message);
        } catch (\Kreait\Firebase\Exception\Messaging\NotFound $e) {
            throw new Exception($e);
        }
    }

    public static function subscribeToPlace($userId, $placeId, $favouritePlaceId = null, $tripPointId = null)
    {
        if (!NotificationSubscription::where('user_id', $userId)
            ->where('place_id', $placeId)
            ->where('favourite_place_id', $favouritePlaceId)
            ->where('trip_point_id', $tripPointId)
            ->exists()) {
            $sub = new NotificationSubscription();
            $sub->user_id = $userId;
            $sub->place_id = $placeId;
            $sub->favourite_place_id = $favouritePlaceId;
            $sub->trip_point_id = $tripPointId;
            $sub->save();
        }
    }

    public static function subscribeToPlaceAndHisParents($userId, $placeId, $favouritePlaceId = null, $tripPointId = null)
    {
        $placesIds = PlaceApiHelper::getAddressComponentsPlaceIds($placeId);
        foreach ($placesIds as $id) {
            self::subscribeToPlace($userId, $id, $favouritePlaceId, $tripPointId);
        }
    }

    public static function unsubscribeFromPlace($userId, $placeId, $favouritePlaceId = null, $tripPointId = null)
    {
        NotificationSubscription::where('user_id', $userId)
            ->where('place_id', $placeId)
            ->where('favourite_place_id', $favouritePlaceId)
            ->where('trip_point_id', $tripPointId)
            ->delete();
    }

    public static function unsubscribeFromPlaceAndHisParents($userId, $placeId, $favouritePlaceId = null, $tripPointId = null)
    {
        $placesIds = PlaceApiHelper::getAddressComponentsPlaceIds($placeId);
        foreach ($placesIds as $id) {
            self::unsubscribeFromPlace($userId, $id, $favouritePlaceId, $tripPointId);
        }
    }
}

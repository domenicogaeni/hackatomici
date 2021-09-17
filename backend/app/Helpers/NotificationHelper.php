<?php

namespace App\Helpers;

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
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends BaseController
{
    public static function getValidationRules()
    {
        return array_merge(parent::getValidationRules(), [
            'register' => [
                'email' => 'required|email',
                'password' => 'required|string',                
            ],
            'setDeviceId' => [
                'device_id' => 'required|string',                
            ]
        ]);
    }

    public function register(Request $request)
    {

    }

    public function setDeviceId(Request $request)
    {

    }
}

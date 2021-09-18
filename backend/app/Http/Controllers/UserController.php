<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends BaseController
{
    public static function getValidationRules()
    {
        return array_merge(parent::getValidationRules(), [
            'register' => [
                'firebase_uid' => 'required|string',
                'name' => 'required|string',
                'surname' => 'required|string',
                'email' => 'required|email',
            ],
            'setDeviceId' => [
                'device_id' => 'required|string',                
            ]
        ]);
    }

    public function register(Request $request)
    {
        $fillable = $request->only(['name', 'surname', 'email']);
        $user = new User();
        $user->firebase_uid = $request->input('firebase_uid');
        $user->fill($fillable);    
        
        $user->save();
        $user->refresh();

        return User::find($user->id);
    }

    public function setDeviceId(Request $request)
    {
        $currentUser = User::findOrFail(Auth::user()->id);    
        $currentUser->device_id = $request->input('device_id');

        $currentUser->save();
    }

    public function me()
    {
        if (!isset(Auth::user()->id)) {
            throw new Exception('user not register.', 500);
        }

        return User::find(Auth::user()->id);
    }
}

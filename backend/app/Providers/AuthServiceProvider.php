<?php

namespace App\Providers;

use stdClass;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Firebase\Auth\Token\Exception\InvalidToken;
use Kreait\Laravel\Firebase\Facades\Firebase;



class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.        
        $this->app['auth']->viaRequest('api', function ($request) {
            if ($request->bearerToken()) {                
                // Autenticazione con Firebase dall'app.
                try {                                            
                    $auth = app('firebase.auth');
                    $idTokenString = $request->bearerToken();
                    if (env('APP_ENV') == 'local' || env('APP_ENV') == 'testing') {
                        $uid = $idTokenString;
                    } else {
                        $verifiedIdToken = $auth->verifyIdToken($idTokenString);
                        $uid = $verifiedIdToken->claims()->get('sub');
                    }                        
                    $user = $auth->getUser($uid);
                    $customUser = User::where('firebase_uid', $uid)->first();
                    $response = new stdClass();                                                
                    if (isset($customUser)) {
                        $response = (object)$customUser->getBasicInfo();                    
                    }                    
                    $response->uid = $user->uid;                
                } catch (\InvalidArgumentException $e) {
                    $response = null;
                } catch (InvalidToken $e) {
                    $response = null;
                }

                return $response;                
            }            
        });
    }
}

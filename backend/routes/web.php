<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\FavouritePlaceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return ['status' => 'OK'];
});

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->group(['prefix' => 'auth'], function () use ($router) {
        $router->post('/register', UserController::class . '@register');
        $router->post('/device_id', UserController::class . '@setDeviceId');
        $router->get('/me', UserController::class . '@me');
    });

    $router->group(['prefix' => 'users'], function () use ($router) {
        $router->group(['prefix' => 'favourite_places'], function () use ($router) {
            $router->get('', FavouritePlaceController::class . '@getList');
            $router->post('', FavouritePlaceController::class . '@add');
            $router->delete('{id}', FavouritePlaceController::class . '@delete');
        });
    });

    $router->group(['prefix' => 'reports'], function () use ($router) {
        $router->post('/places/{place_id}', ReportController::class . '@new');
    });
});

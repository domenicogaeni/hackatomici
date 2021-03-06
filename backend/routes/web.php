<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\FavouritePlaceController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TripController;
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

    $router->group(['prefix' => 'places'], function () use ($router) {
        $router->get('{placeId}', PlaceController::class . '@get');
    });

    $router->group(['prefix' => 'users'], function () use ($router) {
        $router->group(['prefix' => 'favourite_places'], function () use ($router) {
            $router->get('', FavouritePlaceController::class . '@getList');
            $router->post('', FavouritePlaceController::class . '@add');
            $router->delete('{placeId}', FavouritePlaceController::class . '@delete');
        });
    });

    $router->group(['prefix' => 'reports'], function () use ($router) {
        $router->group(['prefix' => 'places'], function () use ($router) {
            $router->post('{placeId}', ReportController::class . '@new');
            $router->get('{placeId}', ReportController::class . '@getForPlace');
        });

        $router->post('/{reportId}/vote', ReportController::class . '@voteReport');
        $router->delete('/{reportId}/vote', ReportController::class . '@deleteVote');
    });

    $router->group(['prefix' => 'trips'], function () use ($router) {
        $router->get('', TripController::class . '@getList');
        $router->post('/', TripController::class . '@new');
        $router->get('/{tripId}', TripController::class . '@get');
        $router->put('/{tripId}', TripController::class . '@edit');
        $router->delete('/{tripId}', TripController::class . '@delete');

        $router->post('/{tripId}/stops', TripController::class . '@addStop');
        $router->put('/{tripId}/stops/{stopId}', TripController::class . '@editStop');
        $router->delete('/{tripId}/stops/{stopId}', TripController::class . '@deleteStop');
    });
});

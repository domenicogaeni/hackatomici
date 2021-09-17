<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller;

class BaseController extends Controller
{
    public function __construct()
    {
        $this->middleware('validation');
    }

    public static function getValidationRules()
    {
        return [];
    }
}

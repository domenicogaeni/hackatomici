<?php


namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ValidationControllerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        list($controllerName ,$methodName)=explode('@',$request->route()[1]['uses']);
        $validationRules = $controllerName::getValidationRules();

        if(array_key_exists($methodName, $validationRules)){
            $methodRules = $validationRules[$methodName];
            Validator::make($request->all(), $methodRules)->validate();
        }

        return $next($request);
    }
}

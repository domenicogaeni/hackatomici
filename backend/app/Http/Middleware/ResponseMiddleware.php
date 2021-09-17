<?php


namespace App\Http\Middleware;


use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ResponseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        /** @var Request $request */
        /** @var Response $response */

        $response = $next($request);

        if (is_string($response->original) && Str::startsWith($response->original, '<!')) {
            return $response;
        }

        $content = [];
        if(is_array($response->original) && isset($response->original['error']))
            $content['error'] = $response->original['error'];
        else
            $content['data'] = $response->original;

        $response->setContent(json_encode($content));
        $response->header('Content-Type', 'application/json');

        return $response;
    }
}

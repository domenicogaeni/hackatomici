<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Response;
use Illuminate\Http\Request;

class CORSMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($this->isPreflightRequest($request)) {
            $response = $this->createEmptyResponse();
        } else {
            $response = $next($request);
        }

        return $this->addCorsHeaders($request, $response);
    }

    /**
     * Determine if request is a preflight request.
     *
     * @param \Illuminate\Http\Request $request
     * @return bool
     */
    protected function isPreflightRequest($request)
    {
        return $request->isMethod('OPTIONS');
    }

    /**
     * Create empty response for preflight request.
     *
     * @return \Illuminate\Http\Response
     */
    protected function createEmptyResponse()
    {
        return new Response(null, 204);
    }

    /**
     * Add CORS headers.
     *
     * @param \Illuminate\Http\Request  $request
     * @param \Illuminate\Http\Response $response
     * @return Response
     */
    protected function addCorsHeaders($request, $response)
    {
        foreach ([
                     'Access-Control-Allow-Origin' => '*',
                     'Access-Control-Max-Age' => (60 * 60 * 24),
                     'Access-Control-Allow-Headers' => $request->header('Access-Control-Request-Headers'),
                     'Access-Control-Allow-Methods' => $request->header('Access-Control-Request-Methods')
                         ?: 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS',
                     'Access-Control-Allow-Credentials' => 'true',
                     'Access-Control-Expose-Headers' => 'Content-Disposition',
                 ] as $header => $value) {
            $response->header($header, $value);
        }

        return $response;
    }
}

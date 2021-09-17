<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequestSanitazerMiddleware 
{
    /*
     * Middleware to trim the full request tree.
    */
    public function handle(Request $request, Closure $next)
    {
        $request->merge($this->trimTree($request->all()));

        return $next($request);
    }

    public function trimTree($tree)
    {
        if(is_string($tree)){
            return trim($tree);
        }

        if(is_array($tree)){
            return array_map(function($item) {
                return $this->trimTree($item);
            }, $tree);
        } else {
            return $tree;
        }
    }
}
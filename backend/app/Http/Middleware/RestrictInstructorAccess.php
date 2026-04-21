<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RestrictInstructorAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->role === 'instructor') {
            $restrictedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
            if (in_array($request->method(), $restrictedMethods)) {
                return response()->json(['success' => false, 'message' => 'Acceso Denegado.'], 403);
            }
        }
        return $next($request);
    }
}
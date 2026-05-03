<?php

namespace App\Http\Middleware;

use App\Models\Socio;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BloquearSocioSancionado
{
    public function handle(Request $request, Closure $next): Response
    {
        $idSocio = $request->input('id_socio');

        if (! $idSocio) {
            return response()->json([
                'status' => 'error',
                'message' => 'El id_socio es obligatorio para validar sanciones.',
            ], 422);
        }

        $socio = Socio::find($idSocio);

        if (! $socio) {
            return response()->json([
                'status' => 'error',
                'message' => 'Socio no encontrado.',
            ], 404);
        }

        if ($socio->faltas >= 3) {
            return response()->json([
                'status' => 'error',
                'message' => 'Suspendido por inasistencias. No puedes realizar nuevas reservas.',
                'data' => [
                    'id_socio' => $socio->id_socio,
                    'faltas' => $socio->faltas,
                ],
            ], 403);
        }

        return $next($request);
    }
}
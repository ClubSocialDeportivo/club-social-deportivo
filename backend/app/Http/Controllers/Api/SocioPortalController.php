<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\Request;

class SocioPortalController extends Controller
{
    public function perfil(Request $request)
    {
        $usuario = $request->user();

        if ((int) $usuario->id_rol !== 2) {
            return response()->json([
                'message' => 'No autorizado. Esta sección es solo para socios.'
            ], 403);
        }

        $socio = Socio::where('id_usuario', $usuario->id_usuario)->first();

        if (!$socio) {
            return response()->json([
                'message' => 'No existe un socio asociado a este usuario.'
            ], 404);
        }

        return response()->json([
            'socio' => $socio
        ]);
    }
}
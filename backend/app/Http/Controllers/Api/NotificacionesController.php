<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notificacion;

class NotificacionesController extends Controller
{
    /**
     * GET /api/mis-notificaciones?id_socio=#
     */
    public function index(Request $request)
    {
        $idSocio = $request->query('id_socio');

        if (!$idSocio) {
            return response()->json([
                'status' => 'error',
                'message' => 'id_socio es requerido'
            ], 400);
        }

        $notificaciones = Notificacion::where('id_socio', $idSocio)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $notificaciones
        ]);
    }

    /**
     * PUT /api/notificaciones/{id}/leer
     */
    public function marcarComoLeido($id)
    {
        $notificacion = Notificacion::findOrFail($id);

        $notificacion->update([
            'leido_boolean' => true
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notificación marcada como leída'
        ]);
    }
}
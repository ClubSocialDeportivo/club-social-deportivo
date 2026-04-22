<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SocioController extends Controller
{
    /**
     * Lista todos los socios con opción de búsqueda.
     */
    public function index(Request $request): JsonResponse
    {
        $queryText = $request->query('query');

        $socios = Socio::when($queryText, function ($query, $search) {
                return $query->where('nombre', 'LIKE', "%{$search}%")
                    ->orWhere('apellidos', 'LIKE', "%{$search}%")
                    ->orWhere('id_socio', $search);
            })
            ->orderBy('id_socio', 'desc')
            ->get();

        return response()->json([
            'message' => 'Lista de socios obtenida correctamente',
            'data' => $socios,
        ], 200);
    }

    /**
     * Muestra un socio por ID.
     */
    public function show(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado',
            ], 404);
        }

        return response()->json([
            'message' => 'Socio encontrado correctamente',
            'data' => $socio,
        ], 200);
    }

    /**
     * Lista todos los dependientes.
     */
    public function dependientes(): JsonResponse
    {
        $dependientes = Socio::where('es_titular', false)
            ->orderByDesc('id_socio')
            ->get();

        return response()->json([
            'message' => 'Lista de dependientes obtenida correctamente',
            'data' => $dependientes,
        ], 200);
    }

    /**
     * Lista titulares familiares activos o sin bandera de activo.
     */
    public function titulares(): JsonResponse
    {
        $titulares = Socio::where('es_titular', true)
            ->where('modalidad', 'Familiar')
            ->where(function ($query) {
                $query->where('activo', true)
                    ->orWhereNull('activo');
            })
            ->orderBy('nombre')
            ->get([
                'id_socio',
                'nombre',
                'apellidos',
                'activo',
                'estatus_financiero',
                'modalidad',
            ]);

        return response()->json([
            'message' => 'Lista de titulares obtenida correctamente',
            'data' => $titulares,
        ], 200);
    }

    /**
     * Verifica si un socio puede acceder según su estado financiero.
     */
    public function verificarAcceso(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'status' => 'error',
                'message' => 'El socio con ID #' . $id . ' no existe en el sistema.',
            ], 404);
        }

        if ($socio->estatus_financiero === 'Vigente') {
            return response()->json([
                'status' => 'success',
                'message' => 'Acceso Permitido',
                'socio' => $socio->nombre . ' ' . $socio->apellidos,
                'estatus' => $socio->estatus_financiero,
                'tipo_membresia' => $socio->tipo_membresia,
            ], 200);
        }

        return response()->json([
            'status' => 'warning',
            'message' => 'Acceso Restringido: ' . $socio->estatus_financiero,
            'socio' => $socio->nombre . ' ' . $socio->apellidos,
            'estatus' => $socio->estatus_financiero,
            'tipo_membresia' => $socio->tipo_membresia,
        ], 200);
    }
}
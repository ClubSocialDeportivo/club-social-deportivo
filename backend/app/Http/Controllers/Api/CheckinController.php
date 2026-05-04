<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Checkin;
use App\Models\Socio;

class CheckinController extends Controller
{
    /**
     * GET /api/checkins
     * Lista check-ins de hoy por defecto
     * Filtros: ?fecha=2026-04-01
     */
    public function index(Request $request)
    {
        $fecha = $request->get('fecha', now()->toDateString());

        $checkins = Checkin::with('socio')
            ->whereDate('fecha', $fecha)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'fecha'  => $fecha,
            'total'  => $checkins->count(),
            'data'   => $checkins,
        ]);
    }

    /**
     * POST /api/checkins
     * Registra un check-in validando membresía y adeudos
     * Body: { id_socio: 1 } o { numero_documento: "C10" }
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_socio'          => 'required_without:numero_documento|nullable|exists:tbl_socios,id_socio',
            'numero_documento'  => 'required_without:id_socio|nullable|string',
        ]);

        // Buscar socio por id o por número de documento
        if ($request->filled('id_socio')) {
            $socio = Socio::find($request->id_socio);
        } else {
            $socio = Socio::where('numero_documento', $request->numero_documento)->first();
        }

        if (!$socio) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Socio no encontrado.',
            ], 404);
        }

        // Validar membresía activa
        if (!$socio->activo) {
            $checkin = Checkin::create([
                'id_socio'         => $socio->id_socio,
                'acceso_permitido' => false,
                'motivo_denegado'  => 'Membresía inactiva',
            ]);
            return response()->json([
                'status'   => 'denegado',
                'message'  => 'Acceso denegado: membresía inactiva.',
                'socio'    => $socio,
                'checkin'  => $checkin,
            ], 200);
        }

        // Validar estatus financiero — solo "Vigente" permite acceso
        if ($socio->estatus_financiero !== 'Vigente') {
            $checkin = Checkin::create([
                'id_socio'         => $socio->id_socio,
                'acceso_permitido' => false,
                'motivo_denegado'  => "Adeudo pendiente (estatus: {$socio->estatus_financiero})",
            ]);
            return response()->json([
                'status'   => 'denegado',
                'message'  => "Acceso denegado: adeudo pendiente ({$socio->estatus_financiero}).",
                'socio'    => $socio,
                'checkin'  => $checkin,
            ], 200);
        }

        // Todo ok — registrar check-in
        $checkin = Checkin::create([
            'id_socio'         => $socio->id_socio,
            'acceso_permitido' => true,
        ]);

        return response()->json([
            'status'  => 'permitido',
            'message' => '¡Acceso permitido! Bienvenido.',
            'socio'   => $socio,
            'checkin' => $checkin,
        ], 201);
    }

    /**
     * GET /api/checkins/buscar?q=nombre_o_documento
     * Busca socios por nombre o número de documento para el buscador
     */
    public function buscarSocio(Request $request)
    {
        $q = $request->get('q', '');

        if (strlen($q) < 2) {
            return response()->json(['status' => 'success', 'data' => []]);
        }

        $socios = Socio::where('activo', true)
            ->where(function ($query) use ($q) {
                $query->whereRaw("LOWER(nombre || ' ' || apellidos) LIKE ?", ['%' . strtolower($q) . '%'])
                      ->orWhere('numero_documento', 'ILIKE', "%{$q}%")
                      ->orWhere('id_socio', is_numeric($q) ? $q : null);
            })
            ->select('id_socio', 'nombre', 'apellidos', 'numero_documento', 'tipo_membresia', 'estatus_financiero', 'activo')
            ->limit(10)
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $socios,
        ]);
    }
}
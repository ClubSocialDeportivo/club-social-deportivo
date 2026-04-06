<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Asistencia;
use App\Models\Agenda;
use Illuminate\Support\Str;

class AsistenciasController extends Controller
{
    /**
     * GET /api/asistencias
     * Lista todas las asistencias con relaciones
     * Soporta filtros: ?id_sesion=1 &fecha=2026-04-01 &id_instructor=2 &id_disciplina=3
     */
    public function index(Request $request)
    {
        $query = Asistencia::with([
            'socio',
            'sesion.disciplina',
            'sesion.instructor',
            'sesion.espacio',
        ]);

        // Filtro por sesión específica
        if ($request->has('id_sesion')) {
            $query->where('id_sesion', $request->id_sesion);
        }

        // Filtro por fecha (busca en tbl_agenda)
        if ($request->has('fecha')) {
            $query->whereHas('sesion', function ($q) use ($request) {
                $q->whereDate('fecha', $request->fecha);
            });
        }

        // Filtro por instructor
        if ($request->has('id_instructor')) {
            $query->whereHas('sesion', function ($q) use ($request) {
                $q->where('id_instructor', $request->id_instructor);
            });
        }

        // Filtro por disciplina
        if ($request->has('id_disciplina')) {
            $query->whereHas('sesion', function ($q) use ($request) {
                $q->where('id_disciplina', $request->id_disciplina);
            });
        }

        $asistencias = $query->orderBy('timestamp_registro', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'total'  => $asistencias->count(),
            'data'   => $asistencias,
        ]);
    }

    /**
     * GET /api/asistencias/sesion/{id_sesion}
     * Lista de asistencias de una sesión específica
     */
    public function porSesion($id_sesion)
    {
        $sesion = Agenda::with(['disciplina', 'instructor', 'espacio'])
            ->findOrFail($id_sesion);

        $asistencias = Asistencia::with('socio')
            ->where('id_sesion', $id_sesion)
            ->orderBy('timestamp_registro')
            ->get();

        return response()->json([
            'status'      => 'success',
            'sesion'      => $sesion,
            'total'       => $asistencias->count(),
            'data'        => $asistencias,
        ]);
    }

    /**
     * POST /api/asistencias
     * Registra manualmente una asistencia
     * Genera token_qr automáticamente si no se envía
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_socio'           => 'required|exists:tbl_socios,id_socio',
            'id_sesion'          => 'required|exists:tbl_agenda,id_sesion',
            'token_qr'           => 'nullable|string|max:255',
            'timestamp_registro' => 'nullable|date',
        ]);

        // Verificar que el socio no esté ya registrado en esta sesión
        $existe = Asistencia::where('id_socio',  $validated['id_socio'])
                            ->where('id_sesion', $validated['id_sesion'])
                            ->exists();

        if ($existe) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Este socio ya tiene asistencia registrada en esta sesión.',
            ], 422);
        }

        // Generar token_qr si no viene en el request
        $validated['token_qr']           = $validated['token_qr'] ?? Str::uuid()->toString();
        $validated['timestamp_registro']  = $validated['timestamp_registro'] ?? now();

        $asistencia = Asistencia::create($validated);
        $asistencia->load(['socio', 'sesion.disciplina', 'sesion.instructor']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Asistencia registrada correctamente',
            'data'    => $asistencia,
        ], 201);
    }

    /**
     * DELETE /api/asistencias/{id}
     * Elimina un registro de asistencia
     */
    public function destroy($id)
    {
        $asistencia = Asistencia::findOrFail($id);
        $asistencia->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Asistencia eliminada correctamente',
        ]);
    }
}
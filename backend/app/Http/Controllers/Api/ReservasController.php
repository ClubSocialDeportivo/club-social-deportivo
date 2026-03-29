<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservas;

class ReservasController extends Controller
{
    /**
     * GET /api/reservas
     * Lista todas las reservas con sus relaciones
     */
    public function index()
    {
        $reservas = Reservas::with(['socio', 'espacio'])->get();

        return response()->json([
            'status' => 'success',
            'data'   => $reservas
        ]);
    }

    /**
     * GET /api/reservas/{id}
     * Muestra el detalle de una reserva específica
     */
    public function show($id)
    {
        $reserva = Reservas::with(['socio', 'espacio'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $reserva
        ]);
    }

    /**
     * POST /api/reservas
     * Crea una nueva reserva
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_socio'        => 'required|exists:tbl_socios,id_socio',
            'id_espacio'      => 'required|exists:tbl_instalaciones,id_espacio',
            'fecha'           => 'required|date',
            'hora_inicio'     => 'required',
            'hora_fin'        => 'required|after:hora_inicio',
            'folio_reserva'   => 'required|string|max:80|unique:tbl_reservas,folio_reserva',
            'estatus'         => 'required|in:Activa,Cancelada,Liberada,Completada',
            'estatus_noshow'  => 'boolean',
        ]);

        $reserva = Reservas::create($validated);

        $reserva->load(['socio', 'espacio']);

        return response()->json([
            'status'  => 'success',
            'message' => 'Reserva creada correctamente',
            'data'    => $reserva
        ], 201);
    }

    /**
     * PUT /api/reservas/{id}
     * Actualiza una reserva existente
     */
    public function update(Request $request, $id)
    {
        $reserva = Reservas::findOrFail($id);

        $validated = $request->validate([
            'id_socio'       => 'sometimes|exists:tbl_socios,id_socio',
            'id_espacio'     => 'sometimes|exists:tbl_instalaciones,id_espacio',
            'fecha'          => 'sometimes|date',
            'hora_inicio'    => 'sometimes',
            'hora_fin'       => 'sometimes',
            'folio_reserva'  => 'sometimes|string|max:80|unique:tbl_reservas,folio_reserva,' . $id . ',id_reserva',
            'estatus'        => 'sometimes|in:Activa,Cancelada,Liberada,Completada',
            'estatus_noshow' => 'sometimes|boolean',
        ]);

        $reserva->update($validated);

        return response()->json([
            'status'  => 'success',
            'message' => 'Reserva actualizada correctamente',
            'data'    => $reserva->load(['socio', 'espacio'])
        ]);
    }

    /**
     * DELETE /api/reservas/{id}
     * Elimina una reserva
     */
    public function destroy($id)
    {
        $reserva = Reservas::findOrFail($id);
        $reserva->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Reserva eliminada correctamente'
        ]);
    }
}
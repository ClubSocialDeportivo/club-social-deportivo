<?php

namespace App\Http\Controllers;

use App\Models\Torneo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TorneoController extends Controller
{
    public function index()
    {
        try {
            // Traemos los torneos con su sede (tbl_instalaciones)
            $torneos = Torneo::with(['sede'])->get();
            return response()->json(['status' => 'success', 'data' => $torneos]);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        try {
            $datos = $request->all();
            
            // VALIDACIÓN SEGÚN EL SQL DE BRYAN:
            // El campo 'tipo' solo acepta 'Local' o 'Regional'
            $datos['tipo'] = (isset($datos['tipo']) && in_array($datos['tipo'], ['Local', 'Regional'])) 
                             ? $datos['tipo'] : 'Local';

            // Fechas por defecto si vienen vacías
            if (empty($datos['fecha_inicio'])) $datos['fecha_inicio'] = now()->format('Y-m-d');
            if (empty($datos['fecha_fin'])) $datos['fecha_fin'] = now()->addDays(30)->format('Y-m-d');

            $torneo = Torneo::create($datos);

            return response()->json(['status' => 'success', 'data' => $torneo], 201);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error SQL: ' . $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        $torneo = Torneo::find($id);
        if (!$torneo) return response()->json(['message' => 'No encontrado'], 404);
        $torneo->update($request->all());
        return response()->json(['status' => 'success', 'data' => $torneo]);
    }

    public function destroy($id)
    {
        $torneo = Torneo::find($id);
        if ($torneo) $torneo->delete();
        return response()->json(['status' => 'success']);
    }
}
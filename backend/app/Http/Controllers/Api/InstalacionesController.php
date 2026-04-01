<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Instalaciones;

class InstalacionesController extends Controller
{
    public function index()
    {
        // MAGIA: Ahora la tabla principal sabrá si la cancha tiene un torneo activo
        $datos = Instalaciones::with(['torneos'])->get();
        return response()->json(['status' => 'success', 'data' => $datos]);
    }

    public function show($id)
    {
        try {
            $instalacion = Instalaciones::with(['agendas', 'reservas', 'torneos'])->findOrFail($id);
        } catch (\Exception $e) {
            $instalacion = Instalaciones::with(['agendas', 'reservas'])->findOrFail($id);
            $instalacion->torneos = [];
        }

        return response()->json([
            'status' => 'success',
            'data' => $instalacion
        ]);
    }

    public function getCategories()
    {
        return response()->json(\App\Models\CatArea::all());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'id_categoria' => 'required|exists:cat_areas,id_categoria',
            'nombre_especifico' => 'required|string|max:120',
            'ubicacion' => 'nullable|string|max:120',
            'tipo_superficie' => 'nullable|string|max:80',
            'capacidad_max' => 'required|integer|min:1',
            'horario_apertura' => 'nullable',
            'horario_cierre' => 'nullable',
            'equipamiento' => 'nullable|string',
            'estatus' => 'required|string',
            'permite_reserva' => 'required|boolean'
        ]);

        $instalacion = Instalaciones::create($validated);
        return response()->json(['status' => 'success', 'data' => $instalacion]);
    }

    public function update(Request $request, $id)
    {
        $instalacion = Instalaciones::findOrFail($id);
        $instalacion->update($request->all());
        return response()->json(['status' => 'success', 'message' => 'Instalación actualizada correctamente']);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Instalaciones;

class InstalacionesController extends Controller
{
    public function index()
    {
        // Obtenemos todo de Supabase
        $datos = Instalaciones::all();

        return response()->json([
            'status' => 'success',
            'data' => $datos
        ]);
    }

    public function show($id)
    {
        // El "with" carga automáticamente las agendas y reservas relacionadas
        $instalacion = Instalaciones::with(['agendas', 'reservas'])->findOrFail($id);

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

    $instalacion = \App\Models\Instalaciones::create($validated);
    
    return response()->json(['status' => 'success', 'data' => $instalacion]);
}




    public function update(Request $request, $id)
    {
        // 1. Buscamos la instalación
        $instalacion = Instalaciones::findOrFail($id);

        // 2. Actualizamos con los datos que vienen del formulario
        $instalacion->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Instalación actualizada correctamente'
        ]);
    }
}

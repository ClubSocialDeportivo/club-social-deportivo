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

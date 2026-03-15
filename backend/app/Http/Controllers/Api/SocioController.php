<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SocioController extends Controller
{
    public function index()
    {
        $socios = Socio::all();

        return response()->json([
            'data' => $socios
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'sexo' => 'nullable|string|max:20',
            'telefono' => 'required|string|max:20',
            'correo' => 'required|email|max:255|unique:socios,correo',
            'direccion' => 'nullable|string',
            'tipo_membresia' => 'required|string|max:100',
            'fecha_inscripcion' => 'required|date',
            'estado' => 'required|string|max:50',
        ]);

        $socio = Socio::create($validated);

        return response()->json($socio, 201);
    }

    public function show(string $id)
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado'
            ], 404);
        }

        return response()->json($socio, 200);
    }

    public function update(Request $request, string $id)
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado'
            ], 404);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'fecha_nacimiento' => 'nullable|date',
            'sexo' => 'nullable|string|max:20',
            'telefono' => 'required|string|max:20',
            'correo' => [
                'required',
                'email',
                'max:255',
                Rule::unique('socios', 'correo')->ignore($socio->id),
            ],
            'direccion' => 'nullable|string',
            'tipo_membresia' => 'required|string|max:100',
            'fecha_inscripcion' => 'required|date',
            'estado' => 'required|string|max:50',
        ]);

        $socio->update($validated);

        return response()->json([
            'message' => 'Socio actualizado correctamente',
            'data' => $socio
        ], 200);
    }

    public function destroy(string $id)
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado'
            ], 404);
        }

        $socio->delete();

        return response()->json([
            'message' => 'Socio eliminado correctamente'
        ], 200);
    }
}
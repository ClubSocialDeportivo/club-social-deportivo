<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InstructorController extends Controller
{
    public function index()
    {
        return response()->json(DB::table('tbl_instructores')->get(), 200);
    }

    public function store(Request $request)
    {
        try {
            DB::table('tbl_instructores')->insert([
                'id_usuario'      => $request->id_usuario ?? 1,
                'nombre_completo' => $request->nombre_completo,
                'especialidad'    => $request->especialidad,
                'contacto'        => $request->contacto,
                'estatus'         => 'Activo', 
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
            return response()->json(['message' => '¡Guardado con éxito!'], 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            DB::table('tbl_instructores')
                ->where('id_instructor', $id)
                ->update([
                    'nombre_completo' => $request->nombre_completo,
                    'especialidad'    => $request->especialidad,
                    'contacto'        => $request->contacto,
                    'estatus'         => $request->estatus,
                    'updated_at'      => now(),
                ]);
            return response()->json(['message' => 'Información actualizada'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        // Baja lógica: Cambia a Inactivo en lugar de borrar la fila
        DB::table('tbl_instructores')
            ->where('id_instructor', $id)
            ->update(['estatus' => 'Inactivo', 'updated_at' => now()]);
            
        return response()->json(['message' => 'Instructor inactivado'], 200);
    }
}
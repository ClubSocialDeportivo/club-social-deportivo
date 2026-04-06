<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LudotecaController extends Controller
{
    public function registrarIngreso(Request $request)
    {
        $ninoId = $request->input('id_nino');
        $tutorId = $request->input('id_tutor');

        try {
            // 1. Buscar al niño en la base de datos
            $nino = DB::table('tbl_socios')->where('id_socio', $ninoId)->first();
            if (!$nino) {
                return response()->json(['status' => 'error', 'message' => 'El ID del niño no existe.'], 404);
            }

            // 2. Buscar al tutor
            $tutor = DB::table('tbl_socios')->where('id_socio', $tutorId)->first();
            if (!$tutor) {
                return response()->json(['status' => 'error', 'message' => 'El ID del tutor no existe.'], 404);
            }

            // 3. CALCULAR LA EDAD EXACTA
            $edad = Carbon::parse($nino->fecha_nacimiento)->age;
            
            // 4. VALIDACIÓN DE REGLAMENTO (3 a 6 años)
            if ($edad < 3 || $edad > 6) {
                return response()->json([
                    'status' => 'error', 
                    'message' => "ACCESO DENEGADO: El menor tiene {$edad} años. El reglamento solo permite de 3 a 6 años."
                ], 400);
            }

            // 5. Validar que no esté ya jugando adentro
            $activo = DB::table('tbl_ludoteca')
                ->where('id_nino_fk', $ninoId)
                ->where('estado', 'Activo')
                ->first();
            
            if ($activo) {
                return response()->json(['status' => 'error', 'message' => 'El niño ya se encuentra dentro de la ludoteca.'], 400);
            }

            // 6. Si pasa todo, lo registramos en la Ludoteca
            DB::table('tbl_ludoteca')->insert([
                'id_nino_fk' => $ninoId,
                'id_tutor_fk' => $tutorId,
                'estado' => 'Activo',
                'timestamp_entrada' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);

            return response()->json(['status' => 'success', 'message' => 'Ingreso autorizado y registrado.']);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error de servidor: ' . $e->getMessage()], 500);
        }
    }
}
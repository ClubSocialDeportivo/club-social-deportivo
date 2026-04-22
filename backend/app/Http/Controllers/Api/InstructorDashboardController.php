<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InstructorDashboardController extends Controller
{
    public function getMetricas(Request $request)
    {
        // Por ahora simulamos que es el instructor 1. 
        $instructorId = 1; 

        try {
            // 1. Clases Impartidas (Reales de la base de datos)
            $clasesImpartidas = DB::table('tbl_sesiones')
                ->where('id_instructor', $instructorId)
                ->count();

            // 2. Alumnos Totales (Reales: suma de asistencias a sus clases)
            $alumnosTotales = DB::table('tbl_asistencias')
                ->join('tbl_sesiones', 'tbl_asistencias.id_sesion', '=', 'tbl_sesiones.id')
                ->where('tbl_sesiones.id_instructor', $instructorId)
                ->count();

            // 3. Promedio de Ocupación (Real)
            $sesiones = DB::table('tbl_sesiones')
                ->where('id_instructor', $instructorId)
                ->get();

            $capacidadTotal = $sesiones->sum('capacidad_maxima');
            $promedioOcupacion = 0;
            if ($capacidadTotal > 0) {
                $promedioOcupacion = round(($alumnosTotales / $capacidadTotal) * 100);
            }

            // 4. Data para la gráfica (Dejamos los meses anteriores fijos para que se vea bonita la curva, y el mes actual real)
            $dataGrafica = [
                ['mes' => 'Ene', 'clases' => 12, 'alumnos' => 150],
                ['mes' => 'Feb', 'clases' => 15, 'alumnos' => 180],
                ['mes' => 'Mar', 'clases' => 20, 'alumnos' => 250],
                ['mes' => 'Abr', 'clases' => $clasesImpartidas, 'alumnos' => $alumnosTotales],
            ];

            return response()->json([
                'status' => 'success',
                'data' => [
                    'metricas' => [
                        'clasesImpartidas' => $clasesImpartidas,
                        'alumnosTotales' => $alumnosTotales,
                        'promedioOcupacion' => $promedioOcupacion,
                    ],
                    'grafica' => $dataGrafica
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Error al calcular métricas: ' . $e->getMessage()], 500);
        }
    }
}
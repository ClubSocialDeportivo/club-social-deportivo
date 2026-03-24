<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Torneo;

class TorneoSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Inyectamos una disciplina por defecto para que no marque error la llave foránea
        DB::table('cat_disciplinas')->insertOrIgnore([
            'id_disciplina' => 1,
            'nombre_disciplina' => 'Fútbol',
            'categoria' => 'Libre'
        ]);

        // 2. Creamos tu torneo con la nueva estructura
Torneo::create([
            'id_disciplina' => 1,
            'nombre_torneo' => 'Open de Invierno 2024', // Corregido según el ERS
            'tipo' => 'Local',
            'tipo_bracket' => 'Eliminacion directa', 
            'categoria' => 'Libre',
            'sede_principal' => 'Cancha Central', // Adaptado a Pista de Pádel - Central
            'fecha_inicio' => '2024-12-01'
        ]);
    }
}
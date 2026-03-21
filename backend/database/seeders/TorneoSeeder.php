<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Torneo;

class TorneoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
{
    Torneo::create([
        'nombre_torneo' => 'Copa Tec Morelia 2026',
        'tipo' => 'eliminacion_directa', // <-- Palabra exacta de la migración
        'cupo_maximo' => 16,
        'fecha_inicio' => '2026-04-15'
    ]);

    Torneo::create([
        'nombre_torneo' => 'Liga Inter-Clubes',
        'tipo' => 'round_robin', // <-- Palabra exacta de la migración
        'cupo_maximo' => 10,
        'fecha_inicio' => '2026-05-01'
    ]);
}
}


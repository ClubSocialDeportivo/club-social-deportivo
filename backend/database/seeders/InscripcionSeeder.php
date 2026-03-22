<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Inscripcion;
use App\Models\Torneo;

class InscripcionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buscamos el torneo que hiciste en el paso anterior
        $torneo = Torneo::where('nombre_torneo', 'Open de Invierno 2024')->first();

        // 2. Inyectamos un socio de prueba (Adrián) para la llave foránea
        DB::table('tbl_socios')->insertOrIgnore([
            'id_socio' => 1,
            'nombre' => 'Adrián',
            'apellidos' => 'Pérez',
            'fecha_nacimiento' => '2000-01-01',
            'genero' => 'Masculino',
            'tipo_membresia' => 'Accionista',
            'modalidad' => 'Individual'
        ]);

        // 3. Inscribimos al SOCIO al torneo
        Inscripcion::create([
            'id_torneo' => $torneo->id_torneo,
            'id_socio_fk' => 1,
            'nombre_externo' => null,
            'email_externo' => null,
            'telefono_externo' => null
        ]);

        // 4. Inscribimos a un EXTERNO al torneo
        Inscripcion::create([
            'id_torneo' => $torneo->id_torneo,
            'id_socio_fk' => null,
            'nombre_externo' => 'Kevin Invitado',
            'email_externo' => 'kevin@invitado.com',
            'telefono_externo' => '4431234567'
        ]);
    }
}
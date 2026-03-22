<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SedeExterna;

class SedeExternaSeeder extends Seeder
{
    public function run(): void
    {
        SedeExterna::create([
            'nombre_sede' => 'Unidad Deportiva Bicentenario',
            'direccion' => 'Av. Torreón Nuevo s/n',
            'contacto_responsable' => 'Carlos López',
            'telefono_contacto' => '4431112233'
        ]);

        SedeExterna::create([
            'nombre_sede' => 'Club de Golf Altozano',
            'direccion' => 'Paseo del Altozano #55',
            'contacto_responsable' => 'María Fernández',
            'telefono_contacto' => '4439998877'
        ]);
    }
}
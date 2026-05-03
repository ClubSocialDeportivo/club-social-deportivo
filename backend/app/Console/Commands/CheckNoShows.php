<?php

namespace App\Console\Commands;

use App\Models\Asistencia;
use App\Models\Reservas;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckNoShows extends Command
{
    protected $signature = 'app:check-no-shows';

    protected $description = 'Verifica reservas vencidas sin asistencia y suma faltas al socio.';

    public function handle()
    {
        $now = Carbon::now();

        $this->info('Iniciando verificación de No-Shows...');

        $reservas = Reservas::where('estatus', 'Activa')
            ->where('estatus_noshow', false)
            ->get();

        foreach ($reservas as $reserva) {
            $finReserva = Carbon::parse($reserva->fecha . ' ' . $reserva->hora_fin);

            if ($finReserva->lt($now)) {
                $asistio = Asistencia::where('id_socio', $reserva->id_socio)
                    ->whereBetween('timestamp_registro', [
                        $reserva->fecha . ' ' . $reserva->hora_inicio,
                        $reserva->fecha . ' ' . $reserva->hora_fin,
                    ])
                    ->exists();

                if (! $asistio) {
    $this->info("Socio {$reserva->id_socio} NO asistió.");

    $reserva->socio->increment('faltas');

    DB::table('tbl_reservas')
        ->where('id_reserva', $reserva->id_reserva)
        ->update([
            'estatus_noshow' => true,
        ]);
}
            }
        }

        $this->info('Verificación finalizada.');

        return self::SUCCESS;
    }
}
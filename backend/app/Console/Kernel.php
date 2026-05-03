<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define los comandos de la aplicación.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }

    /**
     * Aquí registramos tareas programadas (cronjobs)
     */
    protected function schedule(Schedule $schedule): void
    {
        // Ejecuta cada hora el verificador de No-Shows
        $schedule->command('app:check-no-shows')->hourly();
    }
}
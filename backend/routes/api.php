<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Api\LudotecaController;
use App\Http\Controllers\Api\SocioController;
use App\Http\Controllers\TorneoController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\InstalacionesController;
use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\ReservasController;
use App\Http\Controllers\Api\AsistenciasController;
use App\Http\Controllers\Api\CheckinController;
use App\Http\Controllers\Api\PagosController;
<<<<<<< cm3-167-readonly-socios-dependientes
=======
use App\Http\Controllers\Api\InstructorDashboardController;
>>>>>>> main

/*
|--------------------------------------------------------------------------
| RUTAS DE PRUEBA
|--------------------------------------------------------------------------
*/

Route::get('/test-db', function () {
    DB::table('users')->insert([
        'name'       => 'API User 2',
        'email'      => 'api2@test.com',
        'password'   => '123456',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json(['mensaje' => 'Insertado correctamente']);
});

Route::get('/test', function () {
    return response()->json(['mensaje' => 'API funcionando correctamente']);
});

/*
|--------------------------------------------------------------------------
<<<<<<< cm3-167-readonly-socios-dependientes
| MÓDULO SOCIOS Y DEPENDIENTES (SOLO LECTURA)
|--------------------------------------------------------------------------
*/

Route::get('/socios', [SocioController::class, 'index']);
Route::get('/socios/{id}', [SocioController::class, 'show']);
Route::get('/dependientes', [SocioController::class, 'dependientes']);
Route::get('/titulares', [SocioController::class, 'titulares']);
Route::get('/socios/{id}/verificar-acceso', [SocioController::class, 'verificarAcceso']);

/*
|--------------------------------------------------------------------------
| MÓDULO TORNEOS
|--------------------------------------------------------------------------
*/

Route::get('/torneos', [TorneoController::class, 'index']);
Route::apiResource('torneos', TorneoController::class);

/*
|--------------------------------------------------------------------------
| MÓDULO LUDOTECA
|--------------------------------------------------------------------------
*/

Route::post('/ludoteca/ingreso', [LudotecaController::class, 'registrarIngreso']);

/*
|--------------------------------------------------------------------------
| MÓDULO DE INSTALACIONES
|--------------------------------------------------------------------------
*/

Route::get('/instalaciones', [InstalacionesController::class, 'index']);
Route::get('/instalaciones/{id}', [InstalacionesController::class, 'show']);
Route::post('/instalaciones', [InstalacionesController::class, 'store']);
Route::put('/instalaciones/{id}', [InstalacionesController::class, 'update']);
Route::get('/categorias', [InstalacionesController::class, 'getCategories']);

/*
|--------------------------------------------------------------------------
| MÓDULO DE ACTIVIDADES — AGENDA
|--------------------------------------------------------------------------
*/

Route::get('/agenda/catalogo/disciplinas', [AgendaController::class, 'getDisciplinas']);
Route::get('/agenda/catalogo/instructores', [AgendaController::class, 'getInstructores']);

Route::get('/agenda', [AgendaController::class, 'index']);
Route::get('/agenda/{id}', [AgendaController::class, 'show']);
Route::post('/agenda', [AgendaController::class, 'store']);
Route::put('/agenda/{id}', [AgendaController::class, 'update']);
Route::delete('/agenda/{id}', [AgendaController::class, 'destroy']);
=======
| RUTAS PÚBLICAS O DE CONSULTA GENERAL
|--------------------------------------------------------------------------
*/

Route::get('/instalaciones',       [InstalacionesController::class, 'index']);
Route::get('/instalaciones/{id}',  [InstalacionesController::class, 'show']);
Route::get('/categorias',          [InstalacionesController::class, 'getCategories']);

Route::get('/agenda/catalogo/disciplinas',  [AgendaController::class, 'getDisciplinas']);
Route::get('/agenda/catalogo/instructores', [AgendaController::class, 'getInstructores']);

Route::get('/pagos/metodos', [PagosController::class, 'getMetodos']);
Route::get('/pagos',        [PagosController::class, 'index']);
Route::get('/pagos/{id}',   [PagosController::class, 'show']);

Route::get('/torneos', [TorneoController::class, 'index']);
>>>>>>> main

/*
|--------------------------------------------------------------------------
| RUTAS PROTEGIDAS (Bloquean POST/PUT/DELETE para instructores)
|--------------------------------------------------------------------------
| El middleware 'restrict.instructor' interceptará cualquier intento
| de modificación en estas rutas si el usuario tiene rol de instructor.
*/

<<<<<<< cm3-167-readonly-socios-dependientes
Route::get('/reservas', [ReservasController::class, 'index']);
Route::get('/reservas/{id}', [ReservasController::class, 'show']);
Route::post('/reservas', [ReservasController::class, 'store']);
Route::put('/reservas/{id}', [ReservasController::class, 'update']);
Route::delete('/reservas/{id}', [ReservasController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| MÓDULO INSTRUCTORES
|--------------------------------------------------------------------------
*/

Route::apiResource('instructors', InstructorController::class);
=======
Route::middleware(['restrict.instructor'])->group(function () {
    
    // MÓDULO SOCIOS
    Route::apiResource('socios', SocioController::class);
    Route::patch('/socios/{id}/activar', [SocioController::class, 'activarMembresia']);
    Route::get('/dependientes', [SocioController::class, 'dependientes']);
    Route::get('/titulares',    [SocioController::class, 'titulares']);
    Route::get('/socios/{id}/verificar-acceso', [SocioController::class, 'verificarAcceso']);

    // MÓDULO DE ACTIVIDADES — AGENDA
    Route::get('/agenda',        [AgendaController::class, 'index']);
    Route::get('/agenda/{id}',   [AgendaController::class, 'show']);
    Route::post('/agenda',       [AgendaController::class, 'store']);
    Route::put('/agenda/{id}',   [AgendaController::class, 'update']);
    Route::delete('/agenda/{id}',[AgendaController::class, 'destroy']);

    // MÓDULO DE ACTIVIDADES — RESERVAS
    Route::get('/reservas',         [ReservasController::class, 'index']);
    Route::get('/reservas/{id}',    [ReservasController::class, 'show']);
    Route::post('/reservas',        [ReservasController::class, 'store']);
    Route::put('/reservas/{id}',    [ReservasController::class, 'update']);
    Route::delete('/reservas/{id}', [ReservasController::class, 'destroy']);
    
    // OTRAS MODIFICACIONES DEL SISTEMA
    Route::post('/instalaciones',      [InstalacionesController::class, 'store']);
    Route::put('/instalaciones/{id}',  [InstalacionesController::class, 'update']);
    Route::apiResource('torneos', TorneoController::class)->except(['index']);
    Route::post('/pagos',       [PagosController::class, 'store']);
});
>>>>>>> main

/*
|--------------------------------------------------------------------------
| MÓDULO INSTRUCTORES Y SUS HERRAMIENTAS
|--------------------------------------------------------------------------
*/

<<<<<<< cm3-167-readonly-socios-dependientes
Route::get('/asistencias/sesion/{id_sesion}', [AsistenciasController::class, 'porSesion']);
Route::get('/asistencias', [AsistenciasController::class, 'index']);
Route::post('/asistencias', [AsistenciasController::class, 'store']);
Route::delete('/asistencias/{id}', [AsistenciasController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| MÓDULO DE CHECK-IN
|--------------------------------------------------------------------------
*/

Route::get('/checkins/buscar', [CheckinController::class, 'buscarSocio']);
Route::get('/checkins', [CheckinController::class, 'index']);
Route::post('/checkins', [CheckinController::class, 'store']);
=======
Route::apiResource('instructors', InstructorController::class);

Route::get('/asistencias/sesion/{id_sesion}', [AsistenciasController::class, 'porSesion']);
Route::get('/asistencias',        [AsistenciasController::class, 'index']);
Route::post('/asistencias',       [AsistenciasController::class, 'store']);
Route::delete('/asistencias/{id}',[AsistenciasController::class, 'destroy']);

Route::get('/instructor/dashboard', [InstructorDashboardController::class, 'getMetricas']);
>>>>>>> main

/*
|--------------------------------------------------------------------------
| MÓDULO LUDOTECA Y CHECK-IN
|--------------------------------------------------------------------------
*/

<<<<<<< cm3-167-readonly-socios-dependientes
Route::get('/pagos/metodos', [PagosController::class, 'getMetodos']);
Route::get('/pagos', [PagosController::class, 'index']);
Route::get('/pagos/{id}', [PagosController::class, 'show']);
Route::post('/pagos', [PagosController::class, 'store']);
=======
Route::post('/ludoteca/ingreso', [LudotecaController::class, 'registrarIngreso']);
Route::post('/ludoteca/salida', [LudotecaController::class, 'registrarSalida']);

Route::get('/checkins/buscar', [CheckinController::class, 'buscarSocio']);
Route::get('/checkins',  [CheckinController::class, 'index']);
Route::post('/checkins', [CheckinController::class, 'store']);
>>>>>>> main

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LudotecaController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\SocioController;
use App\Http\Controllers\TorneoController;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\InstalacionesController;
use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\ReservasController;

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
| MÓDULO SOCIOS
|--------------------------------------------------------------------------
*/

Route::apiResource('socios', SocioController::class);
Route::patch('/socios/{id}/activar', [SocioController::class, 'activarMembresia']);
Route::get('/dependientes', [SocioController::class, 'dependientes']);
Route::get('/titulares',    [SocioController::class, 'titulares']);

/*
|--------------------------------------------------------------------------
| MÓDULO TORNEOS
|--------------------------------------------------------------------------
*/

Route::get('/torneos', [TorneoController::class, 'index']);
//GET, POST, PUT y DELETE automáticamente
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

Route::get('/instalaciones',       [InstalacionesController::class, 'index']);
Route::get('/instalaciones/{id}',  [InstalacionesController::class, 'show']);
Route::post('/instalaciones',      [InstalacionesController::class, 'store']);
Route::put('/instalaciones/{id}',  [InstalacionesController::class, 'update']);
Route::get('/categorias',          [InstalacionesController::class, 'getCategories']);

/*
|--------------------------------------------------------------------------
| MÓDULO DE ACTIVIDADES — AGENDA
|--------------------------------------------------------------------------
*/

// Catálogos para los selects del frontend (ANTES de las rutas con {id})
Route::get('/agenda/catalogo/disciplinas',  [AgendaController::class, 'getDisciplinas']);
Route::get('/agenda/catalogo/instructores', [AgendaController::class, 'getInstructores']);

// CRUD principal
Route::get('/agenda',        [AgendaController::class, 'index']);
Route::get('/agenda/{id}',   [AgendaController::class, 'show']);
Route::post('/agenda',       [AgendaController::class, 'store']);
Route::put('/agenda/{id}',   [AgendaController::class, 'update']);
Route::delete('/agenda/{id}',[AgendaController::class, 'destroy']);

/*
|--------------------------------------------------------------------------
| MÓDULO DE ACTIVIDADES — RESERVAS
|--------------------------------------------------------------------------
*/

Route::get('/reservas',         [ReservasController::class, 'index']);
Route::get('/reservas/{id}',    [ReservasController::class, 'show']);
Route::post('/reservas',        [ReservasController::class, 'store']);
Route::put('/reservas/{id}',    [ReservasController::class, 'update']);
Route::delete('/reservas/{id}', [ReservasController::class, 'destroy']);

/*
------------------------------------------------------------------------------
| MÓDULO INSTRUCTORES
------------------------------------------------------------------------------
*/
Route::apiResource('instructors', InstructorController::class);

// Route::get('/test-insert', function () { 
//     DB::table('tbl_socios')->insert([
//         'nombre' => 'Bryan',
//         'apellidos' => 'Mendoza',
//         'fecha_nacimiento' => '2002-01-01',
//         'genero' => 'Masculino',
//         'tipo_membresia' => 'Accionista',
//         'modalidad' => 'Individual',
//         'estatus_financiero' => 'Vigente',
//         'created_at' => now(),
//         'updated_at' => now()
//     ]);
//     return response()->json(['mensaje' => 'Insertado correctamente']);
// });
// });

/*
------------------------------------------------------------------------------
| MÓDULO INSTRUCTORES
------------------------------------------------------------------------------
*/
Route::apiResource('instructors', InstructorController::class);


/*
|--------------------------------------------------------------------------
| MÓDULO DE ASISTENCIAS
|--------------------------------------------------------------------------
*/
 
use App\Http\Controllers\Api\AsistenciasController;
 
// IMPORTANTE: la ruta /sesion/{id} debe ir ANTES de /{id}
// para que Laravel no confunda "sesion" con un ID numérico
Route::get('/asistencias/sesion/{id_sesion}', [AsistenciasController::class, 'porSesion']);
 
Route::get('/asistencias',        [AsistenciasController::class, 'index']);
Route::post('/asistencias',       [AsistenciasController::class, 'store']);
Route::delete('/asistencias/{id}',[AsistenciasController::class, 'destroy']);









/*
|--------------------------------------------------------------------------
| MÓDULO DE PAGOS
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\Api\PagosController;

// Catálogo (debe ir ANTES de /{id})
Route::get('/pagos/metodos', [PagosController::class, 'getMetodos']);

Route::get('/pagos',        [PagosController::class, 'index']);
Route::get('/pagos/{id}',   [PagosController::class, 'show']);
Route::post('/pagos',       [PagosController::class, 'store']);
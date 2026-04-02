<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LudotecaController;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\SocioController;
use App\Http\Controllers\TorneoController;
use App\Http\Controllers\Api\InstalacionesController;

/*
|--------------------------------------------------------------------------
| RUTAS DE PRUEBA
|--------------------------------------------------------------------------
*/

// Prueba de inserción en base de datos
Route::get('/test-db', function () {
    DB::table('users')->insert([
        'name' => 'API User 2',
        'email' => 'api2@test.com',
        'password' => '123456',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response()->json([
        'mensaje' => 'Insertado correctamente'
    ]);
});

// Prueba básica de API
Route::get('/test', function () {
    return response()->json([
        'mensaje' => 'API funcionando correctamente'
    ]);
});

/*
|--------------------------------------------------------------------------
| MÓDULO SOCIOS
|--------------------------------------------------------------------------
*/

Route::apiResource('socios', SocioController::class);
Route::patch('/socios/{id}/activar', [SocioController::class, 'activarMembresia']);

Route::get('/dependientes', [SocioController::class, 'dependientes']);
Route::get('/titulares', [SocioController::class, 'titulares']);

/*
|--------------------------------------------------------------------------
| MÓDULO TORNEOS
|--------------------------------------------------------------------------
*/

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

Route::get('/instalaciones', [InstalacionesController::class, 'index']);
Route::get('/instalaciones/{id}', [InstalacionesController::class, 'show']);
Route::put('/instalaciones/{id}', [InstalacionesController::class, 'update']);
Route::get('/categorias', [InstalacionesController::class, 'getCategories']);
Route::post('/instalaciones', [InstalacionesController::class, 'store']);
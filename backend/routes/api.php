<?php

use Illuminate\Support\Facades\Route;
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

/*
|--------------------------------------------------------------------------
| MÓDULO TORNEOS
|--------------------------------------------------------------------------
*/

Route::get('/torneos', [TorneoController::class, 'index']);


/*
|--------------------------------------------------------------------------
| MÓDULO DE INSTALACIONES
|--------------------------------------------------------------------------
*/




Route::get('/instalaciones', [InstalacionesController::class, 'index']);

Route::get('/instalaciones/{id}', [InstalacionesController::class, 'show']);

Route::put('/instalaciones/{id}', [App\Http\Controllers\Api\InstalacionesController::class, 'update']);
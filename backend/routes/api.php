<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test-db', function() {
    DB::table('users') -> insert ([
        'name' => 'API User 2',
        'email' => 'api2@test.com',
        'password' => '123456',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return response() -> json ([
        'mensaje' => "Insertado correctamente"
    ]);
});

// Route::get('/test', function () {
//     return response()->json([
//         'mensaje' => 'API funcionando correctamente'
//     ]);
// });
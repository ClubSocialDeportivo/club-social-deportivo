<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocioController;

Route::get('/', function () {
    return view('welcome');
});

Route::apiResource('socios', SocioController::class);
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SocioController;

Route::apiResource('socios', SocioController::class);
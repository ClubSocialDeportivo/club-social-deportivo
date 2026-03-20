<?php

namespace App\Http\Controllers;

use App\Models\Torneo;
use Illuminate\Http\Request;

class TorneoController extends Controller
{
    public function index()
    {
        // Traemos todos los torneos de tu base de datos
        $torneos = Torneo::all();
        
        // Los mandamos como datos puros (JSON) para que React los pueda leer
        return response()->json([
            'status' => 'success',
            'data' => $torneos
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscripcion;

class InscripcionController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validamos que Adrián al menos nos mande el ID del torneo
        $request->validate([
            'id_torneo' => 'required|integer'
        ]);

        // 2. Guardamos en la base de datos en automático (sea socio o externo)
        $inscripcion = Inscripcion::create($request->all());

        // 3. Le respondemos a React con un JSON de éxito
        return response()->json([
            'mensaje' => '¡Jugador inscrito con éxito al torneo!',
            'data' => $inscripcion
        ], 201);
    }
}
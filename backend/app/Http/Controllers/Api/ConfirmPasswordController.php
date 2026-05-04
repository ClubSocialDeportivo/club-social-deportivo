<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ConfirmPasswordController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $tokenHash = hash('sha256', $validated['token']);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', $tokenHash)
            ->first();

        if (!$resetRecord) {
            return response()->json([
                'message' => 'El enlace de creación de contraseña es inválido o ya fue utilizado.',
            ], 400);
        }

        $socio = Socio::where('correo', $validated['email'])->first();

        if (!$socio) {
            return response()->json([
                'message' => 'No se encontró un socio asociado a este correo.',
            ], 404);
        }

        $socio->update([
            'password' => Hash::make($validated['password']),
        ]);

        DB::table('password_reset_tokens')
            ->where('email', $validated['email'])
            ->where('token', $tokenHash)
            ->delete();

        return response()->json([
            'message' => 'Contraseña establecida correctamente. Ya puedes iniciar sesión.',
        ], 200);
    }
}

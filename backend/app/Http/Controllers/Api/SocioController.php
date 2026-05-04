<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeSocio;
use App\Models\Socio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SocioController extends Controller
{
    /**
     * Lista todos los socios con opción de búsqueda.
     */
    public function index(Request $request): JsonResponse
    {
        $queryText = $request->query('query');

        $socios = Socio::when($queryText, function ($query, $search) {
            return $query->where('nombre', 'LIKE', "%{$search}%")
                         ->orWhere('apellidos', 'LIKE', "%{$search}%")
                         ->orWhere('id_socio', $search);
        })
        ->orderBy('id_socio', 'desc')
        ->get();

        return response()->json([
            'message' => 'Lista de socios obtenida correctamente',
            'data' => $socios,
        ], 200);
    }

    /**
     * Crea un nuevo socio.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_usuario' => [
                'nullable',
                'integer',
                'exists:tbl_usuarios,id_usuario',
                'unique:tbl_socios,id_usuario',
            ],
            'nombre' => 'required|string|max:100',
            'apellidos' => 'required|string|max:120',
            'correo' => 'nullable|email|max:255|unique:tbl_socios,correo',
            'telefono' => 'nullable|string|max:20',
            'fecha_nacimiento' => 'required|date',
            'genero' => [
                'required',
                Rule::in(['Masculino', 'Femenino', 'Otro', 'No especifica']),
            ],
            'tipo_membresia' => [
                'nullable',
                Rule::in(['Accionista', 'Rentista']),
            ],
            'modalidad' => [
                'nullable',
                Rule::in(['Individual', 'Familiar']),
            ],
            'numero_documento' => 'nullable|string|max:80',
            'fecha_inicio_vigencia' => 'nullable|date',
            'fecha_fin_vigencia' => 'nullable|date',
            'estatus_financiero' => [
                'nullable',
                Rule::in(['Vigente', 'Inactivo', 'Adeudo', 'Suspendido']),
            ],
            'es_titular' => 'nullable|boolean',
            'id_titular_fk' => 'nullable|integer|exists:tbl_socios,id_socio',
            'activo' => 'nullable|boolean',
        ]);

        $validated['estatus_financiero'] = $validated['estatus_financiero'] ?? 'Vigente';
        $validated['es_titular'] = $validated['es_titular'] ?? true;
        $validated['activo'] = $validated['activo'] ?? true;

        if ($validated['es_titular'] === true) {
            $validated['id_titular_fk'] = null;

            if (
                isset($validated['tipo_membresia']) &&
                $validated['tipo_membresia'] === 'Rentista' &&
                empty($validated['fecha_fin_vigencia'])
            ) {
                return response()->json([
                    'message' => 'Los socios Rentista deben tener fecha_fin_vigencia.',
                ], 422);
            }
        }

        if ($validated['es_titular'] === false) {
            if (empty($validated['id_titular_fk'])) {
                return response()->json([
                    'message' => 'Si el socio no es titular, debes enviar id_titular_fk.',
                ], 422);
            }

            $titular = Socio::find($validated['id_titular_fk']);

            if (!$titular) {
                return response()->json([
                    'message' => 'El titular seleccionado no existe.',
                ], 422);
            }

            if ($titular->es_titular !== true) {
                return response()->json([
                    'message' => 'El socio seleccionado como titular no es un titular válido.',
                ], 422);
            }

            if (($titular->modalidad ?? null) !== 'Familiar') {
                return response()->json([
                    'message' => 'No puedes registrar dependientes para un titular con modalidad Individual.',
                ], 422);
            }

            $validated['tipo_membresia'] = $titular->tipo_membresia;
            $validated['modalidad'] = $titular->modalidad;
            $validated['estatus_financiero'] = $titular->estatus_financiero;
            $validated['fecha_inicio_vigencia'] = $titular->fecha_inicio_vigencia;
            $validated['fecha_fin_vigencia'] = $titular->fecha_fin_vigencia;
            $validated['activo'] = $titular->activo;
            $validated['es_titular'] = false;
            $validated['id_titular_fk'] = $titular->id_socio;
        }

        $socio = Socio::create($validated);

        if ($socio->correo && $socio->es_titular) {
            $token = Str::random(60);

            DB::table('password_reset_tokens')->insert([
                'email' => $socio->correo,
                'token' => hash('sha256', $token),
                'created_at' => now(),
            ]);

            Mail::to($socio->correo)->send(new WelcomeSocio($token, $socio->correo, $socio->nombre));
        }

        return response()->json([
            'message' => 'Socio creado correctamente',
            'data' => $socio,
        ], 201);
    }

    /**
     * Muestra un socio por id.
     */
    public function show(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado',
            ], 404);
        }

        return response()->json([
            'message' => 'Socio encontrado correctamente',
            'data' => $socio,
        ], 200);
    }

    /**
     * Actualiza un socio existente.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado',
            ], 404);
        }

        $validated = $request->validate([
            'id_usuario' => [
                'nullable',
                'integer',
                'exists:tbl_usuarios,id_usuario',
                Rule::unique('tbl_socios', 'id_usuario')->ignore($socio->id_socio, 'id_socio'),
            ],
            'nombre' => 'sometimes|required|string|max:100',
            'apellidos' => 'sometimes|required|string|max:120',
            'fecha_nacimiento' => 'sometimes|required|date',
            'genero' => [
                'sometimes',
                'required',
                Rule::in(['Masculino', 'Femenino', 'Otro', 'No especifica']),
            ],
            'tipo_membresia' => [
                'nullable',
                Rule::in(['Accionista', 'Rentista']),
            ],
            'modalidad' => [
                'nullable',
                Rule::in(['Individual', 'Familiar']),
            ],
            'numero_documento' => 'nullable|string|max:80',
            'fecha_inicio_vigencia' => 'nullable|date',
            'fecha_fin_vigencia' => 'nullable|date',
            'estatus_financiero' => [
                'nullable',
                Rule::in(['Vigente', 'Inactivo', 'Adeudo', 'Suspendido']),
            ],
            'es_titular' => 'sometimes|required|boolean',
            'id_titular_fk' => 'nullable|integer|exists:tbl_socios,id_socio',
            'activo' => 'nullable|boolean',
        ]);

        if (array_key_exists('es_titular', $validated) && $validated['es_titular'] === true) {
            $validated['id_titular_fk'] = null;
        }

        $tipoMembresiaFinal = $validated['tipo_membresia'] ?? $socio->tipo_membresia;
        $fechaFinFinal = $validated['fecha_fin_vigencia'] ?? $socio->fecha_fin_vigencia;
        $esTitularFinal = $validated['es_titular'] ?? $socio->es_titular;
        $titularFinal = $validated['id_titular_fk'] ?? $socio->id_titular_fk;

        if ($esTitularFinal === true) {
            if ($tipoMembresiaFinal === 'Rentista' && empty($fechaFinFinal)) {
                return response()->json([
                    'message' => 'Los socios Rentista deben tener fecha_fin_vigencia.',
                ], 422);
            }
        }

        if ($esTitularFinal === false) {
            if (empty($titularFinal)) {
                return response()->json([
                    'message' => 'Si el socio no es titular, debes enviar id_titular_fk.',
                ], 422);
            }

            $titular = Socio::find($titularFinal);

            if (!$titular) {
                return response()->json([
                    'message' => 'El titular seleccionado no existe.',
                ], 422);
            }

            if ($titular->es_titular !== true) {
                return response()->json([
                    'message' => 'El socio seleccionado como titular no es un titular válido.',
                ], 422);
            }

            if (($titular->modalidad ?? null) !== 'Familiar') {
                return response()->json([
                    'message' => 'No puedes asignar un dependiente a un titular con modalidad Individual.',
                ], 422);
            }

            $validated['tipo_membresia'] = $titular->tipo_membresia;
            $validated['modalidad'] = $titular->modalidad;
            $validated['estatus_financiero'] = $titular->estatus_financiero;
            $validated['fecha_inicio_vigencia'] = $titular->fecha_inicio_vigencia;
            $validated['fecha_fin_vigencia'] = $titular->fecha_fin_vigencia;
            $validated['activo'] = $titular->activo;
            $validated['es_titular'] = false;
            $validated['id_titular_fk'] = $titular->id_socio;
        }

        $socio->update($validated);

        return response()->json([
            'message' => 'Socio actualizado correctamente',
            'data' => $socio->fresh(),
        ], 200);
    }

    public function activarMembresia(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado',
            ], 404);
        }

        $fechaInicio = now()->toDateString();
        $fechaFin = now()->addYear()->toDateString();

        $socio->update([
            'estatus_financiero' => 'Vigente',
            'activo' => true,
            'fecha_inicio_vigencia' => $fechaInicio,
            'fecha_fin_vigencia' => $fechaFin,
        ]);

        return response()->json([
            'message' => 'Membresía activada correctamente',
            'data' => $socio->fresh(),
        ], 200);
    }

    /**
     * Elimina un socio.
     */
    public function destroy(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'message' => 'Socio no encontrado',
            ], 404);
        }

        $socio->delete();

        return response()->json([
            'message' => 'Socio eliminado correctamente',
        ], 200);
    }

    public function dependientes(): JsonResponse
    {
        $dependientes = Socio::where('es_titular', false)
            ->orderByDesc('id_socio')
            ->get();

        return response()->json([
            'message' => 'Lista de dependientes obtenida correctamente',
            'data' => $dependientes,
        ], 200);
    }

    public function titulares(): JsonResponse
    {
        $titulares = Socio::where('es_titular', true)
            ->where('modalidad', 'Familiar')
            ->where(function ($query) {
                $query->where('activo', true)
                    ->orWhereNull('activo');
            })
            ->orderBy('nombre')
            ->get([
                'id_socio',
                'nombre',
                'apellidos',
                'activo',
                'estatus_financiero',
                'modalidad',
            ]);

        return response()->json([
            'message' => 'Lista de titulares obtenida correctamente',
            'data' => $titulares,
        ], 200);
    }

    public function verificarAcceso(string $id): JsonResponse
    {
        $socio = Socio::find($id);

        if (!$socio) {
            return response()->json([
                'status' => 'error',
                'message' => 'El socio con ID #' . $id . ' no existe en el sistema.'
            ], 404);
        }

        if ($socio->estatus_financiero === 'Vigente') {
            return response()->json([
                'status' => 'success',
                'message' => 'Acceso Permitido',
                'socio' => $socio->nombre . ' ' . $socio->apellidos,
                'estatus' => $socio->estatus_financiero,
                'tipo_membresia' => $socio->tipo_membresia
            ], 200);
        } else {
            return response()->json([
                'status' => 'warning',
                'message' => 'Acceso Restringido: ' . $socio->estatus_financiero,
                'socio' => $socio->nombre . ' ' . $socio->apellidos,
                'estatus' => $socio->estatus_financiero,
                'tipo_membresia' => $socio->tipo_membresia
            ], 200);
        }
    }
}
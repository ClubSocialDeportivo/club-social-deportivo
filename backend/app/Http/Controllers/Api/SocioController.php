<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Socio;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SocioController extends Controller
{
    /**
     * Lista todos los socios.
     */
    public function index(): JsonResponse
    {
        $socios = Socio::orderBy('id_socio', 'desc')->get();

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
            'fecha_nacimiento' => 'required|date',
            'genero' => [
                'required',
                Rule::in(['Masculino', 'Femenino', 'Otro', 'No especifica']),
            ],
            'tipo_membresia' => [
                'required',
                Rule::in(['Accionista', 'Rentista']),
            ],
            'modalidad' => [
                'required',
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
        }

        if (
            isset($validated['tipo_membresia']) &&
            $validated['tipo_membresia'] === 'Rentista' &&
            empty($validated['fecha_fin_vigencia'])
        ) {
            return response()->json([
                'message' => 'Los socios Rentista deben tener fecha_fin_vigencia.',
            ], 422);
        }

        if (
            isset($validated['es_titular']) &&
            $validated['es_titular'] === false &&
            empty($validated['id_titular_fk'])
        ) {
            return response()->json([
                'message' => 'Si el socio no es titular, debes enviar id_titular_fk.',
            ], 422);
        }

        $socio = Socio::create($validated);

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
                'sometimes',
                'required',
                Rule::in(['Accionista', 'Rentista']),
            ],
            'modalidad' => [
                'sometimes',
                'required',
                Rule::in(['Individual', 'Familiar']),
            ],
            'numero_documento' => 'nullable|string|max:80',
            'fecha_inicio_vigencia' => 'nullable|date',
            'fecha_fin_vigencia' => 'nullable|date',
            'estatus_financiero' => [
                'sometimes',
                'required',
                Rule::in(['Vigente', 'Inactivo', 'Adeudo', 'Suspendido']),
            ],
            'es_titular' => 'sometimes|required|boolean',
            'id_titular_fk' => 'nullable|integer|exists:tbl_socios,id_socio',
            'activo' => 'sometimes|required|boolean',
        ]);

        if (array_key_exists('es_titular', $validated) && $validated['es_titular'] === true) {
            $validated['id_titular_fk'] = null;
        }

        $tipoMembresiaFinal = $validated['tipo_membresia'] ?? $socio->tipo_membresia;
        $fechaFinFinal = $validated['fecha_fin_vigencia'] ?? $socio->fecha_fin_vigencia;
        $esTitularFinal = $validated['es_titular'] ?? $socio->es_titular;
        $titularFinal = $validated['id_titular_fk'] ?? $socio->id_titular_fk;

        if ($tipoMembresiaFinal === 'Rentista' && empty($fechaFinFinal)) {
            return response()->json([
                'message' => 'Los socios Rentista deben tener fecha_fin_vigencia.',
            ], 422);
        }

        if ($esTitularFinal === false && empty($titularFinal)) {
            return response()->json([
                'message' => 'Si el socio no es titular, debes enviar id_titular_fk.',
            ], 422);
        }

        $socio->update($validated);

        return response()->json([
            'message' => 'Socio actualizado correctamente',
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
}
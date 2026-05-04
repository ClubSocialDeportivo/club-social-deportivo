<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Socio extends Model
{
    protected $table = 'tbl_socios';
    protected $primaryKey = 'id_socio';

    public $timestamps = true;

    protected $fillable = [
        'id_usuario',
        'nombre',
        'apellidos',
        'correo',
        'telefono',
        'password',
        'fecha_nacimiento',
        'genero',
        'tipo_membresia',
        'modalidad',
        'numero_documento',
        'fecha_inicio_vigencia',
        'fecha_fin_vigencia',
        'estatus_financiero',
        'es_titular',
        'id_titular_fk',
        'activo',
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_inicio_vigencia' => 'date',
        'fecha_fin_vigencia' => 'date',
        'es_titular' => 'boolean',
        'activo' => 'boolean',
    ];
}
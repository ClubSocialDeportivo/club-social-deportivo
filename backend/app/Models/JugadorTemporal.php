<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JugadorTemporal extends Model
{
    use HasFactory;

    // Le decimos a Laravel el nombre exacto de la tabla en español
    protected $table = 'jugadores_temporales';

    protected $fillable = [
        'torneo_id',
        'nombre',
        'apellidos',
        'identificacion_unica',
        'telefono',
    ];
}
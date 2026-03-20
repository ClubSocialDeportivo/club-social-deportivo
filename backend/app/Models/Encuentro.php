<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Encuentro extends Model
{
    use HasFactory;

    protected $fillable = [
        'torneo_id',
        'fase',
        'participante_1',
        'participante_2',
        'ganador',
        'fecha_inicio',
        'fecha_fin',
        'cancha',
        'juez_arbitro',
        'sede_externa_id',
    ];
}
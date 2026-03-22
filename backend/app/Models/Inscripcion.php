<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    use HasFactory;

    // Conectamos con la tabla de la nube
    protected $table = 'tbl_inscripciones';
    protected $primaryKey = 'id_participante';

    // Campos permitidos
    protected $fillable = [
        'id_torneo',
        'id_socio_fk',
        'nombre_externo',
        'email_externo',
        'telefono_externo'
    ];
}
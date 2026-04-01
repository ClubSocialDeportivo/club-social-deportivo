<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instructor extends Model
{
    protected $table      = 'tbl_instructores';
    protected $primaryKey = 'id_instructor';

    protected $fillable = [
        'id_usuario',
        'nombre_completo',
        'especialidad',
        'contacto',
        'estatus',
    ];
}
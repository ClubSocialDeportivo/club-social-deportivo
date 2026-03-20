<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SedeExterna extends Model
{
    use HasFactory;

    protected $table = 'sedes_externas';

    protected $fillable = [
        'nombre_sede',
        'direccion',
        'contacto_responsable',
        'telefono_contacto',
    ];
}
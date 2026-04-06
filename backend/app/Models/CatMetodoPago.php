<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatMetodoPago extends Model
{
    protected $table      = 'cat_metodos_pago';
    protected $primaryKey = 'id_metodo';

    protected $fillable = [
        'nombre_metodo',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];
}
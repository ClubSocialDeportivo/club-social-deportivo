<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    // Conectamos con la nueva tabla de Bryan
    protected $table = 'tbl_torneos';
    protected $primaryKey = 'id_torneo';

    // Los nuevos campos obligatorios
    protected $fillable = [
        'id_disciplina', 
        'nombre_torneo', 
        'tipo', 
        'tipo_bracket',
        'categoria', 
        'sede_principal', 
        'fecha_inicio', 
        'fecha_fin'
    ];
}
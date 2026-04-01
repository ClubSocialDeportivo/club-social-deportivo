<?php
// ============================================================
// App\Models\CatDisciplina.php
// ============================================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CatDisciplina extends Model
{
    protected $table      = 'cat_disciplinas';
    protected $primaryKey = 'id_disciplina';

    protected $fillable = [
        'nombre_disciplina',
        'descripcion',
        'categoria',
        'equipo_necesario',
        'activa',
    ];

    protected $casts = [
        'activa' => 'boolean',
    ];
}


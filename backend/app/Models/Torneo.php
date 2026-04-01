<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Torneo extends Model
{
    use HasFactory;

    protected $table = 'tbl_torneos';
    protected $primaryKey = 'id_torneo';

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

    public function encuentros()
    {
        return $this->hasMany(Encuentro::class, 'torneo_id', 'id_torneo');
    }

    public function participantes()
    {
        return $this->hasMany(JugadorTemporal::class, 'id_torneo', 'id_torneo');
    }

    public function sede()
    {
        return $this->belongsTo(Instalaciones::class, 'sede_principal', 'id_espacio');
    }
}
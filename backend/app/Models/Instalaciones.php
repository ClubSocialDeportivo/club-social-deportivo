<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Torneo; // Importamos tu modelo para que lo reconozca

class Instalaciones extends Model
{
    protected $table = 'tbl_instalaciones';
    protected $primaryKey = 'id_espacio';
    public $timestamps = false;

    protected $fillable = [
        'id_categoria',
        'nombre_especifico',
        'ubicacion',
        'tipo_superficie',
        'capacidad_max',
        'horario_apertura',
        'horario_cierre',
        'equipamiento',
        'estatus',
        'permite_reserva'
    ];

    public function agendas()
    {
        return $this->hasMany(Agenda::class, 'id_espacio', 'id_espacio');
    }

    public function reservas()
    {
        return $this->hasMany(Reservas::class, 'id_espacio', 'id_espacio');
    }

    // EL CONECTE MAESTRO A TUS TORNEOS
    public function torneos()
    {
        return $this->hasMany(Torneo::class, 'sede_principal', 'id_espacio');
    }
}
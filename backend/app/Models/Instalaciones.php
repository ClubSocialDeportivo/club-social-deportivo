<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Instalaciones extends Model
{
    // Nombre de la tabla en Supabase
    protected $table = 'tbl_instalaciones';

    // Tu llave primaria no se llama "id", se llama "id_espacio"
    protected $primaryKey = 'id_espacio';

    // Para que Laravel no intente buscar columnas de "created_at"
    public $timestamps = false;

    protected $fillable = [
        'id_categoria',
        'nombre_especifico',
        'ubicacion',
        'tipo_superficie',
        'capacidad_max',
        'estatus',
        'horario_apertura',
        'horario_cierre'
    ];

    public function agendas()
    {
        return $this->hasMany(Agenda::class, 'id_espacio', 'id_espacio');
    }

    public function reservas()
    {
        return $this->hasMany(Reservas::class, 'id_espacio', 'id_espacio');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistencia extends Model
{
    protected $table      = 'tbl_asistencias';
    protected $primaryKey = 'id_asistencia';

    // No tiene updated_at
    const UPDATED_AT = null;

    protected $fillable = [
        'id_socio',
        'id_sesion',
        'token_qr',
        'timestamp_registro',
    ];

    protected $casts = [
        'timestamp_registro' => 'datetime',
        'created_at'         => 'datetime',
    ];

    // Relación con tbl_socios
    public function socio()
    {
        return $this->belongsTo(Socio::class, 'id_socio', 'id_socio');
    }

    // Relación con tbl_agenda
    public function sesion()
    {
        return $this->belongsTo(Agenda::class, 'id_sesion', 'id_sesion');
    }
}
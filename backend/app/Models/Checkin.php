<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Checkin extends Model
{
    protected $table      = 'tbl_checkins';
    protected $primaryKey = 'id_checkin';

    const UPDATED_AT = null;

    protected $fillable = [
        'id_socio',
        'fecha',
        'hora_entrada',
        'acceso_permitido',
        'motivo_denegado',
    ];

    protected $casts = [
        'acceso_permitido' => 'boolean',
        'fecha'            => 'date',
        'created_at'       => 'datetime',
    ];

    public function socio()
    {
        return $this->belongsTo(Socio::class, 'id_socio', 'id_socio');
    }
}
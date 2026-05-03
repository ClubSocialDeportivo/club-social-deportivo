<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    protected $table = 'tbl_notificaciones';
    protected $primaryKey = 'id_notificacion';

    protected $fillable = [
        'id_socio',
        'titulo',
        'mensaje',
        'leido_boolean',
    ];

    protected $casts = [
        'leido_boolean' => 'boolean',
    ];

    public function socio()
    {
        return $this->belongsTo(Socio::class, 'id_socio', 'id_socio');
    }
}
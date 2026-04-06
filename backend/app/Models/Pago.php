<?php
// ============================================================
// App\Models\Pago.php
// ============================================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    protected $table      = 'tbl_pagos';
    protected $primaryKey = 'id_pago';

    protected $fillable = [
        'id_socio',
        'id_metodo',
        'monto',
        'concepto',
        'referencia',
        'folio_digital',
        'fecha_pago',
    ];

    protected $casts = [
        'monto'      => 'decimal:2',
        'fecha_pago' => 'datetime',
    ];

    public function socio()
    {
        return $this->belongsTo(Socio::class, 'id_socio', 'id_socio');
    }

    public function metodo()
    {
        return $this->belongsTo(CatMetodoPago::class, 'id_metodo', 'id_metodo');
    }
}
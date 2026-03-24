<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agenda extends Model
{
    protected $table = 'tbl_agenda';
    protected $primaryKey = 'id_sesion'; // Según tu SQL
    public $timestamps = false;
}

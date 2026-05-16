<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'tbl_usuarios';
    protected $primaryKey = 'id_usuario';

    public $timestamps = true;

    protected $fillable = [
        'email',
        'password_hash',
        'id_rol',
        'activo',
        'ultimo_login_at',
    ];

    protected $hidden = [
        'password_hash',
    ];

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function socio()
    {
        return $this->hasOne(Socio::class, 'id_usuario', 'id_usuario');
    }
}
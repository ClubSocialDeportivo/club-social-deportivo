<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('sedes_externas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_sede')->unique(); // El unique() evita sedes duplicadas
            $table->string('direccion');
            $table->string('contacto_responsable')->nullable();
            $table->string('telefono_contacto')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sedes_externas');
    }
};
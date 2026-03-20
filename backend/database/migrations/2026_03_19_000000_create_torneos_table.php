<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('torneos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_torneo');
            $table->enum('tipo', ['eliminacion_directa', 'round_robin']);
            $table->integer('cupo_maximo');
            $table->date('fecha_inicio');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('torneos');
    }
};
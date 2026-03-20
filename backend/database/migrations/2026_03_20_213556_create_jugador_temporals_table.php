<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('jugadores_temporales', function (Blueprint $table) {
            $table->id();
            // Vinculamos al jugador con el torneo que creaste antes
            $table->foreignId('torneo_id')->constrained('torneos')->onDelete('cascade');
            $table->string('nombre');
            $table->string('apellidos');
            $table->string('identificacion_unica')->unique(); // Para evitar duplicidad como pide tu Jira
            $table->string('telefono')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('jugadores_temporales');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('encuentros', function (Blueprint $table) {
            $table->id();
            // Vinculamos al torneo
            $table->foreignId('torneo_id')->constrained('torneos')->onDelete('cascade');
            
            // Datos para el Bracket (CM3-26)
            $table->string('fase')->nullable(); // Ej: Cuartos, Semifinal, Final
            $table->string('participante_1')->nullable();
            $table->string('participante_2')->nullable();
            $table->string('ganador')->nullable();
            
            // Datos para Programación de eventos (CM3-28)
            $table->dateTime('fecha_inicio')->nullable();
            $table->dateTime('fecha_fin')->nullable();
            $table->string('cancha')->nullable();
            $table->string('juez_arbitro')->nullable();
            
            // Vinculamos a la sede externa (CM3-27) si es que aplica
            $table->foreignId('sede_externa_id')->nullable()->constrained('sedes_externas')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('encuentros');
    }
};
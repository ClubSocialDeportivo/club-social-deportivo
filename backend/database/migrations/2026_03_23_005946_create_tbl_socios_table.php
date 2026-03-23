<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_socios', function (Blueprint $table) {
            $table->bigIncrements('id_socio');

            $table->unsignedBigInteger('id_usuario')->nullable();

            $table->string('nombre');
            $table->string('apellidos');
            $table->date('fecha_nacimiento');
            $table->string('genero');
            $table->string('tipo_membresia');
            $table->string('modalidad');

            $table->string('numero_documento')->nullable();

            $table->date('fecha_inicio_vigencia')->nullable();
            $table->date('fecha_fin_vigencia')->nullable();

            $table->string('estatus_financiero');

            $table->boolean('es_titular');
            $table->unsignedBigInteger('id_titular_fk')->nullable();
            $table->boolean('activo');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_socios');
    }
};
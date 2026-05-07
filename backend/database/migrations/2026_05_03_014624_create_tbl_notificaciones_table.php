<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tbl_notificaciones', function (Blueprint $table) {
            $table->bigIncrements('id_notificacion');
            $table->unsignedBigInteger('id_socio');
            $table->string('titulo', 120);
            $table->text('mensaje');
            $table->boolean('leido_boolean')->default(false);
            $table->timestamps();

            $table->foreign('id_socio')
                ->references('id_socio')
                ->on('tbl_socios')
                ->onDelete('cascade');

            $table->index('id_socio');
            $table->index('leido_boolean');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tbl_notificaciones');
    }
};
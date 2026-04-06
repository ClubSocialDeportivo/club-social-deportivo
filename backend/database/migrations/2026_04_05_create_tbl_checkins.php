<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('tbl_checkins', function (Blueprint $table) {
            $table->bigIncrements('id_checkin');
            $table->unsignedBigInteger('id_socio');
            $table->date('fecha')->default(DB::raw('CURRENT_DATE'));
            $table->time('hora_entrada')->default(DB::raw('CURRENT_TIME'));
            $table->boolean('acceso_permitido')->default(true);
            $table->string('motivo_denegado', 120)->nullable();
            $table->timestamps();

            $table->foreign('id_socio')->references('id_socio')->on('tbl_socios')->onDelete('cascade');
            $table->index('fecha');
            $table->index('id_socio');
        });
    }

    public function down()
    {
        Schema::dropIfExists('tbl_checkins');
    }
};

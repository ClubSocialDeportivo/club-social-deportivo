<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tbl_socios', function (Blueprint $table) {
            $table->string('correo')->nullable()->unique()->after('apellidos');
            $table->string('telefono')->nullable()->after('correo');
        });
    }

    public function down(): void
    {
        Schema::table('tbl_socios', function (Blueprint $table) {
            $table->dropColumn(['correo', 'telefono']);
        });
    }
};

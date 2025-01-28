<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('genders', function (Blueprint $table) {
            $table->id();
            $table->name();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table()->insert([
            'name' => 'Homem',
        ]);
        
        DB::table()->insert([
            'name' => 'Mulher',
        ]);
        
        DB::table()->insert([
            'name' => 'Além de binário',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('genders');
    }
};
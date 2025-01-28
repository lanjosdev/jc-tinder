<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('gender_not_binarys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('fk_genders_gender_not_binarys')->nullable()->constrained('genders')->onUpdate();
            $table->foreignId('fk_user_gender_not_binarys')->nullable()->constrained('users')->onUpdate();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
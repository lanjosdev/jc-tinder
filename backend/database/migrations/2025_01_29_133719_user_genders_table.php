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
        Schema::create('user_genders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fk_genders_user_gender_id')->nullable()->constrained('genders')->onUpdate('cascade');
            $table->foreignId('fk_sub_genders_user_gender_id')->nullable()->constrained('sub_genders')->onUpdate('cascade');
            $table->foreignId('fk_user_user_gender_id')->nullable()->constrained('users')->onUpdate('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_genders');
    }
};
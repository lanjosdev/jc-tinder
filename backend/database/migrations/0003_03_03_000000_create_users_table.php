<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

use function Laravel\Prompts\table;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('password');
            $table->boolean('adult')->default(0);
            $table->string('phone');
            $table->string('email')->nullable()->unique();
            $table->string('birth_data');
            $table->boolean('level')->default(0);
            $table->text('about_me')->nullable();
            $table->foreignId('fk_gender_user_id')->nullable()->constrained('genders')->onUpdate('cascade');
            $table->foreignId('fk_sexuality_user_id')->nullable()->constrained('sexualities')->onUpdate('cascade');
            $table->foreignId('fk_sub_gender_user_id')->nullable()->constrained('sub_genders')->onUpdate('cascade');
            $table->integer('minimum_age')->default(18);
            $table->integer('maximum_age')->default(100);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });

        DB::table('users')->insert([
            'name' => 'admin-bizsys',
            'email' => 'ti.datacenter@bizsys.com.br',
            'password' => Hash::make('r4bhvp2h372020'),
            'adult' => 1,
            'level' => 1,
            'phone' => '11900000000',
            'birth_data' => '2000-01-01',
            'minimum_age' => 18,
            'maximum_age' => 100,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
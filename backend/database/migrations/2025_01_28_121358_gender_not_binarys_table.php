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
        Schema::create('gender_not_binarys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('fk_genders_gender_not_binarys')->nullable()->constrained('genders')->onUpdate('cascade');
            $table->foreignId('fk_user_gender_not_binarys')->nullable()->constrained('users')->onUpdate('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('gender_not_binarys')->insert([
            ['name' => 'Agênero', 'description' => 'Uma pessoa que não tem gênero.'],
            ['name' => 'Arromântico','description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Assexual','description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Bissexual' ,'description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Demissexual','description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Homossexual','description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Lésbica' ,'description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Onissexual' ,'description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Pansexual','description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Queer' ,'description' => 'Uma pessoa que não tem gênero.' ],
            ['name' => 'Questionando','description' => 'Uma pessoa que não tem gênero.' ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('habits');
    }
};
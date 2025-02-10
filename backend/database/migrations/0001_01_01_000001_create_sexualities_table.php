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
        Schema::create('sexualities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('sexualities')->insert([
            ['name' => 'Heterossexual', 'description' => 'Atração por pessoas do gênero oposto.'],
            ['name' => 'Arromântico', 'description' => 'Não sente atração romântica, mas pode sentir atração sexual.'],
            ['name' => 'Assexual', 'description' => 'Pouca ou nenhuma atração sexual.'],
            ['name' => 'Bissexual', 'description' => 'Atração por dois ou mais gêneros.'],
            ['name' => 'Demissexual', 'description' => 'Atração sexual apenas após uma forte conexão emocional.'],
            ['name' => 'Homossexual', 'description' => 'Atração por pessoas do mesmo gênero.'],
            ['name' => 'Lésbica', 'description' => 'Uma mulher que sente atração sexual, romântica ou emocional por outra mulher.'],
            ['name' => 'Onissexual', 'description' => 'Alguém que pode sentir atração sexual, romântica ou emocional por pessoas de todos os gêneros.'],
            ['name' => 'Pansexual', 'description' => 'Atração por pessoas independentemente de gênero.'],
            ['name' => 'Queer', 'description' => 'Atração não limitada a normas tradicionais de gênero ou sexualidade.'],
            ['name' => 'Questionando', 'description' => 'Explorando ou incerto sobre sua orientação sexual.'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sexualities');
    }
};
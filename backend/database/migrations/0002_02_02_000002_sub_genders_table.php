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
        Schema::create('sub_genders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->foreignId('fk_genders_sub_genders_id')->nullable()->constrained('genders')->onUpdate('cascade');
            $table->timestamps();
            $table->softDeletes();
        });

        /////////////////MEN
        DB::table('sub_genders')->insert([
            'name' => 'Homem Cisgênero',
            'description' => 'Pessoa designada homem ao nascer e que se identifica como homem.',
            'fk_genders_sub_genders_id' => 1,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Homem Transgênero',
            'description' => 'Pessoa designada mulher ao nascer, mas que se identifica como homem.',
            'fk_genders_sub_genders_id' => 1,
        ]);


        /////////////////WOMAN

        DB::table('sub_genders')->insert([
            'name' => 'Mulher Cisgênero',
            'description' => 'Pessoa designada mulher ao nascer e que se identifica como mulher.',
            'fk_genders_sub_genders_id' => 2,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Mulher Transgênero',
            'description' => 'Pessoa designada homem ao nascer, mas que se identifica como mulher.',
            'fk_genders_sub_genders_id' => 2,
        ]);

        //////////////////NOT-BINARY

        DB::table('sub_genders')->insert([
            'name' => 'Bigênero',
            'description' => 'Uma pessoa que não tem dois gêneros (pode ser simultaneamente ou fluido).',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Gênero fluido',
            'description' => 'Uma pessoa que não tem um único gênero fixo.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Questionando',
            'description' => 'Uma pessoa que está questionando o gênero atual e/ou explorando outros gêneros e expresões.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Genderqueer',
            'description' => 'Uma pessoa que não se identifica ou expressa seu gênero dentro do gênero binário.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Intersexo',
            'description' => 'Um termo abrangente para se referir ás pessoas nascidas com uma ou mais variações de características sexuais que não se encaixam em ideias binárias de corpos masculinos ou femininos.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Não binário',
            'description' => 'Uma pessoa cujo gênero está além das categorias exclusivas de homem e mulher.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Pangênero',
            'description' => 'Uma pessoa que expirementa vários gêneros simultaneamente ou ao longo do tempo.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Pessoa trans',
            'description' => 'Uma pessoa que é transgênero, e cujo gênero é diferente do sexo atribuído no nascimento.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Transfeminima',
            'description' => 'Uma pessoa que foi designada homem ao nascer, mas se apresenta como feminina. Esta pessoa pode ou não se ver como uma mulher ou uma mulher transgênero.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Transmasculino',
            'description' => 'Uma pessoa que foi designada mulher ao nascer, mas se apresenta como masculino. Esta pessoa pode ou não se ver como um homem ou um homem transgênero.',
            'fk_genders_sub_genders_id' => 3,
        ]);

        DB::table('sub_genders')->insert([
            'name' => 'Two-Spirit',
            'description' => 'Um termo abrangente usando por nativos norte-americanos e comunidades indígenas do Canadá para homenagear o papel sagrado que pessoas que não exclusivamente cisgênero e/ou heterossexual detêm nestes grupos.',
            'fk_genders_sub_genders_id' => 3,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_genders');
    }
};
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
        Schema::create('habits', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });

        DB::table('habits')->insert([
            ['name' => 'Beber Drinks'],
            ['name' => 'Beber Cerveja'],
            ['name' => 'Jogar Futebol'],
            ['name' => 'Assistir Séries'],
            ['name' => 'Assistir Filmes'],
            ['name' => 'Passear ao Ar Livre'],
            ['name' => 'Correr'],
            ['name' => 'Ir à Praia'],
            ['name' => 'Dançar'],
            ['name' => 'Fotografar'],
            ['name' => 'Ler Livros'],
            ['name' => 'Jogar Videogame'],
            ['name' => 'Meditar'],
            ['name' => 'Fazer Yoga'],
            ['name' => 'Viajar'],
            ['name' => 'Praticar Natação'],
            ['name' => 'Tocar Instrumento Musical'],
            ['name' => 'Desenhar'],
            ['name' => 'Pintar Quadros'],
            ['name' => 'Cozinhar'],
            ['name' => 'Caminhar'],
            ['name' => 'Andar de Bicicleta'],
            ['name' => 'Fazer Trilhas'],
            ['name' => 'Acampar'],
            ['name' => 'Jardinagem'],
            ['name' => 'Pescaria'],
            ['name' => 'Degustar Vinhos'],
            ['name' => 'Jogar Xadrez'],
            ['name' => 'Praticar Esportes Radicais'],
            ['name' => 'Cantar'],
            ['name' => 'Ir a Shows'],
            ['name' => 'Participar de Festas'],
            ['name' => 'Ir a Teatros'],
            ['name' => 'Ir ao Cinema'],
            ['name' => 'Praticar Crossfit'],
            ['name' => 'Andar de Skate'],
            ['name' => 'Jogar Tênis'],
            ['name' => 'Praticar Artes Marciais'],
            ['name' => 'Fazer Pilates'],
            ['name' => 'Treinar na Academia'],
            ['name' => 'Andar de Patins'],
            ['name' => 'Escrever Poesias'],
            ['name' => 'Escrever Contos'],
            ['name' => 'Fazer DIY (faça você mesmo)'],
            ['name' => 'Ouvir Podcasts'],
            ['name' => 'Participar de Voluntariado'],
            ['name' => 'Adotar Animais de Estimação'],
            ['name' => 'Cuidar de Animais'],
            ['name' => 'Assistir Documentários'],
            ['name' => 'Colecionar Objetos'],
            ['name' => 'Fazer Artesanato'],
            ['name' => 'Praticar Tiro com Arco'],
            ['name' => 'Jogar Paintball'],
            ['name' => 'Jogar Boliche'],
            ['name' => 'Fazer Stand-up Paddle'],
            ['name' => 'Surfar'],
            ['name' => 'Praticar Canoagem'],
            ['name' => 'Praticar Escalada'],
            ['name' => 'Assistir Animes'],
            ['name' => 'Cantar no Karaokê'],
            ['name' => 'Jogar Jogos de Tabuleiro'],
            ['name' => 'Organizar Eventos'],
            ['name' => 'Fazer Decorações'],
            ['name' => 'Explorar Culinária Local'],
            ['name' => 'Explorar Restaurantes'],
            ['name' => 'Participar de Workshops'],
            ['name' => 'Fazer Terapia'],
            ['name' => 'Manter Diário'],
            ['name' => 'Praticar Minimalismo'],
            ['name' => 'Seguir Tendências de Moda'],
            ['name' => 'Fazer Investimentos'],
            ['name' => 'Estudar Idiomas'],
            ['name' => 'Fazer Origami'],
            ['name' => 'Participar de Maratonas'],
            ['name' => 'Jogar Poker'],
            ['name' => 'Praticar Patinação no Gelo'],
            ['name' => 'Jogar Basquete'],
            ['name' => 'Explorar Museus'],
            ['name' => 'Jogar Rugby'],
            ['name' => 'Fazer Parkour'],
            ['name' => 'Praticar Tai Chi'],
            ['name' => 'Explorar Cidades Históricas'],
            ['name' => 'Ficar com a Família'],
            ['name' => 'Brincar com Crianças'],
            ['name' => 'Fazer Crochê'],
            ['name' => 'Costurar'],
            ['name' => 'Fazer Tricô'],
            ['name' => 'Montar Quebra-cabeças'],
            ['name' => 'Cuidar de Plantas'],
            ['name' => 'Participar de Feiras'],
            ['name' => 'Cuidar da Saúde Mental'],
            ['name' => 'Preparar Sobremesas'],
            ['name' => 'Explorar Natureza'],
            ['name' => 'Apreciar Paisagens'],
            ['name' => 'Comer em Famílias'],
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
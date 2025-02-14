<?php

namespace Database\Seeders;

use App\Models\Photo;
use App\Models\Sequence;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Storage;
use App\Models\Utils;
use Illuminate\Support\Facades\DB;

class UsersSeeder extends Seeder
{
    protected $utils;

    public function __construct(Utils $utils)
    {
        $this->utils = $utils;
    }

    public function run(): void
    {
        // DB::beginTransaction();

        // $faker = Faker::create();
        // $users = [];

        // for ($i = 0; $i < 120; $i++) {
        //     $gender = $faker->randomElement(['male', 'female']);
        //     $name = $faker->name($gender);
        //     $birthDate = $faker->dateTimeBetween('-100 years', '-18 years')->format('Y-m-d');
        //     $phone = '119' . $faker->numerify('########');
        //     $genderId = $faker->numberBetween(1, 3);
        //     $sexualityId = $faker->numberBetween(1, 11);
        //     $subGenderId = $faker->numberBetween(1, 15);

        //     $user = User::create([
        //         'name' => $name,
        //         'password' => Hash::make('123456789'),
        //         'adult' => 1,
        //         'level' => 0,
        //         'phone' => $phone,
        //         'birth_data' => $birthDate,
        //         'fk_gender_user_id' => $genderId,
        //         'fk_sexuality_user_id' => $sexualityId,
        //         'fk_sub_gender_user_id' => $subGenderId,
        //         'minimum_age' => 18,
        //         'maximum_age' => 100,
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);

        // // Caminho da pasta com as imagens
        // $folderPath = storage_path('app/public/uploads');

        // if (!is_dir($folderPath) || empty(glob("$folderPath/*"))) {
        //     continue; // Pula o usuário se não houver imagens
        // }

        // $result = $this->utils->handleFolderImageUploads($folderPath, $user->id);
        // $savedImages = $result['savedImages'] ?? [];
        // $thumbnailPaths = $result['thumbnailPaths'] ?? [];

        // // Adicionando verificação para evitar erro de índice inexistente
        // if (!empty($savedImages) && !empty($thumbnailPaths) && isset($savedImages[0], $thumbnailPaths[0])) {
        //     $photo = Photo::create([
        //         'fk_user_photos_id' => $user->id,
        //         'name_photo' => $savedImages[0], // Pega a primeira imagem
        //         'send' => 0,
        //         'thumb_photo' => $thumbnailPaths[0],
        //         'created_at' => now(),
        //         'updated_at' => now(),
        //     ]);

        //     Sequence::create([
        //         'order' => 0,
        //         'fk_sequences_photos_id' => $photo->id,
        //     ]);
        // } else {
        //     DB::rollBack();
        //     echo "⚠️ Nenhuma imagem encontrada para o usuário {$user->id}. Pulando...\n";
        // }
        // }
        // DB::commit();

        // echo "120 usuários e imagens inseridos com sucesso!";

        // DB::beginTransaction();

        // try {
        //     $faker = Faker::create();

        //     for ($i = 0; $i < 120; $i++) {
        //         $gender = $faker->randomElement(['male', 'female']);
        //         $name = $faker->name($gender);
        //         $birthDate = $faker->dateTimeBetween('-100 years', '-18 years')->format('Y-m-d');
        //         $phone = '119' . $faker->numerify('########');
        //         $genderId = $faker->numberBetween(1, 3);
        //         $sexualityId = $faker->numberBetween(1, 11);
        //         $subGenderId = $faker->numberBetween(1, 15);

        //         $user = User::create([
        //             'name' => $name,
        //             'password' => Hash::make('123456789'),
        //             'adult' => 1,
        //             'level' => 0,
        //             'phone' => $phone,
        //             'birth_data' => $birthDate,
        //             'fk_gender_user_id' => $genderId,
        //             'fk_sexuality_user_id' => $sexualityId,
        //             'fk_sub_gender_user_id' => $subGenderId,
        //             'minimum_age' => 18,
        //             'maximum_age' => 100,
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);

        //         // Caminho da pasta das imagens
        //         $folderPath = storage_path('app/public/uploads');

        //         // if (!is_dir($folderPath) || empty(glob("$folderPath/*"))) {
        //         //     echo "⚠️ Nenhuma imagem disponível na pasta. Pulando usuário {$user->id}...\n";
        //         //     continue;
        //         // }

        //         // Tenta pegar imagens usando seu método
        //         $result = $this->utils->handleFolderImageUploads($folderPath, $user->id);
        //         $savedImages = $result['savedImages'] ?? [];
        //         $thumbnailPaths = $result['thumbnailPaths'] ?? [];

        //         $photo = Photo::create([
        //             'fk_user_photos_id' => $user->id,
        //             'name_photo' => $savedImages[0], // Pega a primeira imagem
        //             'send' => 0,
        //             'thumb_photo' => $thumbnailPaths[0],
        //             'created_at' => now(),
        //             'updated_at' => now(),
        //         ]);

        //         Sequence::create([
        //             'order' => 0,
        //             'fk_sequences_photos_id' => $photo['id'], // Agora usa o ID da foto
        //         ]);
        //     }

        //     DB::commit(); // Se chegou até aqui sem erros, confirma tudo

        //     echo "120 usuários e imagens inseridos com sucesso!\n";
        // } catch (\Exception $e) {
        //     DB::rollBack(); // Se houver erro, cancela tudo
        //     echo "Erro: " . $e->getMessage() . "\n";
        // }

        $faker = Faker::create();
        $users = [];
        $photos = [];
        $sequence = [];

        for ($i = 0; $i < 5; $i++) {
            $gender = $faker->randomElement(['male', 'female']);
            $name = $faker->name($gender);
            $birthDate = $faker->dateTimeBetween('-100 years', '-18 years')->format('Y-m-d');
            $phone = '119' . $faker->numerify('########');
            $genderId = $faker->numberBetween(1, 3);
            $sexualityId = $faker->numberBetween(1, 11);
            $subGenderId = $faker->numberBetween(1, 15);

            $users[] = [
                'name' => $name,
                'password' => Hash::make('123456789'),
                'adult' => 1,
                'level' => 0,
                'phone' => $phone,
                'birth_data' => $birthDate,
                'fk_gender_user_id' => $genderId,
                'fk_sexuality_user_id' => $sexualityId,
                'fk_sub_gender_user_id' => $subGenderId,
                'minimum_age' => 18,
                'maximum_age' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ];


            // $userIds = User::pluck('id')->toArray();

            // foreach ($userIds as $userId) {
            //     $folderPath = storage_path('app/public/uploads');

            //     $result = $this->utils->handleFolderImageUploads($folderPath, $userId);
            //     $savedImages = $result['savedImages'];
            //     $thumbnailPaths = $result['thumbnailPaths'];

            //     $photos[] = [
            //         'fk_user_photos_id' => $userId,
            //         'name_photo' => $savedImages[0], // Considerando apenas a primeira imagem
            //         'send' => 0,
            //         'thumb_photo' => $thumbnailPaths[0],
            //         'created_at' => now(),
            //         'updated_at' => now(),
            //     ];

            //     $sequence[] = [
            //         'order' => 0,
            //         'fk_sequences_photos_id' => $savedImages[0]
            //     ];
            // }
        }

        // Insere os usuários e obtém os IDs
        User::insert($users);

        // Photo::insert($photos);

        // Sequence::insert($sequence);

        echo "120 usuários e imagens inseridos com sucesso!";
    }
}
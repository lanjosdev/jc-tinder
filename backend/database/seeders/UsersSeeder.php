<?php

namespace Database\Seeders;

use App\Models\Photo;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Storage;
use App\Models\Utils;

class UsersSeeder extends Seeder
{

    // protected $utils;

    // public function __construct(Utils $utils)
    // {
    //     $this->utils = $utils;
    // }
    // /**
    //  * Run the database seeds.
    //  */
    // public function run(): void
    // {

    //     $faker = Faker::create();
    //     $users = [];
    //     $photos = [];

    //     for ($i = 0; $i < 120; $i++) {
    //         $gender = $faker->randomElement(['male', 'female']);
    //         $name = $faker->name($gender);
    //         $birthDate = $faker->dateTimeBetween('-100 years', '-18 years')->format('Y-m-d');
    //         $phone = '119' . $faker->numerify('########'); // Garantir 11 dígitos com um prefixo inicial
    //         $gender = $faker->numberBetween(1, 3);
    //         $sexuality = $faker->numberBetween(1, 11);
    //         $sub_gender = $faker->numberBetween(1, 15);

    //         $folderPath = storage_path('app/public/uploads');

    //         $result = $this->utils->handleFolderImageUploads($folderPath, $users[$i]);
    //         $savedImages = $result['savedImages'];
    //         $thumbnailPaths = $result['thumbnailPaths'];

    //         $photos[] = [
    //             'fk_user_photos_id' => $users[$i],
    //             'name_photo' => $savedImages,
    //             'send' => 0,
    //             'thumb_photo' =>  $thumbnailPaths,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ];

    //         $users[] = [
    //             'name' => $name,
    //             'password' => Hash::make('123456789'),
    //             'adult' => 1,
    //             'level' => 0,
    //             'phone' => $phone,
    //             'birth_data' => $birthDate,
    //             'fk_gender_user_id' => $gender,
    //             'fk_sexuality_user_id' => $sexuality,
    //             'fk_sub_gender_user_id' => $sub_gender,
    //             'minimum_age' => 18,
    //             'maximum_age' => 100,
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ];
    //     }

    //     User::insert($users);
    //     Photo::insert($photos);

    //     echo "120 usuários inseridos com sucesso!";
    // }

    protected $utils;

    public function __construct(Utils $utils)
    {
        $this->utils = $utils;
    }

    public function run(): void
    {
        $faker = Faker::create();
        $users = [];
        $photos = [];

        for ($i = 0; $i < 120; $i++) {
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
        }

        // Insere os usuários e obtém os IDs
        User::insert($users);

        $userIds = User::pluck('id')->toArray();

        foreach ($userIds as $userId) {
            $folderPath = storage_path('app/public/uploads');

            $result = $this->utils->handleFolderImageUploads($folderPath, $userId);
            $savedImages = $result['savedImages'];
            $thumbnailPaths = $result['thumbnailPaths'];

            $photos[] = [
                'fk_user_photos_id' => $userId,
                'name_photo' => $savedImages[0], // Considerando apenas a primeira imagem
                'send' => 0,
                'thumb_photo' => $thumbnailPaths[0],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        Photo::insert($photos);

        echo "120 usuários e imagens inseridos com sucesso!";
    }
}
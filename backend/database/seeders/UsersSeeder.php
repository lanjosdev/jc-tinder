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

        $faker = Faker::create();
        $users = [];

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
        }

        // Insere os usuários e obtém os IDs
        User::insert($users);

        // Photo::insert($photos);

        // Sequence::insert($sequence);

        echo $i . " usuários inseridos com sucesso!";
    }
}
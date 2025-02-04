<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $faker = Faker::create();
        $users = [];

        for ($i = 0; $i < 120; $i++) {
            $gender = $faker->randomElement(['male', 'female']);
            $name = $faker->name($gender);
            $birthDate = $faker->dateTimeBetween('-100 years', '-18 years')->format('Y-m-d');
            $phone = '11' . $faker->numerify('#########'); // Garantir 11 dígitos com um prefixo inicial
            $gender = $faker->numberBetween(1,3);
            $sexuality = $faker->numberBetween(1,11);
            $sub_gender = $faker->numberBetween(1,15);

            $users[] = [
                'name' => $name,
                'password' => Hash::make('123456789'),
                'adult' => 1,
                'level' => 0,
                'phone' => $phone,
                'birth_data' => $birthDate,
                'fk_gender_user_id' => $gender,
                'fk_sexuality_user_id' => $sexuality,
                'fk_sub_gender_user_id' => $sub_gender,
                'minimum_age' => 18,
                'maximum_age' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        
        User::insert($users);

        echo "120 usuários inseridos com sucesso!";
    }
}
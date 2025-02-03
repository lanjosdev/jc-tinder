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

            $users[] = [
                'name' => $name,
                'password' => Hash::make('123456789'),
                'adult' => 1,
                'level' => 0,
                'phone' => $phone,
                'birth_data' => $birthDate,
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
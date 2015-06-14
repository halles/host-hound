<?php

# database/seeds/UserTableSeeder.php

use App\Models\User;
use Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{

    public function run()
    {

        User::create([
             'name' => 'Matías Halles',
             'email' => 'matias.halles@gmail.com',
             'password' => Hash::make('123456')
         ]);

        User::create([
            'name' => 'Sofía González',
            'email' => 'sofita.1@gmail.com',
            'password' => Hash::make('123456')
        ]);

    }
}

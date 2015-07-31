<?php

# database/seeds/ProfileTableSeeder.php

use App\Models\Profile;
use App\Models\ProfileAttribute;
use App\Models\ProfileNote;
use App\Models\ProfileEmployment;
use App\Models\ProfileLog;
use App\Models\Attribute;
use Illuminate\Database\Seeder;

class ProfileTableSeeder extends Seeder
{

    public function random_number($digits){
      return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
    }

    public function random_phone_number(){
      return '+56 9 '.self::random_number(8);
    }

    public function random_rut(){
      return number_format(self::random_number(7) , 0 , "," , ".").'-'.self::random_number(1);
    }

    public function create_email_from_name($name){
      return mb_ereg_replace("\ ",".",mb_strtolower($name).'@gmail.com');
    }

    public function create_profile_record($name, $sex){

      $profile = Profile::create([
        'name' => $name,
        'organization_id' => 1,
        'is_employee' => rand(0,4) < 1,
        'phone' => self::random_phone_number(),
        'sex' => $sex,
        'id_num' => self::random_rut(),
        'id_type' => 'rut',
        'email' => self::create_email_from_name($name),
        'profile_test_id' => null
      ]);

      $attributes = array();

      do{
        $attributes[] = rand(0,19);
      } while(count($attributes) < 5);

      $profile->attributes()->sync($attributes);

    }

    public function run()
    {

        $names = array(
          'm' => array('Jamel Eberhart', 'Caleb Dyment', 'Rich Talmage', 'Emilio Talamantez', 'Lenny Suhr', 'Courtney Sultan', 'Donny Ratti', 'Shane Mcmonagle', 'Clyde Acheson', 'Octavio Dufresne', 'Rickie Maher', 'Dillon Quellette', 'Carl Laury', 'Scotty Telfer', 'Jefferey Sterling', 'Grant Rose', 'Del Castaldo', 'Ismael Shattuck', 'Abel Parke', 'Kelly Cantor', 'Hung Keppler', 'Marco Kubat', 'Florentino Bondi', 'Michel Degroot', 'Rolland Ariola', 'Phillip Rench', 'Kendrick Smeltzer', 'Trenton Maysonet', 'Fabian Penland', 'Matthew Aubrey', 'Jay Pridmore', 'Abdul Marling', 'Marcus Samayoa', 'Alvin Pinelli', 'Rogelio Badger', 'Thad Hennig', 'Olen Dulaney', 'Rodney Colson', 'Rex Ribble', 'Lowell Rojo', 'Owen Needham', 'Aaron Polster', 'Blake Gilkey', 'Jeffry Doles', 'Drew Damato', 'Brendan Farthing', 'Donnell Dowe', 'Pasquale Grose', 'Ivory Bickel', 'Stevie Hite'),
          'f' => array('Mora Tarin', 'Lurlene Speno', 'Lise Kraatz', 'Magdalena Munden', 'Farah Cropp', 'Bernita Defrank', 'Noemi Mccomas', 'Ranae Riggleman', 'Lavada Police', 'Sherice Scheck', 'Kathie Wiest', 'Nu Sealey', 'Devorah Perkinson', 'Particia Osborne', 'Felicita Kinser', 'Stefania Adan', 'Joanne Buel', 'Mira Reddix', 'Reiko Heyen', 'Kellie Hodson', 'Vena Combes', 'Kristina Arter', 'Alpha Liang', 'Florine Silversmith', 'Yvone Norville', 'Ernestina Hauff', 'Jeniffer Borst', 'Celestina Fucci', 'Shanelle Riva', 'Essie Ney', 'Tomeka Vien', 'Gidget Mccarville', 'Miranda Meloy', 'Consuelo Fontenot', 'Nam Alleman', 'Jazmine Knowlton', 'Huong Morabito', 'Daina Molander', 'Lois Moshier', 'Silvia Gardella', 'Joetta Coolidge', 'Anika Trost', 'Hettie Cousar', 'Mamie Siegfried', 'Yadira Glessner', 'Britta Sy', 'Marica Curtin', 'Stephania Doonan', 'Nathalie Threatt', 'Isela Mckinzie')
        );

        for($i=0; $i < 50; $i++){

          self::create_profile_record($names['m'][$i], 'm');

          self::create_profile_record($names['f'][$i], 'f');

        }

    }
}

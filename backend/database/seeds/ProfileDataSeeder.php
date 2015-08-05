<?php

# database/seeds/ProfileTableSeeder.php

use App\Models\Profile;
use App\Models\ProfileAttribute;
use App\Models\ProfileNote;
use App\Models\ProfileNoteType;
use App\Models\ProfileEmployment;
use App\Models\ProfileLog;
use App\Models\Attribute;
use Illuminate\Database\Seeder;

class ProfileTableSeeder extends Seeder
{

  private static $names = array(
    'm' => array('Jamel Eberhart', 'Caleb Dyment', 'Rich Talmage', 'Emilio Talamantez', 'Lenny Suhr', 'Courtney Sultan', 'Donny Ratti', 'Shane Mcmonagle', 'Clyde Acheson', 'Octavio Dufresne', 'Rickie Maher', 'Dillon Quellette', 'Carl Laury', 'Scotty Telfer', 'Jefferey Sterling', 'Grant Rose', 'Del Castaldo', 'Ismael Shattuck', 'Abel Parke', 'Kelly Cantor', 'Hung Keppler', 'Marco Kubat', 'Florentino Bondi', 'Michel Degroot', 'Rolland Ariola', 'Phillip Rench', 'Kendrick Smeltzer', 'Trenton Maysonet', 'Fabian Penland', 'Matthew Aubrey', 'Jay Pridmore', 'Abdul Marling', 'Marcus Samayoa', 'Alvin Pinelli', 'Rogelio Badger', 'Thad Hennig', 'Olen Dulaney', 'Rodney Colson', 'Rex Ribble', 'Lowell Rojo', 'Owen Needham', 'Aaron Polster', 'Blake Gilkey', 'Jeffry Doles', 'Drew Damato', 'Brendan Farthing', 'Donnell Dowe', 'Pasquale Grose', 'Ivory Bickel', 'Stevie Hite', 'Earl Russell', 'Brian Martin', 'Richard Washington', 'Gary Rogers', 'Frank Thomas', 'Joseph Bell', 'Clarence Hill', 'Albert Carter', 'Jason Gonzales', 'William Jenkins', 'James Phillips', 'Justin Rodriguez', 'Martin Powell', 'Victor Ross', 'Nicholas Thompson', 'Willie Griffin', 'Jeffrey Lewis', 'Brandon Allen', 'Ernest Morgan', 'Adam Brooks', 'Stephen Flores', 'Bobby Nelson', 'Jack Ramirez', 'Jimmy Collins', 'Henry Patterson', 'Carl Davis', 'Christopher Smith', 'Walter Peterson', 'Benjamin Robinson', 'Larry Wilson', 'Randy Perry', 'Dennis Turner', 'Samuel Gonzalez', 'Wayne Harris', 'Aaron King', 'Juan Bryant', 'Steve Coleman', 'George Watson', 'Donald Baker', 'Raymond Green', 'David Simmons', 'Harry Lee', 'Robert Cox', 'Billy Evans', 'Thomas Price', 'Patrick Butler', 'Chris White', 'Howard James', 'Anthony Cook', 'Arthur Jones'),
    'f' => array('Mora Tarin', 'Lurlene Speno', 'Lise Kraatz', 'Magdalena Munden', 'Farah Cropp', 'Bernita Defrank', 'Noemi Mccomas', 'Ranae Riggleman', 'Lavada Police', 'Sherice Scheck', 'Kathie Wiest', 'Nu Sealey', 'Devorah Perkinson', 'Particia Osborne', 'Felicita Kinser', 'Stefania Adan', 'Joanne Buel', 'Mira Reddix', 'Reiko Heyen', 'Kellie Hodson', 'Vena Combes', 'Kristina Arter', 'Alpha Liang', 'Florine Silversmith', 'Yvone Norville', 'Ernestina Hauff', 'Jeniffer Borst', 'Celestina Fucci', 'Shanelle Riva', 'Essie Ney', 'Tomeka Vien', 'Gidget Mccarville', 'Miranda Meloy', 'Consuelo Fontenot', 'Nam Alleman', 'Jazmine Knowlton', 'Huong Morabito', 'Daina Molander', 'Lois Moshier', 'Silvia Gardella', 'Joetta Coolidge', 'Anika Trost', 'Hettie Cousar', 'Mamie Siegfried', 'Yadira Glessner', 'Britta Sy', 'Marica Curtin', 'Stephania Doonan', 'Nathalie Threatt', 'Isela Mckinzie', 'Andrea Henderson', 'Christina Perry', 'Kelly Stewart', 'Christine Mitchell', 'Sandra Baker', 'Julie Brooks', 'Helen Cook', 'Rose Torres', 'Elizabeth Hall', 'Jennifer Martinez', 'Betty Bailey', 'Michelle Turner', 'Donna Sanchez', 'Marie Watson', 'Frances Hill', 'Laura Ramirez', 'Lois Adams', 'Karen Bell', 'Virginia Ward', 'Evelyn Lewis', 'Martha Bennett', 'Amy Phillips', 'Paula Scott', 'Pamela Harris', 'Lillian Davis', 'Diana Lee', 'Maria Wood', 'Dorothy Price', 'Janice Johnson', 'Wanda Patterson', 'Shirley Thomas', 'Kathryn Nelson', 'Debra Long', 'Ashley Edwards', 'Anne Miller', 'Emily Morgan', 'Melissa Griffin', 'Louise Evans', 'Heather Alexander', 'Alice White', 'Joyce Hughes', 'Angela Thompson', 'Mary Collins', 'Doris Gray', 'Judith Coleman', 'Nicole Foster', 'Linda Williams', 'Sarah Richardson', 'Jean Parker', 'Deborah Morris')
  );

  private static $reference_names = array('Oscar Allison', 'Nicole Cunningham', 'Melinda Hampton', 'Janie Cobb', 'Shelly Saunders', 'Rodney Black', 'Lawrence Bryant', 'Agnes Weber', 'Patty Ryan', 'Gloria Richards', 'Annie Gonzales', 'Norman George', 'Pearl Montgomery', 'Terry Roberson', 'Shawna Cummings', 'Wilfred Hawkins', 'Israel Day', 'Maurice Lambert', 'Neal Williamson', 'Brendan Baldwin', 'Kelvin Foster', 'Edna Parker', 'Jeremy Wood', 'Adam Stevenson', 'Henry Pope', 'Lloyd Rodriguez', 'Ivan Higgins', 'Debbie Simmons', 'Leigh Nichols', 'Sandy Moody', 'Rosemarie Alvarez', 'Ron Collier', 'Kathy Chavez', 'Dora Beck', 'Julia Scott', 'Warren Mendoza', 'Deanna Bowman', 'Zachary Dennis', 'Arturo Ray', 'Marcus Stone', 'Robin Spencer', 'Grace Wilkerson', 'Loren Hubbard', 'Alexander Dawson', 'Ken Page', 'Jonathan Douglas', 'Eugene Guerrero', 'Danielle Willis', 'Bernadette Collins', 'Wilma Sandoval', 'Jorge Conner', 'Ginger Perez', 'Archie Chambers', 'Shane Johnston', 'Barry Fisher', 'Leonard Barber', 'Inez Ortega', 'Hubert Ellis', 'Reginald Watkins', 'Floyd Schneider', 'Dana Salazar', 'Darin Jimenez', 'Nichole Knight', 'Bernard Curry', 'Philip Nguyen', 'Terence Cruz', 'Edith Frazier', 'Jimmy Davidson', 'Sarah Blake', 'Sheldon Wolfe', 'Bobby Clayton', 'Joanne Reynolds', 'Terrell Santos', 'Yvette Mack', 'Lillian Pena', 'Dawn Graves', 'Randolph Fletcher', 'Tabitha Gomez', 'Marco Horton', 'Julie Greer', 'Ervin Dean', 'Ian Garza', 'Elaine Mullins', 'Sara Luna', 'Silvia Massey', 'Paulette Williams', 'Dianna Hodges', 'Delia Bradley', 'Randall Walton', 'Roger Morton', 'Roman Ramos', 'Derek Jensen', 'Arlene Peterson', 'Rickey Stanley', 'Nadine Warner', 'Darlene Hansen', 'Alejandro Moss', 'Violet Wade', 'Carol Owens', 'Jean Goodwin');

  private static $jobs = array(
      array(
        'employers' => array('Restaurant Santabrasa', 'Café Orly Schopdog', 'Restaurant Ají Seco Místico', 'Kintaro Sushi', 'Tanta Restaurant'),
        'positions' => array('Garzón/a', 'Anfitriona', 'Cocinero/a', 'Jefe de Garzones', 'Maitre', 'Barman', 'Copero')
      ),
      array(
        'employers' => array('Hotel El Director', 'Hotel Regal Pacific', 'Hotel Atton', 'Hotel Plaza El Bosque Ebro', 'Hotel Diego de Almagro', 'Hotel Renaissance', 'Hotel Los Nogales'),
        'positions' => array('Mucama', 'Aseador', 'Barman', 'Cocinero/a', 'Garzón/a', 'Steward')
      ),
      array(
        'employers' => array('Domicilio particular'),
        'positions' => array('Empleada doméstica', 'Niñero/a')
      ),
      array(
        'employers' => array('Andina del Sud', 'Euroandino'),
        'positions' => array('Guía turístico', 'Agente de ventas', 'Secretaria')
      ),
      array(
        'employers' => array('Falabella', 'Almacenes Paris', 'La Polar', 'Movistar', 'VTR', 'GTD Manquehue'),
        'positions' => array('Promotor/a', 'Vendedor/a', 'Cajero/a', 'Servicio al cliente')
      ),
      array(
        'employers' => array('Starbucks Coffee', 'Café Juan Valdez'),
        'positions' => array('Barista')
      ),
      array(
        'employers' => array('Yogen Fruz'),
        'positions' => array('Supervisor de Local')
      ),
      array(
        'employers' => array('Telepizza', 'Doggis', 'Fritz', 'Juan Maestro'),
        'positions' => array('Cajero/a', 'Cocinero/a')
      ),
      array(
        'employers' => array('Clínica Vitacura', 'Clínica Las Nieves'),
        'positions' => array('Encargado/a de bodega')
      ),
      array(
        'employers' => array('Panadería Lo Saldes'),
        'positions' => array('Panadero/a', 'Cajero/a')
      ),
      array(
        'employers' => array('OK Market', 'Big John'),
        'positions' => array('Cajero/a')
      )
    );

    private static $notesipsum = array(
      array(1, 'Mucho descuido en la presentación personal.'),
      array(1, 'Mala dicción.'),
      array(1, 'Llega tarde a la entrevista.'),
      array(1, 'No llega a la entrevista.'),
      array(2, 'Vive cerca del hotel.'),
      array(2, 'Vive lejos del hotel.'),
      array(2, 'Tiene su propio emprendimiento.'),
      array(2, 'Conoce a uno o más trabajadores actuales del hotel.'),
      array(3, 'Disponibilidad inmediata para comenzar a trabajar.'),
      array(3, 'Hace seguimiento luego de la entrevista, mostrando interés.'),
      array(3, 'Persona carismática y con desplante.'),
      array(3, 'Llega puntual y bien presentado a la entrevista.'),
    );

    public function random_number($digits){
      return rand(pow(10, $digits - 1) - 1, pow(10, $digits) - 1);
    }

    public function random_phone_number(){
      return '+56 9 '.self::random_number(8);
    }

    public function random_rut(){
      return number_format(self::random_number(7) , 0 , "," , ".").'-'.self::random_number(1);
    }

    public function create_email_from_name($name, $organization = false){
      if(!$organization){
        $domain = 'gmail.com';
      }else{
        $domain = strtolower(preg_replace("/[^A-Za-z0-9]/", "", $organization)).'.com';
      }
      return mb_ereg_replace("\ ",".",mb_strtolower($name).'@'.$domain);
    }

    public function random_date($lower, $higher){

      $lower = strtotime($lower);
      $higher = strtotime($higher);

      return date("Y-m-d",mt_rand($lower,$higher));

    }

    public function populateTest($answers)
    {

      $test = array();
      $test['b'] = 0;
      $test['c'] = 0;
      $test['i'] = 0;
      $test['a'] = 0;

      for($y = 0; $y < 16; $y++){
        $test['b'] = $test['b'] + $answers[$y][0];
        $test['c'] = $test['c'] + $answers[$y][1];
        $test['i'] = $test['i'] + $answers[$y][2];
        $test['a'] = $test['a'] + $answers[$y][3];
      }

      $test['code'] = 'code';
      $test['name'] = 'name';
      $test['style'] = 'style';

      return $test;
    }

    public function create_profile_record($name, $sex){

      /** Perfil **/

      $profile = Profile::create([
        'name' => $name,
        'organization_id' => 2,
        'is_employee' => rand(0,4) < 1,
        'birthday' => self::random_date('1960-01-01', '1997-01-01'),
        'phone' => self::random_phone_number(),
        'sex' => $sex,
        'id_num' => self::random_rut(),
        'id_type' => 'rut',
        'email' => self::create_email_from_name($name),
        'profile_test_id' => null
      ]);

      /** Atributos **/

      $attributes = array();

      do{
        $attributes[] = mt_rand(1,19);
      } while(count($attributes) < 5);

      $profile->attributes()->sync($attributes);

      /** Tests **/

      $all = array(1,2,3,4);
      $answers = array();

      for($y = 0; $y < 16; $y++){
        $temp = $all;
        $answers[$y] = array();
        for($x = 0; $x < 4; $x++) {
          $value = array_splice($temp, mt_rand(0,count($temp)-1),1);
          $answers[$y][] = $value[0];
        }
      }

      $test = self::populateTest($answers);

      $profile->test()->create([
        'answers' => $answers
      ]);


      /** Empleos **/

      $jobs = mt_rand(0,5);

      $start_date = self::random_date('2000-01-01', date("Y-m-d"));

      for($i = 0; $i < $jobs; $jobs++){
        $end_date = (mt_rand(0,2)>0)?self::random_date($start_date, date("Y-m-d",strtotime($start_date)+mt_rand(1,48)*86400*30)):null;
        if(strtotime($end_date) > time()) $end_date = null;
        $groupi = mt_rand(0,(count(self::$jobs)-1));
        $ref_name = self::$reference_names[(mt_rand(0,count(self::$reference_names)-1))];
        $employer = self::$jobs[$groupi]['employers'][mt_rand(0,count(self::$jobs[$groupi]['employers'])-1)];
        $position = self::$jobs[$groupi]['positions'][mt_rand(0,count(self::$jobs[$groupi]['positions'])-1)];
        $description = '';
        $profile->jobs()->create([
          'employer' => $employer,
          'position' => $position,
          'description' => $description,
          'reference_name' => $ref_name,
          'reference_phone' => self::random_phone_number(),
          'reference_email' => self::create_email_from_name($ref_name, $employer),
          'start' => $start_date,
          'end' => $end_date
        ]);
        if(!$end_date){
          break;
        }else{
          $start_date = self::random_date($end_date, date("Y-m-d"));
        }
      }

      /** Notas **/

      $notes = mt_rand(0,6);
      $temp_notes = self::$notesipsum;

      for($i = 0; $i < $notes; $i++){
        $note = array_splice($temp_notes,mt_rand(0,(count($temp_notes)-1)),1);
        $profile->notes()->create([
          'user_id' => mt_rand(1,2),
          'profile_note_type_id' => $note[0][0],
          'content' => $note[0][1],
        ]);
      }

    }

    public function run()
    {

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Negativo',
        'score' => -1,
        'color' => 'A70000'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Neutro',
        'score' => 0,
        'color' => '63636A'
      ]);

      ProfileNoteType::create([
        'organization_id' => 2,
        'name' => 'Positivo',
        'score' => 1,
        'color' => '42C74B'
      ]);

      foreach(self::$names['m'] as $name){
        $names[$name] = 'm';
      }

      foreach(self::$names['f'] as $name){
        $names[$name] = 'f';
      }

      do{
        $current = array_splice($names, mt_rand(0,count($names)-1),1);
        foreach($current as $name => $sex){
          self::create_profile_record($name, $sex);
        }
      }while(count($names));

    }
}

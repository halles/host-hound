<?php

# database/seeds/AttributesSeeder.php

use App\Models\Opportunity;
use Illuminate\Database\Seeder;

class OpportunitiesSeeder extends Seeder
{

    public function run()
    {

      $parameters = array(
        'profile_patterns' => array(
          array(
            'factor' => 2,
            'patterns' => array('ce')
          ),
          array(
            'factor' => 1.7,
            'patterns' => array('ec')
          ),
          array(
            'factor' => 1.2,
            'patterns' => array('c','ca','ci')
          ),
          array(
            'factor' => 1,
            'patterns' => array('e','ea','ei')
          ),
          array(
            'factor' => 0.7,
            'patterns' => array('ac','ic','ae','ie','eci','cia','eia','eca','ecia')
          ),
          array(
            'factor' => 0.3,
            'patterns' => array('a','i','ia','ai')
          )
        ),
        'attributes' => array(
          array(
            'attribute_id' => 1,
            'factor' => 2
          ),
          array(
            'attribute_id' => 2,
            'factor' => 2
          ),
          array(
            'attribute_id' => 3,
            'factor' => 1
          ),
          array(
            'attribute_id' => 4,
            'factor' => 1
          ),
          array(
            'attribute_id' => 5,
            'factor' => 1
          ),
          array(
            'attribute_id' => 6,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 7,
            'factor' => 1
          ),
          array(
            'attribute_id' => 8,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 9,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 10,
            'factor' => 2
          ),
          array(
            'attribute_id' => 11,
            'factor' => 2
          ),
          array(
            'attribute_id' => 12,
            'factor' => 2
          ),
          array(
            'attribute_id' => 13,
            'factor' => 2
          ),
          array(
            'attribute_id' => 14,
            'factor' => 0
          ),
          array(
            'attribute_id' => 15,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 16,
            'factor' => 0
          ),
          array(
            'attribute_id' => 17,
            'factor' => 1
          ),
          array(
            'attribute_id' => 18,
            'factor' => 1
          ),
          array(
            'attribute_id' => 19,
            'factor' => 1
          ),
          array(
            'attribute_id' => 20,
            'factor' => 1
          ),
          array(
            'attribute_id' => 21,
            'factor' => 1
          )
        ),
        'experience' => array(
          'stability' => 2,
          'previous' => 1.5
        ),
        'employed' => array(
          'in' => 0,
          'no' => 1.5
        )
      );

      Opportunity::create([
        'department_id' => 2,
        'name' => 'Recepcionista',
        'active' => true,
        'parameters' => $parameters
      ]);

      $parameters = array(
        'profile_patterns' => array(
          array(
            'factor' => 2,
            'patterns' => array('ce')
          ),
          array(
            'factor' => 1.7,
            'patterns' => array('ec')
          ),
          array(
            'factor' => 1.2,
            'patterns' => array('c','ca','ci')
          ),
          array(
            'factor' => 1,
            'patterns' => array('e','ea','ei')
          ),
          array(
            'factor' => 0.7,
            'patterns' => array('ac','ic','ae','ie','eci','cia','eia','eca','ecia')
          ),
          array(
            'factor' => 0.3,
            'patterns' => array('a','i','ia','ai')
          )
        ),
        'attributes' => array(
          array(
            'attribute_id' => 1,
            'factor' => 1
          ),
          array(
            'attribute_id' => 2,
            'factor' => 1
          ),
          array(
            'attribute_id' => 3,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 4,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 5,
            'factor' => 1
          ),
          array(
            'attribute_id' => 6,
            'factor' => 2
          ),
          array(
            'attribute_id' => 7,
            'factor' => 2
          ),
          array(
            'attribute_id' => 8,
            'factor' => 1
          ),
          array(
            'attribute_id' => 9,
            'factor' => 1
          ),
          array(
            'attribute_id' => 10,
            'factor' => 1
          ),
          array(
            'attribute_id' => 11,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 12,
            'factor' => 1
          ),
          array(
            'attribute_id' => 13,
            'factor' => 1.5
          ),
          array(
            'attribute_id' => 14,
            'factor' => 1
          ),
          array(
            'attribute_id' => 15,
            'factor' => 0.5
          ),
          array(
            'attribute_id' => 16,
            'factor' => 0
          ),
          array(
            'attribute_id' => 17,
            'factor' => 0.5
          ),
          array(
            'attribute_id' => 18,
            'factor' => 1
          ),
          array(
            'attribute_id' => 19,
            'factor' => 1
          ),
          array(
            'attribute_id' => 20,
            'factor' => 1
          ),
          array(
            'attribute_id' => 21,
            'factor' => 1
          )
        ),
        'experience' => array(
          'stability' => 2,
          'previous' => 2
        ),
        'employed' => array(
          'in' => 1,
          'no' => 0
        )
      );

      Opportunity::create([
        'department_id' => 2,
        'name' => 'Mesero',
        'active' => true,
        'parameters' => $parameters
      ]);

    }
}

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
            'factor' => 3,
            'patterns' => array('ce','ec')
          ),
          array(
            'factor' => 2,
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
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 2,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 3,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 4,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 5,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 6,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 7,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 8,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 9,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 10,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 11,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 12,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 13,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 14,
            'requirement' => 'negative'
          ),
          array(
            'attribute_id' => 15,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 16,
            'requirement' => 'negative'
          ),
          array(
            'attribute_id' => 17,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 18,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 19,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 20,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 21,
            'requirement' => 'neutral'
          )
        ),
        'experience' => array(
          'stability' => 2,
          'previous' => 2
        ),
        'employment' => array(
          'is_employee' => 1,
          'unemployed' => 1,
          'employed' => 1
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
            'factor' => 3,
            'patterns' => array('ce','ec')
          ),
          array(
            'factor' => 2,
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
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 2,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 3,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 4,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 5,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 6,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 7,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 8,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 9,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 10,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 11,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 12,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 13,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 14,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 15,
            'requirement' => 'negative'
          ),
          array(
            'attribute_id' => 16,
            'requirement' => 'negative'
          ),
          array(
            'attribute_id' => 17,
            'requirement' => 'negative'
          ),
          array(
            'attribute_id' => 18,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 19,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 20,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 21,
            'requirement' => 'neutral'
          )
        ),
        'experience' => array(
          'stability' => 2,
          'previous' => 1.5
        ),
        'employment' => array(
          'is_employee' => 1,
          'unemployed' => 1,
          'employed' => 1
        )
      );

      Opportunity::create([
        'department_id' => 2,
        'name' => 'Garzón(a)',
        'active' => true,
        'parameters' => $parameters
      ]);

      $parameters = array(
        'profile_patterns' => array(
          array(
            'factor' => 3,
            'patterns' => array('ce','ec')
          ),
          array(
            'factor' => 2,
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
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 2,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 3,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 4,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 5,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 6,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 7,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 8,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 9,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 10,
            'requirement' => 'mandatory'
          ),
          array(
            'attribute_id' => 11,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 12,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 13,
            'requirement' => 'plus'
          ),
          array(
            'attribute_id' => 14,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 15,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 16,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 17,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 18,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 19,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 20,
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 21,
            'requirement' => 'neutral'
          )
        ),
        'experience' => array(
          'stability' => 2,
          'previous' => 2
        ),
        'employment' => array(
          'is_employee' => 1,
          'unemployed' => 1,
          'employed' => 1
        )
      );

      Opportunity::create([
        'department_id' => 2,
        'name' => 'Telefonista',
        'active' => true,
        'parameters' => $parameters
      ]);

    }
}

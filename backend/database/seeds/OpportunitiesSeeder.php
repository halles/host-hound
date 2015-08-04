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
            'patterns' => array('cb')
          ),
          array(
            'factor' => 1.7,
            'patterns' => array('bc')
          ),
          array(
            'factor' => 1.2,
            'patterns' => array('c','ca','ci')
          ),
          array(
            'factor' => 1,
            'patterns' => array('b','ba','bi')
          ),
          array(
            'factor' => 0.7,
            'patterns' => array('ac','ic','ab','ib','bci','cia','bia','bca','bcia')
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
            'requirement' => 'neutral'
          ),
          array(
            'attribute_id' => 2,
            'requirement' => 'neutral'
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

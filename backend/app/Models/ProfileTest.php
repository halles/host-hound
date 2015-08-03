<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

final class ProfileTest extends Model
{

  public $patterns_def = array(
    'cuadruple' => array(
      array(
        'type' => 'synergistic',
        'ref' => 'bcia',
        'letters' => array('b','c','i','a'),
        'name' => 'Sinergístico'
      )
    ),
    'triple' => array(
      array(
        'type' => 'ambitious',
        'ref' => 'bci',
        'letters' => array('b','c','i'),
        'name' => 'Ambicioso'
      ),
      array(
        'type' => 'balanced',
        'ref' => 'cia',
        'letters' => array('c','i','a'),
        'name' => 'Balanceado'
      ),
      array(
        'type' => 'influential',
        'ref' => 'bia',
        'letters' => array('b','i','a'),
        'name' => 'Influyente'
      ),
      array(
        'type' => 'productive',
        'ref' => 'bca',
        'letters' => array('b','c','a'),
        'name' => 'Productivo'
      )
    ),
    'double' => array(
      array(
        'type' => 'independent',
        'ref' => 'bc',
        'letters' => array('b','c'),
        'name' => 'Independiente'
      ),
      array(
        'type' => 'determined',
        'ref' => 'bi',
        'letters' => array('b','i'),
        'name' => 'Determinado'
      ),
      array(
        'type' => 'optimistic',
        'ref' => 'ba',
        'letters' => array('b','a'),
        'name' => 'Optimista'
      ),
      array(
        'type' => 'competitive',
        'ref' => 'cb',
        'letters' => array('c','b'),
        'name' => 'Competitivo'
      ),
      array(
        'type' => 'practical',
        'ref' => 'ci',
        'letters' => array('c','i'),
        'name' => 'Práctico'
      ),
      array(
        'type' => 'perceptive',
        'ref' => 'ca',
        'letters' => array('c','a'),
        'name' => 'Percetivo'
      ),
      array(
        'type' => 'reliable',
        'ref' => 'ib',
        'letters' => array('i','b'),
        'name' => 'Confiable'
      ),
      array(
        'type' => 'thoughtful',
        'ref' => 'ic',
        'letters' => array('i','c'),
        'name' => 'Considerado'
      ),
      array(
        'type' => 'responsive',
        'ref' => 'ia',
        'letters' => array('i','a'),
        'name' => 'Receptivo'
      ),
      array(
        'type' => 'idealistic',
        'ref' => 'ab',
        'letters' => array('a','b'),
        'name' => 'Idealista'
      ),
      array(
        'type' => 'inventive',
        'ref' => 'ac',
        'letters' => array('a','c'),
        'name' => 'Creativo'
      ),
      array(
        'type' => 'versatile',
        'ref' => 'ai',
        'letters' => array('a','i'),
        'name' => 'Versátil'
      )
    ),
    'single' => array(
      array(
        'type' => 'commanding',
        'ref' => 'b',
        'letters' => array('b'),
        'name' => 'Autoritario'
      ),
      array(
        'type' => 'analytical',
        'ref' => 'c',
        'letters' => array('c'),
        'name' => 'Analítico'
      ),
      array(
        'type' => 'harmonious',
        'ref' => 'i',
        'letters' => array('i'),
        'name' => 'Armonioso'
      ),
      array(
        'type' => 'performing',
        'ref' => 'a',
        'letters' => array('a'),
        'name' => 'Actor'
      )
    )
  );

  public $dimentions_display = array(
    'b' => false,
    'c' => false,
    'i' => false,
    'a' => false
  );

  public $patterns_display = array(
    'bcia' => false,
    'bci' => false,
    'cia' => false,
    'bia' => false,
    'bca' => false,
    'bc' => false,
    'bi' => false,
    'ba' => false,
    'cb' => false,
    'ci' => false,
    'ca' => false,
    'ib' => false,
    'ic' => false,
    'ia' => false,
    'ab' => false,
    'ac' => false,
    'ai' => false,
    'b' => false,
    'c' => false,
    'a' => false,
    'i' => false
  );

  public function profile()
  {
    return $this->belongsTo('App\Models\Profile');
  }

  public function populateTest()
  {

    $answers = $this->answers;

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

    $this->score_b = $test['b'];
    $this->score_c = $test['c'];
    $this->score_i = $test['i'];
    $this->score_a = $test['a'];

    arsort($test, SORT_NUMERIC);

    $this->code = '';
    $si = array();

    foreach($test as $key => $value){
      $results[] = (object) array(
        'type' => $key,
        'score' => $value
      );
      $this->code .= $key;
    }

    $over40counter = 0;
    $differences = array();

    if(($results[0]->score - $results[3]->score) <= 5){ /* Is Synergistic */

      $this->style = 'cuadruple';
      $this->patterns = array('bcia');

    }else{

      foreach ($results as $ri => $result) {
        if($result->score > 40){
          $results[$ri]->over40 = true;
          $over40counter++;
          if($ri < (count($results) - 1)){
            $differences[] = $results[$ri]->score - $results[$ri+1]->score;
          }
        }
      }

      switch ($over40counter) {
        case 3:

          $this->style = 'triple';

          $lookup = $this->patterns_def['triple'];
          $lookup_found = array();
          $temp = array();

          for($ri = 0; $ri < count($results)-1; $ri++){

            for($li = 0; $li < count($lookup); $li++){
              if(in_array($results[$ri]->type, $lookup[$li]['letters'])){
                $lookup_found[] = $li;
              }
            }

            $temp = array();
            foreach($lookup_found as $lfi => $lfv){
              $temp[] = $lookup[$lfv];
            }
            $lookup = $temp;
            $lookup_found = array();

          }

          $this->patterns = array($lookup[0]['ref']);

          break;

        case 2:

          if(($results[0]->score - $results[1]->score) <= 5){

            $this->style = 'double dual';

            $this->patterns = array(
              $results[0]->type.$results[1]->type,
              $results[1]->type.$results[0]->type
            );

          }else{

            $this->style = 'double single';

            $this->patterns = array(
              $results[0]->type.$results[1]->type
            );

          }

          break;


        case 1:

          $this->style = 'single';

          $this->patterns = array(
            $results[0]->type
          );

          break;

      }

    }

    $this->patterns = json_encode($this->patterns);
    $this->answers = json_encode($this->answers);

    return true;

  }

}

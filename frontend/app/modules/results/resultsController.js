hostHound

  .controller('ResultsCtrl', function($scope, $auth, $alert, $log, $state) {

    var scores = $state.params.resultsData.split('-');

    $scope.scores = scores;
    $scope.bars = [];

    for (var i = 0; i < scores.length; i++) {
      $scope.bars[i] = scores[i]/0.6;
    };

    dimentions_names = {
      e: 'Acción hacia el Entorno',
      c: 'Análisis Cognitivo',
      i: 'Armonía Interpersonal',
      a: 'Expresión Afectiva'
    }

    results = [
      {
        type: 'e',
        score: parseInt(scores[0])
      },{
        type: 'c',
        score: parseInt(scores[1])
      },{
        type: 'i',
        score: parseInt(scores[2])
      },{
        type: 'a',
        score: parseInt(scores[3])
      }
    ];

    results.sort(function(a,b){
      return b.score-a.score;
    });

    $scope.dimentions = [
      dimentions_names[results[0].type],
      dimentions_names[results[1].type],
      dimentions_names[results[2].type],
      dimentions_names[results[3].type]
    ];

    $log.log(results[0].type+'-'+results[1].type+'-'+results[2].type+'-'+results[3].type);
    $log.log(results[0].score+'-'+results[1].score+'-'+results[2].score+'-'+results[3].score);

    var over40counter = 0;
    var differences = [];

    var patterns = {
      cuadruple: [
        {
          type: 'synergistic',
          ref: 'ecia',
          letters: ['e','c','i','a'],
          name: 'Sinergístico'
        }
      ],
      triple: [
        {
          type: 'ambitious',
          ref: 'eci',
          letters: ['e','c','i'],
          name: 'Ambicioso'
        },
        {
          type: 'balanced',
          ref: 'cia',
          letters: ['c','i','a'],
          name: 'Balanceado'
        },
        {
          type: 'influential',
          ref: 'eia',
          letters: ['e','i','a'],
          name: 'Influyente'
        },
        {
          type: 'productive',
          ref: 'eca',
          letters: ['e','c','a'],
          name: 'Productivo'
        }
      ],
      double: [
        {
          type: 'independent',
          ref: 'ec',
          letters: ['e','c'],
          name: 'Independiente'
        },
        {
          type: 'determined',
          ref: 'ei',
          letters: ['e','i'],
          name: 'Determinado'
        },
        {
          type: 'optimistic',
          ref: 'ea',
          letters: ['e','a'],
          name: 'Optimista'
        },
        {
          type: 'competitive',
          ref: 'ce',
          letters: ['c','e'],
          name: 'Competitivo'
        },
        {
          type: 'practical',
          ref: 'ci',
          letters: ['c','i'],
          name: 'Práctico'
        },
        {
          type: 'perceptive',
          ref: 'ca',
          letters: ['c','a'],
          name: 'Percetivo'
        },
        {
          type: 'reliable',
          ref: 'ie',
          letters: ['i','e'],
          name: 'Confiable'
        },
        {
          type: 'thoughtful',
          ref: 'ic',
          letters: ['i','c'],
          name: 'Considerado'
        },
        {
          type: 'responsive',
          ref: 'ia',
          letters: ['i','a'],
          name: 'Receptivo'
        },
        {
          type: 'idealistic',
          ref: 'ae',
          letters: ['a','e'],
          name: 'Idealista'
        },
        {
          type: 'inventive',
          ref: 'ac',
          letters: ['a','c'],
          name: 'Creativo'
        },
        {
          type: 'versatile',
          ref: 'ai',
          letters: ['a','i'],
          name: 'Versátil'
        }
      ],
      single: [
        {
          type: 'commanding',
          ref: 'e',
          letters: ['e'],
          name: 'Autoritario'
        },
        {
          type: 'analytical',
          ref: 'c',
          letters: ['c'],
          name: 'Analítico'
        },
        {
          type: 'harmonious',
          ref: 'i',
          letters: ['i'],
          name: 'Armonioso'
        },
        {
          type: 'performing',
          ref: 'a',
          letters: ['a'],
          name: 'Actor'
        }
      ]
    }

    $scope.dimentions_display = {
      e: false,
      c: false,
      i: false,
      a: false
    }

    $scope.patterns_display = {
      ecia: false,
      eci: false,
      cia: false,
      eia: false,
      eca: false,
      ec: false,
      ei: false,
      ea: false,
      ce: false,
      ci: false,
      ca: false,
      ie: false,
      ic: false,
      ia: false,
      ae: false,
      ac: false,
      ai: false,
      e: false,
      c: false,
      a: false,
      i: false
    }

    $scope.pattern_style = 0;

    if((results[0].score - results[3].score) <= 5){ /* Is Synergistic */

      $log.log('Quadruple Pattern');

      $scope.dimentions_display = {
        e: true,
        c: true,
        i: true,
        a: true
      }
      $scope.patterns_display.ecia = true;
      $scope.pattern_style = 4;
    } /* / Is Synergistic */

    if($scope.pattern_style != 4){ /* Is Not Synergistic */

      for (var i = 0; i < results.length; i++) {
        if(results[i].score > 40){
          results[i].over40 = true;
          over40counter++;
          if(i < (results.length - 1)){
            differences.push(results[i].score - results[i+1].score);
          }
        }
      }

      if(over40counter == 3){

        $log.log('Triple Pattern');

        $scope.pattern_style = 3;

        var lookup = patterns.triple;
        var lookup_found = [];
        var temp = [];

        // $log.log(lookup);

        // $log.log('Results:', results);

        for (var results_i = 0; results_i < results.length - 1; results_i++) {

          for(var lookup_i = 0; lookup_i < lookup.length; lookup_i++){
            if(lookup[lookup_i].letters.indexOf(results[results_i].type) >= 0){
              // $log.log('Type ' + results[results_i].type + ' found in: ', lookup[lookup_i].ref);
              lookup_found.push(lookup_i);
            }
          }

          temp = [];
          for (var lookup_fi = 0; lookup_fi < lookup_found.length; lookup_fi++) {
            temp.push(lookup[lookup_found[lookup_fi]]);
          };
          lookup = temp;
          lookup_found = [];

        };

        $log.log('Found: ', lookup);

        for (var i = 0; i < lookup[0].letters.length; i++) {
          $scope.dimentions_display[lookup[0].letters[i]] = true;
        };

        $scope.patterns_display[lookup[0].ref] = true;

        $log.log($scope.dimentions_display);

      }else if(over40counter == 2){

        $scope.pattern_style = 2;

        if((results[0].score - results[1].score) <= 5){
          $log.log('Double Dual Pattern: ' + results[0].type + results[1].type + '&' + results[1].type + results[0].type);

          $scope.dimentions_display[results[0].type] = true;
          $scope.dimentions_display[results[1].type] = true;
          var a = results[0].type + results[1].type;
          var b = results[1].type + results[0].type;
          $scope.patterns_display[a] = true;
          $scope.patterns_display[b] = true;
        }else{
          $log.log('Double Single Pattern: ' + results[0].type + results[1].type);
          $scope.dimentions_display[results[0].type] = true;
          $scope.dimentions_display[results[1].type] = true;
          var a = results[0].type + results[1].type;
          $scope.dimentions_display[a] = true;
          $scope.patterns_display[a] = true;
        }

      }else if(over40counter == 1){

        $scope.pattern_style = 1;

        $log.log('Single Pattern: ' + results[0].type);
        $scope.dimentions_display[results[0].type] = true;
        $scope.patterns_display[results[0].type] = true;

      }


    } /* / Is Not Synergistic */

    $log.log($scope.patterns_display);
    $log.log($scope.dimentions_display);

  });

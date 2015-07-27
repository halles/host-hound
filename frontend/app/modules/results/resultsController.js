hostHound

  .controller('ResultsCtrl', function($scope, $auth, $alert, $log, $state) {

    var scores = $state.params.resultsData.split('-');

    results = [
      {
        type: 'b',
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

    $log.log(results[0].type+'-'+results[1].type+'-'+results[2].type+'-'+results[3].type);
    $log.log(results[0].score+'-'+results[1].score+'-'+results[2].score+'-'+results[3].score);

    var over40counter = 0;
    var differences = [];

    var primary_style_pattern = null;

    var patterns = {
      cuadruple: [
        {
          type: 'synergistic',
          ref: 'bcia',
          letters: ['b','c','i','a'],
          name: 'Synergistic'
        }
      ],
      triple: [
        {
          type: 'ambitious',
          ref: 'bci',
          letters: ['b','c','i'],
          name: 'Ambitious'
        },
        {
          type: 'balanced',
          ref: 'cia',
          letters: ['c','i','a'],
          name: 'Balanced'
        },
        {
          type: 'influential',
          ref: 'bia',
          letters: ['b','i','a'],
          name: 'Influential'
        },
        {
          type: 'productive',
          ref: 'bca',
          letters: ['b','c','a'],
          name: 'Productive'
        }
      ],
      double: [
        {
          type: 'independent',
          ref: 'bc',
          letters: ['b','c'],
          name: 'Independent'
        },
        {
          type: 'determined',
          ref: 'bi',
          letters: ['b','i'],
          name: 'Determined'
        },
        {
          type: 'optimistic',
          ref: 'ba',
          letters: ['b','a'],
          name: 'Optimistic'
        },
        {
          type: 'competitive',
          ref: 'cb',
          letters: ['c','b'],
          name: 'Competitive'
        },
        {
          type: 'practical',
          ref: 'ci',
          letters: ['c','i'],
          name: 'Practical'
        },
        {
          type: 'perceptive',
          ref: 'ca',
          letters: ['c','a'],
          name: 'Perceptive'
        },
        {
          type: 'reliable',
          ref: 'ib',
          letters: ['i','b'],
          name: 'Reliable'
        },
        {
          type: 'thoughtful',
          ref: 'ic',
          letters: ['i','c'],
          name: 'Thoughtful'
        },
        {
          type: 'responsive',
          ref: 'ia',
          letters: ['i','a'],
          name: 'Responsive'
        },
        {
          type: 'idealistic',
          ref: 'ab',
          letters: ['a','b'],
          name: 'Idealistic'
        },
        {
          type: 'inventive',
          ref: 'ac',
          letters: ['a','c'],
          name: 'Inventive'
        },
        {
          type: 'versatile',
          ref: 'ai',
          letters: ['a','i'],
          name: 'Versatile'
        }
      ],
      single: [
        {
          type: 'Commanding',
          ref: 'b',
          letters: ['b'],
          name: 'commanding'
        },
        {
          type: 'analytical',
          ref: 'c',
          letters: ['c'],
          name: 'Analytical'
        },
        {
          type: 'harmonious',
          ref: 'a',
          letters: ['a'],
          name: 'Harmonious'
        },
        {
          type: 'performing',
          ref: 'i',
          letters: ['i'],
          name: 'Performing'
        }
      ]
    }

    if((results[0].score - results[3].score) <= 5){ /* Is Synergistic */
      primary_style_pattern = patterns.cuadruple.bcia.name;
    } /* / Is Synergistic */

    if(primary_style_pattern != 'synergistic'){ /* Is Not Synergistic */

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

        /*var temp_array =  Object.keys(patterns.triple).map(function(value, index) {
          return [value];
        });*/

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

        $log.log(lookup);
        return;

        /*for (var i = 0; i < results.length-1; i++) {

        }*/
      }else if(over40counter == 2){

        $log.log('Double Pattern');
        finalresult = results[0].type+results[1].type;


      }else if(over40counter == 1){

        $log.log('Single Pattern');
        finalresult = results[0].type;

      }


    } /* / Is Not Synergistic */

    $log.log(primary_style_pattern);

  });

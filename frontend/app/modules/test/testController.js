hostHound

  .controller('TestCtrl', function($scope, $auth, $alert, $log) {

    $scope.answers = [];
    $scope.results = [];
    $scope.validate = [];

    for (i = 0; i < 16; i++) {
      $scope.answers[i] = [];
      for(o = 0; o < 4; o++) {
        $scope.answers[i][o] = 0;
      }
    }

    $scope.$watch('answers', function(newValue, oldValue){

      /** Cálculos Validaciones por Block **/

      for (y = 0; y < 16; y++){

        $scope.validate[y] = {
          is_valid: true,
          fields: [true,true,true,true],
          class: 'not-checked fui-question-circle'
        };

        if(parseInt($scope.answers[y][0]) && parseInt($scope.answers[y][1]) && parseInt($scope.answers[y][2]) && parseInt($scope.answers[y][3])){
          $log.log('Validando: ' + y);
          var temp_sum = parseInt($scope.answers[y][0]) + parseInt($scope.answers[y][1]) + parseInt($scope.answers[y][2]) + parseInt($scope.answers[y][3]);
          $log.log('Suma: ' + temp_sum);
          $scope.validate[y].is_valid = (temp_sum != 10)?false:true;
          if($scope.validate[y].is_valid){
            $log.log('Checking Dupes');
            $scope.validate[y].is_valid = !has_duplicates($scope.answers[y]);
          }
          if($scope.validate[y].is_valid){
            $log.log('VALID');
            $scope.validate[y].class = 'valid fui-check-circle';
          }else{
            $log.log('INVALID');
            $scope.validate[y].class = 'invalid fui-cross-circle';
          }
        }else{
          $log.log('No Completado: ' + y);
          $scope.validate[y].is_valid = null;
          $scope.validate[y].class = 'not-checked fui-question-circle';
        }

        $log.log('Resultado: ' + $scope.validate[y].class);;
      }

      /** Cálculos Resultado por Columna **/

      for (i = 0; i < 4; i++) {
        $scope.results[i] = 0;
        for (o = 0; o < 16; o++) {
          $scope.results[i] += parseInt($scope.answers[o][i]);
        }
      }

    }, true);

    $scope.showInstructions = false;

    $scope.toggleInstructions = function(){

    }

    $scope.terms = [
      [
        ['Autosuficiente','confiado','seguro de sí mismo','independiente'],
        ['Disciplinado','sistemático','eficiente','autocontrolado'],
        ['Confiable','responsable','fiable','puntual'],
        ['Expresivo','muestra emociones','elocuente','gesticula']
      ],
      [
        ['Dominante','autoritario','controlador','desconsiderado'],
        ['Inflexible','rígido','tenaz','poco colaborador'],
        ['Tímido','retraído','reacio','vergonzoso'],
        ['Desorganizado','disperso','desordenado','improvisado']
      ],
      [
        ['Productivo','ambicioso','orientado a metas','fructífero'],
        ['Ordenado','pulcro','prolijo','organizado'],
        ['Colaborador','servicial','alentador','comprensivo'],
        ['Creativo','de ideas únicas','intuitivo','innovador']
      ],
      [
        ['Frío','reservado','precavido','contenido'],
        ['Perfeccionista','busca excelencia','preciso','quisquilloso'],
        ['Obstinado','terco','inconformista','reticente'],
        ['Impulsivo','de acción súbita','motivado','lanzado']
      ],
      [
        ['Valiente','intrépido','osado','audaz'],
        ['Riguroso','cuidadoso','exacto','sin errores'],
        ['Cálido','afectuoso','amable','gentil'],
        ['Entusiasta','intenso','motivado','inspirador']
      ],
      [
        ['Ingrato','desagradecido','descortés','desalentador'],
        ['Antisocial','poco amigable','privado','retraído'],
        ['Pasivo','sumiso','poco asertivo','conformista'],
        ['Egocéntrico','ensimismado','narcisista','excluyente']
      ],
      [
        ['Decisivo','determinado','claro','inmediato'],
        ['Analítico','examina','descifra','evalúa'],
        ['Leal','fiel','confiable','fiable'],
        ['Hablador','expresivo','sociable','amigable']
      ],
      [
        ['Contundente','poderoso','arrogante','autoritario'],
        ['Preocupado','fácilmente molesto','ansioso','aproblemado'],
        ['Lento','inactivo','pausado','perezoso'],
        ['Inquieto','impaciente','agitado','intranquilo']
      ],
      [
        ['Seguro de sí mismo','confiado','determinado','resuelto'],
        ['Pensador crítico','analiza','acertado','preciso'],
        ['Agradable','atractivo','placentero','simpático'],
        ['Divertido','animado','gracioso','bromista']
      ],
      [
        ['Sin tacto','torpe','insensible','bruto'],
        ['Estricto','rígido','impaciente','severo'],
        ['Dependiente','se apoya en otros','inseguro','fácil de persuadir'],
        ['Poco confiable','desleal','no es de fiar','impuntual']
      ],
      [
        ['Audaz','valiente','osado','intrépido'],
        ['Calculador','planificador','preciso','cuidadoso'],
        ['Confiable','de fiar','honrado','creíble'],
        ['Extrovertido','transparente','comunicativo','expresivo']
      ],
      [
        ['Obstinado','lógico','inamovible','terco'],
        ['Cauteloso','cuidadoso','precavido','prudente'],
        ['Indeciso','poco claro','reacio','dudoso'],
        ['Inconsistente','ilógico','contradictorio','creativo']
      ],
      [
        ['Decidido','motivado','resuelto','firme'],
        ['Preciso','riguroso','conciso','responsable'],
        ['Tolerante','paciente','respetuoso','transigente'],
        ['Versátil','flexible','creativo','innovador']
      ],
      [
        ['Dominante','inflexible','agresivo','competitivo'],
        ['Sensible','fácil de ofender','delicado','susceptible'],
        ['Tranquilo','sereno','pacífico','calmado'],
        ['Comunicativo','elocuente','franco','asertivo']
      ],
      [
        ['Directo','imponente','resuelto','sólido'],
        ['Perceptivo','observador','receptivo','discriminador'],
        ['Paciente','tolerante','flexible','complaciente'],
        ['Generoso','desinteresado','atento','amable']
      ],
      [
        ['Controlador','manipulador','egocéntrico','autoritario'],
        ['Desconfiado','suspicaz','vigilante','defensivo'],
        ['Emotivo','sensible','sentimental','emocional'],
        ['Sobreentusiasta','apresurado','impulsivo','ansioso']
      ]
    ];

    $scope.displayAnswers = function(){
      $log.log($scope.answers);
    };

    function has_duplicates(arr) {

      var len=arr.length,
          out=[],
          counts={};

      for (var i=0;i<len;i++) {
        var item = arr[i];
        counts[item] = counts[item] >= 1 ? counts[item] + 1 : 1;
      }

      for (var item in counts) {
        if(counts[item] > 1)
          out.push(item);
      }

      if(out.length>0)
        $log.log('Rep: ' + out);

      return (out.length>0)?true:false;

    }

  });

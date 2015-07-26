hostHound

  .controller('TestCtrl', function($scope, $auth, $alert, $log) {

    $scope.answers = {};

    $scope.$watch('answers', function(newValue, oldValue){
      $log.log(newValue);
    }, true);

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

  });

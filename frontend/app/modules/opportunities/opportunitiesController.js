hostHound.controller('OpportunitiesController', ['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http){

  $log.log('OpportunitiesController');

  $http.get('api/profile/'+$state.params.organizationId+'/'+$state.params.departmentId+'/opportunities').
    success(function(data, status, headers, config) {
      $log.log(data);
      $scope.opportunities = data.opportunities;
      $scope.department = data.department;
      $scope.organization = data.organization;
      $scope.attributes = data.attributes;
    }).
    error(function(data, status, headers, config) {

    });

    $scope.getAttributeName = function(attribute_id){
      for (var i = 0; i < $scope.attributes.length; i++) {
        if($scope.attributes[i].id == attribute_id){
          return $scope.attributes[i].group + ' | ' + $scope.attributes[i].attribute;
        }
      };
    }

}]);

hostHound.controller('OpportunitiesEditController', ['$scope','$modal','$log', '$auth', '$state', '$http', '$q' , function ($scope, $modal, $log, $auth, $state, $http, $q){

  $log.log('OpportunitiesEditController');

  $opportunityId = null;
  $scope.opParams = null;

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

  var gotAttributes = $http.get('api/attributes/'+$state.params.organizationId+'/'+$state.params.departmentId);

  if($state.params.opportunityId==undefined){

    $scope.opParams = {
      employment:{
        employed: 1,
        is_employee: 1,
        unemployed: 1
      },
      experience: {
        previous: 1,
        stability: 1,
      },
      profile_patterns: [
        {factor:3.0,patterns:[]},
        {factor:2.0,patterns:[]},
        {factor:1.0,patterns:[]},
        {factor:0.5,patterns:[]},
        {factor:0.0,patterns:[]},
      ],
      attributes: []
    };

    for (var a in patterns) {
      if (patterns.hasOwnProperty(a)) {
        for (var b = 0; b < patterns[a].length; b++) {
          $scope.opParams.profile_patterns[2].patterns.push(patterns[a][b].ref);
        }
      }
    };

    gotAttributes.then(function(response){
      allAttributes = response.data.attributes;
      for (var i = 0; i < allAttributes.length; i++) {
        $scope.opParams.attributes.push({attribute_id: allAttributes[i].id, requirement: 'neutral'});
      };

      initSliders();
      initProfilePatterns();
    });

  }else{
    $http.get('api/opportunities/'+$state.params.organizationId+'/'+$state.params.departmentId+'/'+$state.params.opportunityId).
    then(function(response){
      $opportunityId = response.data.opportunity.id;
      $scope.opParams = response.data.opportunity.parameters;
      $log.log($scope.opParams);
      initSliders();
      initProfilePatterns();
    });
  }

  /*$http.get('api/profile/'+$state.params.organizationId+'/'+$state.params.departmentId+'/opportunities').
    success(function(data, status, headers, config) {
      $log.log(data);
      $scope.opportunities = data.opportunities;
      $scope.department = data.department;
      $scope.organization = data.organization;
      $scope.attributes = data.attributes;
    }).
    error(function(data, status, headers, config) {

    });

    $scope.getAttributeName = function(attribute_id){
      for (var i = 0; i < $scope.attributes.length; i++) {
        if($scope.attributes[i].id == attribute_id){
          return $scope.attributes[i].group + ' | ' + $scope.attributes[i].attribute;
        }
      };
    }*/

    $log.log($scope.opParams);


    var initProfilePatterns = function(){

      return $q(function(resolve, reject) {

        $scope.list1 = $scope.opParams.profile_patterns[4].patterns;
        $scope.list2 = $scope.opParams.profile_patterns[3].patterns;
        $scope.list3 = $scope.opParams.profile_patterns[2].patterns;
        $scope.list4 = $scope.opParams.profile_patterns[1].patterns;
        $scope.list5 = $scope.opParams.profile_patterns[0].patterns;
        resolve(true);

      });

    }



    var initSliders = function(){

      return $q(function(resolve, reject) {

        var $slider = angular.element('#experience-stability-slider');
        if ($slider.length > 0) {
          $slider.slider({
            min: 0,
            max: 2,
            step: 0.01,
            value: $scope.opParams.experience.stability,
            orientation: 'horizontal',
            range: 'min',
            change: function( event, ui ) { $scope.$apply(function() {$scope.opParams.experience.stability = ui.value }); }
          });
        }

        var $slider2 = angular.element('#experience-previous-slider');
        if ($slider2.length > 0) {
          $slider2.slider({
            min: 0,
            max: 2,
            step: 0.01,
            value: $scope.opParams.experience.previous,
            orientation: 'horizontal',
            range: 'min',
            change: function( event, ui ) { $scope.$apply(function() {$scope.opParams.experience.previous = ui.value }); }
          });
        }

        resolve(true);

      });

    }

    $scope.spitData = function(){
      $log.log($scope.opParams);
    }

}]);

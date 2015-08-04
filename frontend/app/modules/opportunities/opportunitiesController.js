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

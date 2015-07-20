
hostHound.controller('departmentChooserController', ['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http){

  $log.log('Department Chooser Controller');

  $http.get('api/organizations/'+$state.params.organizationId+'/departments').
    success(function(data, status, headers, config) {
      $log.log(status);
      $log.log(data);
      $scope.departments = data.departments;
      $scope.organization = data.organization;
    }).
    error(function(data, status, headers, config) {
      $log.log(status);
    });

}]);


hostHound.controller('departmentDashboardController',['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http) {

  $log.log('Department Dashboard Controller');

  $http.get('api/group/'+$state.params.organizationId+'/profiles').
    success(function(data, status, headers, config) {
      $scope.status = data.status;
      $scope.profiles = data.profiles;
    }).
    error(function(data, status, headers, config) {

    });

}]);

hostHound.controller('departmentsController', ['$scope','$modal','$log', '$auth', '$state' , function ($scope, $modal, $log, $auth, $state) {

  $log.log('HostHound Controller');

  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };

  if(!$auth.isAuthenticated()){
    $log.log($state.go('login'));
  }

  $scope.currentGroup = {
    id: '541',
    name: 'Noi Santiago',
    slug: '541-noi-santiago'
  };

}]);


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

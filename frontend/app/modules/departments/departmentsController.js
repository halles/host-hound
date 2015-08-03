
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

  $scope.organizationId = $state.params.organizationId;
  $scope.departmentId = $state.params.departmentId;

  $scope.monthDiff = function(d1,d2){
    d1 = d1.split('-');
    d1 = new Date(d1[0],d1[1],d1[2]);
    if (d2 == undefined){
      d2 = new Date();
    }else{
      d2 = d2.split('-');
      d2 = new Date(d2[0],d2[1],d2[2]);
    }
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  $scope.age = function(profile){
    months = $scope.monthDiff(profile.birthday);
    age = Math.floor(months/12);
    return age;
  }

  $http.get('api/organizations/'+$state.params.organizationId+'/profiles').
    success(function(data, status, headers, config) {
      $scope.status = data.status;
      $scope.profiles = data.profiles;
      $scope.note_types = data.note_types;
    }).
    error(function(data, status, headers, config) {

    });

}]);

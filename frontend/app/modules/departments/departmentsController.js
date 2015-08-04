
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

  /** Utils **/

}]);


hostHound.controller('profilesTableController',[
  '$scope', '$state', '$http', '$log',
  function($scope, $state, $http, $log){

  $log.log('HOLA!');

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

  var getRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  }

  $scope.prepareFields = function(){

  }

  var vm = this;

  var theTable;

  $http.get('api/organizations/'+$state.params.organizationId+'/profiles').
      success(function(data, status, headers, config) {
        $scope.status = data.status;
        $scope.profiles = data.profiles;
        $scope.note_types = data.note_types;
        $scope.calculateScore();
      }).
      error(function(data, status, headers, config) {

      });

  $scope.calculateScore = function(doRebuild){
    for(pi = 0; pi < $scope.profiles.length; pi++){
      $scope.profiles[pi].score = getRandomArbitrary(0,1);
    }
    if(doRebuild){
      theTable.destroy();
    }

    theTable = angular.element('#profiles-table').DataTable({
          data: $scope.profiles,
          order: [4,'desc'],
          columns: [
            { "data": "name" },
            { "data": "id_num" },
            { "data": "phone" },
            { "data": "notes" },
            { "data": "score" }
          ]
        });
  }



}]);









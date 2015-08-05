
hostHound.controller('profileViewController', ['$scope','$modal','$log', '$auth', '$state', '$http' , function ($scope, $modal, $log, $auth, $state, $http){

  $log.log('Profile View Controller');

  $http.get('api/profile/'+$state.params.organizationId+'/'+$state.params.departmentId+'/'+$state.params.profileId).
    success(function(data, status, headers, config) {
      $scope.profile = data.profile;
      $scope.note_types = data.note_types;
      $scope.department = data.department;
      $scope.organization = data.organization;
    }).
    error(function(data, status, headers, config) {

    });

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
    if(profile!=undefined){
      months = $scope.monthDiff(profile.birthday);
      age = Math.floor(months/12);
      return age;
    }
  }

}]);

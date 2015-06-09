hostHound.controller("homeController", function ($scope, $rootScope, User, $http) {

  $http.get('api/group/'+$scope.currentGroup.id+'/profiles').
    success(function(data, status, headers, config) {
      $scope.status = data.status;
      $scope.profiles = data.profiles;
    }).
    error(function(data, status, headers, config) {

    });

});


hostHound
.directive('profileDataTableElement', function() {
  return function(scope, element, attrs) {
    if (scope.$last){
      $(document).ready(function() {
        $('table').dataTable();
      });
    }
  };
});

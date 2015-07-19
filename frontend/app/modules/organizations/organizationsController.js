hostHound.controller('organizationsController', ['$scope','$modal','$log', '$auth', '$state', 'User', '$http' , function ($scope, $modal, $log, $auth, $state, User, $http) {

  $log.log('Organizations Controller');

  $log.log($auth);

  $log.log(User);

  $http.get('api/organizations/').
    success(function(data, status, headers, config) {
      $scope.status = data.status;
      $scope.profiles = data.profiles;
      $log.log(data);
    }).
    error(function(data, status, headers, config) {
      $log.log(data);
    });

}]);

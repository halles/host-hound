hostHound.controller('organizationsController', ['$scope','$modal','$log', '$auth', '$state', 'User', '$http' , function ($scope, $modal, $log, $auth, $state, User, $http) {

  $log.log('Organizations Controller');

  $log.log($auth);

  $log.log(User);

  $http.get('api/organizations/').
    success(function(data, status, headers, config) {
      $log.log(status);
      $log.log(data);
      $scope.organizations = data.organizations;
    }).
    error(function(data, status, headers, config) {
      $log.log(status);
    });

}]);

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

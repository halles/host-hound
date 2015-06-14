'use strict';

var hostHound = angular.module("hostHoundApp",["ngRoute","satellizer","ui.bootstrap","ngFileUpload", "ngProgress"]);

/**
 *  Main App Controller
 **/

hostHound.controller('hostHoundController', ['$scope','$modal','$log', function ($scope, $modal, $log) {

  $scope.currentGroup = {
    id: '541',
    name: 'Noi Santiago',
    slug: '541-noi-santiago'
  };

  $scope.items = ['item1', 'item2', 'item3'];

  $scope.animationsEnabled = true;

  $scope.loginDialog = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/modals/login.html',
      controller: 'loginModalController'
    });

    modalInstance.result.then(function (response) {
      $log.info('Response: ' + response);
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

  };

  $scope.toggleAnimation = function () {
    $scope.animationsEnabled = !$scope.animationsEnabled;
  };

}]);

hostHound.controller('loginModalController', function ($scope, $modalInstance, $http, $log) {

  $scope.remember = false;

  $scope.ok = function () {

    var data = {
      email: $scope.email,
      password: $scope.password,
      remember: $scope.remember
    }
    $http.post('api/login',data).
    success(function(data, status, headers, config) {

    }).
    error(function(data, status, headers, config) {

    });
    //$modalInstance.close('ok');
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

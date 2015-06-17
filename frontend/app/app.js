'use strict';

var hostHound = angular.module("hostHoundApp",[
  'ngResource',
  'ngMessages',
  'ngProgress',
  'ui.router',
  'satellizer',
  'ui.bootstrap',
  'ngFileUpload',
  'mgcrea.ngStrap'
]);

/**
 *  Main App Controller
 **/

hostHound.controller('hostHoundController', ['$scope','$modal','$log', function ($scope, $modal, $log) {

  $scope.currentGroup = {
    id: '541',
    name: 'Noi Santiago',
    slug: '541-noi-santiago'
  };

/*
  $scope.animationsEnabled = true;

  $scope.loginDialog = function (size) {

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'app/modules/auth/login.html',
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
*/
}]);

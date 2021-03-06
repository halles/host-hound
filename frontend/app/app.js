'use strict';

var hostHound = angular.module("hostHoundApp",[
  'ngResource',
  'ngMessages',
  'ngProgress',
  'ui.router',
  'satellizer',
  'ngFileUpload',
  'mgcrea.ngStrap',
  'ngDragDrop'
]);

/**
 *  Main App Controller
 **/

hostHound.controller('hostHoundController', ['$scope','$modal','$log', '$auth', '$rootScope', '$window', function ($scope, $modal, $log, $auth, $rootScope, $window) {

  $log.log('HostHound Controller');
  $log.log('Authenticated: ' + $auth.isAuthenticated());

  $rootScope.isLoggedIn = false;

  if ($auth.isAuthenticated()){
    $rootScope.isLoggedIn = true;
  }

  $rootScope.goBack = function(){
    $window.history.back();
  }

}]);

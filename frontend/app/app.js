'use strict';

var hostHound = angular.module("hostHoundApp",["ngRoute","satellizer","ui.bootstrap", "ngFileUpload", "ngProgress"]);

/**
 *  Main App Controller
 **/

hostHound.controller('hostHoundController', ['$scope', function ($scope) {

  $scope.currentGroup = {
    id: '541',
    name: 'Noi Santiago',
    slug: '541-noi-santiago'
  };

}]);

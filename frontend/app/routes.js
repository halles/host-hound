hostHound.config(function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider){

  $stateProvider
    .state('organization',{
      url: '/',
      templateUrl: 'app/modules/organizations/organizations.html',
      controller: 'organizationsController',
      resolve: {
        authenticated: function($q, $location, $auth) {
          var deferred = $q.defer();
          if (!$auth.isAuthenticated()) {
            $location.path('/login');
          } else {
            deferred.resolve();
          }
          return deferred.promise;
        }
      }
    })
    .state('departmentChooser', {
      url: '/o/:orgId/',
      templateUrl: 'app/modules/departments/chooser.html',
      controller: 'departmentChooserController',
      resolve: {
        authenticated: function($q, $location, $auth) {
          var deferred = $q.defer();
          if (!$auth.isAuthenticated()) {
            $location.path('/login');
          } else {
            deferred.resolve();
          }
          return deferred.promise;
        }
      }
    })
    .state('organization.department.detail', {
      url: '/o-:orgId/d/:departmentId',
      templateUrl: 'app/modules/department/choose.html',
      controller: 'departmentChoiceController'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'app/modules/auth/login.html',
      controller: 'LoginCtrl'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/modules/auth/signup.html',
      controller: 'SignupCtrl'
    })
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'app/modules/user/profile.html',
      controller: 'ProfileCtrl',
      resolve: {
        authenticated: function($q, $location, $auth) {
          var deferred = $q.defer();

          if (!$auth.isAuthenticated()) {
            $location.path('/login');
          } else {
            deferred.resolve();
          }

          return deferred.promise;
        }
      }
    });

    $locationProvider.html5Mode(true).hashPrefix('!')

    $urlRouterProvider.otherwise('/');

    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true;
    $authProvider.baseUrl = '/api/' // API Base URL for the paths below.
    $authProvider.loginUrl = 'login';

  });

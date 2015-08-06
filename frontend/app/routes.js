hostHound.config(function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider){

  $stateProvider
    .state('home',{
      url: '/',
      templateUrl: 'app/modules/organizations/list.html',
      controller: 'organizationsListController',
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
    .state('department', {
      url: '/o/:organizationId',
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
    .state('dashboard', {
      url: '/o/:organizationId/:departmentId',
      templateUrl: 'app/modules/departments/dashboard.html',
      controller: 'departmentDashboardController',
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
    .state('profile', {
      url: '/o/:organizationId/:departmentId/profile/:profileId',
      templateUrl: 'app/modules/profiles/profileView.html',
      controller: 'profileViewController',
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
    .state('opportunities', {
      url: '/o/:organizationId/:departmentId/opportunities',
      templateUrl: 'app/modules/opportunities/list.html',
      controller: 'OpportunitiesController',
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
    .state('opportunities_new', {
      url: '/o/:organizationId/:departmentId/opportunities/new',
      templateUrl: 'app/modules/opportunities/new.html',
      controller: 'OpportunitiesEditController',
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
    .state('opportunities_edit', {
      url: '/o/:organizationId/:departmentId/opportunities/edit/:opportunityId',
      templateUrl: 'app/modules/opportunities/edit.html',
      controller: 'OpportunitiesEditController',
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
    .state('test', {
      url: '/test',
      templateUrl: 'app/modules/test/test.html',
      controller: 'TestCtrl'
    })
    .state('results', {
      url: '/results/:resultsData',
      templateUrl: 'app/modules/results/results.html',
      controller: 'ResultsCtrl'
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
    });

    $locationProvider.html5Mode(true).hashPrefix('!')

    $urlRouterProvider.otherwise('/');

    $authProvider.httpInterceptor = true; // Add Authorization header to HTTP request
    $authProvider.loginOnSignup = true;
    $authProvider.baseUrl = '/api/' // API Base URL for the paths below.
    $authProvider.loginUrl = 'login';

  });

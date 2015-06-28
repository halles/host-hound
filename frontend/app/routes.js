hostHound.config(function ($stateProvider, $urlRouterProvider, $authProvider, $locationProvider){

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/modules/home/home.html',
      controller: 'homeController'
    })
    .state('static-page', {
      url: '/static-page',
      templateUrl: 'app/modules/staticPage/staticPage.html'
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
    $authProvider.baseUrl = '/HostHound/webapp/frontend/api/' // API Base URL for the paths below.
    $authProvider.loginUrl = 'login';

  });

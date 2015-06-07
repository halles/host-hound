hostHound.config(function ($routeProvider){

  $routeProvider
  .when('/',
  {
    templateUrl: 'app/modules/home/home.template.html',
    controller: 'homeController'
  })
  .when('/static-page',
  {
    templateUrl: 'app/modules/staticPage/staticPage.template.html'
  })
  .otherwise({
    redirectTo: '/'
  });

});

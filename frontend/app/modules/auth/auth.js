
hostHound

  .controller('LoginCtrl', function($scope, $alert, $auth) {

    $scope.login = function() {
      $auth.login({ email: $scope.email, password: $scope.password })
        .then(function() {
          $alert({
            content: 'Haz ingresado exitósamente',
            animation: 'fadeZoomFadeDown',
            duration: 3,
            type: 'success',
            container: '#global-alerts'
          });
        })
        .catch(function(response) {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'danger',
            container: '#login-message'
          });
        });
    };

  })

  .controller('LogoutCtrl', function($auth, $alert) {
    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
      .then(function() {
        $alert({
          content: 'You have been logged out',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
  });

hostHound.factory("User", function ($rootScope, $http, $location, ngProgress){
  var interfaz = {
    data: null,
    isLogin: false,
    register: false,

    fetch: function(callback) {
      var _this = this;
      $http.get(fbconfig.apiUrl + '/me')
        .success(function(data, status, headers, config) {
          _this.afterlogin(data);
          if (callback) callback(true);
        })
        .error(function(data, status, headers, config) {
          if (callback) callback(false, data);
        });

      return this;
    },

    set: function(datos) {
      this.data = datos;
      return this;
    },

    save: function(callback) {
      var _this = this;
      if (this.isLogin){
        $http.put(fbconfig.apiUrl + '/me', this.data)
          .success(function(data, status, headers, config) {
            _this.afterlogin(data);
            if (callback) callback(true);
          })
          .error(function(data, status, headers, config) {
            if (callback) callback(false, data);
          });
      }else{
        $http.post(fbconfig.apiUrl + '/auth/email', this.data)
          .success(function(data, status, headers, config) {
            _this.afterlogin(data);
            if (callback) callback(true);
          })
          .error(function(data, status, headers, config) {
            if (callback) callback(false, data);
          });
      }

      return this;
    },

    login: function (email, password, callback) {
      var _this = this;
      $http.post(fbconfig.apiUrl + '/login', {email: email, password: password})
        .success(function(data, status, headers, config) {
          _this.afterlogin(data);
          if (callback) callback(true);
        })
        .error(function(data, status, headers, config) {
          if (callback) callback(false, data);
        });
      return this;
    },

    logout: function(callback) {
      var _this = this;
      $http.post(fbconfig.apiUrl + '/logout')
        .success(function() {
          _this.data = null;
          _this.isLogin = false;
          _this.register = false;
          $location.path('/');
          if (callback) callback();
        });
      return this;
    },

    afterlogin: function (data) {
      this.data = data;
      this.isLogin = true;
      if (data.register)
        this.register = true;
    }
  }
  return interfaz;
});

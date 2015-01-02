var auth = angular.module("app.auth", ["ngSanitize"]);

auth.factory("AuthenticationService", function($http, $sanitize, SessionService, FlashService) {

  var cacheSession   = function() {
    SessionService.set('authenticated', true);
  };

  var uncacheSession = function() {
    SessionService.unset('authenticated');
  };

  var sanitizeCredentials = function(credentials) {
    return {
      username: $sanitize(credentials.username),
      password: $sanitize(credentials.password)
    };
  };

  return {
    login: function(credentials) {
      var login = $http.post("/auth/login", sanitizeCredentials(credentials));
      login.success(cacheSession);
      login.success(FlashService.clear);
      return login;
    },
    logout: function() {
      var logout = $http.get("/auth/logout");
      logout.success(uncacheSession);
      return logout;
    },
    isLoggedIn: function() {
      return SessionService.get('authenticated');
    }
  };

});

auth.factory("SessionService", function() {

  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    set: function(key, val) {
      return sessionStorage.setItem(key, val);
    },
    unset: function(key) {
      return sessionStorage.removeItem(key);
    }
  };

});

auth.factory("FlashService", function($rootScope) {

  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  };

});

auth.config(function($httpProvider) {

  $httpProvider.interceptors.push(function($location, $q, SessionService, FlashService) {
    return {
      response: function(response) {
        if(response.data.flash){
          FlashService.show(response.data.flash);
        }
        return response;
      },
      responseError: function(response) {
        if(response.data.error) {
          FlashService.show(response.data.error.message);
        }

        if(response.status === 403) {
          SessionService.unset('authenticated');
          $location.path('/login');
        }

        return $q.reject(response);
      }
    };
  });

});

auth.run(function($rootScope, $location, $http, AuthenticationService, FlashService) {
  var routesThatRequireAuth = ['/cards', '/home'];

  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      FlashService.show("Please log in to continue.");
    }
  });

  $rootScope.isLoggedOut = function() {
    return !AuthenticationService.isLoggedIn();
  };

  $rootScope.expireMySession = function() {
    $http.get('/expire-my-session');
  };
});

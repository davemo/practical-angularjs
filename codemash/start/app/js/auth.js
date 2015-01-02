var auth = angular.module("app.auth", []);

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
      return sessionStorage.getItem(key); // html5 sessionStorage
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
    show: function(message) { // so we can show users a message
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  };
});

auth.config(function($httpProvider) {
  // middleware to handle logging the user out if the server says they should be logged out
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

        // handle session expiry
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
  // naive scheme for protecting routes client-side
  // should not be used standalone or in lieu of server-side route protection
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

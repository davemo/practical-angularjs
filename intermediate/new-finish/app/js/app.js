var app = angular.module("app", ['ngSanitize', 'ngRoute', 'ngResource']);

app.service("HearthstoneService", function($http) {
  return {
    getCards: function() {
      return $http.get('/cards');
    }
  };
});


app.config(function($httpProvider) {

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
      },
    };
  });

});

app.config(function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/login', {
    templateUrl: 'templates/login.html',
    controller: 'LoginController'
  });

  $routeProvider.when('/home', {
    templateUrl: 'templates/home.html',
    controller: 'HomeController'
  });

  $routeProvider.when('/list-of-books', {
    templateUrl: 'templates/books.html',
    controller: 'BooksController',
    resolve: {
      books : function(BookService) {
        return BookService.get();
      }
    }
  });

  $routeProvider.when('/$resource/list-of-books', {
    templateUrl: 'templates/books_resource.html',
    controller: 'BooksResourceController'
  });

  $routeProvider.when('/$http/list-of-books', {
    templateUrl: 'templates/books_http.html',
    controller: 'BooksHttpController',
    resolve: {
      books: function(BookService) {
        return BookService.get();
      }
    }
  });

  $routeProvider.when('/hearthstone', {
    templateUrl: 'templates/hearthstone.html',
    controller: function($scope, cards) {
      $scope.cards = cards.data.cards;
    },
    resolve: {
      cards: function (HearthstoneService) {
        return HearthstoneService.getCards();
      }
    }
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});

app.run(function ($rootScope, $http, AuthenticationService) {
  $rootScope.expireMySession = function() {
    $http.get('/expire-my-session');
  };

  $rootScope.isLoggedOut = function() {
    return !AuthenticationService.isLoggedIn();
  };
});

app.run(function($rootScope, $location, AuthenticationService, FlashService) {
  var routesThatRequireAuth = ['/home'];

  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      FlashService.show("Please log in to continue.");
    }
  });
});

app.factory("BookService", function($http) {
  return {
    get: function() {
      return $http.get('/books');
    }
  };
});

app.factory("BookResource", function($q, $resource) {
  return $resource('/books');
});

app.factory("FlashService", function($rootScope) {
  return {
    show: function(message) {
      $rootScope.flash = message;
    },
    clear: function() {
      $rootScope.flash = "";
    }
  };
});

app.factory("SessionService", function() {
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

app.factory("AuthenticationService", function($http, $sanitize, SessionService, FlashService) {

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

app.controller("LoginController", function($scope, $location, AuthenticationService) {
  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials).success(function() {
      $location.path('/home');
    });
  };
});

app.controller("BooksController", function($scope, books) {
  $scope.books = books.data;
});

app.controller("BooksResourceController", function ($scope, BookResource) {
  // because the stubbed endpoint returns an array of results, .query() is used
  // if the endpoint returned an object, you would use .get()
  $scope.books = BookResource.query();
});

app.controller("BooksHttpController", function ($scope, books) {
  $scope.books = books;
});

app.controller("HomeController", function($scope, $location, AuthenticationService) {
  $scope.title = "Awesome Home";
  $scope.message = "Mouse Over these images to see a directive at work!";

  $scope.logout = function() {
    AuthenticationService.logout().success(function() {
      $location.path('/login');
    });
  };
});

app.directive("showsMessageWhenHovered", function() {
  return {
    restrict: "A", // A = Attribute, C = CSS Class, E = HTML Element, M = HTML Comment
    link: function(scope, element, attributes) {
      var originalMessage = scope.message;
      element.bind("mouseenter", function() {
        scope.message = attributes.message;
        scope.$apply();
      });
      element.bind("mouseleave", function() {
        scope.message = originalMessage;
        scope.$apply();
      });
    }
  };
});

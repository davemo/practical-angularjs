// setter
var app = angular.module("app", ["ngRoute"]);

// routes
app.config(function($routeProvider) {

  $routeProvider.when('/login', {
    templateUrl: "login.html",
    controller: "LoginController"
  });

  $routeProvider.when('/home', {
    templateUrl: "home.html",
    controller: "HomeController"
  });

  $routeProvider.otherwise({ redirectTo: '/login' });

});

// controllers/login.js

// Dependency Injection
// resolver/registry of dependencies
// at runtime detect dependencies in function signatures and inject those instances from teh right place
// in the resolver

// provider -
// factory - created by invoking it factory()
// service - create it with the 'new' operator `new service()`
// singletons

app.factory("AuthenticationService", function($location) {
  return {
    login: function(credentials) {
      if(credentials.username === "ralph") {
        $location.path('/home');
      } else {
        alert('username must be ralph');
      }
    },
    logout: function() {
      $location.path('/login');
    }
  };
});


app.controller("LoginController", function($scope, AuthenticationService) {
  $scope.credentials = {username: "", password: ""};
  $scope.login = function() {
    AuthenticationService.login($scope.credentials);
  };
});

app.controller("HomeController", function($scope, AuthenticationService) {
  $scope.title   = "Home";
  $scope.message = "Mouse over these images to see a directive at work!";
  $scope.logout  = AuthenticationService.logout;
});

app.directive("showsMessageWhenHovered", function() {
  return {
    restrict: "A",
    link: function(scope, element, attributes) {
      var originalMessage = scope.message;
      element.bind("mouseenter", function() {
        scope.$apply(function() {
          scope.message = attributes.message;
        });
      });
      element.bind("mouseleave", function() {
        scope.$apply(function() {
          scope.message = originalMessage;
        });
      });
    }
  };
});



























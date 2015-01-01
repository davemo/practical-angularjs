// setter
var app = angular.module("app", ["ui.router"]); // dependencies go in the array as strings, which are names of modules.

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true); // for pushState routing support instead of # hash

  $stateProvider.state('cards', {
    url: "/cards",
    templateUrl: "cards.html",
    controller: "CardsController"
  });

  // default route

  $urlRouterProvider.otherwise('/cards');

  // admin, decks

});

app.controller("CardsController", function($scope, $http) {

  // fetch the cards from our API
  $http.get("/api/cards").success(function(response) {
    // attach them to the $scope
    $scope.cards = response.cards;
  });

  // iterate over them in the template to render images
});

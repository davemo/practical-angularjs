// setter
var app = angular.module("app", ["ui.router"]); // dependencies go in the array as strings, which are names of modules.

app.constant('CARD_DATABASE', function($http) {

});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true); // for pushState routing support instead of # hash

  $stateProvider.state('cards', {
    url: "/cards",
    templateUrl: "cards.html",
    controller: "CardsController",
    resolve: {
      CARD_DATABASE: function($http) {

        app.constant('CARD_DATABASE', )
      }
    }
  });

  // default route

  $urlRouterProvider.otherwise('/cards');

  // admin, decks

});

app.controller("CardsController", function($scope, CardFilter) {

  // fetch the cards from our API
  $http.get("/api/cards").success(function(response) {
    // attach them to the $scope
    $scope.cards = response.cards;
  });


  $scope.CardFilter = CardFilter;

  // iterate over them in the template to render images
});

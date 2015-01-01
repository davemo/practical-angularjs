// setter
var app = angular.module("app", ["ui.router"]); // dependencies go in the array as strings, which are names of modules.

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true); // for pushState routing support instead of # hash

  $stateProvider.state('cards', {
    url: "/cards",
    templateUrl: "cards.html"
  });

  // default route

  $urlRouterProvider.otherwise('/cards');

  // admin, decks

});

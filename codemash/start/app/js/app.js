// setter
var app = angular.module("app", ["app.auth", "ui.router", "ngAnimate", "ngSanitize"]); // dependencies go in the array as strings, which are names of modules.

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true); // for pushState routing support instead of # hash

  $stateProvider.state('cards', {
    url: "/cards",
    templateUrl: "cards.html",
    controller: "CardsController",
    resolve: {
      cardsResponse: function($http) {
        return $http.get("/api/cards");
      }
    }
  });

  $stateProvider.state('cards.detail', { // nested state, url segments built from parent + children
    url: '/:id',
    templateUrl: "detail.html",
    controller: "DetailViewController",
    onEnter: function($stateParams) {
      console.log($stateParams.id);
    }
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  // swap default route to login
  $urlRouterProvider.otherwise('/login');

});

app.controller('LoginController', function($scope, $location, AuthenticationService) {

  if(AuthenticationService.isLoggedIn()) {
    $location.path('/cards');
  }

  $scope.credentials = {username: "", password: ""};

  $scope.login = function() {
    AuthenticationService.login($scope.credentials).success(function() {
      $location.path('/cards');
    });
  };

});

app.run(function($rootScope, $state) {

  $rootScope.searchQueryChanged = function(query) {
    $rootScope.searchQuery = query;
  };

});

app.controller("DetailViewController", function($scope, $state, $stateParams, cardsResponse) {

  var cards = cardsResponse.data.cards; // child states can inject parent resolved dependencies

  // we need to detect a state change and extract the right card to show in the case
  // where the user comes to the /cards/:id url from a full page reload

  $scope.$on('$stateChangeSuccess', function() {
    $scope.card = _(cards).findWhere({id: parseInt($stateParams.id,10)});
  });

  $scope.isDetailState = function() {
    return $state.is('cards.detail');
  };

  $scope.hide = function() {
    $state.go('cards');
  };

});

app.controller("CardsController", function($scope, $rootScope, $state, cardsResponse, CardFilter) {

  var cards = cardsResponse.data.cards;

  $scope.heroFilters = CardFilter.heroFilters;
  $scope.manaFilters = CardFilter.manaFilters;
  $scope.currentHeroFilter = 'neutral';
  $scope.currentManaFilter = 'all';
  $scope.currentPage = 0;
  $scope.totalPages  = 0;

  function renderFilteredCards() {
    var pages = CardFilter.filterCards(cards, $scope.currentManaFilter, $scope.currentHeroFilter);
    $scope.totalPages = pages.length;
    $scope.cards = pages[$scope.currentPage];
  }

  $scope.detailViewFor = function(card) {
    $state.go('cards.detail', {id: card.id});
  };

  $scope.prevPage = function() {
    $scope.currentPage -= 1;
  };

  $scope.nextPage = function() {
    $scope.currentPage += 1;
  };

  $scope.canGoPrev = function() {
    return $scope.currentPage - 1 >= 0;
  };

  $scope.canGoNext = function() {
    return $scope.currentPage < $scope.totalPages - 1;
  };

  $scope.$watchGroup(['currentManaFilter', 'currentHeroFilter', 'currentPage'], renderFilteredCards);

  $scope.setHeroFilter = function(value) {
    $scope.currentHeroFilter = value;
  };

  $scope.setManaFilter = function(value) {
    $scope.currentManaFilter = value;
  };
});
























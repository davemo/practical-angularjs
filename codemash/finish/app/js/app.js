var app = angular.module("app", ["app.auth", "ui.router", "ngAnimate"]);

app.run(function($rootScope, $state) {

  $rootScope.searchQueryChanged = function(query) {
    $rootScope.searchQuery = query;
  };

});

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

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

  $stateProvider.state('cards.detail', {
    url: '/:id',
    templateUrl: "detail.html",
    controller: "DetailViewController",
    onEnter: function($stateParams) {
      console.log($stateParams.id);
    }
  });

  $stateProvider.state('decks', {
    url: '/decks',
    templateUrl: 'decks.html'
  });

  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'admin.html'
  });

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $urlRouterProvider.otherwise('/login');

});

app.filter('capitalize', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
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

app.controller("DetailViewController", function($scope, $state, $stateParams, cardsResponse) {

  var cards = cardsResponse.data.cards;

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

  $scope.$watchGroup(['currentManaFilter', 'currentHeroFilter', 'currentPage'], renderFilteredCards);

  $scope.setHeroFilter = function(value) {
    $scope.currentHeroFilter = value;
  };

  $scope.setManaFilter = function(value) {
    $scope.currentManaFilter = value;
  };

  $scope.isDetailState = function() {
    return $state.is('cards.detail');
  };

  $scope.detailViewFor = function(card) {
    $state.go('cards.detail', {id: card.id});
  };

  $scope.nextPage = function() {
    $scope.currentPage += 1;
  };

  $scope.prevPage = function() {
    $scope.currentPage -= 1;
  };

  $scope.canGoPrev = function() {
    return $scope.currentPage - 1 >= 0;
  };

  $scope.canGoNext = function() {
    return $scope.currentPage < $scope.totalPages - 1;
  };

});

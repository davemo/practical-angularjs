var app = angular.module("app", ['ngSanitize', 'ngAnimate', 'ui.router']);

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

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginController'
  });

  $stateProvider.state('decks', {
    url: '/decks',
    templateUrl: 'decks.html',
    controller: function($scope) {
      console.log('decks controller!');
    }
  });

  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'admin.html',
    controller: function($scope) {
      console.log('admin controller!');
    }
  });

  $stateProvider.state('cards', {
    url: '/cards',
    templateUrl: 'cards.html',
    controller: 'HearthstoneController',
    resolve: {
      getCardsResponse: function (HearthstoneService) {
        return HearthstoneService.getCards();
      }
    }
  });

  $stateProvider.state('cards.detail', {
    url: '/:id',
    onEnter: function($stateParams) {
      console.log($stateParams.id);
      console.log('entered cards.detail');
    },
    onExit: function() {
      console.log('exited cards.detail');
    }
  });

  $urlRouterProvider.otherwise('/login');

});

app.controller("LoginController", function($scope, $location, AuthenticationService) {
  if(AuthenticationService.isLoggedIn()) {
    $location.path('/cards');
  }

  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials).success(function() {
      $location.path('/cards');
    });
  };
});

app.controller('HearthstoneController', function($scope, $state, $rootScope, getCardsResponse) {

  // to demonstrate $broadcast
  // $scope.$on('search-query-changed', function(e, query) {
  //   $scope.searchQuery = query;
  // });

  $scope.cardDB = getCardsResponse.data.cards;
  $scope.pageSize = 8;
  $scope.currentPage = 0;
  $scope.totalPages  = 0;
  $scope.currentManaFilter = 'all';
  $scope.currentHeroFilter = 'neutral';
  $scope.heroFilterOptions = [
    {value: 'druid', label: 'Druid' },
    {value: 'hunter', label: 'Hunter' },
    {value: 'mage', label: 'Mage' },
    {value: 'paladin', label: 'Paladin' },
    {value: 'priest', label: 'Priest' },
    {value: 'rogue', label: 'Rogue' },
    {value: 'shaman', label: 'Shaman' },
    {value: 'warlock', label: 'Warlock' },
    {value: 'warrior', label: 'Warrior' },
    {value: 'neutral', label: 'Neutral' }
  ];

  $scope.canGoNext = function() {
    return $scope.currentPage < $scope.totalPages - 1;
  };

  $scope.canGoPrev = function() {
    return $scope.currentPage - 1 >= 0;
  };

  $scope.detailViewFor = function(card) {
    $state.go('cards.detail', {id: card.id});
    $rootScope.detailCard = card;
  };

  // ALL, 0, 1, 2, 3, 4, 5, 6, 7+
  $scope.manaFilterOptions = [
    {value: 'all', label: 'ALL'}
  ].concat(
    _(_.range(0,6)).map(function(i) {
      return {
        value: i,
        label: i
      };
    })
  ).concat(
    {value: 'seven-plus', label: '7 +' }
  );

  // the dataset has cards of types we don't want, like "hero" and "ability"
  // we also want the values sorted ascending which is the default that .sortBy gives us
  var filterCardsByManaCostAndHero = function(cards, cost, hero) {
    return _(filterCardsByHero(filterCardsByManaCost(cards, cost), hero)).chain().filter(function(card) {
      return _(["spell", "minion", "weapon", "secret"]).contains(card.category);
    }).sortBy(function(c) {
      return c.mana;
    }).value();
  };

  // also updates the current value of the mana filter so the styling can update
  var filterCardsByManaCost = function(cards, cost) {
    $scope.currentManaFilter = cost;
    if(cost === 'all') {
      return cards;
    } else if(cost === 'seven-plus') {
      return _(cards).filter(function(c) {
        return c.mana >= 7;
      });
    } else {
      return _(cards).where({mana: cost});
    }
  };

  // also updates the current value of the hero filter so the styling can update
  var filterCardsByHero = function(cards, hero) {
    $scope.currentHeroFilter = hero;
    return _(cards).where({hero:hero});
  };

  var splitIntoPageGroups = function(cards) {
    var result = _(cards).chain().groupBy(function(card, index) {
      return Math.floor(index/$scope.pageSize);
    }).toArray().value();

    return result;
  };

  $scope.nextPage = function() {
    $scope.currentPage += 1;
  };

  $scope.prevPage = function() {
    $scope.currentPage -= 1;
  };

  $scope.filterCards = function(cards, filterType, filterValue) {
    switch(filterType) {
      case 'hero':
        $scope.cards = splitIntoPageGroups(filterCardsByManaCostAndHero(cards, $scope.currentManaFilter, filterValue))[$scope.currentPage];
        break;
      case 'cost':
        $scope.cards = splitIntoPageGroups(filterCardsByManaCostAndHero(cards, filterValue, $scope.currentHeroFilter))[$scope.currentPage];
        break;
      default:
        break;
    }
  };

  $scope.$watch('currentPage', function(newPage, oldPage) {
    // console.log('currentPage changed (new, old)', newPage, oldPage);
    var pages         = splitIntoPageGroups(filterCardsByManaCostAndHero($scope.cardDB, $scope.currentManaFilter, $scope.currentHeroFilter));
    $scope.totalPages = pages.length;
    $scope.cards      = pages[newPage];
  });
});

app.filter('capitalize', function() {
  return function(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };
});

app.run(function ($rootScope, $state, $http, AuthenticationService) {
  $rootScope.expireMySession = function() {
    $http.get('/expire-my-session');
  };

  $rootScope.searchQueryChanged = function(query) {
    $rootScope.searchQuery = query;
    // to demonstrate event broadcasting
    // $rootScope.$broadcast('search-query-changed', query);
  };

  $rootScope.isLoggedOut = function() {
    return !AuthenticationService.isLoggedIn();
  };

  $rootScope.$state = $state;
});

app.run(function($rootScope, $location, AuthenticationService, FlashService) {
  var routesThatRequireAuth = ['/cards', '/home'];

  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if(_(routesThatRequireAuth).contains($location.path()) && !AuthenticationService.isLoggedIn()) {
      $location.path('/login');
      FlashService.show("Please log in to continue.");
    }
  });
});


app.factory("HearthstoneService", function($http) {
  var defaultUrl = '/api/cards';
  return {
    getCards: function(url) {
      return $http.get(url ? url : defaultUrl);
    }
  };
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

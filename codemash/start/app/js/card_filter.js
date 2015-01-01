angular.module("app").factory("CardFilter", function(CARD_DATABASE) {

  var PAGE_SIZE = 8;

  var HERO_FILTER_OPTIONS =
    ['druid','hunter','mage','paladin','priest','rogue','shaman','warlock','warrior','neutral'];

  // ALL, 0, 1, 2, 3, 4, 5, 6, 7+
  var MANA_FILTER_OPTIONS =
    [{value: 'all', label: 'ALL'}].concat(
      _(_.range(0,6)).map(function(i) {
        return { value: i, label: i };
      })
    ).concat(
      {value: 'seven-plus', label: '7+'}
    );

  function splitIntoPages() {
    return _(CARD_DATABASE).chain().groupBy(function(card, index) {
      return Math.floor(index/PAGE_SIZE);
    }).toArray().value();
  }

  function filterByManaAndHero(cost, hero) {
    return _(filterCardsByHero(filterCardsByMana(CARD_DATABASE, cost), hero)).chain().filter(function(card) {
      return _(["spell", "minion", "weapon", "secret"]).contains(card.category);
    }).sortBy(function(c) {
      return c.mana;
    }).value();
  }

  function filterByMana(cost) {
    if(cost === 'all') {
      return CARD_DATABASE;
    } else if(cost === 'seven-plus') {
      return _(CARD_DATABASE).filter(function(c) {
        return c.mana >= 7;
      });
    } else {
      return _(CARD_DATABASE).where({mana: cost});
    }
  }

  function filterByHero(hero) {
    return _(CARD_DATABASE).where({hero:hero});
  }

  // filterType:string ('hero' or 'mana')
  // filterValue:integer|string 0,1,2,'all','seven-plus', 'warrior', 'mage', etc..
  function filterCards(filterType, filterValue) {
    switch(filterType) {
      case 'hero':
        return splitIntoPageGroups(filterByManaAndHero($scope.currentManaFilter, filterValue))[$scope.currentPage];
        break;
      case 'mana':
        return splitIntoPageGroups(filterByManaAndHero(filterValue, $scope.currentHeroFilter))[$scope.currentPage];
        break;
      default:
        return CARD_DATABASE;
        break;
    }
  }

  return {
    filterByMana: filterByMana,
    filterByHero: filterByHero,
    manaFilters: MANA_FILTER_OPTIONS,
    heroFilters: HERO_FILTER_OPTIONS
  };

});

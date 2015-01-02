angular.module("app").factory("CardFilter", function() {

  var PAGE_SIZE = 8;

  var HERO_FILTER_OPTIONS = [
    {value: 'druid',   label: 'Druid' },
    {value: 'hunter',  label: 'Hunter'},
    {value: 'mage',    label: 'Mage'},
    {value: 'paladin', label: 'Paladin'},
    {value: 'priest',  label: 'Priest'},
    {value: 'rogue',   label: 'Rogue'},
    {value: 'shaman',  label: 'Shaman'},
    {value: 'warlock', label: 'Warlock'},
    {value: 'warrior', label: 'Warrior'},
    {value: 'neutral', label: 'Neutral'}
  ];

  // ALL, 0, 1, 2, 3, 4, 5, 6, 7+
  var MANA_FILTER_OPTIONS =
    [{value: 'all', label: 'ALL'}].concat(
      _(_.range(0,6)).map(function(i) {
        return { value: i, label: i };
      })
    ).concat(
      {value: 'seven-plus', label: '7+'}
    );

  function splitIntoPages(cards) {
    return _(cards).chain().groupBy(function(card, index) {
      return Math.floor(index/PAGE_SIZE);
    }).toArray().value();
  }

  function filterByManaAndHero(cards, mana, hero) {
    return _(cards).chain()
            .filter(byMana(mana))
            .filter(byHero(hero))
            .filter(inTheseCategories(["spell", "minion", "weapon", "secret"]))
            .sortBy(function(c) {
              return c.mana;
            }).value();
  }

  function inTheseCategories(categories) {
    return function(card, index, cards) {
      return _(categories).contains(card.category);
    };
  }

  function byMana(mana) {
    return function(card, index, cards) {
      if(mana === 'all') {
        return true;
      } else if(mana === 'seven-plus') {
        return card.mana >= 7;
      } else {
        return card.mana === mana;
      }
    };
  }

  function byHero(hero) {
    return function(card, index, cards) {
      return card.hero === hero;
    };
  }

  // filterType:string ('hero' or 'mana')
  // filterValue:integer|string 0,1,2,'all','seven-plus', 'warrior', 'mage', etc..
  function filterCards(cards, mana, hero) {
    return splitIntoPages(filterByManaAndHero(cards, mana, hero));
  }

  return { // our public interface
    filterCards: filterCards,
    manaFilters: MANA_FILTER_OPTIONS,
    heroFilters: HERO_FILTER_OPTIONS
  };

});

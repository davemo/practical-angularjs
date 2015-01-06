# Practical AngularJS

This workshop, prepared for a CodeMash 2015 precompiler, is designed to educate attendees on Angular concepts by building an application that mimics the Hearthstone in game Deck Browser using as many web technologies as possible. Hearthstone is made with Unity3D and some assets were extracted from the game package for use in this project.

## Setup / Pre-Requisites

- A code editor of your choice, I like [Sublime Text](http://www.sublimetext.com/)
- Install [Node.JS](http://nodejs.org/) for your platform of choice
- Install [LinemanJS](http://www.linemanjs.com) globally `npm i -g lineman`
- Clone `git clone https://github.com/davemo/practical-angularjs.git` or [Download](https://github.com/davemo/practical-angularjs/archive/master.zip) this repo
- Navigate to the project directory and install dependencies `cd practical-angularjs/codemash/start && npm i`
- Run the app with `lineman run`

## Hearthstone Deck Browser

**Features**
- search via text entry
- filter by hero, mana cost
- pagination (8 per page)
- single page navigation
- detail view
- basic authentication, login, logout
- JSON api remote loading hearthstone card data

![App Screenshot](https://raw.githubusercontent.com/davemo/practical-angularjs/master/codemash/app-screenshot.png)

## Schedule Overview

Time | Topic
--- | ---
1:00-1:15 | Intro: background, goals, lineman setup, demo of completed app
1:15-2:00 | Exercise 1: Navigation & Routing
2:15-2:30 | Discussion
2:30-3:00 | Exercise 2: Deck Browser: Basic Listing
3:00-3:15 | Break
3:15-3:45 | Exercise 3: Deck Browser: Pagination & Filtering
3:45-4:00 | Discussion
4:00-4:30 | Exercise 4: Deck Browser: Detail View & Animation
4:30-5:00 | Exercise 5: Authentication
5:00-5:30 | Bonus Exercise: Refactoring Detail View (if we have time)

### Intro

Goal: set expectations and provide a context for the day

Videos:
> [01 - Practical AngularJS - Intro](https://www.youtube.com/watch?v=zeuQ8i8HP7w&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=1)

* Set agenda, goals, and constraints
* Solicit requests from attendees of concepts to emphasize or cover ad hoc
* Review angular basics, angular.module, dependency injection, ng-app
* Review lineman setup and config/server

### Exercise 1: Navigation and Routing

Goal: understand the differences between client-side routing and server-side routing; look at how to integrate 3rd party routing tools like ui-router and contrast differences to ng-router

Videos:
> [02 - Practical AngularJS - Navigation & Routing](https://www.youtube.com/watch?v=hJ_umWSes0o&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=2)

Angular Concepts: `ng-view`, `ui-view`, `ng-href`, `ui-sref`, `ng-include`, `ng-class`

* Provided: css, templates without angular directives, navbar component
* Pair off and setup routes for 3 pages: 'cards', 'decks', and 'admin' using ng-router and $routeProvider
* Then, replace the ngRoute dependency with ui.router and refactor using $stateProvider
* Use `ng-class`, `ng-include` and `ui-sref-active="active"` to make navigation DRY and highlight the current navigation item

**Challenge**: add routes for admin and decks, load the templates, setup decks.html and admin.html to include the navbar

### Exercise 2: Deck Browser - Basic Listing

Goal: understand how to load and render JSON data from a remote api

Videos:
> [03 - Practical AngularJS - Basic Deck Listing](https://www.youtube.com/watch?v=anBd8yh_pLI&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=3)

> [04 - Practical AngularJS - Route.Resolve](https://www.youtube.com/watch?v=mEphlFTXlYU&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=4)

Angular Concepts: `$http`, `ng-repeat`, `ng-src`, `angular expression syntax`, `$scope`, `controller`, `controllerAs`, `route.resolve`

* Provided: css, templates without angular directives, card-images, card data as JSON and server-side routes (`GET /api/cards`), `<div id="card-book">` element
* Pair off and use the `resolve` property of our `cards` route to load card data from `GET /api/cards`
* Create a controller using `angular.module('app').controller` and attach card data to the `$scope`
* Use `ng-repeat` to render card meta data and the `card.image_url` into the `<div id="card-book">` element in `cards.html` using `ng-src` for the image.

### Exercise 3: Deck Browser - Pagination & Filtering

Goal: showcase angular controllers as the introductory spot for experimenting with logic, extraction to service objects once things get too complex, and understand angulars implicit 2-way data-binding and its effect on rendering data

Videos:
> [05 - Practical AngularJS - Deck Browser - Filter by Hero](https://www.youtube.com/watch?v=uvrQhgvXLbg&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=5)

> [06 - Practical AngularJS - Deck Browser - Paginate Previous](https://www.youtube.com/watch?v=35X0xT27W90&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=6)

> [07 - Practical AngularJS - Deck Browser - Search Filtering](https://www.youtube.com/watch?v=lt--d0HhBE4&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=7)

Angular Concepts: `$scope.$watch`, `$scope.$broadcast`, `$filter`, `ng-click`, `dependency injection`, `angular.factory`, `angular.service`

* Provided: css, templates without angular directives, `CardFilter` service with public method `.filterCards(cardDB:array, criteria:string, filterValue:integer)`, and `.heroFilterOptions` and `.manaFilterOptions` properties
* Pair off and inject the `CardFilter` service into your controller for the `cards` page. Use the `.filterCards` method to filter cards by Hero and by Mana Cost
* Set up a `$scope.$watch` on the `currentPage` property and bind `$scope.cards` to `CardFilter.splitIntoPageGroups` at the value of the newPage

**Challenge**: Implement Filter by Mana by leveraging properties in `card_filter.js` and `cards.html`

**Challenge**: add a custom filter, `capitalize` using angular.filter, and use it to render a capitalized `currentHero` within the `<div class="current-hero">` element inside of `cards.html`

### Exercise 4: Deck Browser - Detail View & Animation

Goal: understand techniques for animating with css3 support, binding application state to urls, and how state transitions work; create a detail view that is shown when a user clicks on a card

Videos:
> [08 - Practical AngularJS - Deck Browser - Detail View](https://www.youtube.com/watch?v=ajPsJvihFdg&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=8)

> [09 - Practical AngularJS - Deck Browser - Animation](https://www.youtube.com/watch?v=lSKwJ8KcM-0&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=9)

Angular Concepts: `ng-click`, `$state`, `$stateParams`, `$state.onExit`, `$state.onEnter`, `ng-animate`, `ui-router nested states`, `ui-sref`

* Provided: css, templates without angular directives, `detailViewFor(card)` function
* Create a function, `detailViewFor` that takes a `card` object; attach this function to the `$scope` in the controller for the `cards` route.
* Create an `ng-click="detailViewFor(card)"` binding on each `<div class="card">` element in cards.html
* Implement a transition to a new state `cards.detail` which is a nested state of `cards`, add `onEnter` and `onExit` functions to understand how `$stateParams` and state transitions work.

**Challenge**: there’s a `blurred` class in the css that will use a css3 filter to add a blur effect to a containing element, use `ng-class` to toggle a class value of `blurred` in conjunction with a custom function `isDetailState` that returns true if the current state is `cards.detail` and add this to the following elements within `cards.html`:
  - the ng-include for the navbar
  - each instance of the element `<div class=“large-12 column”>`

**Challenge**: modify the animation using CSS3 transforms so that it rotates the card 360 degrees along its y-axis creating a spinning card effect.

**Advanced Challenge**: refactor the use of ng-class into an attribute directive `blurs-when-detail-view-active`

**Advanced Challenge**: use your knowledge of ng-animate and the states of an element to add an animation hook for the card detail view in detail.html which animates the cards scale to make it appear zooming.

### Exercise 5: Authentication

Goal: understand approaches to single page app authentication, how angular manages CSRF and configuring your server-side for the type of CSRF support angular expects; how to manage user sessions using HTML5 SessionStorage where possible while letting the server-side maintain the final say in whether a user is logged in or out

Videos:

> [010 - Practical AngularJS - Authentication](https://www.youtube.com/watch?v=SOnloQRpAyY&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=10)

Angular Concepts: `$httpProvider.interceptors`, `angular.factory`, `promises`, `ng-sanitize`, `$location`, `ng-model`

* Provided: server-side auth route `POST /auth/login`, server-side CSRF support configured, `SessionService`, `FlashService` and `AuthenticationService`
* Create a `login` state, for the url `/login`, and a controller that injects `$scope`, `$location`, `AuthenticationService`
* Create `$scope.credentials = {username:"", password:""}`; bind each property of credentials using `ng-model` on the respective `input` element within the `login.html` template
* Create a `$scope.login` method on this controller that passes `$scope.credentials` to `AuthenticationService.login` and attaches a `.success` callback which redirects the user to `$location.path('/cards')`

**Challenge**: create a response interceptor that checks for HTTP status 202 and shows a message to the user stating they have been accepted using pieces within `auth.js`; then, create an api endpoint that returns HTTP status 202 along with a message in the response payload (see config/server.js)

**Advanced Challenge**: see if you can bypass the client-side authentication scheme that locks you out of routes you can’t visit unless you are logged in by editing javascript source files in chrome dev tools

### Bonus Exercise: Refactoring the Detail View

Goal: look at the way angular apps start as experimenting with logic in templates, how this quickly falls apart and a cleaner way to refactor to separate concerns while retaining behaviour and placing less logic in templates.

Angular Concepts: `nested ui-router states`, `ui-view`, `$state.is`, `$state.go`

Videos:

> [011 - Practical AngularJS - Bonus - Refactoring Detail View](https://www.youtube.com/watch?v=cPWs7aXWAvI&list=PLIdFBvsYFxr6FMPKHWSVsiqfGHnq4A8Dm&index=11)

* Provided: css, templates without angular directives
* Take the existing `<div class="detail-view">` element and extract it to its own template file `detail.html` within `app/templates`
* Create a ui-router nested route, `cards.detail` and define a nested `ui-view` element where ui-router will inject the template
* Eliminate calls to `$state` from within the `detail.html` template you just created and refactor those to functions on the `DetailViewController`

**Challenge**: we’ve duplicated cardsResponse, leveraging the parent states resolve property, extract and refactor to an angular factory that fetches cards once and caches them when the /cards parent route is hit

### Double Bonus Topics: If we crush the exercises...

* Refactor `<li class="card">` to a `<card>` element directive
* Implement search properly so that it scans across all pages in the current set instead of the currently rendered one
* Create an end-to-end test with Protractor to verify our search works as advertised
* Create a `<card-editor>` *element* directive that builds a form which has all fields bound to an instance of our card schema
* Create a custom *element* directive `<card-browser>` which transcludes `<card>` and renders the card listing as per normal
* Add an *attribute* directive `as-table` that only works on `<card-browser>` and renders the card listing in a `<table>` element.

### Useful Links

* [ui.router api](http://angular-ui.github.io/ui-router/site/#/api/ui.router)
* [angular docs](https://docs.angularjs.org/api)
* [css3 transforms](http://css-tricks.com/almanac/properties/t/transform/)

#### LICENSE

MIT

Image Assets extracted from Hearthstone are &copy;Blizzard Entertainment, Inc.

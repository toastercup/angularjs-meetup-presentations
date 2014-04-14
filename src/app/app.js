var module = angular.module('app', [
  'ngRoute',
  'app.settings',
  'app.constants',
  'app.controllers.category'
]);

module.config(function ($routeProvider) {
  $routeProvider.
    when('/category', {
      templateUrl: 'category.tpl.html',
      controller: 'CategoryCtrl'
    }).
    when('/category/:categoryId', {
      templateUrl: 'category-detail.tpl.html',
      controller: 'CategoryDetailCtrl'
    }).
    otherwise({
      redirectTo: '/category'
    });
});

module.controller('AppCtrl', function ($scope, $state, EVENTS) {
});

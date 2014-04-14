var module = angular.module('app', [
  'ui.router',
  'app.states',
  'app.settings',
  'app.constants'
]);

module.config(function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
});

module.controller('AppCtrl', function($scope, $state, EVENTS) {
});

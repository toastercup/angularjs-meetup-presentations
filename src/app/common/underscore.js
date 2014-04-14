var module = angular.module('underscore', []);

module.config(function($provide) {
  $provide.constant('_', window._);
});

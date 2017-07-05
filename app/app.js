'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.map',
  'myApp.services'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('/login');

  $routeProvider.otherwise({redirectTo: '/map'});
}]);

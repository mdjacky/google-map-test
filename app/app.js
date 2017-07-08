'use strict';

angular.module('myApp', [
  'ngRoute',
  'ngTable',
  'myApp.map',
  'myApp.services'

]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  // $locationProvider.hashPrefix('/login');

  $routeProvider.otherwise({redirectTo: '/map'});
}]);

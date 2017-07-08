'use strict';

angular.module('myApp.map', ['ngRoute', 'myApp.services'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/map', {
            templateUrl: 'components/map/map.html',
            controller: 'MapCtrl'
        });
    }])

    .controller('MapCtrl', ['$scope', '$filter', 'MapService', 'ngTableParams', function($scope, $filter, MapService, ngTableParams) {
        $scope.searchPlace = '';
        $scope.selectedAddress = '';
        $scope.searchResult = [];
        $scope.displayResult = [];
        $scope.isSearching = false;

        MapService.init();
        $scope.search = function() {
            $scope.apiError = false;
            $scope.isSearching = true;
            MapService.search($scope.searchPlace)
                .then(function(res) {
                    $scope.searchResult = angular.copy(res);
                    MapService.addMarker($scope.searchResult);
                    $scope.tableParams.reload();
                },function(status) {
                    $scope.apiError = true;
                    $scope.apiStatus = status;
                })
                .finally(function(){
                    $scope.isSearching = false;
                });
        };

        $scope.tableParams = new ngTableParams({}, {
            paginationMaxBlocks: 7,
            paginationMinBlocks: 1,
            getData: function ($defer, params) {
                params.total($scope.searchResult.length);
                params.settings().counts = 10;
                $scope.searchResult = params.sorting() ? $filter('orderBy')($scope.searchResult, params.orderBy()) : $scope.searchResult;
                $scope.searchResult = $scope.filters ? $filter('filter')($scope.searchResult, $scope.filters) : $scope.searchResult;
                $scope.displayResult = $scope.searchResult.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve($scope.displayResult);
            }
        });

        $scope.selectPlace = function(place){
            $scope.selectedAddress = place.formatted_address;
            MapService.showPlace(place);
        }

    }]);
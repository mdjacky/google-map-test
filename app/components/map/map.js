'use strict';

angular.module('myApp.map', ['ngRoute', 'myApp.services'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/map', {
            templateUrl: 'components/map/map.html',
            controller: 'MapCtrl'
        });
    }])

    .controller('MapCtrl', ['$scope', 'MapService', function($scope, MapService) {
        console.log(MapService);

        $scope.place = {};

        $scope.search = function() {
            $scope.apiError = false;
            MapService.search($scope.searchPlace)
                .then(
                    function(res) { // success
                        MapService.addMarker(res);
                    },
                    function(status) { // error
                        $scope.apiError = true;
                        $scope.apiStatus = status;
                    }
                );
        }

        $scope.send = function() {
            alert($scope.place.name + ' : ' + $scope.place.lat + ', ' + $scope.place.lng);
        }

        MapService.init();

    }]);